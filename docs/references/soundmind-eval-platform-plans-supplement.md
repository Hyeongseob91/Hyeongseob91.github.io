# SoundMind Eval Platform - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

SoundMind Eval Platform은 RAG(Retrieval-Augmented Generation) 파이프라인의 품질을 체계적으로 평가하는 개발자 도구이다. 핵심 구조는 다음과 같다.

**기술 스택**:
- Backend: Python 3.11 / FastAPI / Uvicorn, SQLite(aiosqlite), Redis 7
- Frontend: React 19 / TypeScript 5.6 / Vite 6, Tailwind CSS 3.4, Recharts
- Infra: Docker Compose 기반 3개 서비스 오케스트레이션

**서비스 구성**:
- Eval API (FastAPI, :9300): 평가 오케스트레이터, 메트릭 계산, A/B 테스트 통계 분석
- Web Console (React + Vite, :3300): 평가 결과 시각화, 실험 관리 대시보드
- Redis (:6380): 평가 결과 캐싱

**평가 체계**: LLM-as-Judge 방식으로 5가지 기준(Faithfulness 30%, Relevance 25%, Completeness 20%, Coherence 15%, Fluency 10%)을 평가하며, 통계 분석에 Paired t-test, Mann-Whitney U test, Holm-Bonferroni 보정, Bootstrap CI, Cohen's d를 활용한다.

**아키텍처적 특징**: 평가 대상인 Analysis Platform(RAG Pipelines, :9200)에 HTTP로 질문을 전송하고 응답을 수신하는 구조로, 평가 시스템이 피평가 시스템과 완전히 분리되어 있다.

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 현재 메트릭 품질의 한계 인식

future_work.md에서 가장 먼저 지적하는 문제는 현재 평가 메트릭이 "플레이스홀더(placeholder) 수준"이라는 것이다. 구체적으로:
- ContextPrecisionMetric: 단순 문자열 포함 검사
- ContextRecallMetric: 단어 수준 커버리지
- AnswerRelevanceMetric: 키워드 오버랩
- FaithfulnessMetric: 콘텐츠 단어 존재 검사
- AnswerCorrectnessMetric: 단어 수준 F1

이는 기존 `rag-evaluation-framework` 프로젝트에서 시맨틱 유사도, RAGAS 호환 메트릭, BLEU/ROUGE, MRR/NDCG 등을 이미 구현한 상태에서, Eval Platform으로의 이식이 아직 완료되지 않았음을 의미한다. 즉, "프레임워크에서 검증된 평가 방법론을 플랫폼으로 이전하는 과정"에서의 기술 부채가 존재한다.

### 2.2 플랫폼 간 코드 재사용성 문제

Phase 9(shared 패키지 pip 패키지화)의 우선순위가 "높음"으로 설정되어 있다. 이는 SoundMind 생태계 내 여러 플랫폼(Analysis, Eval, Monitoring 등)이 데이터 모델, 유틸리티, 상수 등을 각각 독립적으로 구현하면서 인터페이스 불일치가 발생하고 있음을 시사한다. `soundmind-shared` 패키지를 통해 Pydantic 모델, 포트 번호 상수, HTTP 유틸리티를 공유하려는 설계는 마이크로서비스 간 계약(contract) 관리의 필요성을 반영한다.

### 2.3 지속적 품질 보증(CQA) 체계의 부재

Phase 3(자동 평가 파이프라인)과 Phase 6(CI/CD 통합)은 현재 평가가 수동으로 실행되고 있음을 보여준다. 새 파이프라인 배포 시 webhook/polling으로 감지하여 자동 평가를 트리거하고, 품질 게이트를 통해 최소 점수 미달 시 배포 롤백을 하는 구조는 ML 모델의 CD(Continuous Delivery)에 해당하는 설계이다.

---

## 3. Future Work / 로드맵

9단계 Phase로 구성된 로드맵이 명확히 정의되어 있다.

| 우선순위 | Phase | 핵심 가치 |
|---------|-------|----------|
| 높음 | Phase 1: 메트릭 이식 | 현재 평가 정밀도가 프로덕션 미달 |
| 높음 | Phase 3: 자동 평가 | 배포 시 자동 벤치마크 + 품질 게이트 |
| 높음 | Phase 9: shared 패키지화 | 플랫폼 간 인터페이스 일관성 |
| 중간 | Phase 2: 데이터셋 고도화 | LLM 기반 GT 자동 생성, 버전 관리 |
| 중간 | Phase 4: 시각화 강화 | 레이더/히트맵/박스플롯 등 고급 차트 |
| 중간 | Phase 6: CI/CD 통합 | PR 시 자동 평가 + 코멘트 |
| 중간 | Phase 7: 벤치마크 데이터셋 | KorQuAD, KLUE 등 표준 벤치마크 내장 |
| 낮음 | Phase 5: 비교 리포트 | PDF/LaTeX/Markdown 자동 리포트 생성 |
| 낮음 | Phase 8: 실시간 모니터링 | 프로덕션 트래픽 샘플링 + 품질 드리프트 감지 |

의존성 체인: Phase 1 -> Phase 3 -> Phase 6 (메트릭 정밀화 -> 자동화 -> CI/CD)

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "왜 별도 플랫폼으로 분리했는가?"**
기존 `rag-evaluation-framework`에서 평가 로직을 개발했지만, 이를 운영 가능한 서비스로 전환하면서 API 서버 + 웹 콘솔 + 캐싱 레이어를 추가하여 별도 플랫폼으로 분리했다. 이는 평가 도구를 "개발자가 로컬에서 실행하는 스크립트"에서 "팀원 누구나 웹 브라우저에서 접근하는 서비스"로 전환하려는 의도이다.

**2. "LLM-as-Judge를 선택한 이유"**
tech-report에서 확인된 바와 같이, 한국어 RAG에서 ROUGE-L(0.0501)과 BLEU(0.0018)는 사실상 무의미했다. 반면 LLM Judge는 종합 0.786을 기록하며 인간 평가에 근접한 결과를 보였다. 이 실험 결과가 Eval Platform의 평가 방법론(LLM-as-Judge 5차원 평가)을 결정하는 근거가 되었다.

**3. "통계 검증을 왜 이렇게 풍부하게 넣었는가?"**
A/B 테스트에서 단순 평균 비교가 아닌 Paired t-test + Mann-Whitney U + Holm-Bonferroni 보정 + Bootstrap CI + Cohen's d를 적용한 것은, tech-report 실험에서 대부분의 비교에서 p > 0.05로 유의미한 차이를 검출하지 못한 경험에 기인한다. 제한된 데이터셋에서도 통계적 신뢰성을 확보하기 위한 다층적 검증 설계이다.

**4. "왜 플레이스홀더 메트릭으로 먼저 출시했는가?"**
MVP(Minimum Viable Product) 전략으로, 평가 파이프라인의 전체 흐름(질문 전송 -> 응답 수집 -> 점수화 -> 시각화)을 먼저 구축하고, 이후 정밀한 메트릭을 이식하는 방식을 선택했다. 이는 "완벽한 평가"보다 "평가할 수 있는 체계를 먼저 확보"하는 것이 팀에 더 급선무였다는 판단이다.

**5. "Redis 캐싱을 평가 시스템에 넣은 이유"**
동일 파이프라인에 같은 질문을 반복 평가할 때 LLM 호출 비용을 절감하기 위함이다. 특히 A/B 테스트에서 Baseline(Naive RAG) 결과를 캐싱하면 비교 대상만 새로 평가하면 되므로 비용과 시간을 절반으로 줄일 수 있다.
