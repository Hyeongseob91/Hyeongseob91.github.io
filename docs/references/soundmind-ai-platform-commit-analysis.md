# SoundMind AI Platform - 커밋 히스토리 분석 보고서

> 분석 일시: 2026-03-11
> 분석 대상: `/mnt/data1/work/soundmind-ai-platform` Git 저장소
> 작성자: AI Research Engineer, Hyeongseob Kim (단독 개발)

---

## 1. 프로젝트 개요

### 기본 정보

| 항목 | 내용 |
|------|------|
| **총 커밋 수** | 85개 (revert 포함) |
| **개발 기간** | 2026-01-20 ~ 2026-03-08 (약 7주) |
| **기여자** | Hyeongseob Kim (단독 개발) |
| **라이선스** | Proprietary - Soundmind Labs |

### 프로젝트 정체성

SoundMind AI Platform은 **B2B SaaS 형태의 AI Agent 체험 플랫폼**이다. 기업 고객이 자사 문서를 업로드하면 RAG(Retrieval-Augmented Generation) 기반으로 질의응답을 수행하고, LangGraph 기반 ReAct Agent를 통해 도구 호출 및 추론을 제공한다.

### 서비스 구성 (마이크로서비스 아키텍처)

| 서비스 | 포트 | 기술 스택 | 역할 |
|--------|------|-----------|------|
| **Web Console** | 3000 | React 19, TypeScript, Vite, TailwindCSS | 프론트엔드 UI |
| **API Gateway** | 9000 | FastAPI, httpx, SSE | BFF (Backend for Frontend) |
| **Chat Agent** | 8100 | LangGraph, FastAPI | ReAct AI Agent |
| **General RAG Pipeline** | 동적 | FastAPI, Weaviate, Infinity | 범용 RAG 파이프라인 |
| **Structured RAG Pipeline** | 동적 | FastAPI, Qdrant | 구조화 RAG 파이프라인 |
| **PostgreSQL** | 5432 | - | 사용자/세션 영속화 |
| **Weaviate** | 8080 | - | 벡터 DB (일반 RAG) |
| **Qdrant** | 6333 | - | 벡터 DB (구조화 RAG) |

---

## 2. 타임라인: 주요 마일스톤

### Phase 1: 초기 구축 (2026-01-20 ~ 2026-01-22) - 6커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 01-20 | `dde14aa` | **Initial commit** - 플랫폼 전체 모노레포 초기 구조 |
| 01-21 | `ac9582f` | uv.lock 추가 (의존성 재현성 확보) |
| 01-21 | `5bde3e7` | TAVILY_API_KEY 환경변수 추가 (웹 검색 도구 준비) |
| 01-21 | `925f8f2` | **OpenAI 프로바이더 지원 + 스트리밍 수정** |
| 01-21 | `e59226a` | SSE 스트리밍에 프로바이더 정보 추가 (조건부 Thinking UI) |
| 01-21 | `1494d42` | 디버그 로깅 + 시스템 프롬프트에 현재 날짜 주입 |

> **핵심**: 첫날에 모노레포 구조를 잡고, 둘째 날에 OpenAI 연동과 SSE 스트리밍 기반을 완성했다. 초기부터 vLLM + OpenAI 멀티 프로바이더를 고려한 설계.

### Phase 2: 핵심 기능 구현 (2026-01-22 ~ 2026-01-23) - 8커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 01-22 | `a57a7ac` | done 이벤트 핸들링 (스트리밍 완료 처리) |
| 01-23 | `f0a8d2c` | **Docling -> pdfplumber + PaddleOCR 전환** (한국어 OCR 지원) |
| 01-23 | `dbd6e5b` | RAG Agent 페이지 다크모드 |
| 01-23 | `268e45e` | AI Agent 페이지 다크모드 |
| 01-23 | `65d89a3` | RAG Agent 2-column 레이아웃 재설계 |
| 01-23 | `bd082af` | **StateGraph 기반 커스텀 ReAct Agent 구현** |
| 01-23 | `c761d82` | 시스템 메시지 포맷팅 |
| 01-23 | `d223110` | UI 현대화 PRD 문서 추가 |

> **핵심**: PDF 파서를 Docling에서 pdfplumber + PaddleOCR로 교체한 것은 **한국어 문서 처리**라는 핵심 요구사항 해결. LangGraph StateGraph 기반 커스텀 ReAct Agent는 아키텍처의 중심축.

### Phase 3: 멀티 LLM + 아키텍처 확장 (2026-01-24 ~ 2026-02-01) - 9커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 01-24 | `845071b` | **Benchmark 기능 제거** (방향 전환) |
| 01-28 | `706a0a1` | **멀티 LLM 모델 지원 + 동적 프롬프트 선택** |
| 01-30 | `4c7690a` | 조건부 소스 표시 + RRF top-k 정렬 수정 |
| 01-30 | `3d7ef11` | **Gemini 프로바이더 추가, 모델 선택 UI, PDF 지원** |
| 01-30 | `ba3005e` | Gemini 호환성 수정, 토큰 추적, 데드 코드 제거 |
| 01-30 | `3ca85d4` | 프롬프트 스타일 템플릿 + 선택 UI |
| 01-30 | `f112fe1` | 파일 업로드 파이프라인, 에러 핸들링, UX 개선 |
| 01-31 | `7d74adf` | **Sentry 통합**, 리포트 중복 출력 수정, 아키텍처 문서 |
| 02-01 | `c4123e4` | **Redis 세션 영속성** (대화 히스토리 유지) |

> **핵심**: vLLM -> OpenAI -> Gemini로 **3개 LLM 프로바이더**를 지원하는 멀티 모델 아키텍처 완성. Sentry 에러 추적 도입으로 프로덕션 대비.

### Phase 4: 인증/권한 + B2B SaaS 전환 (2026-02-03 ~ 2026-02-06) - 16커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 02-03 | `092d877` | Gemini thinking 스트림, RAG 파서/프롬프트 개선 |
| 02-04 | `c14beef` | **JWT 인증, 문서 관리, RAG 수정** |
| 02-04 | `81ebbdd` | 코드 리뷰 크리티컬/메이저 이슈 해결 |
| 02-04 | `88d26bb` | Docker document_storage 디렉토리 권한 수정 |
| 02-04 | `dc0a8b6` | **게스트 로그인 + JWT + 페이지 상태 영속** |
| 02-05 | `e0464bf` | **어드민 대시보드: 기업 상세, 세션, 사용자, 일별 메시지 차트** |
| 02-05 | `437b6e4` | AI Agent 세션/메시지 영속성 |
| 02-05 | `be83afd` | vLLM 도구 호출용 ReAct 패턴 파싱 |
| 02-05 | `496c88e` ~ `8cf5ce4` | 토큰 사용량 차트 (Input/Output 분리 BarChart) |
| 02-05 | `d2fc8da` | 세션 뷰어에 에이전트 타입 필터 탭 |
| 02-05 | `6bc7aa8` | **Weaviate 컬렉션 이름 sanitization** |
| 02-05 | `2b4b8fd` | 기업 ID 영숫자 전용 검증 |
| 02-05 | `94144bf` | 대시보드 리팩토링 - 세션별 토큰 사용량 |
| 02-06 | `592671e` | 세션 문서 복원 + agent_type 일관성 |
| 02-06 | `af63f32` | 로그아웃 시 세션 보존 + 문서 상태 업데이트 |
| 02-06 | `b55ac3a` | **DB-level KST 타임존 변환으로 일별 통계 최적화** |

> **핵심**: 단순 AI 도구에서 **JWT 인증 + 기업별 관리 + 어드민 대시보드**가 포함된 B2B SaaS 플랫폼으로의 대규모 전환. 하루에 10개 이상의 커밋으로 집중 개발.

### Phase 5: 프로덕션 안정화 + 인프라 (2026-02-06 ~ 2026-02-17) - 10커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 02-06 | `81901cf` ~ `cf99cbe` | README 대규모 업데이트 (B2B SaaS 아키텍처 반영) |
| 02-10 | `c54ec15` | **Kanana-2 모델 지원** (한국어 특화 모델) |
| 02-10 | `c2acd8a` | 토큰 사용량 DB 저장 (어드민 대시보드용) |
| 02-14 | `ad26865` | 새 인프라 서빙 엔드포인트 업데이트 |
| 02-15 | `3acec96` | **TensorRT-LLM 구조화 출력 지원 + 스트림 타임아웃 증가** |
| 02-16 | `43577b8` | **3-tier 역할 시스템 (SuperAdmin/Admin/User) + 서비스 로깅** |
| 02-17 | `49f4ba5` | **Guest BYOK(Bring Your Own Key) + 멀티 워커 지원** |
| 02-17 | `e3720fc` | AI Agent -> Chat Agent 명명 통일 |

> **핵심**: TensorRT-LLM 지원, 3-tier RBAC, Guest BYOK 등 엔터프라이즈급 기능 추가. Kanana-2(한국어 LLM) 모델 등록으로 한국 시장 타겟팅.

### Phase 6: Hook 시스템 + 멀티 플랫폼 통합 (2026-02-18 ~ 2026-03-08) - 22커밋

| 날짜 | 커밋 | 내용 |
|------|------|------|
| 02-18 | `c127da1` | **Hook 시스템 + 업로드 동시성 제어** |
| 02-27 | `f86049d` | UI 문서 삭제 시 벡터 청크 삭제 |
| 03-02 | `14aa90b` | **RAG 모듈화 리팩토링 + 데드 코드 제거** |
| 03-05 | `4c85cf2` | **멀티 플랫폼 통합 + 파이프라인 매핑** |
| 03-05 | `afc84ee` | **RAG 파이프라인 구조 재설계** |
| 03-05 | `0ce4b03` | **동적 파이프라인 라우팅 (pipeline_mapping)** |
| 03-05 | `3752278` | /packages PYTHONPATH 공유 모듈 해결 |
| 03-05 | `c5bd228` | **모니터링 스택 분리 + 크로스 플랫폼 포트 규칙 통일** |
| 03-06 | `d4438c8` | Qwen3.5-122B 모델 등록 |
| 03-06 | `f47cc40` | **Qdrant 벡터 스토어 구현 (구조화 RAG)** |
| 03-06 | `771002f` | Grafana 모니터링 탭 (어드민 대시보드) |
| 03-06 | `73a8077` | 토큰 분석 대시보드 재설계 |
| 03-07 | `078f4e3` | 답변 품질 개선 (번호 규칙, 컨텍스트 확장) |
| 03-07 | `d497ecf` ~ `79c599a` | 파일별 삭제 + session_id 필터 수정 |
| 03-07 | `042c7bd` | hybrid search initial_limit 50 -> 100 증가 |
| 03-07 | `cbe5161` | **다양성 인식 컨텍스트 필터링 (부서별 커버리지)** |
| 03-07 | `f6e700c` ~ `8420105` | 파이프라인 선택 드롭다운 + pipeline-configs PK 수정 |
| 03-08 | `2a5a1dd` | **순수 프록시 모드 + 동적 파이프라인 디스커버리** |
| 03-08 | `1f007a0` | 파이프라인 타입 동적 통일 + 테이블 레이아웃 수정 |
| 03-08 | `bc728f2` | 파이프라인 선택 시 pipeline_mappings 자동 업데이트 |

> **핵심**: 단일 RAG 파이프라인에서 **동적 파이프라인 라우팅 + 멀티 플랫폼 통합** 아키텍처로 대전환. 별도의 Analysis Platform과 연동하여 파이프라인을 동적으로 배포/관리하는 구조로 진화.

---

## 3. 방향 전환 (Pivot Points)

### Pivot 1: Benchmark 기능 제거 (01-24)

- **커밋**: `845071b` - `refactor: Remove Benchmark feature from platform`
- **배경**: 초기에는 Pre-query/Post-query 벤치마크 (청킹 전략 비교, RAGAS 메트릭)가 포함되어 있었음
- **결정**: 핵심 제품(RAG Agent + Chat Agent)에 집중하기 위해 벤치마크를 별도 프로젝트로 분리
- **영향**: web_console에서 benchmark 관련 컴포넌트 제거, docker-compose에서 benchmark 프로파일 간소화

### Pivot 2: PDF 파서 교체 - Docling에서 pdfplumber + PaddleOCR로 (01-23)

- **커밋**: `f0a8d2c` - `feat(rag-service): Replace Docling with pdfplumber + PaddleOCR for Korean OCR support`
- **문제**: Docling이 한국어 문서의 OCR을 제대로 처리하지 못함
- **해결**: pdfplumber(PDF 텍스트 추출) + PaddleOCR(한국어 OCR)의 조합으로 교체
- **의의**: 한국어 B2B 시장을 타겟으로 한 핵심 결정

### Pivot 3: 개인 도구에서 B2B SaaS 플랫폼으로 (02-04 ~ 02-06)

- **주요 커밋들**: `c14beef` (JWT 인증), `dc0a8b6` (게스트 로그인), `e0464bf` (어드민 대시보드)
- **변화**: 단순 AI 채팅 도구에서 기업별 관리, 사용자 인증, 사용량 추적이 포함된 SaaS 플랫폼으로 전환
- **추가된 요소**: JWT 인증, 3-tier RBAC, 기업별 문서 관리, 토큰 사용량 대시보드, 게스트 체험 모드

### Pivot 4: 정적 RAG에서 동적 파이프라인 라우팅으로 (03-05 ~ 03-08)

- **주요 커밋들**: `4c85cf2` (멀티 플랫폼 통합), `0ce4b03` (동적 파이프라인 라우팅), `2a5a1dd` (순수 프록시 모드)
- **이전**: 단일 RAG 파이프라인이 docker-compose에 하드코딩
- **이후**: API Gateway가 순수 프록시로 동작하며, Analysis Platform이 파이프라인을 동적으로 배포/관리. pipeline_mapping을 통해 기업별로 다른 RAG 파이프라인 할당 가능
- **의의**: 진정한 멀티 테넌트 SaaS 아키텍처 완성

### Pivot 5: RAG 파이프라인 모듈화 리팩토링 (03-02 ~ 03-06)

- **커밋들**: `14aa90b` (모듈화 리팩토링), `afc84ee` (구조 재설계), `f47cc40` (Qdrant 스토어)
- **변화**: 모놀리식 RAG 코드를 `rag-core` 공유 패키지 + `general_rag_pipeline` + `structured_rag_pipeline`으로 분리
- **패턴**: Component-based Architecture (base/chunker, base/retriever, base/generator, base/reranker)

---

## 4. 문제 해결 이력

### 4.1 스트리밍 관련

| 커밋 | 문제 | 해결 |
|------|------|------|
| `925f8f2` | OpenAI 프로바이더 스트리밍 미지원 | OpenAI 프로바이더 추가 및 스트리밍 수정 |
| `a57a7ac` | 스트리밍 완료 시점 감지 불가 | done 이벤트 핸들링 추가 |
| `3acec96` | TensorRT-LLM 구조화 출력 미지원 + 스트림 타임아웃 | 구조화 출력 지원 + 타임아웃 증가 |

### 4.2 RAG 품질 관련

| 커밋 | 문제 | 해결 |
|------|------|------|
| `f0a8d2c` | 한국어 PDF OCR 실패 (Docling) | pdfplumber + PaddleOCR로 교체 |
| `4c7690a` | 관련 없는 소스가 표시됨 + RRF 정렬 오류 | 조건부 소스 필터 + top-k 정렬 수정 |
| `3516a28` | 무관한 문서가 생성기 컨텍스트에 포함 | 관련 없는 문서 필터링 추가 |
| `042c7bd` | 검색 결과가 너무 적음 | hybrid search initial_limit 50 -> 100 |
| `cbe5161` | 특정 부서 문서만 검색됨 | 다양성 인식 컨텍스트 필터링으로 부서별 커버리지 보장 |
| `078f4e3` | 답변이 번호 없이 나열됨 | 번호 규칙 + 컨텍스트 확장으로 답변 품질 개선 |
| `79c599a` | session_id 없이 collection_name만으로 검색 | collection_name 존재 시 session_id 필터 적용 |

### 4.3 인프라/Docker 관련

| 커밋 | 문제 | 해결 |
|------|------|------|
| `88d26bb` | document_storage 디렉토리 권한 문제 | Docker에 적절한 권한 설정 추가 |
| `6bc7aa8` | Weaviate 컬렉션 이름 호환성 오류 | 컬렉션 이름 sanitization (특수문자 제거) |
| `3752278` | 공유 모듈 import 실패 | /packages를 PYTHONPATH에 추가 |
| `b55ac3a` | 일별 통계 타임존 오류 (UTC vs KST) | DB-level KST 타임존 변환 |

### 4.4 인증/세션 관련

| 커밋 | 문제 | 해결 |
|------|------|------|
| `81ebbdd` | 코드 리뷰 크리티컬/메이저 이슈 다수 | 일괄 수정 |
| `af63f32` | 로그아웃 시 세션 데이터 소실 | 세션 보존 + 문서 상태 업데이트 |
| `db0a16d` | 토큰 사용량 추출 실패 | usage_metadata dict에서 올바르게 추출 |
| `437b6e4` | AI Agent 대화 히스토리 미저장 | 세션/메시지 영속성 추가 |

### 4.5 UI/UX 관련

| 커밋 | 문제 | 해결 |
|------|------|------|
| `ba3005e` | Gemini API 호환성 + 데드 코드 | 호환성 수정 + 코드 정리 |
| `1f007a0` | 파이프라인 타입 불일치 + 테이블 깨짐 | 타입 동적 통일 + 레이아웃 수정 |
| `8420105` | pipeline-configs PK 조회 오류 | Company.id(PK)로 조회 허용 |

---

## 5. 기술적 진화

### 5.1 LLM 프로바이더 진화

```
vLLM (자체 호스팅)
  -> + OpenAI API (01-21, 925f8f2)
    -> + Gemini (01-30, 3d7ef11)
      -> + Kanana-2 한국어 모델 (02-10, c54ec15)
        -> + Qwen3.5-122B (03-06, d4438c8)
          -> + TensorRT-LLM 지원 (02-15, 3acec96)
```

초기 vLLM 단독에서 시작하여 **6종 이상의 LLM을 동적으로 선택 가능한 멀티 모델 아키텍처**로 진화. 프롬프트 스타일 템플릿(`3ca85d4`)을 통해 모델별 최적 프롬프트를 자동 적용.

### 5.2 인증 시스템 진화

```
무인증
  -> JWT 기본 인증 (02-04, c14beef)
    -> 게스트 로그인 (02-04, dc0a8b6)
      -> 3-tier RBAC: SuperAdmin/Admin/User (02-16, 43577b8)
        -> Guest BYOK (02-17, 49f4ba5)
```

"Bring Your Own Key"는 게스트도 자신의 API 키를 입력하여 서비스를 체험할 수 있는 기능으로, 세일즈 데모 시나리오에 최적화.

### 5.3 RAG 파이프라인 진화

```
단일 RAG 서비스 (모놀리식)
  -> Docling -> pdfplumber+PaddleOCR 교체 (01-23)
    -> 조건부 소스 표시 + RRF 개선 (01-30)
      -> Redis 세션 영속성 (02-01)
        -> 모듈화 리팩토링 (03-02, 14aa90b)
          -> General + Structured 파이프라인 분리 (03-05~06)
            -> 동적 파이프라인 라우팅 (03-05, 0ce4b03)
              -> 순수 프록시 모드 (03-08, 2a5a1dd)
```

최종 아키텍처: API Gateway는 **순수 프록시**로서 요청을 적절한 파이프라인에 라우팅. 각 파이프라인은 Component-based Architecture(Chunker, Retriever, Reranker, Generator)로 구성.

### 5.4 벡터 DB 진화

```
Weaviate (Hybrid Search: Dense + Sparse)
  -> + Qdrant 추가 (03-06, f47cc40) - 구조화 RAG용
```

General RAG는 Weaviate(Hybrid Search), Structured RAG는 Qdrant(Dense + Payload 필터링)로 용도별 벡터 DB 분리.

### 5.5 대시보드/모니터링 진화

```
없음
  -> 기업 상세 뷰: 세션, 사용자, 일별 차트 (02-05)
    -> 토큰 사용량 BarChart (02-05)
      -> 세션별 토큰 사용량 (02-05)
        -> 토큰 DB 저장 (02-10)
          -> Grafana 모니터링 탭 (03-06)
            -> 토큰 분석 대시보드 재설계 (03-06)
```

### 5.6 기술 스택 전체 그림

| 계층 | 기술 |
|------|------|
| **Frontend** | React 19, TypeScript 5.9, Vite 5, TailwindCSS 3.4, Recharts, Axios |
| **API Layer** | FastAPI, SSE (Server-Sent Events), httpx (async) |
| **Agent** | LangGraph (StateGraph + ReAct), LangChain-OpenAI |
| **RAG** | Semantic Chunking, Hybrid Search (Dense + Sparse), Reranking, Query Rewrite |
| **Vector DB** | Weaviate 1.27, Qdrant 1.17 |
| **Embedding/Reranker** | Infinity (self-hosted) |
| **LLM** | vLLM, OpenAI, Gemini, Kanana-2, Qwen3.5-122B, TensorRT-LLM |
| **Auth** | JWT, 3-tier RBAC, BYOK |
| **DB** | PostgreSQL 16, Redis |
| **Monitoring** | Sentry, Grafana, Prometheus |
| **Infra** | Docker Compose, Nginx, uv (Python) |

---

## 6. 규모 분석

### 6.1 서비스별 소스 파일 수

| 서비스 | Python 파일 | TypeScript 파일 | 합계 |
|--------|-------------|-----------------|------|
| **API Gateway** | ~50개 (routes, auth, hooks, streaming, services, clients) | - | ~50 |
| **Chat Agent** | ~16개 (agents, tools, routes) | - | ~16 |
| **General RAG Pipeline** | ~35개 (pipelines, components, infrastructure, services) | - | ~35 |
| **Structured RAG Pipeline** | ~35개 (동일 구조, Qdrant 특화) | - | ~35 |
| **Web Console** | - | ~30개 (components, services, contexts) | ~30 |
| **Shared Packages** | rag-core, shared utils | - | ~10 |

**추정 총 소스 파일**: ~176개

### 6.2 주요 디렉토리 구조

```
soundmind-ai-platform/
├── services/
│   ├── api_gateway/src/          # BFF - 가장 큰 서비스 (인증, 라우팅, 스트리밍, 훅)
│   ├── agents/chat_agent/src/    # LangGraph Agent
│   ├── tools/
│   │   ├── general_rag_pipeline/ # Weaviate 기반 RAG
│   │   └── structured_rag_pipeline/ # Qdrant 기반 RAG
│   └── web_console/src/          # React 프론트엔드
├── packages/
│   ├── rag-core/                 # 공유 RAG 코어
│   ├── shared/                   # 공유 유틸리티
│   └── pipelines/
│       ├── advanced/             # 고급 파이프라인 패키지
│       └── structured/           # 구조화 파이프라인 패키지
├── infrastructure/scripts/       # 배포/설정 스크립트
├── docker-compose.yml            # 플랫폼 오케스트레이션
└── pyproject.toml               # 루트 프로젝트 설정
```

### 6.3 핵심 파일 목록

| 파일 | 역할 |
|------|------|
| `services/api_gateway/src/api/routes/chat.py` | SSE 스트리밍 채팅 엔드포인트 |
| `services/api_gateway/src/streaming/sse.py` | SSE 이벤트 스트리밍 엔진 |
| `services/api_gateway/src/auth/jwt.py` | JWT 인증 |
| `services/api_gateway/src/database/models.py` | DB 모델 (User, Company, Session, Message) |
| `services/api_gateway/src/hooks/` | Hook 시스템 (message, document, auth) |
| `services/agents/chat_agent/src/agents/chat_agent.py` | LangGraph ReAct Agent 메인 |
| `services/agents/chat_agent/src/agents/templates.py` | 프롬프트 스타일 템플릿 |
| `services/tools/general_rag_pipeline/src/core/pipelines/advanced.py` | 고급 RAG 파이프라인 |
| `services/tools/structured_rag_pipeline/src/core/pipelines/structured.py` | 구조화 RAG 파이프라인 |
| `services/web_console/src/App.tsx` | 프론트엔드 메인 라우팅 |
| `services/web_console/src/components/ChatInterface.tsx` | 채팅 UI (SSE 수신) |
| `services/web_console/src/components/AdminDashboard.tsx` | 어드민 대시보드 |
| `docker-compose.yml` | 전체 서비스 오케스트레이션 |

### 6.4 커밋 빈도 분석

| 기간 | 커밋 수 | 평균 커밋/일 | 특징 |
|------|---------|-------------|------|
| 01-20 ~ 01-24 | 14 | 2.8 | 초기 구축 집중 개발 |
| 01-28 ~ 02-01 | 7 | 1.75 | 멀티 LLM + 파일 업로드 |
| 02-03 ~ 02-06 | 24 | 6.0 | **최고 집중 개발기** (B2B SaaS 전환) |
| 02-10 ~ 02-18 | 8 | 0.89 | 안정화 + 인프라 |
| 02-27 ~ 03-08 | 22 | 2.2 | 멀티 플랫폼 통합 |

> 02-05 하루에만 약 10개의 커밋이 있었으며, 이는 B2B SaaS 전환의 핵심 기능(어드민 대시보드, 토큰 추적, 세션 관리)을 집중 구현한 날이다.

---

## 7. 이력서용 핵심 스토리 후보

### 스토리 1: 한국어 특화 RAG 파이프라인 구축

- **문제**: 기업 고객의 한국어 PDF 문서(계약서, 규정집 등)에서 정확한 텍스트 추출이 필요했으나, 기존 PDF 파서(Docling)가 한국어 OCR을 제대로 처리하지 못함
- **해결**: pdfplumber + PaddleOCR 조합으로 교체, Semantic Chunking + Hybrid Search(Dense + Sparse) + Reranking 파이프라인 구축. 다양성 인식 컨텍스트 필터링으로 부서별 문서 커버리지 보장
- **성과**: 한국어 문서 기반 RAG 품질 확보. Query Rewrite -> Hybrid Search -> Reranking -> Generation의 4단계 파이프라인으로 검색 정확도와 답변 충실도 동시 달성

### 스토리 2: 멀티 LLM 프로바이더 아키텍처 설계

- **문제**: 단일 LLM에 의존하면 장애 시 서비스 중단, 또한 고객마다 선호하는 모델이 다름 (비용, 성능, 한국어 지원도)
- **해결**: Provider 추상화 레이어 설계로 vLLM(자체 호스팅), OpenAI, Gemini, TensorRT-LLM을 동적으로 전환 가능. 모델별 프롬프트 스타일 템플릿 자동 적용. Guest BYOK로 자신의 API 키 사용 가능
- **성과**: 6종 이상 LLM 지원 (vLLM/Qwen3.5-122B, OpenAI/GPT-4o, Gemini/2.5-Pro, Kanana-2 등). 프로바이더 추가 시 코드 변경 최소화

### 스토리 3: 실시간 SSE 스트리밍 + Think Tag 파싱 시스템

- **문제**: LLM의 응답이 길어 사용자가 오래 기다려야 함. 또한 LLM의 사고 과정(`<think>` 태그)을 사용자에게 실시간으로 보여주고 싶음
- **해결**: API Gateway에서 SSE(Server-Sent Events) 기반 실시간 스트리밍 구현. Think Tag Parser가 `<think>...</think>` 태그를 스트림 중에 실시간 파싱하여 thinking/chunk 이벤트로 분리. 10종 이상의 SSE 이벤트 타입으로 파이프라인 진행 상태 실시간 전달 (query_rewrite -> retrieval -> generation)
- **성과**: 사용자가 RAG 파이프라인의 각 단계를 실시간으로 확인 가능. VL 모델 등 다양한 Think Tag 형식 호환

### 스토리 4: 동적 파이프라인 라우팅 아키텍처

- **문제**: 고객마다 다른 RAG 전략이 필요 (범용 문서 vs 구조화 데이터). 파이프라인 추가/변경 시 플랫폼 전체 재배포 필요
- **해결**: API Gateway를 순수 프록시로 전환, pipeline_mapping 테이블을 통해 기업별 파이프라인 동적 할당. Analysis Platform이 파이프라인을 동적으로 배포/관리. Component-based Architecture(Chunker, Retriever, Reranker, Generator)로 파이프라인 컴포넌트 교체 가능
- **성과**: 코드 변경 없이 새 파이프라인 배포 가능. 기업별 맞춤 RAG 전략 제공. General RAG(Weaviate/Hybrid) + Structured RAG(Qdrant/Filtered) 2종 파이프라인 동시 운영

### 스토리 5: 7주 만에 B2B SaaS 플랫폼 구축 (Solo Developer)

- **문제**: 제한된 시간 내에 프로토타입 수준의 AI 도구를 엔터프라이즈급 B2B SaaS 플랫폼으로 발전시켜야 함
- **해결**: 모노레포 + 마이크로서비스 아키텍처로 시작. 7주간 85개 커밋으로 5개 서비스, 3개 데이터베이스, 6종 LLM 지원 플랫폼 구축. JWT 인증, 3-tier RBAC, 어드민 대시보드, 토큰 사용량 추적, Sentry 에러 모니터링, Grafana 대시보드까지 포함
- **성과**: 풀스택 단독 개발로 프론트엔드(React/TypeScript) + 백엔드(FastAPI/Python) + 인프라(Docker/Nginx) + AI(LangGraph/RAG) 전 계층을 아우르는 프로덕션 레디 플랫폼 완성

### 스토리 6: LangGraph 기반 ReAct Agent + 보안 레이어

- **문제**: 단순 챗봇을 넘어 도구 호출(RAG, 웹 검색, 파일 처리)이 가능한 AI Agent가 필요하지만, 프롬프트 인젝션 등 보안 위협에도 대비해야 함
- **해결**: LangGraph StateGraph 기반 커스텀 ReAct(Reasoning + Acting) Agent 구현. Security Layer(RateLimiter, InputValidator, PromptSanitizer, FileSandbox) 적용. Middleware Pipeline으로 의도 분석 -> 도구 선택 -> 라우팅 자동화. BaseTool 기반 확장 가능한 도구 레지스트리
- **성과**: 5종 이상 도구(RAG, File Read/Write, Web Search, Report Generation) 지원. 보안 레이어로 프롬프트 인젝션 방어, 파일 샌드박스, Rate Limiting 적용

---

## 부록: 전체 커밋 로그 (시간순)

| # | 날짜 | 해시 | 메시지 |
|---|------|------|--------|
| 1 | 01-20 | `dde14aa` | feat(platform): Initial commit - SoundMind AI Platform |
| 2 | 01-21 | `ac9582f` | chore(deps): Add uv.lock for dependency reproducibility |
| 3 | 01-21 | `5bde3e7` | chore(infra): Add TAVILY_API_KEY to chat-agent environment |
| 4 | 01-21 | `925f8f2` | feat(chat-agent): Add OpenAI provider support and fix streaming |
| 5 | 01-21 | `e59226a` | feat(chat-agent): Add provider info to SSE streaming for conditional Thinking UI |
| 6 | 01-21 | `1494d42` | feat(chat-agent): Add debug logging and system prompt with current date |
| 7 | 01-22 | `a57a7ac` | feat(chat-agent): Add done event handling for streaming completion |
| 8 | 01-23 | `f0a8d2c` | feat(rag-service): Replace Docling with pdfplumber + PaddleOCR for Korean OCR support |
| 9 | 01-23 | `dbd6e5b` | feat(ui): Add dark mode to RAG Agent page |
| 10 | 01-23 | `268e45e` | feat(ui): Add dark mode to AI Agent page |
| 11 | 01-23 | `65d89a3` | feat(ui): Redesign RAG Agent layout with 2-column structure |
| 12 | 01-23 | `bd082af` | feat(chat-agent): Implement StateGraph-based custom ReAct agent |
| 13 | 01-23 | `c761d82` | style(chat-agent): Format system message whitespace |
| 14 | 01-23 | `d223110` | docs(prd): Add UI modernization PRD and analysis |
| 15 | 01-24 | `845071b` | refactor: Remove Benchmark feature from platform |
| 16 | 01-28 | `706a0a1` | feat(llm): Add multi-LLM model support with dynamic prompt selection |
| 17 | 01-30 | `4c7690a` | fix(rag): Add conditional source display and RRF top-k sorting |
| 18 | 01-30 | `37288f4` | chore: Add docs/reference to gitignore |
| 19 | 01-30 | `3d7ef11` | feat(agent): Add Gemini provider, model selection UI, and PDF support |
| 20 | 01-30 | `ba3005e` | refactor(agent): Fix Gemini compatibility, add token tracking, clean dead code |
| 21 | 01-30 | `3ca85d4` | feat(agent): Add prompt style templates and selection UI |
| 22 | 01-30 | `f112fe1` | feat(agent): Add file upload pipeline, error handling, and UX improvements |
| 23 | 01-31 | `7d74adf` | feat: Add Sentry integration, fix report duplicate output, add architecture docs |
| 24 | 02-01 | `c4123e4` | feat: Add session persistence with Redis for conversation history |
| 25 | 02-01 | `3516a28` | fix(rag): Filter irrelevant docs from generator context |
| 26 | 02-03 | `e5b50b8` | docs: Update README with comprehensive platform documentation |
| 27 | 02-03 | `092d877` | feat: Add Gemini thinking stream, improve RAG parser and prompts, enhance UX |
| 28 | 02-04 | `c14beef` | feat: Add JWT authentication, document management, and RAG fixes |
| 29 | 02-04 | `81ebbdd` | fix: Address code review critical/major issues |
| 30 | 02-04 | `88d26bb` | fix(docker): Add document_storage directory with proper permissions |
| 31 | 02-04 | `5be3e19` | chore(docs): Remove outdated documentation files |
| 32 | 02-04 | `a236c23` | fix(docs): Update image path in README |
| 33 | 02-04 | `047ba1e` | refactor(docs): Move system architecture image to docs folder |
| 34 | 02-04 | `dc0a8b6` | feat(auth): Add guest login with JWT and page state persistence |
| 35 | 02-05 | `e0464bf` | feat(admin): Add company detail view with sessions, users, and daily message chart |
| 36 | 02-05 | `437b6e4` | fix(ai-agent): Add session/message persistence for AI Agent chat |
| 37 | 02-05 | `be83afd` | feat(chat-agent): Add ReAct pattern parsing for vLLM tool calling |
| 38 | 02-05 | `496c88e` | feat(dashboard): Add token usage chart and fix AI Agent token tracking |
| 39 | 02-05 | `db0a16d` | fix(chat): Fix token usage extraction from usage_metadata dict |
| 40 | 02-05 | `05a3148` | feat(dashboard): Change token usage to stacked BarChart with Input/Output |
| 41 | 02-05 | `8cf5ce4` | feat(dashboard): Add token summary and match project color scheme |
| 42 | 02-05 | `d2fc8da` | feat(dashboard): Add agent type filter tabs to session viewer |
| 43 | 02-05 | `6bc7aa8` | fix(vectordb): Sanitize collection name for Weaviate compatibility |
| 44 | 02-05 | `2b4b8fd` | feat(admin): Add Company ID validation for alphanumeric only |
| 45 | 02-05 | `94144bf` | refactor(dashboard): Remove session tab, add token usage per session |
| 46 | 02-06 | `592671e` | feat(rag): Add session document restoration and fix agent_type consistency |
| 47 | 02-06 | `af63f32` | fix(session): Preserve session on logout and update document status |
| 48 | 02-06 | `b55ac3a` | fix(admin): Optimize daily stats with DB-level KST timezone conversion |
| 49 | 02-06 | `81901cf` | docs: Update README to reflect B2B SaaS platform architecture |
| 50 | 02-06 | `2a9fd2b` | docs: Update LLM model references to support multiple series |
| 51 | 02-06 | `cf99cbe` | docs: Add RAG Agent data parsing and chunking documentation |
| 52 | 02-10 | `c54ec15` | feat(config): Add Kanana-2 model support to model registry |
| 53 | 02-10 | `c2acd8a` | fix(chat): Save token usage to database for admin dashboard |
| 54 | 02-14 | `ad26865` | feat(config): Update model serving endpoints for new infrastructure |
| 55 | 02-15 | `3acec96` | fix(rag): Support TensorRT-LLM structured output and increase stream timeout |
| 56 | 02-16 | `43577b8` | feat(auth): Add 3-tier role system and service logging |
| 57 | 02-17 | `49f4ba5` | feat(auth): Add Guest BYOK and multi-worker support |
| 58 | 02-17 | `e3720fc` | refactor(ui): Rename AI Agent to Chat Agent in user-facing text |
| 59 | 02-18 | `c127da1` | feat(hooks): Add Hook system and upload concurrency control |
| 60 | 02-27 | `f86049d` | fix(rag): Delete vector chunks when document is removed from UI |
| 61 | 03-02 | `14aa90b` | refactor(rag): Extract modular components and remove dead code |
| 62 | 03-05 | `4c85cf2` | feat: add multi-platform integration and pipeline mapping |
| 63 | 03-05 | `7ad5970` | docs: add project manual and future work plan |
| 64 | 03-05 | `f72b335` | docs: add project manual and future work plan (duplicate) |
| 65 | 03-05 | `3d74009` | revert: Revert "docs: add project manual and future work plan" |
| 66 | 03-05 | `afc84ee` | refactor: restructure RAG pipelines and update README |
| 67 | 03-05 | `0ce4b03` | feat: add dynamic pipeline routing via pipeline_mapping |
| 68 | 03-05 | `3752278` | fix: add /packages to PYTHONPATH for shared module resolution |
| 69 | 03-05 | `c5bd228` | refactor(infra): extract monitoring stack and unify cross-platform port rules |
| 70 | 03-06 | `d4438c8` | feat(llm): register Qwen3.5-122B model in model registry |
| 71 | 03-06 | `f47cc40` | feat(rag): implement QdrantStore for structured RAG pipeline |
| 72 | 03-06 | `771002f` | feat(console): add Grafana monitoring tab to Admin Dashboard |
| 73 | 03-06 | `73a8077` | feat(admin): redesign Usage tab with token analytics dashboard |
| 74 | 03-07 | `078f4e3` | feat(rag): improve answer quality with numbering rules and context expansion |
| 75 | 03-07 | `d497ecf` | fix(docs): enable per-file deletion and preserve documents on upload |
| 76 | 03-07 | `79c599a` | fix(rag): apply session_id filter when collection_name is present |
| 77 | 03-07 | `042c7bd` | feat(rag): increase hybrid search initial_limit from 50 to 100 |
| 78 | 03-07 | `cbe5161` | feat(rag): implement diversity-aware context filtering for division coverage |
| 79 | 03-07 | `f6e700c` | feat(admin): add pipeline selection dropdown to accounts table |
| 80 | 03-07 | `8420105` | fix(admin): allow pipeline-configs lookup by Company.id (PK) |
| 81 | 03-08 | `2a5a1dd` | feat: pure proxy mode with dynamic pipeline discovery and routing |
| 82 | 03-08 | `1f007a0` | fix(admin): unify pipeline types to dynamic, fix table layout |
| 83 | 03-08 | `bc728f2` | feat(admin): auto-update pipeline_mappings on pipeline selection |

---

> 이 보고서는 `.git/logs/HEAD`의 85개 커밋 로그와 프로젝트 소스 구조를 기반으로 작성되었습니다.
