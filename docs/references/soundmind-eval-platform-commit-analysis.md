# SoundMind Eval Platform - 커밋 히스토리 분석 보고서

> 분석 일시: 2026-03-11
> 대상 리포지토리: soundmind-eval-platform
> 기여자: Hyeongseob Kim (rukais2294@gmail.com)
> 총 커밋 수: 8 (rebase 포함)
> 개발 기간: 2026-03-04 ~ 2026-03-05 (2일간 집중 개발)

---

## 1. 프로젝트 개요

**SoundMind Eval Platform**은 RAG(Retrieval-Augmented Generation) 파이프라인의 품질을 자동으로 평가하고, A/B 테스트를 수행하며, LLM 기반 개선 인사이트를 제공하는 풀스택 평가 플랫폼이다.

### 핵심 기술 스택
| 계층 | 기술 |
|------|------|
| **백엔드 API** | Python 3.11+, FastAPI, uvicorn, Pydantic v2 |
| **데이터 저장** | SQLite (aiosqlite), Redis 7 (캐시) |
| **프론트엔드** | React 19, TypeScript, Vite 6, Tailwind CSS 3, Recharts, Lucide React |
| **통계 분석** | NumPy, SciPy (Mann-Whitney U test, Bootstrap CI) |
| **인프라** | Docker Compose, 마이크로서비스 아키텍처, Promtail/Loki 호환 JSON 로깅 |

### 아키텍처 구성
- `services/eval_api/` - FastAPI 기반 평가 API 서버 (포트 9300)
- `services/web_console/` - React SPA 대시보드 (포트 3300)
- `eval-redis` - Redis 캐시 서버 (포트 6380)
- 외부 의존: `soundmind-analysis-api` (분석 플랫폼, 포트 9200)과 HTTP 통신

### 주요 기능 모듈
1. **평가 메트릭 엔진**: Faithfulness, Answer Relevance, Context Precision, Context Recall, Answer Correctness, Chunking Quality, LLM-as-Judge
2. **A/B 테스트 프레임워크**: 두 파이프라인 간 성능 비교 + 통계적 유의성 검증
3. **인사이트 리포트 생성기**: 규칙 기반 분석 + LLM 강화 개선 제안
4. **실험 관리**: 실험 CRUD, 데이터셋 업로드/관리, 실행 이력 추적
5. **웹 콘솔**: 대시보드, 실험 관리, A/B 테스트, 파이프라인 모니터링, 인사이트 시각화

---

## 2. 타임라인: 주요 마일스톤

### Day 1: 2026-03-04 (핵심 구축일)

| 시간 | 커밋 | 내용 | 의미 |
|------|------|------|------|
| 17:01 | `Initial commit: SoundMind Eval Platform` | 프로젝트 초기 구축 - 전체 아키텍처, 평가 엔진, API 라우트, 웹 콘솔 | **풀스택 MVP 완성** |
| 17:34 | `fix: resolve serving readiness issues` | 서빙 준비 상태 문제 해결 | 첫 배포 시도 후 즉시 수정 |
| 18:36 | `feat(web-console): improve UX with toast, error handling, empty states` | 토스트 알림, 에러 핸들링, 빈 상태 UI 개선 | **UX 품질 강화** |
| 18:37 | `rebase onto 9bfcff8` | 히스토리 정리 | 커밋 이력 관리 |
| 18:41 | `chore: add *.tsbuildinfo to .gitignore` | TypeScript 빌드 산출물 제외 | 빌드 환경 정리 |
| 19:10 | `chore(infra): update service ports for eval platform` | 서비스 포트 변경 | 기존 인프라와의 충돌 해결 |
| 21:01 | `chore(infra): add .dockerignore for Docker build optimization` | Docker 빌드 최적화 | 배포 파이프라인 성숙 |

### Day 2: 2026-03-05

| 시간 | 커밋 | 내용 | 의미 |
|------|------|------|------|
| 17:08 | `feat(eval): add experiment delete and JSON logging` | 실험 삭제 API + cascade 삭제 + JSON 로깅 | **운영 준비 완료** |

---

## 3. 방향 전환 (Pivot Points)

### Pivot 1: 직접 호출 -> HTTP 클라이언트 패턴으로의 전환
코드 주석에서 핵심적인 아키텍처 결정이 드러난다:
```
"This is the key refactoring: instead of directly instantiating pipeline nodes,
the orchestrator communicates with deployed pipelines via HTTP."
```
`PipelineClient` 코드에도 명시되어 있다:
```
Before: node = self._registry.get("query_rewrite")
        result = await node.process(state["question"], ...)
After:  result = await client.query(question)
```
이 전환은 평가 플랫폼을 파이프라인 코드로부터 완전히 분리(decoupling)하여, 어떤 파이프라인이든 HTTP API만 노출하면 평가할 수 있는 범용 플랫폼으로 만들었다.

### Pivot 2: 포트 재배치 (커밋 6)
서비스 포트를 변경한 것은 기존 SoundMind 에코시스템(Analysis Platform: 9200, Registry: 9100 등)과의 통합을 위한 것이다. 독립적 개발에서 시스템 통합 단계로의 전환점이다.

### Pivot 3: 규칙 기반 + LLM 하이브리드 인사이트
`InsightReportGenerator`에서 규칙 기반 분석을 먼저 수행하고, LLM이 가용할 경우에만 추가 인사이트를 생성하는 하이브리드 전략을 채택했다. LLM 의존성 없이도 동작하는 견고한 설계이다.

---

## 4. 문제 해결 이력

### 4.1 서빙 준비 상태 문제 (커밋 2)
- **문제**: 초기 커밋 직후 서빙이 정상적으로 되지 않는 이슈 발생
- **해결**: `fix: resolve serving readiness issues` - 33분 만에 수정 완료
- **학습**: 초기 배포 단계에서 발생하는 전형적인 설정 이슈

### 4.2 UX 결함 (커밋 3)
- **문제**: 웹 콘솔에서 에러 발생 시 피드백 없음, 데이터 없을 때 빈 화면
- **해결**: Toast 알림 시스템, 에러 핸들링 개선, EmptyState 컴포넌트 추가
- **학습**: 사용자 경험은 기능 구현과 동시에 고려해야 함

### 4.3 빌드 산출물 오염 (커밋 5)
- **문제**: `*.tsbuildinfo` 파일이 git에 추적됨
- **해결**: `.gitignore`에 추가
- **학습**: TypeScript 프로젝트 초기 세팅 시 빌드 캐시 파일 관리 필수

### 4.4 인프라 포트 충돌 (커밋 6)
- **문제**: 기존 서비스와 포트 충돌 가능성
- **해결**: eval platform 전용 포트로 재배치 (API: 9300, Web: 3300, Redis: 6380)
- **학습**: 마이크로서비스 환경에서 포트 네임스페이스 관리의 중요성

### 4.5 실험 데이터 정리 및 관찰성 (커밋 8)
- **문제**: 실험 삭제 시 관련 execution_history 잔존, 로그가 Promtail과 비호환
- **해결**: CASCADE 삭제 구현 + JSON 포맷 로깅 도입
- **학습**: 운영 환경에서의 데이터 정합성과 관찰성(Observability) 확보

---

## 5. 기술적 진화

### Phase 1: 코어 아키텍처 수립 (커밋 1)
- **평가 메트릭 추상화**: `BaseMetric` ABC를 통한 Strategy 패턴 적용
  - `MetricInput` / `MetricOutput` 표준 인터페이스
  - 7개 구체 메트릭 구현 (Retrieval 2개, Generation 2개, E2E 1개, Chunking 1개, LLM Judge 1개)
- **Orchestrator 패턴**: 파이프라인 발견(Registry) -> 질의(PipelineClient) -> 평가 파이프라인
- **비동기 우선 설계**: 모든 평가 메트릭과 DB 작업이 `async/await` 기반
- **관계형 데이터 모델**: experiments -> execution_history (1:N), datasets 독립 테이블
- **React SPA**: 6개 페이지 (Dashboard, Experiments, ABTest, Insights, Pipelines, Datasets)

### Phase 2: 안정화 및 UX 개선 (커밋 2-3)
- 서빙 이슈 해결으로 배포 가능 상태 확보
- Toast 알림 시스템 (`ToastProvider` 컨텍스트)
- EmptyState 컴포넌트로 빈 데이터 상태 처리
- 에러 바운더리 강화

### Phase 3: 인프라 성숙 (커밋 4-7)
- `.gitignore` 정리 (TypeScript 빌드 캐시)
- 포트 네임스페이스 확정 (9300/3300/6380)
- `.dockerignore` 추가로 Docker 빌드 최적화
- Docker Compose healthcheck 설정 (interval: 30s, retries: 3)

### Phase 4: 운영 준비 (커밋 8)
- 실험 삭제 API (DELETE /experiments/{id}) + cascade 삭제
- 프론트엔드에 삭제 버튼 + 확인 다이얼로그
- JSON 포맷 로깅 (`JsonFormatter`) - Promtail/Loki 호환
- uvicorn 로거 통합, 외부 라이브러리 로그 억제

### 기술적 하이라이트
| 영역 | 설계 결정 | 근거 |
|------|-----------|------|
| **통계 검정** | Mann-Whitney U test | 비모수 검정 - 점수 분포 가정 불필요 |
| **신뢰구간** | Bootstrap CI (1000회 리샘플링) | 소표본에서도 견고한 추정 |
| **LLM Judge** | OpenAI 호환 API (/v1/chat/completions) | 다양한 LLM 백엔드 지원 |
| **캐싱** | Redis + Graceful Degradation | Redis 미가용 시 정상 동작 |
| **DB** | SQLite + aiosqlite | 경량 시작, 필요 시 PostgreSQL 전환 용이 |
| **인사이트** | Rule-based + LLM Hybrid | LLM 없이도 기본 분석 가능 |

---

## 6. 규모 분석

### 코드베이스 규모

| 구분 | 파일 수 | 주요 내용 |
|------|---------|-----------|
| **백엔드 Python** | ~20개 | 평가 엔진, API 라우트, 스토리지, 어댑터, 캐시, 인사이트 |
| **프론트엔드 TSX** | ~15개 | 6 페이지 + 5 컴포넌트 + App/Main |
| **인프라 설정** | 3개 | docker-compose.yml, pyproject.toml, package.json |
| **스크립트** | 3개 | 평가 실행, 차트 생성, README 생성 |

### API 엔드포인트 (총 13개+)

| 라우트 그룹 | 엔드포인트 수 | 기능 |
|-------------|-------------|------|
| `/api/v1/evaluate` | 2 | 평가 실행, A/B 테스트 |
| `/api/v1/experiments` | 4 | CRUD (목록/생성/조회/삭제) |
| `/api/v1/datasets` | 5 | CRUD + 파일 업로드 |
| `/api/v1/insights` | 1 | 인사이트 리포트 생성 |
| `/api/v1/orchestrator` | 1 | 상태 확인 |
| `/api/v1` | 2 | 파이프라인 목록, 헬스체크 |

### 평가 메트릭 (7개)

| 카테고리 | 메트릭 | 방식 |
|----------|--------|------|
| Retrieval | Context Precision | 키워드 매칭 기반 |
| Retrieval | Context Recall | 키워드 커버리지 기반 |
| Generation | Answer Relevance | 질문-답변 키워드 오버랩 |
| Generation | Faithfulness | 컨텍스트 근거 검증 |
| E2E | Answer Correctness | F1-style GT 비교 |
| Chunking | Chunking Quality | 청크 길이 기반 휴리스틱 |
| LLM Judge | LLM Judge (configurable criteria) | 외부 LLM API 호출 |

### 개발 속도 분석
- **Day 1 집중도**: 7개 커밋을 4시간(17:01 ~ 21:01)에 완성
- **MVP 완성 시간**: 초기 커밋 1건에 전체 풀스택 구현 포함
- **버그 수정 속도**: 서빙 이슈 발생 후 33분 내 해결
- **협업 도구 활용**: Claude AI와의 Co-Authored-By 커밋 (커밋 8)

---

## 7. 이력서용 핵심 스토리 후보

### 스토리 1: "RAG 파이프라인 평가 자동화 플랫폼 설계 및 구현"
> RAG 파이프라인의 품질을 정량적으로 측정하기 위해, 7가지 평가 메트릭(Faithfulness, Context Recall, LLM-as-Judge 등)을 포함하는 평가 플랫폼을 설계하고 구현했습니다. Strategy 패턴으로 메트릭을 추상화하여 새로운 평가 기준 추가가 용이하도록 했으며, Mann-Whitney U 통계 검정과 Bootstrap 신뢰구간 분석을 통해 A/B 테스트 결과의 통계적 유의성을 검증하는 프레임워크를 구축했습니다.

**키워드**: RAG 평가, A/B 테스트, 통계적 유의성 검증, Strategy 패턴, FastAPI

### 스토리 2: "마이크로서비스 간 HTTP 기반 느슨한 결합 아키텍처 설계"
> 평가 플랫폼이 특정 파이프라인 구현에 종속되지 않도록, 직접 노드 인스턴스 호출 방식에서 HTTP 클라이언트 패턴으로 전환했습니다. RegistryClient를 통한 서비스 발견(Service Discovery)과 PipelineClient를 통한 표준화된 통신 인터페이스를 설계하여, 어떤 RAG 파이프라인이든 HTTP API를 노출하기만 하면 평가할 수 있는 범용 플랫폼을 만들었습니다.

**키워드**: 마이크로서비스, 서비스 발견, HTTP 어댑터 패턴, 느슨한 결합(Loose Coupling)

### 스토리 3: "LLM 기반 개선 인사이트 자동 생성 시스템"
> 평가 결과로부터 RAG 파이프라인 개선 방향을 자동으로 도출하는 인사이트 시스템을 구축했습니다. 규칙 기반 분석(Context Recall 낮음 -> 청킹 전략 변경 권장 등)을 먼저 수행하고, LLM이 가용할 경우 추가 분석을 생성하는 하이브리드 접근법을 채택하여, LLM 의존성 없이도 기본 기능이 보장되는 견고한 설계를 달성했습니다.

**키워드**: LLM-as-Judge, 하이브리드 AI 시스템, Graceful Degradation, 규칙 엔진

### 스토리 4: "2일 만에 풀스택 평가 플랫폼 MVP 구축"
> FastAPI 백엔드, React 19 프론트엔드, Redis 캐시, Docker Compose 인프라를 포함하는 풀스택 평가 플랫폼을 2일 만에 구축했습니다. 비동기 우선 설계(async/await 전체 적용), JSON 구조 로깅(Promtail/Loki 호환), Docker healthcheck, 그리고 6개 페이지의 웹 콘솔을 포함하는 운영 수준의 플랫폼을 빠르게 delivery했습니다.

**키워드**: 빠른 MVP 개발, 풀스택, Docker Compose, 운영 준비 수준(Production-Ready)

### 스토리 5: "한국어 RAG 시스템 특화 평가 프레임워크"
> 인사이트 리포트에서 한국어로 개선 제안을 생성하고(예: "청킹 전략 변경 권장 - 시맨틱 청킹 또는 청크 크기 조정 검토"), 프롬프트 튜닝 방향까지 제시하는 한국어 특화 평가 프레임워크를 구현했습니다. LLM 프롬프트도 한국어로 작성하여 한국어 RAG 파이프라인의 품질 개선 사이클을 완결적으로 지원합니다.

**키워드**: 한국어 NLP, RAG 품질 관리, 도메인 특화 평가

---

## 부록: 전체 커밋 로그

```
1. 7207aa2 | 2026-03-04 17:01 | Initial commit: SoundMind Eval Platform
2. 8536ca9 | 2026-03-04 17:34 | fix: resolve serving readiness issues
3. e798434 | 2026-03-04 18:36 | feat(web-console): improve UX with toast notifications, error handling, and empty states
4. 33e6eb0 | 2026-03-04 18:37 | rebase onto 9bfcff8 (history cleanup)
5. 6df5b77 | 2026-03-04 18:41 | chore: add *.tsbuildinfo to .gitignore
6. ff4ed94 | 2026-03-04 19:10 | chore(infra): update service ports for eval platform
7. 1c2c919 | 2026-03-04 21:01 | chore(infra): add .dockerignore for Docker build optimization
8. 2cbb006 | 2026-03-05 17:08 | feat(eval): add experiment delete and JSON logging
```

**기여자**: Hyeongseob Kim (단독 개발, 커밋 8에서 Claude AI Co-Author)
