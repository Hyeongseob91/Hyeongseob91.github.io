# SoundMind AI Platform - 기획/설계 문서 분석 보충 보고서

> **분석일**: 2026-03-11
> **분석 대상**: README, PRD 2건, Plan 2건, Task Plan(Future Work), PoC 검수 문서 4건
> **목적**: 커밋 분석 보고서에서 드러나지 않는 기획 의도, 기술적 판단 근거, 비즈니스 맥락을 보충

---

## 1. README에서 파악되는 프로젝트 전체 구조

### 1.1 플랫폼 정체성

SoundMind AI Platform은 **B2B SaaS** 형태의 기업 고객 대상 AI 문서 분석 및 지능형 에이전트 서비스이다. 단순한 RAG 챗봇이 아니라, **멀티 테넌트 아키텍처**를 갖춘 엔터프라이즈급 플랫폼으로 설계되었다. 회사별 데이터 격리, 역할 기반 접근 제어(Admin/Manager/Customer 3-Tier), 사용량 추적 등 실제 B2B 납품에 필요한 기능을 모두 포함한다.

### 1.2 아키텍처 구성 (8개 서비스)

| 계층 | 서비스 | 핵심 기술 |
|------|--------|-----------|
| **프론트엔드** | Web Console (React 19, TypeScript, Vite, Tailwind) | 통합 Web UI |
| **BFF 계층** | API Gateway (FastAPI + JWT + SSE) | 인증, 세션, 라우팅, 스트리밍 |
| **RAG 계층** | General RAG (Weaviate + Hybrid Search) | Dense+Sparse 하이브리드 검색, Semantic Chunking |
| **RAG 계층** | Structured RAG (Qdrant) | 정형 데이터 최적화 검색 |
| **에이전트 계층** | Chat Agent (LangGraph ReAct) | 멀티 프로바이더 LLM, 도구 활용 |
| **데이터 계층** | PostgreSQL 16 | 사용자, 세션, 메시지, 문서 메타데이터 |
| **벡터 DB** | Weaviate 1.27 + Qdrant 1.17 | 듀얼 벡터 DB 전략 |
| **모니터링** | Grafana + Loki + Promtail | 선택적 모니터링 스택 |

### 1.3 듀얼 RAG 전략

특히 주목할 점은 **Dual RAG Strategy**이다. General RAG(Weaviate, Hybrid Search)과 Structured RAG(Qdrant, 정형 데이터 최적화)을 분리하고, Admin이 회사별로 사용할 파이프라인을 매핑할 수 있도록 설계했다. 이는 "모든 문서에 하나의 파이프라인"이 아닌, **고객사 데이터 특성에 맞는 최적 파이프라인을 선택적으로 적용**하겠다는 아키텍처적 판단을 보여준다.

### 1.4 기술 스택 특징

- **LLM**: vLLM 기반 로컬 모델 서빙(Qwen3, Deepseek-R1, Kanana-2)이 메인이며, OpenAI/Gemini를 선택적으로 지원하는 **멀티 프로바이더** 구조
- **임베딩/리랭커**: BGE-M3 + BGE-Reranker-v2-M3 (Infinity 서빙) -- 한국어 지원이 강한 모델 선택
- **문서 파싱**: 7종 파일 포맷 지원(PDF, DOCX, XLSX, TXT, JSON, HWP, HWPX) + PaddleOCR 기반 스캔 PDF 자동 감지
- **청킹**: Semantic Chunking (breakpoint threshold 0.90, 100~2000 토큰)

### 1.5 Admin Dashboard

4개 탭(계정 관리, 사용 현황, 문서 관리, 서비스 로그)으로 구성된 통합 관리자 대시보드가 존재한다. 특히 일별 메시지/토큰 사용량 시각화, 세션별 대화 내역 열람, 구조화 로그 검색(서비스/레벨/Task ID 필터) 등은 **B2B 고객 관리와 운영 투명성**을 위한 기능이다.

---

## 2. PRD 분석: 기획 의도와 문제 인식

### 2.1 PRD: Beta Service Concurrency & Hook System

#### 문제 인식 -- "왜" 이 기능이 필요했는가

Beta 출시(3사 x 5명 = 15명 동시 사용자)를 앞두고, **동시성 처리가 전혀 검증되지 않았다**는 구조적 위험이 식별되었다. 구체적으로 3가지 문제:

1. **RAG Engine 병목**: Worker 1개 + 100% 동기 코드로 구현된 문서 업로드 파이프라인. CPU-bound 작업(PDF 파싱, PaddleOCR)이 무제한으로 ThreadPool에 쌓이면 GIL 경합으로 쿼리 처리까지 지연된다.
2. **요청 내 순차 실행**: 스트리밍 완료 후 DB 작업(메시지 저장, 타이틀 업데이트)이 모두 순차 `await`로 실행되어 불필요한 지연 발생.
3. **확장 불가능한 구조**: 새 비즈니스 로직(알림, 분석, 감사 로그) 추가 시 매번 메인 라우트 코드를 직접 수정해야 하는 Procedural 구조.

#### 해결 방향

| 목표 | 해결책 | 기술적 판단 |
|------|--------|-------------|
| 동시 업로드 제어 | `threading.Semaphore(2)` | Redis/Kafka 도입은 Beta 규모에서 과도하다고 판단 |
| Worker 스케일링 | Worker 1개 유지 | TaskStore(in-memory)가 프로세스 간 공유 불가, PaddleX 메모리(~2GB) 중복 방지 |
| 비즈니스 로직 확장성 | Hook 시스템(이벤트 버스) | 메인 코드 수정 없이 플러그인 방식으로 기능 추가/제거 |
| 비동기 후처리 | fire-and-forget 패턴 | `asyncio.create_task()`로 LOW 우선순위 핸들러 비차단 실행 |

#### 핵심 기술적 판단: "왜 Worker를 늘리지 않았는가"

PRD에서 가장 돋보이는 부분은 **Worker 1개 유지 결정의 근거**이다:

- `TaskStore._tasks`는 in-memory dict(클래스 변수)로 프로세스 간 공유 불가 -- Worker를 늘리면 업로드 상태 폴링이 간헐적 404를 반환
- `threading.Semaphore`는 프로세스 내 스코프 -- Worker 2개면 Semaphore(2) x 2 = 실제 4건 동시 처리, 의도와 불일치
- PaddleX 초기화 메모리 ~2GB가 Worker마다 중복
- 쿼리는 async Event Loop에서 처리되므로 업로드와 독립적으로 응답 가능

이 판단은 "스케일링 = 무조건 Worker 증가"라는 단순한 접근을 거부하고, **현재 아키텍처의 제약 조건을 정확히 이해한 위에서 최소한의 변경으로 안정성을 확보**하는 실용적 엔지니어링 사고를 보여준다.

#### Hook 시스템 설계의 깊이

3단계 우선순위(CRITICAL/NORMAL/LOW)와 `order` 파라미터로 같은 우선순위 내 실행 순서를 보장하는 설계는, 단순 이벤트 버스를 넘어서 **실무에서 발생하는 핸들러 간 의존성 문제**까지 고려한 것이다. 예를 들어 `save_messages`(order=0)가 반드시 `auto_set_title`(order=10)보다 먼저 실행되어야 하는 요구사항을 설계 레벨에서 해결했다.

### 2.2 PRD Analysis: 자체 검수 프로세스

PRD 작성 후 별도의 **PRD Analysis**를 통해 12건의 이슈(Critical 3, Major 6, Minor 3)를 스스로 발굴하고 PRD v1.1에 반영했다는 점은 주목할 만하다. Critical 이슈 3건(Semaphore 스코프, sync/async 호환성, TaskStore 공유 문제)은 모두 **구현 시 런타임 에러를 발생시킬 수 있는 실제 버그**였다. 이를 구현 전에 문서 레벨에서 발견하고 수정한 것은 "PRD 작성 -> 분석 -> 수정 -> 구현"이라는 체계적인 프로세스를 운영했음을 의미한다.

### 2.3 PRD: Diversity-Aware Retrieval Filtering

#### 문제 인식 -- 실제 고객 사용에서 발견된 문제

"20개 분과별 추진배경을 알려줘" 같은 광범위 질문에서, Reranker가 `top_k=25`로 제한하면 특정 분과의 청크가 여러 개 높은 점수를 받아 다른 분과가 밀려나는 현상이 발생했다. 결과적으로 20개 분과 중 13~17개만 응답에 포함되었다.

#### 해결 방향: Greedy Diversity-Aware Selection

근본 원인을 "Reranker 이후 ~ Generator 이전 단계에서 다양성(diversity)을 고려하는 로직이 없음"으로 정확히 진단하고, 다음 알고리즘을 설계했다:

1. **threshold 필터링**: score >= 0.01인 문서만 대상
2. **division_name 기준 그룹핑**: 분과별 청크 그룹화
3. **Round-Robin 1st Pass**: 각 분과에서 최고 점수 청크 1개씩 대표 선택
4. **Score-Fill 2nd Pass**: 남은 슬롯을 점수 순으로 채움

이 설계의 핵심은 **기존 relevance score 기반 품질은 유지하면서 coverage를 개선**한다는 점이다. Reranker 모델 자체를 변경하거나, 벡터 검색 단계를 수정하지 않고, `_filter_context_docs()` 함수 하나만 개선하는 **최소 침습적 접근**을 택했다.

---

## 3. Plan/Task Plan 분석: 구현 전략

### 3.1 Beta Concurrency & Hook System Plan

#### 구현 순서와 우선순위 결정

4개 Phase로 나누어 구현했으며, 모두 완료(32/32 태스크) 상태이다:

| Phase | 내용 | 소요 | 우선순위 |
|-------|------|------|----------|
| Phase 1 | Concurrency 즉시 개선 (Semaphore + queued 상태) | 1일 | P0 |
| Phase 2 | Hook 인프라 구축 (shared 패키지) | 1일 | P0 |
| Phase 3 | API Gateway Hook 적용 (chat.py, ai_agent.py) | 1일 | P0 |
| Phase 4 | 확장 Hook Points (documents, auth, session) | 2일 | P1 |

모든 Phase가 **하루 안에 설계부터 구현, 분석, 수정, 재구현까지 완료**된 것으로 기록되어 있다(2026-02-13). PRD v1.0 작성 -> Digging 분석(3C/6M/3m 발견) -> PRD v1.1 수정 -> 4 Phase 구현 완료가 단일 일자에 이루어졌다.

#### 기술적 트레이드오프

| 결정 | 선택 | 대안 (채택하지 않은 것) | 이유 |
|------|------|------------------------|------|
| 동시성 제어 | Semaphore | Redis Queue, Kafka | Beta 15명 규모에서 메시지 큐는 과잉 인프라 |
| Worker 수 | 1개 유지 | 2~4개 스케일링 | TaskStore/Semaphore 공유 불가, 메모리 중복 |
| RAG Pipeline Hook | P2로 강등 | 즉시 구현 | 100% sync 코드에서 async emit() 호출 불가 |
| Hook 저장소 | In-memory (HookRegistry) | DB 기반 이벤트 로그 | 경량성 우선, 오버헤드 < 1ms 목표 |
| fire-and-forget | asyncio.create_task | 별도 Worker Thread | Event Loop 내에서 자연스러운 비동기 처리 |

### 3.2 Diversity-Aware Retrieval Plan

코드 수정 완료(Phase 1~2)되었으나, Docker rebuild/deploy 및 실제 쿼리 테스트(Phase 3)가 아직 진행 중이다. 특히 "20개 분과별 추진배경" 쿼리로 20/20 커버리지 달성 여부와 단일 분과 질문 regression 테스트가 남아있다.

---

## 4. PoC 검수 문서 분석: 프로덕션 준비 수준

### 4.1 검수 프로세스의 체계성

PoC 납품 전 검수 문서는 **8개의 별도 문서**로 구성된 종합적인 검증 체계이다:

| 문서 | Phase | 검증 영역 |
|------|-------|-----------|
| 인프라 체크리스트 | Phase 0 | 서비스 기동, 포트, 볼륨, Cold Start, 보안 |
| 기능 테스트 케이스 | Phase 1~2 | 인증, 업로드, RAG 쿼리, 환각 방지 (34개 테스트) |
| 오류 처리 테스트 | Phase 3 | 복원력, 장애 대응 |
| 보안 체크리스트 | Phase 0 | JWT, 패스워드, 네트워크 노출 |
| 성능 기준선 | Phase 1 | 응답 시간, 처리량 |
| 데모 리허설 | Phase 5 | Golden Path 3회 연속 성공 |
| 테스트 보고서 | Phase 6~7 | 결과 종합 |
| 고객 운영 가이드 | 납품 산출물 | 고객 전달용 |

3일간의 일정으로 구성되어 있으며, **납품 통과 기준**이 명확하다:
1. health-check.sh 모든 서비스 OK
2. P0 테스트 항목 전부 PASS
3. 성능 기준선 허용 범위 내
4. Golden Path 3회 연속 성공
5. 내부 보고서 + 고객 운영 가이드 완성

### 4.2 인프라 체크리스트에서 드러나는 운영 성숙도

#### health-check.sh 포트 수정

기존 스크립트의 포트가 실제 서비스 포트와 불일치하는 문제(8188->9001, 8050->9000)를 사전에 발견하고 수정 항목으로 기록했다. 이는 인프라 설정이 코드와 별도로 관리되면서 발생하는 **드리프트(drift)**를 검수 프로세스에서 잡아내는 것이다.

#### 볼륨 영속성 테스트

Docker Compose down/up 사이클에서 7가지 데이터(사용자 계정, 세션, 메시지, 원본 파일, 문서 저장소, 벡터 데이터, RAG 검색 결과)의 잔존 여부를 확인하는 테스트가 정의되어 있다. 이는 **상태를 가진 서비스의 데이터 무결성**을 보장하기 위한 것이다.

#### Cold Start 소요 시간 측정

각 서비스별 healthy 달성 시각과 첫 RAG 쿼리 TTFT(Time To First Token)를 측정하는 항목이 있다. vLLM cold start는 별도 관리 대상으로 분리한 점도 주목할 만하다.

#### 보안 기본값 변경 (P0)

JWT_SECRET_KEY, ADMIN_PASSWORD, POSTGRES_PASSWORD가 개발 환경용 하드코딩 값으로 되어 있었으며, 이를 반드시 변경하도록 P0으로 지정했다. PostgreSQL 비밀번호 변경 시 볼륨 삭제 후 재생성이 필요하다는 주의사항까지 기록했다.

#### 네트워크 노출 최소화

모든 내부 서비스 포트를 `127.0.0.1` 바인딩으로 제한하고, Web Console(3000번)만 외부 노출하는 구성을 권장했다. Weaviate의 Anonymous Access가 활성화되어 있지만, 네트워크 바인딩 제한으로 외부 접근을 차단하는 **계층적 방어** 전략이다.

### 4.3 기능 테스트에서 드러나는 품질 기준

#### 34개 테스트 케이스 (6개 카테고리)

| 카테고리 | 테스트 수 | 핵심 포인트 |
|---------|----------|-------------|
| 인증 플로우 | 6 | Admin/일반/게스트 로그인, 토큰 갱신, 만료, 오류 |
| 문서 업로드 정상 | 8 | 7종 파일 포맷 + 스캔 PDF OCR |
| 문서 업로드 엣지 | 4 | 미지원 확장자, 100MB 초과, 빈 파일, 한글 파일명 |
| RAG 쿼리 | 5 | 사실 질문, 표 데이터, 미업로드, 무관한 질문, CJK 누출 |
| 표 파싱 품질 | 5 | Markdown 변환, 헤더, 숫자, 청크 경계, 병합 셀 |
| 환각 방지 | 6 | 날조, 숫자 정확도, 목록 완전성, 교차 문서 누출, CJK |

#### 고객사 특성 반영

고객사가 **DB 사업 회사**이므로 "표 형태 데이터의 정확한 추출"이 최우선 테스트 항목으로 지정되었다. 별도의 표 파싱 품질 체크리스트(열/행 정렬, 헤더 유지, 숫자 정확성, 청크 경계 분할, 병합 셀)가 있다.

#### SSE 스트리밍 이벤트 순서 검증

RAG 쿼리 응답의 SSE 이벤트가 정확한 순서(agent_start -> processing -> query_data -> hybrid_data -> rerank_data -> llm_stream(thinking) -> llm_stream(answer) -> done)로 도착하는지 검증하는 항목이 있다. 이는 **프론트엔드 UX의 단계별 피드백**이 정상 동작하는지 확인하기 위한 것이다.

#### 환각 방지 테스트

단순 정확도 테스트가 아닌, **AI 시스템 특유의 장애 모드**(날조, 교차 문서 누출, CJK 언어 혼입)를 체계적으로 검증한다. `_clean_answer_text()` 함수가 CJK Unified Ideographs, Hiragana, Katakana 문자 범위를 감지하는 코드가 구현되어 있음을 확인할 수 있다.

### 4.4 데모 리허설에서 보이는 비즈니스 맥락

#### Golden Path: 7단계 데모 시나리오

1. 접속 & 로그인 -> 2. 세션 생성 -> 3. 문서 업로드 -> 4. 사실 기반 질문 -> 5. 표 데이터 질문 -> 6. 후속 질문 -> 7. Admin 대시보드

이 시나리오는 **B2B 고객에게 보여줄 핵심 가치 흐름**을 그대로 반영한다:
- "문서를 올리면 즉시 AI가 질문에 답변한다" (3->4단계)
- "표 데이터도 정확하게 추출한다" (5단계 -- DB 사업 고객 맞춤)
- "대화 맥락을 이해한다" (6단계)
- "관리자가 사용 현황을 모니터링할 수 있다" (7단계 -- B2B 운영)

#### 리허설 3회 + Do's/Don'ts

데모를 3회 반복 리허설하며, "처음 보는 문서로 라이브 데모 하지 않기", "vLLM 사전 워밍업 필수" 등의 **현장 경험에서 나온 실전 팁**이 문서화되어 있다. 장애 대응 시나리오(응답 지연, 오류, 업로드 실패, 전체 서비스 다운)까지 사전 준비된 것은 실제 고객 대면 경험이 반영된 결과이다.

---

## 5. Future Work: 미완성 로드맵

### 5.1 8단계 로드맵의 기술적 비전

| Phase | 내용 | 시간 | 핵심 비전 |
|-------|------|------|-----------|
| **Phase 1** | services/tools/ 제거 | 중기 | Analysis Platform으로 파이프라인 이전, 모노레포 분리 |
| **Phase 2** | Registry 기반 전환 | 중기 | 하드코딩 URL -> 동적 파이프라인 URL 조회 |
| **Phase 3** | AdminDashboard 탭 통합 | 즉시 | PipelineMapping을 5번째 탭으로 |
| **Phase 4** | 사용자별 파이프라인 세션 | 장기 | 회사 -> 팀 -> 사용자 3계층 파이프라인 설정 |
| **Phase 5** | OAuth2/SSO 지원 | 중기 | Google/Azure AD/Okta/SAML 2.0 연동 |
| **Phase 6** | AI Agent 확장 | 단기 | MCP, 코드 실행, 이미지 분석, NL2SQL |
| **Phase 7** | 분석 대시보드 | 장기 | DAU/WAU/MAU, P50/P95/P99, 할루시네이션 감지 |
| **Phase 8** | monitoring/ 제거 | 장기 | Monitoring Platform 독립화 후 정리 |

### 5.2 아키텍처 진화 방향

로드맵에서 드러나는 핵심 방향은 **플랫폼 분리와 마이크로서비스화**이다:

1. **AI Platform**: 인증, 세션, Admin Dashboard 등 핵심 플랫폼 기능만 담당
2. **Analysis Platform**: RAG 파이프라인 레지스트리, 배포, 관리를 독립 운영
3. **Monitoring Platform**: 로그, 메트릭, 대시보드를 독립 운영

현재 모노레포에 모든 서비스가 포함되어 있지만, 장기적으로는 각 플랫폼이 독립적으로 배포/운영되는 구조로 진화할 계획이다.

### 5.3 B2B 엔터프라이즈 기능 확장

- **OAuth2/SSO**: Google Workspace, Azure AD, Okta, SAML 2.0 지원은 B2B SaaS의 필수 기능
- **사용자별 파이프라인**: 동일 회사 내에서도 팀/사용자별 다른 파이프라인 설정 가능 (3계층 우선순위: 사용자 > 팀 > 회사)
- **분석 대시보드**: DAU/WAU/MAU, 토큰 비용 추정, 할루시네이션 감지 등 운영 인사이트

---

## 6. 이력서 보충 스토리

### 6.1 커밋에서는 안 보이는 기획력

커밋 로그에서는 "Semaphore 추가", "Hook 시스템 구현" 같은 코드 변경만 보인다. 그러나 문서를 통해 다음이 드러난다:

- **문제 정의의 정확성**: "RAG Engine이 Worker 1개 + 100% sync 코드"라는 현상을 파악하고, "GIL 경합으로 쿼리 처리가 지연된다"는 근본 원인까지 분석
- **자체 검수 프로세스**: PRD 작성 후 Analysis를 통해 12건의 이슈를 스스로 발견하고 수정 (Critical 3건은 실제 런타임 버그)
- **트레이드오프 문서화**: Worker를 늘리지 않은 이유, Redis를 도입하지 않은 이유 등 "하지 않은 결정"까지 명확히 기록
- **Gherkin 기반 Acceptance Criteria**: 사용자 스토리와 검증 시나리오를 코드와 무관하게 정의

### 6.2 B2B 납품 경험

PoC 검수 문서는 **실제 고객사(DB 사업 회사) 납품** 경험을 보여준다:

- 고객사 도메인(표 데이터)에 특화된 테스트 케이스 설계
- 3회 데모 리허설 + 장애 대응 시나리오 사전 준비
- health-check.sh, 보안 기본값 변경, 네트워크 노출 최소화 등 **운영 환경 보안 체크**
- 고객 전달용 운영 가이드 작성 (납품 산출물)

### 6.3 아키텍처 의사결정 능력

문서 전반에서 다음과 같은 아키텍처 판단이 드러난다:

| 판단 | 근거 | 결과 |
|------|------|------|
| Dual RAG 전략 | 일반 문서(Weaviate) vs 정형 데이터(Qdrant) 특성 차이 | 고객사별 최적 파이프라인 매핑 |
| Worker 1 유지 + Semaphore | TaskStore 공유 불가, 메모리 중복, GIL 경합 분석 | 최소 변경으로 15명 동시 사용 안정성 확보 |
| Hook 시스템 3단계 우선순위 | CRITICAL(검증), NORMAL(DB 저장), LOW(로깅) 분리 | 메인 코드 수정 없는 확장 구조 |
| Diversity-Aware Retrieval | Reranker의 relevance-only 순위가 분과 커버리지를 해치는 문제 | `_filter_context_docs()` 한 함수만 수정하는 최소 침습적 접근 |
| 프론트엔드 React Hook 리팩토링 제외 | "이미 useAgentTrace로 충분" | 불필요한 작업 범위 확장 방지 |

### 6.4 시스템 설계의 전체 그림

커밋 분석에서는 개별 기능 구현만 보이지만, 문서를 통해 다음과 같은 **전체 시스템 설계 역량**이 드러난다:

- **8개 서비스의 마이크로서비스 아키텍처** 설계 및 Docker Compose 오케스트레이션
- **멀티 테넌트** 데이터 격리와 역할 기반 접근 제어
- **듀얼 벡터 DB** 전략과 파이프라인 매핑
- **7종 파일 포맷** 파싱 + OCR 폴백 파이프라인
- **Semantic Chunking** + Hybrid Search(Dense+Sparse) + Reranking 파이프라인
- **SSE 스트리밍** 기반 실시간 응답 (Thinking 과정 포함)
- **환각 방지** 프롬프트 엔지니어링 + CJK 누출 방지 후처리
- **3플랫폼 분리**(AI/Analysis/Monitoring)를 향한 로드맵

---

> **요약**: SoundMind AI Platform의 기획/설계 문서는, 커밋 로그에서 볼 수 없는 **문제 정의의 정확성, 아키텍처 트레이드오프 판단 능력, B2B 납품 현장 경험, 그리고 장기적 기술 비전**을 보여준다. 단순히 코드를 작성한 것이 아니라, "왜 이렇게 만들었는가"와 "왜 다르게 만들지 않았는가"를 모두 설명할 수 있는 엔지니어의 사고 과정이 문서화되어 있다.
