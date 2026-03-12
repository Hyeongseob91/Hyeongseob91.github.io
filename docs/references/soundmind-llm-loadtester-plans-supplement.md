# SoundMind LLM LoadTester - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

Simple LLM Tester(이하 LLM LoadTester)는 vLLM, SGLang, Ollama 등 LLM 추론 서버의 성능을 측정하는 부하테스트 도구이다. 실시간 대시보드와 AI 기반 분석 보고서를 제공한다.

**기술 스택**:
- Backend: Python 3.11+ / FastAPI / asyncio+aiohttp / WebSocket / SQLite / tiktoken / pynvml / Typer
- Frontend: Next.js 14 / TypeScript / TanStack Query / Recharts / Tailwind CSS
- Infra: Docker Compose

**MSA 구조**:
- CLI (`services/cli/`): Typer 기반 CLI 명령어 (`run`, `recommend`, `info`, `gpu`)
- API (`services/api/`): FastAPI 백엔드 서버 (REST + WebSocket)
- Web (`services/web/`): Next.js 대시보드
- Core (`shared/core/`): 부하 생성 엔진, 메트릭 계산, GPU 모니터링, Validator
- Adapters (`shared/adapters/`): vLLM/SGLang/Ollama/Triton 어댑터 (Adapter Pattern)
- Database (`shared/database/`): SQLite 벤치마크 결과 저장

**핵심 메트릭**: TTFT(Time To First Token), TPOT(Time Per Output Token), E2E Latency, ITL(Inter-Token Latency), Throughput, Request Rate, Error Rate, Goodput(SLO 기반 품질 처리량)

**특징적 기능**: AI 분석 보고서 - Thinking 모델 지원(`/no_think` 옵션, `</think>` 태그 감지), 마크다운 구조화된 프롬프트 기반 분석

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 고도화 PRD (prd.md): 70% 완성에서 프로덕션으로

PRD v2.0에서 진단한 현재 상태: "약 70% 완성". 핵심 기능은 구현되었으나 다음 문제가 존재:
- 클라이언트 에러 5건 이상 (React Query v5 타입 에러, Compare 페이지 undefined 접근 등)
- 토큰 카운팅 정확도 약 60% (`len(prompt.split())` word split 방식)
- 테스트 커버리지 0%
- `sys.path.insert(0, ...)` 불안정한 import 구조

4단계 Phase로 고도화 계획:
1. **Phase 1 (버그 수정 + 안정화)**: 6개 FR, 2-3일 - refetchInterval 타입 에러, Compare 타입 안전성, Goodput undefined 처리
2. **Phase 2 (핵심 기능 개선)**: tiktoken 기반 정확한 토큰 카운팅, GPU 모니터링 실구현(pynvml), CSV/Excel 내보내기, WebSocket 실시간 진행률
3. **Phase 3 (UX 개선)**: 인터랙티브 차트, 결과 비교 강화, 테스트 프리셋, 다크모드
4. **Phase 4 (프로덕션 준비)**: API Key 인증, structlog 구조화 로깅, Redis 캐싱, DB 인덱스 성능 최적화

### 2.2 검증 시스템 PRD (validation-loop-prd.md): 측정 결과의 신뢰성 확보

가장 독특한 설계 문서. 부하테스트 도구가 측정한 결과가 실제 서버 상태와 일치하는지 **교차 검증**하는 시스템이다.

**이중 검증 전략**:
1. **Prometheus 메트릭 검증**: vLLM `/metrics` 엔드포인트에서 수집한 서버 측 메트릭(request_success_total, time_to_first_token_seconds, generation_tokens_total)과 클라이언트 측 측정값을 비교. 허용 오차 +-5%.
2. **Docker 로그 검증 (v1.1 추가)**: Docker 로그에서 HTTP 200 OK 카운트, Engine throughput, KV cache usage를 파싱하여 클라이언트 측 데이터와 교차 검증. 허용 오차 +-10%.

이 설계는 "부하테스트 도구 자체의 정확성을 어떻게 보장할 것인가"라는 메타적 질문에 답하는 것으로, 네트워크 손실, 측정 오류, 타이밍 차이 등 잠재적 문제를 자동으로 감지한다.

### 2.3 인프라 추천 PRD (prd-phase5-infra-recommend.md): "GPU 몇 장 필요한가?"

"서버가 버티는가?"를 넘어 **"버티려면 GPU가 몇 장 필요한가?"**에 답하는 기능이다.

**타겟 사용자**: 영업팀(고객에게 인프라 비용 제안 근거), MLOps(SLO 기반 용량 산정), PM(프로젝트 비용 추정)

**핵심 알고리즘**:
```
필요 GPU 수 = ceil(목표 동시성 / 현재 최대 동시성) x (1 + headroom)
```
예시: 목표 500명, H100 1장 최대 120명(Goodput 95%), Headroom 20% -> 5장

CLI, API, Web UI 세 가지 인터페이스로 제공되며, 포화점(saturation point) 기반 보정과 Tensor Parallelism 최적화 휴리스틱도 포함한다.

### 2.4 Task Plan (task_plan.md): 벤치마크 중지 기능

벤치마크 실행 중 graceful 중단 + 부분 결과 보존 기능. Phase 1(Backend Core: stop_event, save_partial_result), Phase 2(API: POST /stop), Phase 3(Frontend: 중지 버튼 + cancelled 상태), Phase 4(Testing: 118개 테스트 통과) 구조. 현재 Phase 4 완료 상태.

---

## 3. Future Work / 로드맵

| 영역 | 현재 상태 | 계획 |
|------|----------|------|
| 버그 수정 | Phase 1 대부분 해결 (코드 구조 개선 완료) | 완료 |
| 토큰 카운팅 | tiktoken 기반 구현 완료 | 완료 |
| GPU 모니터링 | pynvml 실구현 완료 | 완료 |
| CSV/Excel 내보내기 | 구현 완료 | 완료 |
| WebSocket 실시간 진행 | 구현 완료 | 완료 |
| AI 분석 보고서 | 구현 완료 (Thinking 모델 지원) | 완료 |
| 벤치마크 중지 | 구현 완료 (118 테스트 통과) | 완료 |
| 인프라 추천 | CLI + API 구현 완료, Web UI 미구현 | Coming Soon |
| 검증 시스템 | PRD 작성 완료, 구현 대기 | 미착수 |
| 결과 비교 | Web UI 미구현 | Coming Soon |
| 프로덕션 준비 | API 인증, 로깅, 캐싱 미구현 | Phase 4 대기 |

향후 확장 가능성: GPU 프로파일 DB, 클라우드 비용 계산기(AWS/GCP/Azure), K8s HPA 설정 추천, Triton 어댑터 완성

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "왜 부하테스트 도구를 직접 만들었는가?"**
기존 LLM 벤치마크 도구(llm-perf-bench, vLLM의 benchmark_serving.py 등)는 CLI 기반이며 시각화가 부족하다. 특히 Goodput(SLO 기반 품질 처리량) 개념을 지원하는 도구가 없었고, "TTFT 500ms 이내이면서 TPOT 50ms 이내인 요청 비율"이라는 복합 SLO를 측정할 필요가 있었다. 또한 비기술 직군(영업팀, PM)이 결과를 해석할 수 있는 웹 대시보드가 필수적이었다.

**2. "검증 시스템이라는 독특한 설계의 배경"**
부하테스트 결과를 고객에게 제시할 때, "이 수치가 정확한가?"라는 질문에 답할 수 없다면 신뢰를 잃는다. 클라이언트 측에서 측정한 TTFT와 서버 측 Prometheus 메트릭의 TTFT가 +-5% 이내로 일치하는지 자동 검증하는 것은, 결과의 **신뢰성을 객관적 데이터로 입증**하기 위함이다. Docker 로그 기반 2차 검증은 Prometheus가 비활성화된 환경에서도 검증 가능하도록 하는 fallback이다.

**3. "인프라 추천이 영업 도구로 기능하는 이유"**
"Qwen3-14B-AWQ 모델을 DAU 10,000명, 피크 500명 동시성으로 운영하려면 H100 5장이 필요하다"는 식의 추천은, 단순한 기술적 산출물이 아니라 **고객 제안서에 첨부할 근거 자료**이다. 계산 공식과 reasoning을 포함하여 비기술 직군도 이해할 수 있는 형태로 출력한다.

**4. "Adapter Pattern 선택의 이유"**
vLLM, SGLang, Ollama, Triton 등 다양한 LLM 서빙 프레임워크를 지원하기 위해 Adapter Pattern을 적용했다. OpenAI-compatible API(`/v1/chat/completions`)를 기본 어댑터로 사용하면 대부분의 서버를 커버하면서, Triton 같은 비표준 API는 별도 어댑터로 확장할 수 있다.

**5. "Memory System (Goal Drift 방지)"**
CLAUDE.md에 정의된 메모리 시스템은 Claude Code를 활용한 개발에서 목표 이탈을 방지하기 위한 구조화된 프로토콜이다. task_plan.md(마스터 플랜), notes.md(리서치 노트), checkpoint.md(세션 상태)로 구성되며, "주요 결정 전 반드시 task_plan 읽기", "에러 3회 반복 시 접근 방식 변경"이라는 규칙을 통해 AI 보조 개발의 일관성을 유지한다.

**6. "오픈소스로 공개한 이유"**
MIT 라이선스로 GitHub에 공개하여 LLM 서빙 커뮤니티에 기여하면서, 개인 포트폴리오로도 활용한다. README를 영어로 작성하고, User Flow 스크린샷을 포함하여 해외 사용자도 접근할 수 있도록 했다.
