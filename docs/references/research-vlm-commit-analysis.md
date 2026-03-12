# Research VLM Based Document Parsing - 커밋 히스토리 분석 보고서

> 분석 대상: `research-vlm-based-document-parsing` (WigtnOCR)
> 저장소: https://github.com/Hyeongseob91/research-vlm-based-document-parsing
> 분석 일자: 2026-03-11
> 개발자: Hyeongseob Kim (Kim, Hyeongseob)
> 브랜치: main (단일 브랜치)
> 총 커밋 수: 27개 (2026-01-21 ~ 2026-03-10, 약 7주)

---

## 1. 프로젝트 개요

**WigtnOCR**은 VLM(Vision-Language Model) 기반의 한국 공공문서 지능형 파서로, 3계층 연구 프레임워크이다.

### 핵심 기술 스택
- **VLM 모델**: Qwen3-VL 시리즈 (2B/8B/30B) + LoRA 파인튜닝
- **서빙 인프라**: vLLM, 듀얼 RTX PRO 6000 (각 96GB)
- **텍스트 추출**: PyMuPDF (디지털 PDF), RapidOCR (스캔 PDF)
- **청킹**: LangChain SemanticChunker + BGE-M3 임베딩
- **평가 지표**: CER, WER, Structure F1, TEDS, BC(Boundary Clarity), CS(Chunk Stickiness)
- **언어**: Python 3.11+, 빌드 시스템 hatchling

### 3계층 구조
| 계층 | 디렉토리 | 역할 | 파일 수 |
|------|----------|------|---------|
| **Framework** | `wigtnocr/` | 설치 가능 Python 패키지, 하이브리드 라우팅 파서 | 15개 (.py) |
| **Fine-tuned Model** | `training/` | Qwen3-VL-2B LoRA 어댑테이션 파이프라인 | 7개 (.py) |
| **Benchmark** | `evaluation/` | KoGovDoc-Bench + OmniDocBench 평가 체계 | 14개 (.py) |

### 4-Parser 설계
| 파서 | Stage 1 (추출) | Stage 2 (구조화) | 용도 |
|------|---------------|-----------------|------|
| Text-Baseline | PyMuPDF | - | 디지털 PDF, 속도 우선 |
| Image-Baseline | RapidOCR | - | 스캔 PDF, 속도 우선 |
| Text-Advanced | PyMuPDF | Qwen3-VL-2B | 디지털 PDF, 구조 우선 |
| Image-Advanced | RapidOCR | Qwen3-VL-2B | 스캔 PDF, 구조 우선 |

---

## 2. 타임라인: 주요 마일스톤

### 전체 커밋 히스토리 (시간순)

| # | 날짜 | SHA (7자리) | 커밋 메시지 | 분류 |
|---|------|-------------|-------------|------|
| 1 | 2026-01-21 | `379aa4d` | feat: Add VLM document parsing quality test framework | **초기 구축** |
| 2 | 2026-01-21 | `4431a57` | docs: Update README with prompt engineering and rewrite GT files | 문서 |
| 3 | 2026-01-22 | `af427d5` | feat: Add comprehensive evaluation framework and tech report structure | **평가체계 구축** |
| 4 | 2026-01-26 | `b59009a` | feat: Add chunking evaluation CLI and analysis dashboard | **청킹 평가** |
| 5 | 2026-01-26 | `be1e0b1` | fix(dashboard): Fix Parsing section UI - native components, legend, parser table | 버그수정 |
| 6 | 2026-01-27 | `bf984a6` | refactor: Remove unused modules and clean up codebase | 정리 |
| 7 | 2026-01-27 | `4f5ca49` | feat: Enhance chunking evaluation with OpenAI API and improve dashboard UI | 기능강화 |
| 8 | 2026-01-28 | `b028602` | refactor(metrics): Replace perplexity with semantic distance for BC/CS | **방향 전환** |
| 9 | 2026-01-28 | `4a6b5e5` | refactor(dashboard): Fix data loading and unify parser color mappings | UI 개선 |
| 10 | 2026-01-28 | `2beb69e` | feat(eval): Add Structure F1 metric for markdown structure evaluation | **새 메트릭** |
| 11 | 2026-01-28 | `5361343` | refactor(chunking): Replace custom chunkers with LangChain SemanticChunker | **방향 전환** |
| 12 | 2026-01-28 | `f3d57ec` | refactor(parsers): Remove unused VLM and Docling parsers, enhance OCR parser | **파서 정리** |
| 13 | 2026-01-28 | `8470c5e` | chore(data): Reorganize test data - move test_5 to test_4 | 데이터 정리 |
| 14 | 2026-01-28 | `ed4ed35` | docs: Update README with new architecture and features | 문서 |
| 15 | 2026-01-28 | `90d516d` | refactor(structurer): Enhance markdown formatting prompts for better structure detection | **프롬프트 개선** |
| 16 | 2026-01-28 | `077961a` | feat(dashboard): Add Structure F1 metric display to Parsing Test section | 대시보드 |
| 17 | 2026-01-28 | `5825692` | refactor(dashboard): Improve UI visibility and remove meaningless metrics | UI 정리 |
| 18 | 2026-01-28 | `ca45dc1` | refactor(dashboard): Replace 4 individual charts with unified subplot | UI 통합 |
| 19 | 2026-01-28 | `8b83e85` | chore(data): Reorganize test data structure | 데이터 정리 |
| 20 | 2026-01-28 | `0688f6c` | style(dashboard): Improve metrics comparison chart readability | 스타일 |
| 21 | 2026-01-28 | `7d480e2` | refactor(dashboard): Replace Chunking chart with Bubble Chart | 시각화 개선 |
| 22 | 2026-01-28 | `f030aac` | docs(tech-report): Complete Tech Report with experimental results and charts | **테크 리포트 완성** |
| 23 | 2026-01-29 | `3260899` | (pull: fast-forward) | 원격 동기화 |
| 24 | 2026-01-29 | `fce03fc` | docs: Improve tech report logic and align READMEs with restructured RQs | 문서 정비 |
| 25 | 2026-01-31 | `71bc486` | feat: Add fair CER evaluation pipeline with TEDS, hypothesis validation, and dataset tools | **공정 평가 파이프라인** |
| 26 | 2026-01-31 | `08ccee3` | chore: Add data/ to .gitignore | 정리 |
| 27 | 2026-03-09 | `0d0c384` | (pull: fast-forward from remote) | 원격 동기화 |
| 28 | 2026-03-10 | `bd739f5` | refactor: Restructure project to 3-layer architecture (wigtnocr/training/evaluation) | **대규모 리팩토링** |

### 개발 밀도 분석
- **1월 21일**: 프로젝트 시작 (2커밋)
- **1월 22일**: 평가 프레임워크 구축 (1커밋)
- **1월 26~27일**: 청킹 평가 + 코드 정리 (4커밋)
- **1월 28일**: **최고 집중 개발일** - 하루에 14커밋, 메트릭 교체/파서 정리/프롬프트 개선/테크 리포트 완성
- **1월 29일**: 문서 정비 (2커밋)
- **1월 31일**: TEDS + 공정 CER 평가 (2커밋)
- **3월 9~10일**: 5주 공백 후 3계층 아키텍처 대규모 리팩토링 (2커밋)

---

## 3. 방향 전환 (Pivot Points)

프로젝트 전체에서 3번의 중요한 방향 전환이 확인된다.

### Pivot 1: 메트릭 교체 - Perplexity에서 Semantic Distance로 (2026-01-28)
- **커밋**: `b028602` - `refactor(metrics): Replace perplexity with semantic distance for BC/CS`
- **배경**: 초기에는 청킹 품질을 perplexity(혼란도)로 측정했으나, 의미적 유사도 기반의 BC(Boundary Clarity)와 CS(Chunk Stickiness)로 전환
- **의의**: MoC 논문(arxiv:2503.09600)의 메트릭을 채택한 것으로, 학술적 근거가 있는 평가 체계로의 전환. 코사인 유사도 기반 경계 독립성(BC)과 구조적 엔트로피(CS)는 청킹 품질을 더 직관적으로 측정
- **영향**: 이후 LangChain SemanticChunker 도입과 BGE-M3 임베딩 활용의 기반이 됨

### Pivot 2: 청킹 엔진 교체 - Custom Chunker에서 LangChain SemanticChunker로 (2026-01-28)
- **커밋**: `5361343` - `refactor(chunking): Replace custom chunkers with LangChain SemanticChunker`
- **배경**: 자체 구현 청커를 LangChain의 SemanticChunker로 교체
- **의의**: "바퀴를 다시 발명하지 않는" 실용적 판단. LangChain 생태계 활용으로 유지보수성 향상
- **영향**: 코드 복잡성 감소, 검증된 라이브러리 사용으로 신뢰성 향상

### Pivot 3: 파서 정리 - VLM/Docling 파서 제거 (2026-01-28)
- **커밋**: `f3d57ec` - `refactor(parsers): Remove unused VLM and Docling parsers, enhance OCR parser`
- **배경**: 초기에 VLM 직접 호출 파서와 Docling 파서를 실험했으나, Two-Stage(추출+구조화) 아키텍처가 우월함을 확인 후 제거
- **의의**: 4-Parser 설계(Text-Baseline, Image-Baseline, Text-Advanced, Image-Advanced)로의 집중. 실험을 통한 아키텍처 결정의 좋은 사례
- **영향**: PyMuPDF + RapidOCR을 Stage 1으로, VLM(Qwen3-VL-2B)을 Stage 2 구조화 전용으로 역할 분리

### 부가 Pivot: 대규모 아키텍처 리팩토링 (2026-03-10)
- **커밋**: `bd739f5` - `refactor: Restructure project to 3-layer architecture (wigtnocr/training/evaluation)`
- **배경**: 5주간의 공백기 후 프로젝트 전체를 3계층(Framework/Training/Evaluation)으로 재구조화
- **의의**: 연구 프로토타입에서 설치 가능한 패키지(`pip install wigtnocr`)로의 전환. PyPI 배포 가능 형태로 성숙화

---

## 4. 문제 해결 이력

### 4.1 대시보드 UI 반복 개선 (2026-01-26 ~ 01-28)
- `be1e0b1`: Parsing 섹션 UI 수정 - 네이티브 컴포넌트, 범례, 파서 테이블
- `4a6b5e5`: 데이터 로딩 수정 및 파서 색상 매핑 통일
- `5825692`: UI 가시성 개선 및 무의미한 메트릭 제거
- `ca45dc1`: 4개 개별 차트를 통합 서브플롯으로 교체
- `0688f6c`: 메트릭 비교 차트 가독성 개선
- `7d480e2`: 청킹 차트를 버블 차트로 교체
- **패턴**: 총 6번의 대시보드 개선 커밋. 데이터 시각화에 대한 지속적 반복 개선 과정이 드러남

### 4.2 공정한 평가 체계 구축 (2026-01-31)
- `71bc486`: `feat: Add fair CER evaluation pipeline with TEDS, hypothesis validation, and dataset tools`
- **문제**: 단순 CER만으로는 파서 간 공정한 비교가 불가능
- **해결**: TEDS(Table Edit Distance Similarity)를 추가하여 표 구조 정확도 평가, 가설 검증 체계 도입
- **의의**: 벤치마크의 학술적 엄밀성 강화

### 4.3 프롬프트 엔지니어링 진화 (2026-01-21 ~ 01-28)
- `4431a57`: 프롬프트 엔지니어링 관련 README 업데이트 및 GT 파일 재작성
- `90d516d`: 마크다운 포맷팅 프롬프트 개선 - 구조 감지 향상
- **패턴**: VLM 구조화 단계의 프롬프트를 반복적으로 개선하여 마크다운 출력 품질 향상

### 4.4 데이터 구조 정비 (반복)
- `8470c5e`: test_5를 test_4로 이동
- `8b83e85`: 테스트 데이터 구조 재조직
- `08ccee3`: data/ 디렉토리를 .gitignore에 추가
- **패턴**: 대용량 PDF/이미지 데이터를 git에서 분리하는 과정

---

## 5. 기술적 진화 (프롬프트 v1 -> v2, 4-Parser 비교 등)

### 5.1 프롬프트 진화 과정

| 시점 | 내용 | 커밋 |
|------|------|------|
| v1 (01-21) | 초기 프롬프트 엔지니어링 + GT 파일 수작업 | `4431a57` |
| v2 (01-28) | 마크다운 포맷팅 프롬프트 강화, 구조 감지 개선 | `90d516d` |

- Pseudo GT 생성에 Claude/GPT-4o를 활용하며, CER < 5% 자동 승인 기준 도입
- 시스템 프롬프트는 `training/prompts/templates.py`에서 관리

### 5.2 파서 아키텍처 진화

```
[Phase 1] 초기 (01-21)
  - 다양한 파서 실험: VLM 직접 호출, Docling, PyMuPDF, RapidOCR

[Phase 2] 정리 (01-28)
  - VLM/Docling 파서 제거 (f3d57ec)
  - Two-Stage 아키텍처 확립: 추출(Stage 1) + VLM 구조화(Stage 2)

[Phase 3] 성숙 (03-10)
  - 4-Parser 설계 확정
  - 하이브리드 라우팅 (complexity score 기반 자동 선택)
  - 복잡도 < 0.5: CPU-only (PyMuPDF / RapidOCR)
  - 복잡도 >= 0.5: GPU (Two-Stage + Qwen3-VL-2B)
```

### 5.3 평가 메트릭 진화

```
[Phase 1] 초기 메트릭 (01-21 ~ 01-22)
  - CER, WER (기본 텍스트 품질)

[Phase 2] 청킹 메트릭 전환 (01-28)
  - Perplexity -> BC/CS (MoC 논문 기반)
  - Structure F1 추가 (마크다운 구조 평가)

[Phase 3] 공정 평가 (01-31)
  - TEDS 추가 (표 구조 정확도)
  - 가설 검증 체계 도입
```

최종 메트릭 체계:
| 단계 | 메트릭 | 역할 |
|------|--------|------|
| 전제 검증 | CER, WER | 텍스트 추출 품질 |
| 핵심 | Structure F1 | 구조 보존도 |
| 핵심 | TEDS | 표 구조 정확도 |
| 다운스트림 | BC | 청크 경계 독립성 |
| 다운스트림 | CS | 청크 의존도 |

### 5.4 VLM 모델 3단계 서빙 전략

듀얼 RTX PRO 6000 (각 96GB)에서 vLLM으로 서빙:
| 모델 | 파라미터 | 포트 | 역할 |
|------|---------|------|------|
| Qwen3-VL-30B-A3B-Thinking | 30B (3B active) | 8000 | Pseudo GT 생성 (교사 모델) |
| Qwen3-VL-8B-Thinking-FP8 | 8B | 8004 | 검증 / Ablation |
| Qwen3-VL-2B-Instruct | 2B | 8010 | 프로덕션 추론 + LoRA 베이스 (학생 모델) |

이 구조는 **Knowledge Distillation** 패턴을 따른다: 30B 교사 모델이 Pseudo GT를 생성하고, 2B 학생 모델이 LoRA로 파인튜닝된다.

### 5.5 LoRA 파인튜닝 구성

| 파라미터 | 값 |
|---------|-----|
| 베이스 모델 | Qwen3-VL-2B-Instruct |
| LoRA rank (r) | 64 |
| LoRA alpha | 128 |
| 타겟 모듈 | q_proj, v_proj, k_proj, o_proj |
| Dropout | 0.05 |

---

## 6. 규모 분석

### 6.1 커밋 통계

| 항목 | 수치 |
|------|------|
| 총 커밋 수 | 27개 (pull fast-forward 포함 시 29개 이벤트) |
| 기여자 수 | 1명 (Hyeongseob Kim) |
| 개발 기간 | 2026-01-21 ~ 2026-03-10 (약 49일) |
| 활성 개발일 | 약 8일 (커밋이 있는 날) |
| 최고 집중일 | 2026-01-28 (14커밋) |
| 최장 공백 | 37일 (01-31 ~ 03-09) |

### 6.2 커밋 유형 분류

| 유형 | 개수 | 비율 |
|------|------|------|
| feat (기능 추가) | 8 | 30% |
| refactor (리팩토링) | 10 | 37% |
| docs (문서) | 4 | 15% |
| chore (정리) | 3 | 11% |
| fix (버그 수정) | 1 | 4% |
| style (스타일) | 1 | 4% |

- **리팩토링 비율 37%**: 실험적 프로토타이핑 후 아키텍처를 정비하는 연구 프로젝트의 전형적 패턴
- **feat 30%**: 지속적으로 새로운 기능(메트릭, 파이프라인, 평가 체계)을 추가

### 6.3 소스코드 규모

| 카테고리 | 파일 수 |
|----------|---------|
| `wigtnocr/` (프레임워크) | 15개 .py |
| `training/` (학습) | 7개 .py |
| `evaluation/` (평가) | 14개 .py |
| `scripts/` | 2개 .py |
| `configs/` | 3개 .yaml |
| **총 소스 파일** | **41개** |

### 6.4 의존성 규모

`pyproject.toml` 기준:
| 카테고리 | 주요 의존성 |
|----------|------------|
| Core | httpx, PyMuPDF, Pillow, jiwer, Levenshtein, pyyaml, numpy, langchain-experimental, apted, mistletoe |
| OCR | rapidocr-pdf, rapidocr-onnxruntime |
| Training | transformers, peft, trl, accelerate, datasets, bitsandbytes |
| Evaluation | pandas, sentence-transformers |
| Dev | pytest, pytest-cov, ruff |

---

## 7. 이력서용 핵심 스토리 후보

### 스토리 1: "연구에서 제품으로" - 3계층 아키텍처 설계
> VLM 기반 문서 파싱 연구를 설치 가능한 Python 패키지(`pip install wigtnocr`)로 구조화. Framework/Training/Evaluation 3계층 분리 설계로, 연구 결과물을 즉시 프로덕션에 적용 가능한 형태로 발전시킨 경험.

**핵심 키워드**: 연구-제품 브릿지, 패키지 설계, 3-Layer Architecture

---

### 스토리 2: "4-Parser 하이브리드 라우팅" - 문서 복잡도 기반 자동 최적화
> 문서의 복잡도(스캔 여부, 표 개수, 이미지 밀도)를 분석하여 4개 파서(Text-Baseline, Image-Baseline, Text-Advanced, Image-Advanced) 중 최적의 파서를 자동 선택하는 하이브리드 라우팅 파이프라인을 설계. 단순 문서는 CPU-only로 처리하고 복잡한 문서만 GPU(VLM)를 사용하여 비용-품질 트레이드오프를 최적화.

**핵심 키워드**: 하이브리드 라우팅, 복잡도 분석, 비용-품질 최적화

---

### 스토리 3: "Knowledge Distillation 파이프라인" - 30B 교사 -> 2B 학생
> Qwen3-VL-30B 모델이 생성한 Pseudo Ground Truth를 활용하여 2B 경량 모델에 LoRA 파인튜닝을 적용. CER < 5% 자동 승인 기준으로 학습 데이터 품질을 보장하며, 듀얼 RTX PRO 6000(96GB x 2)에서 vLLM으로 3단계 모델을 동시 서빙.

**핵심 키워드**: Knowledge Distillation, LoRA Fine-tuning, Pseudo GT, vLLM 멀티모델 서빙

---

### 스토리 4: "학술적 엄밀성을 갖춘 벤치마크 구축"
> 6가지 메트릭(CER, WER, Structure F1, TEDS, BC, CS)을 3단계(전제 검증/핵심/다운스트림)로 체계화. Perplexity에서 MoC 논문 기반 시맨틱 디스턴스로의 메트릭 전환, 공정 CER 평가 파이프라인 구축 등 반복적 검증을 통해 평가 체계의 학술적 완성도를 높인 경험.

**핵심 키워드**: 벤치마크 설계, 메트릭 체계화, 가설 검증, KoGovDoc-Bench

---

### 스토리 5: "실험 기반 아키텍처 결정" - 과감한 제거의 기술
> 초기에 VLM 직접 호출, Docling, PyMuPDF, RapidOCR 등 다양한 파서를 실험한 후, 데이터 기반으로 Two-Stage(추출+구조화) 아키텍처가 우월함을 검증하고, 불필요한 파서를 과감히 제거. 1월 28일 하루에 14커밋으로 메트릭 교체, 청킹 엔진 교체, 파서 정리, 프롬프트 개선, 테크 리포트 완성까지 집중 개발.

**핵심 키워드**: 실험 기반 의사결정, Two-Stage Pipeline, 집중 개발

---

### 스토리 6 (통합 버전 - 면접 답변용):
> "한국 공공기관 문서를 VLM으로 구조화하는 연구 프로젝트를 7주간 수행했습니다. 4-Parser 하이브리드 라우팅으로 비용-품질을 최적화하고, 30B 교사 모델에서 2B 학생 모델로의 Knowledge Distillation 파이프라인을 구축했습니다. 6가지 메트릭을 3단계로 체계화한 벤치마크(KoGovDoc-Bench)를 설계했으며, 연구 결과물을 `pip install wigtnocr`로 설치 가능한 3계층 패키지로 구조화했습니다. 듀얼 RTX PRO 6000에서 vLLM 기반 멀티모델 서빙을 운영하며, MoC 논문 기반의 시맨틱 청킹 메트릭(BC/CS)을 적용한 것이 기술적 차별점입니다."

---

## 부록: 커밋 흐름도

```
2026-01-21  [프로젝트 시작]
     |        feat: VLM 문서 파싱 테스트 프레임워크
     |        docs: 프롬프트 엔지니어링 + GT 파일
     |
2026-01-22  [평가 체계]
     |        feat: 종합 평가 프레임워크 + 테크 리포트 구조
     |
2026-01-26  [청킹 평가]
     |        feat: 청킹 평가 CLI + 대시보드
     |        fix: 대시보드 UI 수정
     |
2026-01-27  [코드 정리]
     |        refactor: 미사용 모듈 제거
     |        feat: OpenAI API 청킹 + 대시보드 개선
     |
2026-01-28  [***집중 개발일*** - 14커밋]
     |        refactor: Perplexity -> Semantic Distance (BC/CS)  *** PIVOT 1 ***
     |        feat: Structure F1 메트릭 추가
     |        refactor: LangChain SemanticChunker 교체        *** PIVOT 2 ***
     |        refactor: VLM/Docling 파서 제거                  *** PIVOT 3 ***
     |        refactor: 프롬프트 v2 (구조 감지 강화)
     |        docs: 테크 리포트 완성
     |
2026-01-29  [문서 정비]
     |        docs: 테크 리포트 로직 개선 + RQ 재구성
     |
2026-01-31  [공정 평가]
     |        feat: TEDS + 가설 검증 + 공정 CER 평가
     |
     ---- (37일 공백) ----
     |
2026-03-10  [대규모 리팩토링]
             refactor: 3계층 아키텍처 (wigtnocr/training/evaluation)
```
