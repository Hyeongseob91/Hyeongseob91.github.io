# WIGVO — AI 실시간 전화 통역 플랫폼

**기간:** 2025.01 ~ 현재 | **기여도:** 100% (1인 풀스택 개발) | **ACL 2026 논문 투고**

외국인·장애인·콜포비아 사용자를 위한 AI 실시간 양방향 전화 통역 시스템.
OpenAI Realtime API + Twilio Media Streams 기반으로 레거시 PSTN 전화망 위에서 동작하는 서버사이드 릴레이 아키텍처.

**스택:** Python 3.12/FastAPI (릴레이 서버) · Next.js 16/React 19 (웹) · React Native/Expo SDK 54 (모바일) · Supabase · Google Cloud Run
**규모:** 커밋 235회 · 테스트 430+ · 프로덕션 통화 169건 · 릴레이 서버 8,674 LoC

---

## 1. 에코 루프 — PSTN 전화망에서의 자기 강화 번역 루프 제거

### 문제 정의

OpenAI Realtime API로 양방향 번역 통화를 구현했더니, PSTN 전화망의 물리적 특성으로 인해 **에코 유발 자기 강화 번역 루프(echo-induced self-reinforcing translation loop)** 가 발생했다. AI가 생성한 TTS 음성이 전화망을 타고 되돌아와 VAD가 이를 상대방 발화로 오인식 → 다시 번역 → 다시 TTS 생성 → 무한 반복. 프로토타입 단계에서 **통화의 80%가 에코 루프로 실패**했다.

핵심 난이도는 "에코와 실제 발화를 구분해야 하는데, 둘 다 같은 음성 스트림으로 들어온다"는 점이다. 단순 음소거는 상대방의 실제 발화(인터럽트)까지 차단하고, Pearson 상관계수 기반 에코 감지기(EchoDetector)는 PSTN의 코덱 변환과 지연 변동 때문에 신뢰성이 부족했다.

### 해결 과정

시행착오를 거쳐 3단계 오디오 필터 파이프라인으로 수렴했다:

1. **Stage 0 — Echo Gate (결정론적 차단):** TTS 재생 중 Twilio에서 들어오는 오디오를 mu-law silence(0xFF)로 대체하여 VAD 입력 자체를 차단. 동적 쿨다운 공식 `cooldown = remaining_playback + echo_margin(0.3s)`로 TTS 길이에 비례하는 차단 시간 적용. Post-echo settling(0.5~1.5s, TTS 길이 × 0.3 비율)으로 에코 꼬리 감쇠 대기.

2. **Stage 1 — RMS Energy Gate (에너지 문턱값):** Echo window 중에는 400 RMS 이상만 통과(에코는 대부분 이하), window 밖에서는 150 RMS 미만을 silence로 대체하여 PSTN 배경잡음 필터링.

3. **Stage 2 — Silero VAD (신경망 발화 감지):** 비대칭 히스테리시스(onset 96ms / offset 480ms)로 순간 잡음은 무시하고 실제 발화만 감지. 8kHz → 16kHz 업샘플링(zero-order hold) + 512 sample 프레임 어댑터.

상대방의 실제 인터럽트를 허용하기 위해 **Breakthrough Detection**을 추가: Echo window 중 첫 번째 돌파는 에코로 흡수하고, 두 번째 이상의 지속적 돌파를 실제 발화로 판정. 100ms grace period로 에코 꼬리를 허용.

### 성과
- 147건 완료 통화에서 **에코 루프 발생 0건** (프로토타입 대비 80% → 0%)
- 통화당 평균 7.0회 에코 게이트 활성화(총 1,128회), 358회 상대방 인터럽트 정상 처리
- EchoGateManager 329줄로 V2V/T2V 두 파이프라인에서 공유, 기존 ~120줄 중복 코드 제거

---

## 2. VAD PSTN 적응 — 서버 VAD의 15~72초 멈춤 현상 해결

### 문제 정의

OpenAI Realtime API의 서버 VAD는 고음질 직접 마이크 입력에 최적화되어 있어, PSTN 전화망 오디오(g711 μ-law, 8kHz, 좁은 대역폭, 배경 잡음)에서 **발화 종료를 15~72초간 감지하지 못하는 현상**이 발생했다. 상대방이 말을 끝내도 AI가 응답하지 않고 멈춰 있는 것. 서버 VAD의 `silence_duration_ms`를 아무리 조정해도 PSTN 잡음 환경에서는 효과가 없었다.

### 해결 과정

서버 VAD에 의존하는 대신 **로컬 Silero VAD를 릴레이 서버에 직접 탑재**하여 발화 감지를 자체 수행했다:

- **2단계 감지:** RMS Energy Gate(최소 150 RMS)로 사전 필터링 → Silero 신경망(threshold 0.5)으로 정밀 감지
- **PSTN 튜닝:** `min_speech_frames=5`(160ms, 잡음 버스트 필터), `min_silence_frames=25`(800ms, 발화 내 자연스러운 쉼 무시 + 실제 종료 감지)
- **min_peak_RMS=300:** 조용한 PSTN 발화의 품질 필터, `min_speech_duration=250ms`로 200ms 미만 잡음 배제
- **Cloud Run 호환:** gVisor 환경에서 Silero RNN ELF 바이너리 패칭으로 추론 가능하게 처리

### 성과
- 발화 감지 레이턴시 **15~72초 → 480ms**로 감소 (~1,000ms 절감 대비 이전 VAD 대비)
- 통화당 VAD 오탐 1.8회(총 286건)로 안정적 수준 — 480ms 히스테리시스가 대부분 흡수
- Session B VAD threshold 0.8, silence duration 500ms, prefix padding 300ms로 PSTN 최적화

---

## 3. Strategy 패턴 파이프라인 — 557줄 God Object를 3개 파이프라인으로 분리

### 문제 정의

초기에는 AudioRouter 하나가 모든 통신 모드(V2V, T2V, Agent)의 오디오 처리, 에코 방지, 인터럽트, 컨텍스트 관리를 담당하는 **557줄 God Object**였다. 모드별 분기가 `if/elif` 체인으로 얽혀서 하나를 수정하면 다른 모드가 깨지고, 테스트가 불안정했다.

### 해결 과정

Strategy 패턴으로 파이프라인을 분리:

| 파이프라인 | 줄 수 | 핵심 책임 |
|---|---|---|
| `BasePipeline` (ABC) | 144 | 공통 인터페이스 정의 |
| `VoiceToVoicePipeline` | 615 | 양방향 음성 번역, Echo Gate + Silence Injection, 3단계 인터럽트 우선순위 |
| `TextToVoicePipeline` | 615 | 텍스트→음성, per-response instruction override, exact utterance 패턴 |
| `FullAgentPipeline` | 72 | TextToVoice 상속 + Agent 피드백 루프 + Function Calling |
| `EchoGateManager` | 329 | V2V/T2V 공유 에코 방지 모듈 |

AudioRouter는 **557줄 → 153줄**의 얇은 위임자로 축소. `__getattr__`/`__setattr__` 프록시 패턴으로 기존 테스트와의 하위 호환성 유지.

### 성과
- AudioRouter 코드량 **72% 감소** (557 → 153줄)
- 모드별 독립 테스트 가능 — 한 파이프라인 수정이 다른 모드에 영향 없음
- FullAgentPipeline은 TextToVoice를 상속하여 72줄만으로 구현 (코드 재사용 극대화)
- 에코 게이트 ~120줄 중복 코드를 EchoGateManager로 통합

---

## 4. Session B 번역 분리 — Realtime API 할루시네이션 제거

### 문제 정의

T2V/Agent 모드에서 Session B(수신자→사용자 방향)가 Realtime API의 "생성" 특성 때문에 **번역이 아닌 창작을 하는 할루시네이션**이 발생했다. 상대방이 "네, 알겠습니다"라고 했는데 AI가 "저는 오늘 날씨가 좋아서 기분이 좋습니다"를 번역 결과로 생성하는 식.

V2V 모드는 TTS 출력이 필요하므로 Realtime API 통합 처리가 맞지만, T2V/Agent 모드에서는 텍스트 번역만 필요하므로 "생성형 API를 번역 용도로 억지로 사용"하는 구조적 문제였다.

### 해결 과정

STT와 번역을 분리하는 아키텍처로 전환:
- **STT:** 기존 Realtime API (Whisper) 유지 — 실시간 스트리밍 STT에 최적
- **번역:** Chat API (GPT-4o-mini, temperature=0)로 분리 — 결정론적 번역
- **ChatTranslator** (134줄): `asyncio.Event` 기반 STT 완료 대기 → Chat API 번역 트리거
- **`context_prune_keep=0`:** Realtime API 컨텍스트 아이템을 매 턴 전부 삭제하여 자체 번역 생성 방지
- 2턴 컨텍스트 윈도우로 최소한의 문맥만 유지

### 성과
- T2V/Agent 모드에서 번역 할루시네이션 **제거**
- GPT-4o-mini(temperature=0)로 결정론적 번역 — 동일 입력에 동일 출력
- V2V 대비 **비용 절감:** Chat API 입력 $0.00015/1K vs Realtime 오디오 $0.06/1K (400배 차이)
- CostTokens에 `chat_input`/`chat_output` 필드 추가로 모드별 비용 추적

---

## 5. Whisper Hallucination 4단계 필터 — STT 환각 차단

### 문제 정의

Whisper STT가 무음 또는 잡음 구간에서 **의미 없는 텍스트를 생성하는 할루시네이션**(예: "MBC 뉴스입니다", "시청해 주셔서 감사합니다" 등 학습 데이터의 자막이 출력)이 발생. 이 허위 텍스트가 번역 파이프라인에 진입하면 상대방에게 엉뚱한 말이 전달된다.

### 해결 과정

4단계 가드레일 시스템(총 663줄)을 구축:

1. **Dictionary (143줄):** 다국어 차단 사전 — 한국어 욕설/비속어 44항목, 위협/협박 39항목, 비격식→격식 변환 20항목. 4개 언어(한/영/일/중) 지원.

2. **Filter (186줄):** 정규식 + 키워드 매칭으로 4개 카테고리 분류. `hallucination_max_chars_sec=100`으로 비정상적 속도의 STT 출력 탐지(100자/초 초과 시 할루시네이션 판정).

3. **Checker (199줄):** 3단계 심각도 분류 체계:
   - Level 1 (PASS): 추가 처리 없이 통과
   - Level 2 (비동기 교정): TTS를 먼저 전송하고 백그라운드에서 교정 — 레이턴시 미영향
   - Level 3 (동기 차단): TTS를 중단하고 교정 완료까지 대기

4. **Fallback LLM (124줄):** GPT-4o-mini(temperature=0, timeout 2,000ms)로 Level 2/3 교정 수행.

추가로 **STT 모델을 전 모드 whisper-1로 통일** — 할루시네이션 블록리스트 호환성 + 최저 레이턴시.

### 성과
- 169건 통화에서 **109건 할루시네이션 차단** (통화당 0.7회)
- Guardrail Level 2 활성화 148회, Level 3 0회 (대부분 비격식 표현 교정 수준)
- 15개 패턴의 STT 블록리스트로 무음 할루시네이션 사전 차단

---

## 종합 성과 (실측 데이터, 169건 프로덕션 통화 기준)

| 지표 | 수치 |
|---|---|
| Session A 레이턴시 (P50/P95) | **555ms / 1,156ms** (814턴) |
| Session B E2E 레이턴시 (P50/P95) | **2,868ms / 15,482ms** (744턴) — 전문 동시통역 범위(2~5초) |
| 첫 메시지 레이턴시 (P50/P95) | **1,215ms / 6,890ms** (162건) |
| 에코 루프 발생 | **0건** (프로토타입 80% → 0%) |
| 통화당 비용 | **$0.27~0.28/분, 평균 $0.40/통화** (전문 통역 $1~3/분 대비 1/4~1/10) |
| 번역 품질 (COMET) | EN→KO 0.7078 / KO→EN 0.6242 (155건, Gemini 2.5 Flash 레퍼런스 대비) |
| 테스트 | **430+** (단위·통합·E2E) |
| 총 통화 시간 | 241.4분, 총 비용 $64.71 |

**모드별 분포:** T2V 116건(68.6%) · V2V 52건(30.8%) · Agent 1건(0.6%)
