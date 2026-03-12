# KOCAA (Korean Speaking Assessment) - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

KOCAA(Korean Oral Communication Assessment by AI)는 AI 기반 한국어 말하기 평가 시스템이다. README 파일이 비어 있어 구조 정보가 제한적이나, PRD와 PLAN 문서에서 다음 구조를 파악할 수 있다.

**기존 시스템 구성**:
- `scoring_api/` (Port 8020): 기존 EXAONE-Score 채점 모델 API
  - POST `/api/v1/evaluation/protact`: 채점 엔드포인트
  - `build_prompt()`: question + answer만 사용하여 채점 프롬프트 생성
  - `GEN_LOCK`(asyncio.Lock)으로 동시 1개 배치만 처리
  - temperature=0.7, seed=42
- `models/`: EXAONE-Score 모델 파일
- `test.csv`: 21,505건 테스트 데이터 (cp949 인코딩)

**새로 구축하는 파이프라인**:
- `scoring_pipeline/` (CLI Prototype): 채점 모델 정확도 검증용 CLI 도구
  - `score.py`: CLI 메인 (단일/배치 모드)
  - `scoring_client.py`: scoring_api HTTP 클라이언트
  - `grade.py`: 6등급 매핑 로직
  - `csv_handler.py`: CSV 입출력 (cp949 -> utf-8-sig)
  - `config.yaml`: API URL, API Key, timeout, 등급 범위

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 PRD v2.0: 선행-후행 2단계 로드맵

**현재 상황**: iSKA 프로젝트의 EXAONE-Score 채점 모델이 독립 API로 존재하지만, 채점 정확도가 검증되지 않았고, 실제 시험 운영을 위한 파이프라인이 없다.

**2단계 접근**:
```
[선행] CLI Prototype              [후행] 시험 플랫폼
텍스트 입력 -> 채점 -> 점수+등급    음성 -> STT -> 채점 -> 결과
단일/배치(CSV) 테스트               50인 동시성 처리
채점 모델 정확도 검증               웹 기반 시험 플랫폼
CLI (배포 불필요)                   API + UI (배포)
```

**선행(현재 범위) 핵심 요구사항**:
- FR-001: 단일 문항 채점 (--question, --answer)
- FR-002: CSV 배치 채점 (--csv)
- FR-003: 채점 결과 CSV 출력 (--output)
- FR-004: 6등급 매핑 (config 기반, 범위 변경 가능)
- FR-005: 점수 파싱 실패 시 에러 핸들링 (0점 처리 + 경고)
- FR-006: 배치 통계 요약 출력 (--summary)
- FR-007: API 서버 health check

**6등급 체계**: 총점(언어+내용 평균, 0~5) 기반
- 1급(0.0~0.9), 2급(1.0~1.9), 3급(2.0~2.9), 4급(3.0~3.9), 5급(4.0~4.9), 6급(5.0)

**알려진 한계**:
- EXAONE-Score는 question-answer 쌍만으로 채점 (expected_answer 미활용)
- 모델 출력은 점수만 (언어 + 내용). 피드백 없음(더미 데이터)
- temperature=0.7로 동일 입력에도 점수 소폭 변동 가능
- GEN_LOCK으로 동시 1개 배치만 처리

**후행(향후) 시험 플랫폼 구성요소**:
- STT 서비스 (WhisperX 또는 외부 API)
- API 서버 (FastAPI, Port 8002)
- 웹 UI (Streamlit 또는 Next.js)
- DB (SQLite -> PostgreSQL)
- 동시성 처리 (큐 기반 비동기, 50인 동시 채점)

### 2.2 PRD Analysis Report: 14건 이슈 발견

PRD 분석에서 발견된 이슈: Critical 3건, Major 7건, Minor 4건

**Critical 이슈 3건**:
1. **C-1**: EXAONE-Score의 feedback이 `dummy_text0`으로 하드코딩 -> 피드백 생성 방안 결정 필요
2. **C-2**: 문항 데이터 소스 부재 -> `outputs/iSKA-v1.0.0/` 디렉토리 비어있음
3. **C-3**: expected_answers, image_captions가 채점에 미활용 -> 한계 사항으로 명시 필요

**Major 이슈 중 주요 항목**:
- M-2: WhisperX STT에서 첫 번째 세그먼트만 추출하는 버그 (30초 이상 녹음 시 데이터 손실)
- M-4: EXAONE-Score의 `GEN_LOCK` 동시성 제한 미고려 (10건 동시가 아닌 단일 배치 최대 10건)
- M-5: httpx 타임아웃 미설정 (배치 채점 시 수십 초 소요 가능)

**리스크 매트릭스** (높은 영향도 항목):
- 문항 데이터 부재로 개발 차질 (발생 확률: 높음)
- 피드백 더미 데이터로 품질검증 무의미 (발생 확률: 확실)
- WhisperX 외국인 발음 STT 정확도 저하 (발생 확률: 중)

### 2.3 Task Plan: Phase 3까지 완료, Phase 4 대기

| Phase | 상태 | 내용 |
|-------|------|------|
| Phase 1 | 완료 | 프로젝트 구조, config.yaml, requirements.txt |
| Phase 2 | 완료 | scoring_client.py, grade.py, csv_handler.py |
| Phase 3 | 완료 | score.py CLI 메인 (단일/배치/통계 모드) |
| Phase 4 | 대기 | test.csv 배치 테스트, 정답 레이블 대비 정확도 분석 |

진행률: 7/10 태스크 완료. 특이사항: test.csv 21,505건, cp949 인코딩, 3건의 컬럼 밀림 보정 로직 포함.

---

## 3. Future Work / 로드맵

### 단기 (선행 CLI Prototype 완료)
- Phase 4 실행: test.csv 21,505건 배치 채점 + 정답 레이블 대비 정확도 분석
- Critical 이슈 해결: 피드백 생성 방안 결정, 문항 데이터 소스 확인

### 중기 (후행 시험 플랫폼)
- 음성 녹음 -> STT(WhisperX) -> 자동 채점 End-to-End 파이프라인
- 50인 동시 시험 처리 가능한 웹 플랫폼
- 시험 관리자용 대시보드
- PostgreSQL 기반 세션/응답/결과 저장

### 장기
- 채점 모델 프롬프트 개선 (expected_answer 활용, 피드백 생성)
- temperature 조정 또는 다중 채점 후 평균 계산으로 일관성 향상
- 외국인 발음 특화 STT 모델 fine-tuning

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "선행-후행으로 분리한 전략적 이유"**
EXAONE-Score 채점 모델의 정확도가 검증되지 않은 상태에서 바로 시험 플랫폼을 구축하면, 채점 정확도 문제가 플랫폼 전체의 신뢰성을 훼손할 수 있다. CLI Prototype으로 먼저 21,505건의 테스트 데이터에 대해 채점 정확도를 검증하고, 그 결과에 따라 모델 개선 또는 플랫폼 구축을 결정하는 것이 리스크를 최소화하는 접근이다.

**2. "6등급 체계를 config 기반으로 설계한 이유"**
한국어능력시험(TOPIK)의 등급 체계와 유사하지만 동일하지 않은 자체 등급 체계이다. 연구 과정에서 등급 경계값이 변경될 수 있으므로, config.yaml에서 범위를 변경할 수 있도록 설계했다. 이는 "연구용 프로토타입"의 특성을 반영한 유연한 설계이다.

**3. "expected_answer 미활용이라는 한계의 의미"**
EXAONE-Score 모델이 question-answer 쌍만으로 채점한다는 것은, 정답(expected_answer)과의 비교 없이 언어 능력과 내용 적절성만 평가한다는 뜻이다. 이는 open-ended 말하기 평가에 적합하지만, 특정 정답이 요구되는 문항에서는 채점 정확도가 떨어질 수 있다. PRD Analysis Report에서 이를 Critical 이슈로 분류하고 한계 사항으로 명시하도록 권고한 것은, 기술적 한계를 투명하게 관리하려는 의도이다.

**4. "21,505건 test.csv의 전처리 과제"**
test.csv가 cp949 인코딩이고, 3건의 컬럼 밀림(positive1 빈칸 시 후속 컬럼이 밀리는 문제)이 발견된 것은, 실제 연구 데이터의 품질 문제를 반영한다. csv_handler.py에 컬럼 밀림 보정 로직을 포함한 것은 단순한 CSV 파싱이 아닌 데이터 전처리 경험을 보여준다.

**5. "동시성 제한(GEN_LOCK)에 대한 인식"**
기존 scoring_api가 asyncio.Lock으로 한 번에 하나의 배치만 처리하는 구조는, 50인 동시 시험이라는 후행 요구사항과 직접적으로 충돌한다. 이 제약을 인식하고 "큐 기반 비동기 처리(Celery 등)"를 후행 아키텍처에 명시한 것은, 현재의 기술 부채를 정확히 진단하고 있음을 보여준다.

**6. "이 프로젝트가 보여주는 역량의 차별점"**
SoundMind 생태계의 다른 프로젝트(RAG 평가, LLM 부하테스트, 모니터링)가 모두 LLM/RAG 관련인 반면, KOCAA는 **교육 AI(EdTech)** 도메인이다. 한국어 말하기 능력 평가라는 구체적 비즈니스 문제를 AI로 해결하는 프로젝트로, "LLM 기술을 실제 업무에 적용하는 능력"을 보여주는 사례이다. 특히 STT -> 채점 -> 등급 매핑이라는 멀티모달 파이프라인 설계 경험은 차별화 요소이다.
