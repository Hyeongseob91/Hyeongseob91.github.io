# WIGVO 커밋 히스토리 분석 보고서

> 이력서용 "문제 정의 → 해결 과정 → 성과" 추출을 위한 기술적 의사결정 흐름 분석

## 프로젝트 개요

- **프로젝트**: WIGVO — AI 실시간 전화 통역/중개 플랫폼
- **기간**: 2026-02-13 ~ 2026-02-27 (15일)
- **총 커밋**: 228개 (fix 107개, feat 47개, docs 34개, refactor 15개, 기타 25개)
- **코드 규모**: Relay Server 23,318줄 / Web App 18,446줄 / Mobile App 13,505줄 (총 55,269줄)
- **테스트**: 265개 (pytest)
- **성과물**: ACL 2026 System Demonstration 논문 투고, 프로덕션 배포 (162건 실제 통화)

---

## 1. 타임라인: 주요 마일스톤

| 날짜 | 커밋수 | 마일스톤 |
|------|--------|---------|
| 02-13 | 1 | PRD 작성 |
| 02-14 | 3 | **Phase 1-5 일괄 구현** (Relay Server, VAD, Recovery, Guardrail, DB, Mobile) |
| 02-16 | 1 | CallManager 싱글톤 리팩토링 |
| 02-17 | 1 | **Echo Gate v2** — 대화 자연스러움 개선 시작 |
| 02-18 | 34 | **Web App 추가 + Pipeline 분리** (모놀리식→Strategy 패턴) + 첫 배포 |
| 02-19 | 35 | **에코/VAD 디버깅 집중일** — 7가지 접근법 시도, Local VAD(Silero) 도입 |
| 02-20 | 25 | 메트릭 수집 인프라 + 프로덕션 버그 수정 |
| 02-21~22 | 15 | ACL 논문 데이터 수집, 평가 스크립트, Cloud Run OOM 수정 |
| 02-23 | 14 | **ACL 2026 논문 초고** + 할루시네이션 방지 4단계 필터 |
| 02-24 | 18 | EchoGateManager 추출 + V2T 레거시 제거 + STT 모델 통일 |
| 02-25 | 14 | **COMET 번역 품질 평가** + 논문 강화 |
| 02-26 | 22 | **Chat API 번역 파이프라인** (Session B Realtime→Chat API 분리) |
| 02-27 | 45 | **논문 최종 제출** + Speculative STT + 최종 안정화 (162건 데이터) |

---

## 2. 핵심 기술 스토리 5가지

### 스토리 1: 에코 방지 — 7단계 진화 (25개 커밋)

**문제**: 전화 통역 시 AI가 번역한 TTS 음성이 마이크로 다시 들어와 "에코 루프" 발생. AI가 자기가 말한 걸 다시 번역하는 무한 루프.

**해결 과정** (커밋 순서대로 방향 전환 추적):

| 단계 | 커밋 | 접근법 | 결과 |
|------|------|--------|------|
| 1 | `f94b6a3` | Echo Gate v2: 출력 억제 + 대기열 | 기본 동작하지만 2.5초 고정 차단 → 대화 지연 |
| 2 | `f246d78` | Audio Fingerprint 에코 감지 (Pearson 상관계수) | 이론적으로 우아하지만 PSTN 오디오 변환 후 상관관계 붕괴 |
| 3 | `0981fbe` | EchoDetector → Echo Gate로 롤백 | Fingerprint 방식 포기, 단순한 게이팅으로 복귀 |
| 4 | `57ce1ab` | Dynamic Cooldown: TTS 길이 비례 대기 | 짧은 발화는 빠르게, 긴 발화는 충분히 대기 |
| 5 | `0ccc389` | Dynamic Energy Threshold로 교체 | RMS 에너지 기반 판단 — PSTN 노이즈에 취약 |
| 6 | `e83c9d5` | Silence Frame Injection | 에코 구간에 μ-law 무음(0xFF) 주입 → VAD 정상 동작 **돌파구** |
| 7 | `70c5674` | RMS Pre-gate + Silero VAD Double Gate | 최종 안정화: 2중 게이트로 오탐/미탐 최소화 |

**추가 하드닝** (8개 커밋):
- Post-echo AGC Settling 2.0초 (`359b191`) — 마이크 자동 게인이 안정화될 때까지 대기
- Pre-activate on audio commit (`2876d80`) — 첫 발화 에코 누출 방지
- Break settling 강화 (`ceb8020`) — 에코 게이트 해제 시 잔여 에코 처리
- T2V Interrupt Guard (`499e858`) — TTS 중 인터럽트 차단으로 메시지 완전 전달

**성과**: 에코 루프 발생률 0% 달성 (162건 프로덕션 통화 기준)

---

### 스토리 2: Whisper 할루시네이션 방지 — 4단계 필터 파이프라인 (22개 커밋)

**문제**: OpenAI Whisper STT가 무음/노이즈 구간에서 가짜 텍스트 생성. "감사합니다", "다음 영상에서 만나요" 같은 유튜브 학습 데이터 기반 환각이 번역 파이프라인에 유입.

**해결 과정**:

| 단계 | 커밋 | 접근법 |
|------|------|--------|
| Stage 0 | `09ac3c3` | 3-layer noise filter (최초 대응) |
| Stage 1 | `6569d76` | STT Hallucination Blocklist (한국어/영어 패턴 매칭) |
| Stage 2 | `6b0967a` | 4-layer Stage 2 filter: silence timeout + minimum length + repeated phrase + confidence |
| Stage 3 | `8a2de2d` | Guardrail L3: VAD fragmentation → [unclear] → hallucination 체인 차단 |

**핵심 발견들**:
- Echo/noise audio가 Session B로 누출 → 할루시네이션 트리거 (`2f423a6`)
- Echo window 종료 후 잔여 버퍼에서 late-echo 할루시네이션 (`4a027be`)
- AGC noise spike가 post-echo 구간에서 가짜 speech 감지 (`359b191`)
- Session A에서도 컨텍스트 기반 할루시네이션 발생 (`6ba36b8`)
- T2V 모드에서 VAD fragmentation → [unclear] STT → hallucination 체인 (`8a2de2d`)

**최종 아키텍처**: 3-Stage Filter Pipeline
1. **Pre-STT**: Echo Gate + Silence Injection (음원 차단)
2. **Post-STT**: Blocklist + Length/Silence/Repeat Filter (텍스트 필터링)
3. **Post-Translation**: Guardrail Checker + FallbackLLM (번역 검증)

**성과**: 할루시네이션 유입률 0.3% 미만 (162건 통화, 블록된 환각 이벤트 로깅 기반)

---

### 스토리 3: VAD(음성 활동 감지) 최적화 — PSTN 환경 적응 (25개 커밋)

**문제**: OpenAI Server VAD는 깨끗한 마이크 입력에 최적화. PSTN(일반 전화) 환경은 배경 노이즈, 코덱 압축, 에코 잔향이 있어 오탐/미탐 빈발.

**해결 과정**:

| 단계 | 커밋 | 접근법 | 결과 |
|------|------|--------|------|
| 1 | `20eb470` | Energy gate threshold 낮춤 | 너무 많은 노이즈를 음성으로 오탐 |
| 2 | `309c502` | RMS 150→80 | Twilio 전화 오디오는 예상보다 에너지가 낮음 |
| 3 | `2554628` | RMS 30까지 낮춤 + 진단 로깅 | 여전히 PSTN 노이즈 문제 |
| 4 | `6f4668f` | PSTN 노이즈를 silence frame으로 교체 | VAD는 살았지만 max speech timer 필요 |
| 5 | `3330eeb` | **Local VAD (Silero + RMS) 도입** | Server VAD 대체 → 세밀한 제어 가능 **돌파구** |
| 6 | `1c75c0f` | Peak RMS quality filter | 약한 신호를 노이즈로 거부 |
| 7 | `bf1fbc6` | Silero가 speech end 판단 | SPEAKING 상태에서 에너지 대신 신경망 판단 |
| 8 | `97a3c87` | min_speech 400→250ms | 짧은 발화("네", "아니요") 감지 개선 |
| 9 | `42b66b3` | speech threshold 낮춤 | 조용한 목소리 감지 개선 |

**핵심 기술 결정**: OpenAI Server VAD → Local Silero VAD 전환
- **이유**: Server VAD는 블랙박스라 에코 구간 제어 불가. Silero는 로컬에서 프레임 단위 제어 가능.
- **구현**: RMS Energy Gate (1차 필터) + Silero 신경망 (2차 판단) 2단 구조
- **배포 이슈**: Silero ONNX Runtime이 Docker에서 libgomp1 누락 (`85c1c7e`), .so 파일의 executable stack 플래그 문제 (`32009b5`, `3b03f65`)

**성과**: VAD 정확도 향상으로 turn-taking 레이턴시 ~1초 감소

---

### 스토리 4: 파이프라인 아키텍처 진화 — 모놀리식에서 Strategy 패턴으로

**문제**: 초기 AudioRouter가 557줄 모놀리식으로 V2V/T2V/Agent 3가지 모드의 로직이 뒤섞임. 에코 방지, VAD, 번역 로직이 모드마다 다르게 동작해야 하는데 조건문 지옥.

**해결 과정**:

| 단계 | 커밋 | 변화 |
|------|------|------|
| 1 | `824505c` | VoiceToVoicePipeline 추출 (462줄) |
| 2 | `03e1f11` | TextToVoicePipeline (per-response instruction override) |
| 3 | `ed16a07` | FullAgentPipeline (TextToVoice 상속 + Agent 피드백 루프) |
| 4 | `3186655` | EchoGateManager 추출 (V2V/T2V 공통, ~170줄) |
| 5 | `4e4245a` | Chat API Translation Pipeline (Session B 번역 분리) |
| 6 | `b16367d` | V2T 레거시 모드 제거 (4모드 → 3모드) |

**최종 아키텍처**:
```
AudioRouter (160줄, 얇은 위임자)
  ├── VoiceToVoicePipeline (Echo Gate + Silence Injection + Interrupt + Recovery)
  ├── TextToVoicePipeline (per-response instruction + ChatTranslator)
  └── FullAgentPipeline (TextToVoice 상속 + Function Calling)
      └── EchoGateManager (공통 에코 방지)
      └── ChatTranslator (T2V/Agent Session B 번역)
```

**핵심 기술 결정**: Session B 번역을 Realtime API → Chat API(GPT-4o-mini)로 분리 (`4e4245a`)
- **이유**: Realtime API는 "생성" 특성이 있어 번역 시 원문에 없는 내용을 추가하는 할루시네이션 발생
- **해결**: STT는 Realtime Whisper 유지, 번역만 Chat API (temperature=0)로 분리
- **결과**: context_prune_keep=0으로 Realtime 자체 번역 방지, 번역 정확도 향상

**성과**: AudioRouter 557줄 → 160줄 (71% 감소), 모드별 독립 테스트/배포 가능

---

### 스토리 5: 15일 만에 논문까지 — 속도와 품질의 균형

**문제**: 2주 만에 프로덕션 서비스 + ACL 2026 논문 투고를 동시에 달성해야 하는 압박.

**해결 과정** (커밋 밀도로 추적):

| 일자 | 커밋수 | 주요 작업 |
|------|--------|---------|
| Day 1-2 (02/13-14) | 4 | PRD → Phase 1-5 일괄 구현 |
| Day 3-5 (02/16-18) | 36 | Web App 추가 + Pipeline 분리 + 첫 배포 |
| Day 6 (02/19) | 35 | **가장 밀도 높은 날**: 에코/VAD 집중 디버깅 |
| Day 7-8 (02/20-21) | 28 | 메트릭 인프라 + 프로덕션 안정화 |
| Day 9-10 (02/22-23) | 26 | 논문 초고 + 평가 스크립트 |
| Day 11-12 (02/24-25) | 32 | 아키텍처 정리 + COMET 번역 품질 평가 |
| Day 13-14 (02/26-27) | 67 | 최종 안정화 + 논문 제출 |

**핵심 수치**:
- 228커밋 / 15일 = 일 평균 15.2 커밋
- fix 107개 (47%) — 거의 절반이 버그 수정 (= 실제 통화 테스트에서 발견된 문제들)
- 162건 프로덕션 통화 데이터로 논문 평가
- 265개 pytest 테스트

---

## 3. 주요 방향 전환 (Pivot) 기록

| 시점 | 전환 전 | 전환 후 | 커밋 |
|------|---------|---------|------|
| 02/18 | Audio Fingerprint 에코 감지 (Pearson) | Echo Gate + Silence Injection | `f246d78` → `0981fbe` |
| 02/19 | OpenAI Server VAD | Local Silero VAD | `3330eeb` |
| 02/19 | Echo Gate 고정 차단 | Dynamic Energy Threshold | `0ccc389` |
| 02/24 | 4가지 통신 모드 (V2V/V2T/T2V/Agent) | 3가지로 축소 (V2T 제거) | `b16367d` |
| 02/24 | STT 모드별 다른 모델 | whisper-1 통일 | `0929dc1` |
| 02/26 | Session B Realtime API 번역 | Chat API (GPT-4o-mini) 번역 | `4e4245a` |

---

## 4. 배포/인프라 이슈 기록 (이력서에 DevOps 역량으로 활용 가능)

| 커밋 | 이슈 | 해결 |
|------|------|------|
| `a7b16f1`~`0d647b2` | Cloud Run 서비스명/CORS/GCP 프로젝트 연쇄 수정 (3커밋) | 배포 설정 표준화 |
| `85c1c7e` | Silero ONNX Runtime Docker에서 libgomp1 누락 | Dockerfile에 apt-get install |
| `32009b5`~`3b03f65` | .so 파일 executable stack 보안 플래그 | Python ELF 패치로 해결 |
| `eb108cb` | Cloud Run OOM — dev 의존성이 런타임에 포함 | 의존성 분리 |
| `f4363ba` | Cloud Build 느린 빌드 | Docker → Kaniko 마이그레이션 |
| `e3737bd` | OPENAI_API_KEY 평문 노출 | GCP Secret Manager 이관 |
| `0a62a96` | Supabase Auth 요청 17,000건/시간 | 600건/시간으로 최적화 (96% 감소) |

---

## 5. 성능 최적화 기록

| 커밋 | 최적화 | 수치 |
|------|--------|------|
| `4cdd737` | Voice pipeline 레이턴시 최적화 | ~350ms 감소 |
| `57ce1ab` | Dynamic Echo Gate cooldown | TTS 길이 비례 → 불필요한 대기 제거 |
| `6a9e2c0` | Speculative STT (Session B cold start) | 레이턴시 감소 |
| `0a62a96` | Supabase Auth 요청 최적화 | 17k/hr → 600/hr (96% 감소) |
| `f4363ba` | Cloud Build: Docker → Kaniko | 빌드 시간 단축 |

---

## 6. 이력서용 핵심 키워드 후보

### 기술 스택
- Python (FastAPI, uvicorn, Pydantic v2, async/await)
- Next.js 16, React 19, Zustand, shadcn/ui
- React Native (Expo SDK 54)
- OpenAI Realtime API (WebSocket), GPT-4o-mini, Whisper
- Twilio Media Streams (PSTN 연동)
- Supabase (PostgreSQL + Auth + RLS)
- Google Cloud Run, Cloud Build, Secret Manager
- Docker, Kaniko

### 기술적 깊이를 보여주는 키워드
- Dual WebSocket Session 아키텍처
- Echo Gate + Silence Injection (에코 방지)
- Local VAD (Silero 신경망 + RMS Energy Gate)
- 3-Stage Anti-Hallucination Filter Pipeline
- Strategy Pattern Pipeline Architecture
- Chat API Translation Pipeline (Realtime→Chat 분리)
- COMET/BLEU/chrF 번역 품질 평가

### 정량적 성과 (커밋에서 추출 가능한 것)
- 15일 개발, 228커밋, 55,000줄+, 265개 테스트
- 162건 프로덕션 통화 데이터
- 에코 루프 0% (7단계 진화 끝)
- Supabase Auth 96% 요청 감소 (17k→600/hr)
- AudioRouter 71% 코드 감소 (557→160줄)
- Voice pipeline 350ms 레이턴시 감소
- ACL 2026 System Demonstration 논문 투고

---

## 7. 면접에서 "깊은 대화"가 가능한 질문 예상

1. **"에코 방지를 7번 바꿨는데, 왜 처음부터 Silence Injection을 안 했나요?"**
   → Audio Fingerprint(Pearson 상관계수)가 이론적으로 더 우아했지만 PSTN 코덱 변환 후 상관관계 붕괴 경험 필요

2. **"Server VAD 대신 Local VAD를 선택한 이유는?"**
   → 에코 구간에서 VAD를 끌 수 없는 블랙박스 문제. 프레임 단위 제어가 필수적이었음

3. **"Whisper 할루시네이션은 왜 발생하고 어떻게 막았나요?"**
   → 무음/노이즈를 Whisper에 넣으면 학습 데이터 기반 "그럴듯한" 텍스트 생성. 3-Stage (음원 차단 → 텍스트 필터 → 번역 검증)

4. **"Session B 번역을 Realtime API에서 Chat API로 분리한 결정은?"**
   → Realtime API의 "생성" 특성 vs Chat API의 "변환" 특성. temperature=0 + context_prune_keep=0

5. **"15일 만에 논문까지 어떻게 가능했나요?"**
   → 커밋 밀도(일 15.2건), fix 47% 비율은 "만들면서 바로 테스트하고 고치는" 사이클의 증거

---

*이 보고서는 git log 228개 커밋의 자동 분석 기반입니다. 비즈니스 맥락(왜 이 프로젝트를 시작했는지, 타겟 사용자 반응 등)은 별도로 보완이 필요합니다.*
