# [Legacy] RAG Evaluation Framework - 커밋 히스토리 분석 보고서

## 1. 프로젝트 개요
- **총 커밋 수**: 33개
- **기간**: 2026-01-27 ~ 2026-03-03 (약 5주)
- **주요 기여자**: Hyeongseob Kim (32), Hyeongseob91 (1 — 동일 인물)
- **기술 스택**: Python, FastAPI, Streamlit UI, Redis, Docker, Milvus (Vector DB)
- **현재 상태**: Archive (Legacy) — soundmind-eval-platform으로 발전적 전환

## 2. 타임라인: 주요 마일스톤

### Phase 1: 초기 구축 (2026-01-27)
- `01-27` **초기 프로젝트 설정** — 20,238줄의 대규모 초기 커밋
  - 79개 파일: 평가 시스템 전체 골격 (evaluation/, nodes/, connectors/, baselines/, api/, ui/)
  - RAG 파이프라인 평가를 위한 포괄적 프레임워크
  - A/B 테스트, LLM Judge, 통계 검정, 청킹 비교 등 평가 모듈 완비
  - Naive vs Advanced 파이프라인 비교 구조
- `01-27` 영한 README 문서화, PRD v2 아키텍처 재설계 문서

### Phase 2: Playground Edition 진화 (2026-01-29 ~ 02-02)
- `01-29` **Pipeline Orchestrator + Streamlit UI** — 2,446줄 추가
  - 파이프라인 오케스트레이터, 평가 시스템, CLI 도구
  - UI를 멀티페이지에서 단일 대시보드로 전환
- `02-01` 문서 인제스트 파이프라인 추가 + UI 리팩토링
- `02-02` **4-Phase 빌드** (단 하루에 Phase 1~4 완성):
  - Phase 1: Node Registry, I/O 스키마, Evaluator Binding
  - Phase 2: Redis 캐싱 + Circuit Breaker + Fallback
  - Phase 3: API Gateway (인증, Rate Limiting)
  - Phase 4: Streamlit Playground UI (Node Playground, Pipeline Builder, Cache Panel)
- `02-02` PRD 문서 작성, 코드 리뷰 반영 (timing-safe auth 등)

### Phase 3: 고급 기능 추가 (2026-02-03 ~ 02-05)
- `02-03` Reranker Node + RRF 하이브리드 검색 (1,347줄 추가)
- `02-03` Supervisord 기반 모놀리틱 배포 구조
- `02-04` 오케스트레이터 캐싱, Sample Dataset, Answer Preprocessing
- `02-05` **LLM-as-a-Judge → G-Eval 스타일 업그레이드** (상세 루브릭)
- `02-05` 50개 Multi-hop 질문 데이터셋, Query Decomposition, Pipeline Caching

### Phase 4: 인프라 및 연구 (2026-02-10 ~ 02-20)
- `02-10` Kanana-2 모델 셋업 가이드, Qwen3-235B 마이그레이션
- `02-20` **RAG 파이프라인 최적화 실험 기술 보고서** (629줄)
- `02-20` **대규모 프로젝트 구조 리팩토링** — src/core, src/tests, deploy 분리 (110개 파일)

### Phase 5: SoundMind 통합 (2026-03-03)
- `03-03` **SoundMind 파이프라인 A/B 평가 어댑터** 추가 (830줄)
- `03-03` SSE 연결 종료 Graceful 처리

## 3. 방향 전환 (Pivot Points)

### 3-1. UI 아키텍처: 멀티페이지 → 단일 대시보드 → Playground
- 초기: 6개 페이지 (dashboard, ab_test, experiments, export, node_analysis)
- 01-29: 대부분 삭제, orchestrator 단일 페이지로 전환
- 02-02: Playground Edition으로 완전 재설계

### 3-2. 평가 방식 고도화: 단순 메트릭 → G-Eval
- 초기: 기본 LLM Judge (점수 매기기)
- 02-05: G-Eval 스타일로 업그레이드 — 상세 루브릭, Chain-of-Thought 기반 평가

### 3-3. 프로젝트 구조 진화
- 초기: 평면적 구조 (src/, ui/, tests/)
- 02-20: src/core/, src/tests/, deploy/ 분리 — 110개 파일 재배치

### 3-4. 독립 프레임워크 → SoundMind 통합
- 초기: 범용 RAG 평가 프레임워크
- 03-03: SoundMind 파이프라인 전용 A/B 평가 어댑터 추가
- **이 시점이 Legacy가 된 계기**: eval-platform으로 발전적 전환 추정

## 4. 문제 해결 이력

| 날짜 | 문제 | 해결 |
|------|------|------|
| 02-02 | Auth 보안 취약점 | Timing-safe 비교로 변경, config 중복 제거 |
| 02-04 | LLM 응답에 reasoning 블록 포함 | Answer preprocessing으로 reasoning 블록 제외 |
| 02-04 | GT(Ground Truth) 모드 UI 제어 이슈 | pending 플래그 기반 자동 활성화 |
| 02-05 | 기존 테스트 질문으로 파이프라인 차이 안 보임 | 50개 Multi-hop 질문으로 업그레이드 |
| 03-03 | SSE 연결 종료 시 에러 | Graceful close 처리 |

## 5. 기술적 진화

### 5-1. 평가 시스템 진화
```
기본 메트릭 (Retrieval/Generation/E2E) (01-27)
  → A/B 테스트 + 통계 검정 (01-27, 초기부터 포함)
  → LLM Judge (01-27)
  → Pipeline Orchestrator (01-29)
  → G-Eval 스타일 상세 루브릭 (02-05)
  → SoundMind 파이프라인 A/B 평가 (03-03)
```

### 5-2. RAG 파이프라인 진화
```
Naive vs Advanced 비교 (01-27)
  → Node Registry + I/O 스키마 (02-02)
  → Redis 캐싱 + Circuit Breaker (02-02)
  → Reranker + RRF 하이브리드 검색 (02-03)
  → Query Decomposition (02-05)
  → Pipeline Caching + Markdown 렌더링 (02-05)
```

### 5-3. 인프라 진화
```
단일 Python 앱 (01-27)
  → Docker + Milvus + Redis 구성 (02-02)
  → API Gateway + Rate Limiting (02-02)
  → Supervisord 모놀리틱 배포 (02-03)
  → Qwen3-235B 외부 서빙 인프라 연동 (02-10)
```

## 6. 규모 분석

### 최대 규모 커밋 TOP 3
1. 초기 프로젝트 설정 (01-27): **20,238줄** (79개 파일)
2. Pipeline Orchestrator (01-29): **2,446줄** (21개 파일)
3. Reranker + RRF (02-03): **1,347줄** (11개 파일)

### 핵심 디렉토리
- **src/core/evaluation/**: 6개 평가 모듈 (A/B, E2E, LLM Judge, Retrieval, Generation, Statistics)
- **src/core/nodes/**: 노드 시스템 (Chunking 4종, Generator, Retriever, Reranker, Query Rewrite/Decompose)
- **src/core/orchestrator/**: 파이프라인 오케스트레이션
- **src/core/connectors/**: LLM, Embedding, VectorDB, Reranker 연결
- **src/core/cache/**: Redis 캐싱 + Circuit Breaker

## 7. 이력서용 핵심 스토리 후보

### 스토리 1: "RAG 파이프라인 평가 프레임워크 설계 및 구축"
- **문제 정의**: RAG 시스템의 각 컴포넌트(청킹, 검색, 생성)를 독립적으로 평가하고, 파이프라인 조합별 성능을 비교할 체계적 방법 부재
- **해결 과정**: Node Registry 기반 모듈화 설계, 6종 평가 모듈 구현, A/B 테스트 + 통계 검정 자동화, G-Eval 스타일 LLM Judge 고도화
- **성과**: 파이프라인 조합별 성능 비교를 자동화하여 최적 RAG 구성 도출 가능

### 스토리 2: "LLM-as-a-Judge에서 G-Eval 스타일로의 평가 고도화"
- **문제 정의**: 단순 점수 매기기 방식의 LLM Judge로는 RAG 응답 품질의 미세한 차이를 포착하기 어려움
- **해결 과정**: G-Eval 논문 기반으로 상세 루브릭 + Chain-of-Thought 평가로 전환, 50개 Multi-hop 질문 데이터셋 구축, Answer preprocessing으로 reasoning 블록 제거
- **성과**: 파이프라인 간 품질 차이를 더 정밀하게 측정 가능

### 스토리 3: "Playground Edition: 하루에 4-Phase 아키텍처 구축"
- **문제 정의**: 개발자가 RAG 노드를 개별적으로 실험하고 파이프라인을 조합할 수 있는 인터랙티브 환경 필요
- **해결 과정**: 하루(02-02)에 Node Registry → Redis 캐싱 → API Gateway → Streamlit Playground UI 4단계를 순차 구현
- **성과**: Circuit Breaker 기반 안정적 캐싱, Rate Limiting 보안, 인터랙티브 노드 실험 환경 완성

## 8. Legacy → Eval Platform 전환 맥락 (추정)

커밋 히스토리에서 추정되는 전환 이유:
1. **03-03 SoundMind 어댑터 추가**: 범용 프레임워크가 SoundMind 특화로 변하면서 독립 플랫폼 필요성 대두
2. **구조적 성숙**: src/core, src/tests, deploy 분리가 완료되어 새 프로젝트로 클린 스타트 가능
3. **평가 범위 확장**: RAG 평가만이 아닌 전체 AI 파이프라인 평가로 확대 필요
4. **프로덕션 수준 요구**: Streamlit UI → 본격적 대시보드로의 전환 필요성

이 프레임워크에서 축적된 평가 모듈(A/B, G-Eval, 통계 검정)과 노드 시스템이 eval-platform의 기반이 되었을 것으로 추정됨.
