# SoundMind Analysis Platform - 기획/설계 문서 분석 보충 보고서

> **작성일**: 2026-03-11
> **분석 대상**: soundmind-analysis-platform 프로젝트의 기획/설계/태스크 문서 8건
> **목적**: 프로젝트의 전체 구조, 기획 의도, 기술적 의사결정, 그리고 이력서 활용 맥락을 보충 분석

---

## 1. README에서 파악되는 프로젝트 전체 구조

### 1.1 플랫폼의 본질: "파이프라인 팩토리"

README가 정의하는 Analysis Platform의 핵심 컨셉은 **"문서 업로드 -> AI 분석 -> 파이프라인 추천 -> 원클릭 배포"**이다. 이것은 단순한 RAG 시스템이 아니라, RAG 파이프라인 자체를 생산하는 메타 시스템(meta-system)이다. 즉, 이 플랫폼의 산출물은 "답변"이 아니라 "답변을 생성할 수 있는 파이프라인"이다.

이 구조적 특성은 다음과 같은 아키텍처적 함의를 갖는다:

- **2-Tier 서비스 구조**: Analysis API(포트 9200)는 관리 평면(control plane)이고, 배포된 파이프라인(포트 9201~9299)은 데이터 평면(data plane)이다. 최대 99개의 파이프라인을 동시에 운영할 수 있으며, 각 파이프라인은 독립적인 FastAPI 서비스로 자체 헬스 체크, 쿼리, 스트리밍, 업로드 엔드포인트를 제공한다.
- **런타임 생성 인프라**: `docker-compose.yml`(git 관리, 고정 인프라)과 `docker-compose.deployments.yml`(런타임 생성, 배포된 파이프라인)을 분리하여 git 관리 파일과 런타임 상태의 충돌을 방지한다. Jinja2 템플릿으로 서비스 블록과 Dockerfile을 동적 렌더링하는 방식이다.
- **포트 할당의 동시성 보호**: 9201~9299 범위에서 `asyncio.Lock`으로 동시 배포 시 포트 충돌을 방지한다. 이는 단순해 보이지만, 여러 운영자가 동시에 파이프라인을 배포할 수 있는 실제 운영 시나리오를 고려한 설계이다.

### 1.2 기술 스택 선택의 맥락

README에 명시된 기술 스택을 분석하면 몇 가지 의도적인 선택이 보인다:

- **SQLite(aiosqlite)**: PostgreSQL이 아닌 SQLite를 선택한 것은 "내부 네트워크 배포, 별도 사용자 인증 없이 API 키 기반 보호"라는 운영 전제에 부합한다. 외부 DB 서버 의존 없이 단일 파일로 관리할 수 있어 배포 복잡도를 줄인다. 단, ai-platform(PostgreSQL 10테이블)과 대비되는 선택이다.
- **Dual VectorDB (Weaviate + Qdrant)**: Advanced RAG는 Weaviate(하이브리드 검색: dense + sparse), Structured RAG는 Qdrant(메타데이터 필터링)로 용도별 VectorDB를 분리했다. 하나의 VectorDB로 통일하지 않은 것은 각 파이프라인 패턴의 최적 인프라를 보장하기 위함이다.
- **Dual LLM 분석 (Gemini + GPT)**: 분석에 두 개의 상용 LLM을 사용한다. Gemini는 PDF 네이티브 입력(File API)으로 시각적 구조(표, 차트, 레이아웃)까지 인식하고, GPT-4o는 텍스트 기반 교차 검증을 수행한다. 이 이중 구조는 단일 LLM의 편향을 보정하는 설계이다.
- **uv 패키지 매니저 + 워크스페이스**: `pyproject.toml`에 5개 멤버를 가진 uv 워크스페이스를 구성하여 `rag-core`(추상 인터페이스), `components`(구현체), `pipelines`(advanced/structured), `shared`(공유 패키지), `analysis_service`(메인 앱)를 모노레포로 관리한다.

### 1.3 프로젝트 디렉토리 구조가 드러내는 설계 철학

프로젝트 구조는 **클린 아키텍처**의 영향이 뚜렷하다:

- `packages/rag-core/`: 추상 인터페이스(ABC)만 정의. `BaseChunker`, `BaseRetriever`, `BaseReranker`, `BaseQueryProcessor`, `BaseQueryClassifier` 등. 구현체에 대한 의존 없음.
- `packages/components/`: `rag-core`의 ABC를 구현하는 구체 클래스. `RecursiveChunker`, `HybridRetriever`, `InfinityReranker` 등.
- `packages/pipelines/`: `rag-core`의 `BasePipeline`을 구현하는 Advanced/Structured 파이프라인. LangGraph StateGraph 기반.
- `src/analysis_service/`: FastAPI 애플리케이션. 라우트, 설정, 코어 로직(DB, 레지스트리, 배포), 문서 분석 모듈.

이 구조는 "인터페이스 → 구현 → 오케스트레이션 → 애플리케이션"의 계층을 명확히 분리하며, 새 컴포넌트를 추가할 때 기존 코드를 변경하지 않고 신규 파일만 추가하면 되는 개방-폐쇄 원칙(OCP)을 실현한다.

### 1.4 3단계 분석 파이프라인의 장애 대응

README에 명시된 폴백 전략은 실제 운영 환경의 불확실성을 체계적으로 대응한다:

| 장애 상황 | 폴백 전략 | 결과 품질 |
|-----------|----------|----------|
| Gemini 실패 | 규칙 기반 분석만으로 진행 | 기본 추천 (정확도 하락) |
| GPT 검증 실패 | Gemini 결과만으로 추천 | 교차 검증 없음 (편향 가능) |
| JSON 파싱 실패 | 최대 2회 재시도 후 규칙 기반 추출 | 최소 보장 |
| 서버 재시작 | analyzing 상태 리포트를 failed로 마킹 | 일관성 보장 |

이 설계는 "분석 결과의 품질이 떨어지더라도, 서비스 자체는 절대 중단되지 않는다"는 graceful degradation 원칙을 구현한 것이다.

---

## 2. PRD 분석: 기획 의도와 문제 인식

### 2.1 PRD가 포착한 핵심 문제

PRD v2.0(2026-03-05)의 Problem Statement는 현재 시스템의 5가지 결함을 명확히 진단한다:

1. **핵심 비즈니스 로직 미완성**: 인프라(배포, 레지스트리, 파서)는 있으나 LLM 기반 분석기가 스텁(stub) 상태
2. **문서 업로드 UI 부재**: Dashboard에서 파이프라인 쿼리 테스트만 가능
3. **보고서 기능 부재**: 분석 결과를 보고서로 생성/관리하는 기능 없음
4. **파이프라인 커스터마이징 불가**: 하드코딩된 2종(advanced/structured)만 선택, 노드 레벨 파라미터 튜닝 불가
5. **외부 연동 안내 부재**: 자동 Discovery는 가능하나 UI에서 확인/안내하는 흐름 없음

이 문제 인식은 "인프라는 만들었지만 핵심 가치 전달 경로가 끊겨 있다"는 상황이다. 배포 능력은 있으나, 무엇을 배포해야 하는지 결정하는 지능이 없었다.

### 2.2 Digging Review의 영향 (v1.0 -> v2.0)

PRD 부록에 기록된 Digging Review 변경사항은 설계 의사결정의 질적 도약을 보여준다:

**Critical 이슈 3건**:
- **C-1: PUSH -> PULL 전환**: 원래 설계는 배포 시 AI/Eval Platform에 적극적으로 등록(PUSH)하려 했으나, 실제로는 이미 Pull-based Discovery가 동작 중이었다. Phase 5(플랫폼 연동 PUSH)를 삭제하고 Discovery 확인 + pipeline_mapping 안내로 대체. 이것은 "이미 동작하는 메커니즘을 중복 구현하려 했다"는 과잉 설계를 바로잡은 것이다.
- **C-2: 비동기 실행 미정의**: 원래 PRD에 BackgroundTasks, lifespan cleanup 등 비동기 실행 전략이 없었다. 120초까지 걸리는 분석을 동기로 처리하면 HTTP 타임아웃 문제가 발생한다. 202 Accepted + 폴링 패턴으로 해결.
- **C-3: 고정 토폴로지 확인**: 원래 "노드 조합"이라는 모호한 표현을 사용했으나, 실제로는 LangGraph StateGraph 기반 고정 토폴로지(advanced 3노드, structured 4노드)이다. "base_pipeline 선택 + 파라미터 튜닝"으로 범위를 명확히 축소.

**Major 이슈 4건**:
- **M-4: Reranker 재분류**: Reranker를 별도 LangGraph 노드가 아닌 Retriever의 하위 옵션으로 재분류. 이는 실제 구현 구조를 반영한 정정이다.
- **M-5: Compatibility Matrix 추가**: hybrid->Weaviate만, structured->dense만이라는 제약을 명시. LLM 프롬프트와 Build API 양쪽에서 검증.
- **M-7: LLM JSON 안정성**: Structured Outputs + retry + fallback 전략 추가. LLM 출력의 불안정성이라는 근본 문제를 정면으로 다룸.

### 2.3 LLM 순서 결정의 기술적 근거

PRD에서 가장 중요한 설계 결정 중 하나는 "Gemini 1차(PDF 네이티브) -> GPT 2차(텍스트 검증)" 순서이다:

- **Gemini 1차 이유**: Gemini File API는 PDF를 직접 입력받아 테이블, 차트, 이미지, 레이아웃까지 인식한다. 텍스트 추출 과정에서 손실되는 시각적 정보를 보존할 수 있다. 이것이 "PDF 네이티브"의 핵심 가치이다.
- **GPT 2차 이유**: GPT-4o의 Structured Outputs(json_schema)는 출력 형식의 안정성이 높다. Gemini의 풍부하지만 불안정할 수 있는 분석을 GPT가 교차 검증하여 수정 제안과 신뢰도 조정을 수행한다.
- **병렬 실행 최적화**: 1단계에서 Gemini 분석과 pdfplumber 텍스트 추출 + 규칙 기반 분석을 병렬로 실행하여 전체 분석 시간을 최소화한다.

### 2.4 API 설계의 특징

PRD의 API 명세에서 주목할 점:

- **202 Accepted 패턴**: 업로드 API가 즉시 반환하고 백그라운드에서 분석 실행. REST의 비동기 처리 모범 사례.
- **6단계 폴링**: `file_saved -> text_extraction -> rule_analysis -> gemini_analysis -> gpt_verification -> report_generation`. 클라이언트가 각 단계의 진행 상황을 퍼센트로 추적 가능.
- **Build API의 discovery_info**: 배포 응답에 registry URL, AI Platform pipeline_mapping URL, 안내 메시지를 포함. 단순히 "배포 완료"가 아니라 "다음에 무엇을 해야 하는지"까지 안내하는 사용자 중심 설계.
- **Deprecated API 래핑**: 기존 API(`/api/v1/upload`, `/api/v1/analyze/file`)를 즉시 삭제하지 않고 내부적으로 reports 기반 API를 호출하는 래핑으로 하위 호환성 유지.

---

## 3. RAG 전략 진화 문서 분석

### 3.1 문제의 본질: "전략 지능의 부재"

`rag_strategy_evolution.md`는 현재 시스템의 근본적 한계를 정확히 진단한다:

> "문서 분석(Document Analysis)과 파이프라인 실행(Pipeline Execution) 사이에 전략 지능(Strategy Intelligence) 계층이 부재하다."

현재 상태는 Gemini가 "이 문서에 advanced가 좋을까 structured가 좋을까"를 직접 판단하는 2-way 선택이다. 문제는 Gemini에게 RAG 전략에 대한 체계적 지식을 제공하지 않은 채 선택을 요구한다는 것이다. COMPATIBILITY_MATRIX에는 인프라 호환성(hybrid->Weaviate, dense->Qdrant)만 있고, 전략 지식(언제 hybrid가 적합한가, 어떤 문서에 structure-aware chunking이 필요한가)은 없다.

영향 범위도 넓다: `gemini_analyzer.py`, `gpt_verifier.py`, `strategy_recommender.py`, `report_generator.py`, `pipeline/config.py` 모두 2-way 선택에 고정되어 있어 단일 컴포넌트 수정으로는 해결 불가하다.

### 3.2 3-Layer Strategy Architecture

이 문서가 제안하는 해결책은 3계층 전략 아키텍처이다:

**Layer 1 - Document Intelligence (문서 이해)**: "이 문서는 무엇인가?"
- 현재의 단순 분석을 4차원 프로파일로 확장: `structure_profile`, `content_profile`, `retrieval_profile`, `visual_profile`
- Gemini 프롬프트에서 **파이프라인 추천 지시를 완전 제거**하고 문서 분석에만 집중
- 핵심 원칙: "분석과 추천을 분리한다"

**Layer 2 - Strategy Intelligence (전략 결정)**: "이 문서에 어떤 RAG 전략 조합이 최적인가?"
- 4차원 전략 공간: Chunking, Retrieval, Indexing, Post-Processing
- 각 차원에 6~7가지 전략 옵션 (총 수백 가지 조합)
- 하이브리드 매핑: 규칙 기반 후보 생성 + LLM 기반 최종 선택
- RAG Strategy Knowledge Base: 각 전략의 장단점, 적합/부적합 조건을 구조화한 지식

**Layer 3 - Pipeline Assembly (파이프라인 조립)**: "전략 조합을 실행 가능한 파이프라인으로 조립"
- ComponentRegistry에서 전략 키 -> 컴포넌트 클래스 매핑
- LangGraph StateGraph 동적 구성
- 6가지 그래프 토폴로지 패턴 (Linear, Classify-Filter, Hierarchical, Multi-Index, Graph-Enhanced, Agentic)

### 3.3 4차원 전략 공간의 깊이

이 문서의 가장 가치 있는 기여는 4차원 전략 공간의 체계적 정의이다:

**Dimension 1: Chunking Strategy** (6종)
- `fixed_recursive` (구현됨), `semantic` (구현됨), `structure_aware`, `table_preserving`, `parent_child`, `sliding_window_sentence`

**Dimension 2: Retrieval Strategy** (7종)
- `hybrid_bm25_dense` (구현됨), `dense_only` (구현됨), `metadata_filtered` (구현됨), `hierarchical`, `graph_enhanced`, `multi_index_fusion`, `contextual_expansion`

**Dimension 3: Indexing Strategy** (4종)
- `single_vector` (구현됨), `multi_representation`, `metadata_enriched` (부분 구현), `hypothetical_question`

**Dimension 4: Post-Processing Strategy** (4종)
- `rerank_only` (구현됨), `rerank_with_filter` (부분 구현), `context_compression`, `citation_extraction`

현재 구현 상태를 보면 각 차원에서 2~3개만 구현되어 있고 나머지는 미구현이다. 이 격차가 바로 향후 작업의 대상이다.

### 3.4 urstory-rag 참조 분석의 가치

문서 후반부의 urstory-rag 매핑은 매우 실용적이다. urstory-rag(한국어 규정/문서 QA 시스템)에서 이미 검증된 구현체를 soundmind으로 이식하는 구체적인 경로를 제시한다.

특히 중요한 발견:
- **ContextualChunking (데코레이터 패턴)**: 원래 4차원 전략에 없던 패턴. 어떤 chunker에든 적용 가능한 LLM 기반 breadcrumb/키워드 어노테이션. "청킹 전략과 직교하는 enrichment 레이어"로 식별.
- **Cascading Search**: BM25 -> 쿼리 확장 -> 벡터 폴백의 3단계 적응형 검색. "비싼 검색은 필요할 때만" 원칙.
- **다단계 후처리 파이프라인**: `rerank -> quality_gate -> PII_filter -> answer_gen -> numeric_verify -> faithfulness -> hallucination_check`. 단일 rerank가 아닌 후처리 체인 조합 모델.
- **Question Classification -> Answer Strategy 라우팅**: 질문 유형(extraction/regulatory/explanatory)에 따라 생성 전략을 분기하는 패턴.

이 분석의 결과로 원래 4차원 전략에 `contextual_enrichment`, `cascading`, `quality_gate`, `answer_routing`, `numeric_verification`, `faithfulness_check` 등이 추가되었고, Guardrails가 cross-cutting concern으로 식별되었다.

### 3.5 구현 로드맵 (Phase A~E)

| Phase | 내용 | 의존성 | 핵심 산출물 |
|-------|------|--------|-----------|
| A | Document Intelligence 확장 | 없음 | Gemini 4차원 프로파일 출력 |
| B | Strategy Intelligence 구축 | Phase A | 4차원 전략 추천 + reasoning |
| C | 핵심 컴포넌트 구현 | 독립 (A/B와 병렬) | 6+ chunker, 4+ retriever |
| D | Pipeline Assembly 동적화 | Phase C | 전략 -> 파이프라인 자동 조립 |
| E | Feedback Loop | Phase D | 자기 개선 시스템 |

Phase A~B는 "더 똑똑한 분석"이고, Phase C~D는 "더 다양한 실행"이며, Phase E는 "지속적 개선"이다. 이 로드맵은 단일 프로젝트 차원을 넘어 **자기 진화하는 RAG 최적화 시스템**이라는 장기 비전을 제시한다.

---

## 4. 컴포넌트 포팅 계획: AI Platform에서의 분리 맥락

### 4.1 포팅의 배경: 두 시스템 간의 구조적 차이

`component_porting_plan.md`는 urstory-rag에서 soundmind-analysis-platform으로의 컴포넌트 이식을 계획한다. 두 시스템의 구조적 차이가 명확하다:

| 항목 | urstory-rag | soundmind |
|------|-------------|-----------|
| 타입 시스템 | Protocol (duck typing) | ABC (상속) |
| 동기/비동기 | 전부 async | Chunker/Retriever sync |
| 프레임워크 | Haystack (DocumentSplitter) | LangChain (RecursiveCharacterTextSplitter) |
| LLM 인터페이스 | LLMProvider Protocol 존재 | 없음 (analysis 전용만) |

이 차이는 단순 복사가 불가능함을 의미한다. 각 컴포넌트를 soundmind의 규약(ABC, sync, LangChain, Chunk 10필드 스키마)에 맞게 변환해야 한다.

### 4.2 데이터 모델 매핑의 복잡성

데이터 모델 차이가 특히 주목할 만하다:

- urstory-rag의 `Chunk`는 3필드(`content`, `chunk_index`, `metadata`)로 가볍다.
- soundmind의 `Chunk`는 10필드(`chunk_id`, `content`, `chunk_index`, `doc_id`, `source`, `file_name`, `file_type`, `session_id`, `team_id`, `metadata`)로 무겁다.

soundmind의 Chunk가 더 무거운 이유는 **멀티테넌트 B2B SaaS** 환경에서 청크의 소속(어떤 문서, 어떤 세션, 어떤 팀)을 추적해야 하기 때문이다. 이는 ai-platform의 멀티테넌트 아키텍처와 연동하기 위한 설계이다.

검색 결과도 다르다: urstory-rag의 `SearchResult`(chunk_id, document_id, content, score, metadata)는 개별 결과 중심이고, soundmind의 `RetrievalResult`(final_docs, hybrid_docs_with_scores, ranked_docs_with_scores, pre_rerank_count, timings)는 검색 파이프라인의 전체 맥락을 담는다.

### 4.3 3-Phase 이식 전략

이식 계획은 의존성 기반 3단계로 설계되었다:

**Phase 1: 순수 로직 (즉시, LLM 불필요)** - ~380줄
- P1-1 StructureAwareChunker: 마크다운/평문 헤딩 감지 + 브레드크럼 메타데이터
- P1-2 QualityGate: 검색 결과 품질 임계값 판정 (pass/soft_fail/fail)
- P1-3 CascadingEvaluator: threshold 기반 sufficiency 판단
- P1-4 RuleBasedQueryClassifier: 한국어 정규식 기반 질문 분류 (extraction/regulatory/explanatory)

**Phase 2: LLM 의존 (BaseLLMProvider 선결)** - ~560줄
- P2-0 BaseLLMProvider + OpenAI 구현체: 컴포넌트 레벨 LLM 추상 인터페이스 신설
- P2-1 ContextualEnrichmentDecorator: 데코레이터 패턴으로 청크에 문맥 프리픽스 추가
- P2-2 MultiQueryProcessor: LLM으로 쿼리를 다양한 관점으로 재구성
- P2-3 HyDEQueryEnhancer: 가상 답변 문서 생성 -> 임베딩 검색
- P2-4 CitationExtractor: CoT 기반 증거 추출 + 출처 인용

**Phase 3: 인프라 의존 (추가 패키지 필요)** - ~120줄
- P3-1 KoreanCrossEncoderReranker: `dragonkue/bge-reranker-v2-m3-ko` 모델 (~500MB), `sentence-transformers` 의존

### 4.4 핵심 설계 결정: "신규 파일만 추가"

포팅 계획의 가장 중요한 원칙은 **기존 파이프라인 무영향 보장**이다:

- 이식되는 컴포넌트는 모두 **신규 파일**로 추가
- 기존 `RecursiveChunker`, `SemanticChunker`, `HybridRetriever` 등은 변경 없음
- `PipelineFactory`의 manifest 빌더 경로도 변경 없음
- 새 컴포넌트는 커스텀 조립 경로에서만 사용 (Phase 4)

이는 운영 중인 시스템에 새 기능을 추가하면서 기존 기능을 깨뜨리지 않는 **안전한 확장** 전략이다.

### 4.5 동기/비동기 불일치 해결

urstory-rag는 전부 async인데 soundmind의 ABC는 sync이다. 이 불일치를 해결하는 방법:

- **Phase 1 (순수 로직)**: 문제 없음. 외부 I/O가 없으므로 sync로 이식.
- **Phase 2 (LLM 의존)**: LLM 호출은 본질적으로 async. ABC에 `async_xxx()` 옵셔널 메서드를 추가하고, LangGraph 노드에서 async 호출. **BaseChunker/BaseQueryProcessor 자체를 async로 바꾸면 기존 코드 전부 영향 -> 비권장.**

이 결정은 "기존 인터페이스를 보호하면서 새로운 능력을 추가한다"는 인터페이스 분리 원칙의 실천이다.

### 4.6 StrategyEngine 연동: 전략에서 실행까지

Phase 4(연동)에서 이식된 컴포넌트가 StrategyEngine의 추천과 실제 연결된다:

```
StrategyEngine 추천 -> StrategyToConfigTranslator -> PipelineFactory -> LangGraph StateGraph
```

이를 위해 6개의 레지스트리(CHUNKER, RETRIEVER, RERANKER, POST_PROCESSOR, QUERY_ENHANCEMENT)가 전략 키 -> 컴포넌트 클래스 매핑을 제공하고, 미구현 전략에 대해서는 fallback 매핑 + 경고 로그로 graceful degradation을 보장한다.

---

## 5. Phase 1 E2E 계획: 구현 전략

### 5.1 PLAN_analysis-platform-core.md: 30개 태스크 완료

이 문서는 PRD v2.0을 실행 가능한 태스크로 분해한 것으로, 4개 Phase, 30개 태스크가 **모두 완료(completed)** 상태이다.

**Phase 1 (Backend - Report & Analysis Engine)**: 9개 태스크
- Settings 확장, reports 테이블 + CRUD, PDF 업로드 저장, GeminiAnalyzer, GPTVerifier, ReportGenerator, 비동기 분석 파이프라인, Fallback & Retry, API 엔드포인트

**Phase 2 (Backend - Component Registry & Pipeline Builder)**: 6개 태스크
- ComponentRegistry + Compatibility Matrix, GET /api/v1/components, Build API validation, PipelineFactory 파라미터 오버라이드, POST /api/v1/reports/{id}/build, 기존 API deprecated 래핑

**Phase 3 (Frontend - Upload & Report Pages)**: 8개 태스크
- API proxy routes, TypeScript 타입, 업로드 페이지, 보고서 목록/상세 페이지, Custom hooks, Dashboard 수정, 사이드바 업데이트

**Phase 4 (Frontend - Pipeline Builder UI + Discovery 안내)**: 5개 태스크
- Pipeline Builder 페이지, 토폴로지 시각화, Deploy 버튼 + 상태 모니터링, Discovery 안내, API proxy route

### 5.2 PLAN_component-porting.md: 35개 태스크 완료

컴포넌트 포팅 계획도 5개 Phase, 35개 태스크가 **모두 완료(completed)** 상태이다.

**Phase 0 (사전 준비)**: 3개 태스크 - 디렉토리 생성, BaseQueryClassifier 확인, 스키마 import 경로 확인
**Phase 1 (순수 로직)**: 12개 태스크 - 4개 컴포넌트 각각 소스 분석 + 구현 + 단위 테스트
**Phase 2 (LLM 의존)**: 16개 태스크 - BaseLLMProvider + 4개 컴포넌트 각각 소스 분석 + 구현 + 단위 테스트
**Phase 3 (인프라 의존)**: 5개 태스크 - KoreanCrossEncoderReranker 구현 + 기존 공존 확인
**Phase 4 (StrategyEngine 연동)**: 5개 태스크 - ComponentRegistry, StrategyToConfigTranslator, PipelineFactory 확장, Build API 연동, 통합 테스트

### 5.3 phase1_e2e_plan.md: 생태계 통합 로드맵

이 문서는 analysis-platform을 넘어 **전체 SoundMind 생태계(9개 프로젝트)**의 통합 로드맵이다. 9개 Phase로 구성되며, analysis-platform은 Phase 1(E2E 동작 검증)에서 시작한다.

**Phase 1: E2E 동작 검증 (1~2일)**
- Task 1.1: Upload 파이프라인의 Chunker를 RecursiveCharacterTextSplitter -> StructureAwareChunker로 교체
- Task 1.2: WeaviateStore.add_chunks 구현 (현재 NotImplementedError)
- Task 1.3: 로컬 스모크 테스트 (Docker 없이 직접 실행)
- Task 1.4: Docker 빌드 + 배포 검증
- Task 1.5: Upload + Query 동작 검증 (StructureAwareChunker -> Weaviate indexing -> 쿼리 -> 답변)

**Phase 2: 플랫폼 간 연동 (2~3일)**: Registry API 확장, Pipeline Mapping, Query Proxy, 관리 UI
**Phase 3: 분과(Division) 메타데이터 (3~5일)**: Collection 레벨 분리로 분과별 문서 격리
**Phase 4: 실측 메트릭 수집 (3~5일)**: 이력서 수치화를 위한 7개 플랫폼 메트릭 수집 체계
**Phase 5: 크로스 플랫폼 통합 대시보드 (3~5일)**: 전체 생태계 운영 대시보드
**Phase 6: VLM 기반 Document Parsing (2~3주)**: 3-Mode 파싱 전략 (pymupdf4llm / vlm / hybrid)
**Phase 7: Pipeline 버전 관리 (1~2주)**: 다중 버전 동시 운영 + 롤백
**Phase 8: Prometheus + Grafana (1~2주)**: 운영 관측성 체계
**Phase 9: CI/CD (1주)**: 자동화된 테스트 + 빌드 + 배포

### 5.4 Document Parsing -> Chunking 전략 로드맵

phase1_e2e_plan.md에서 특히 주목할 부분은 **3-Mode 파싱 전략**이다:

| Mode | 파서 | 용도 | Phase |
|------|------|------|-------|
| `pymupdf4llm` (현재) | pymupdf4llm -> Markdown | 디지털 텍스트 PDF, 빠름 | Phase 1 |
| `vlm` (목표) | PDF -> 이미지 -> VLM API -> Markdown | 복잡 레이아웃, 표, 다이어그램 | Phase 6 |
| `hybrid` (최종) | pymupdf4llm -> 복잡 페이지만 VLM 재파싱 | 비용 최적화 (선택적 VLM) | Phase 6+ |

VLM 인프라는 이미 model-serving에 준비되어 있다:
- Qwen3-VL-30B-A3B-Thinking (고품질, GPU 0,1 TP=2)
- Qwen3-VL-8B-Thinking-FP8 (균형)
- Qwen3-VL-2B-Instruct (경량, 빠름)
- Granite-Docling-258M (초경량 문서 이해)

이 전략의 최종 목표는 **구조 인식 정확도 95점**이며, eval-platform의 A/B 테스트로 pymupdf4llm vs VLM 품질을 정량 비교한다.

### 5.5 실측 메트릭과 이력서 연결

phase1_e2e_plan.md의 Phase 4는 "이력서에 반영할 수치화 가능한 성능 데이터 수집 인프라 구축"을 명시적 목표로 한다. 즉시 확정 가능한 수치와 실측이 필요한 수치를 분리한다:

**즉시 확정 (코드베이스에서 추출)**:
- 코드 규모: ~9.4만 줄, 803개 소스 파일
- API 엔드포인트: 161개
- Docker 서비스: 15+ 컨테이너
- 동시 배포 가능 파이프라인: 최대 99개
- 테스트 케이스: 103+ 단위 테스트
- 모델 스토리지: 1.2TB
- 문서 파싱 지원 포맷: 7종

**실측 필요 (Phase 4 + Phase 6)**:
- 문서 분석 소요 시간 -> "PDF -> 전략 추천 N초 이내"
- RAG 평균 응답 시간 -> "RAG 응답 평균 N초"
- VLM 구조 인식 정확도 -> "VLM 파싱으로 구조 인식 N% 향상"
- A/B 테스트 개선률 -> "A/B 테스트로 품질 N% 향상"

---

## 6. Future Work: 미완성 로드맵

### 6.1 8-Phase 장기 로드맵

`future_work.md`는 Analysis Platform의 8단계 발전 로드맵을 정의한다:

| Phase | 내용 | 예상 기간 | 의존성 |
|-------|------|----------|--------|
| 1 | PipelineFactory 커스텀 조립 | 2~3주 | 없음 |
| 2 | 문서 분석 고도화 (LLM 기반) | 3~4주 | 없음 |
| 3 | 파이프라인 버전 관리 | 2~3주 | 없음 |
| 4 | 모니터링 통합 (Prometheus/Grafana) | 2~3주 | 인프라 |
| 5 | shared 패키지 pip 패키지화 | 1~2주 | Private PyPI |
| 6 | 멀티 VectorDB 지원 | 3~4주 | Phase 1 |
| 7 | Auto-scaling | 4~6주 | Phase 4 |
| 8 | CI/CD 파이프라인 | 2~3주 | Phase 5 |

**전체 예상: 약 6~8개월 (풀타임 1~2명 기준)**

### 6.2 의존성 그래프 분석

```
Phase 1 (커스텀 조립) --+
                        |--> Phase 6 (멀티 VectorDB)
Phase 2 (문서 분석) ----+

Phase 4 (모니터링) ---------> Phase 7 (Auto-scaling)

Phase 5 (pip 패키지화) -----> Phase 8 (CI/CD, publish 단계)

Phase 3 (버전 관리) --------- 독립
```

Q1(즉시 착수): Phase 1, 2, 3 -- 핵심 기능 강화
Q2(인프라 준비 후): Phase 4, 5, 8 -- 운영 기반 구축
Q3(안정화 후): Phase 6, 7 -- 확장성 확보

### 6.3 각 Phase의 기술적 깊이

**Phase 1 (PipelineFactory 커스텀 조립)**: 현재 "advanced" 또는 "structured" 중 하나를 통째로 선택하는 방식에서, `nodes` 배열로 개별 컴포넌트를 선택하여 동적 StateGraph를 조립하는 방식으로 전환. 이것은 rag_strategy_evolution.md의 Layer 3(Pipeline Assembly)와 직접 연동된다.

**Phase 2 (문서 분석 고도화)**: `DocumentAnalyzer`(정규식 기반) + `LLMAnalyzer`(미완성) -> 앙상블 결합 -> `StrategyRecommender`(가중치 학습). 문서 타입별 최적 전략 매핑 테이블(PDF->Structured+section_aware, XLSX->Structured+table_parsing 등). 이것은 rag_strategy_evolution.md의 Phase A(Document Intelligence)와 Phase B(Strategy Intelligence)에 해당한다.

**Phase 3 (파이프라인 버전 관리)**: 동일 파이프라인의 다중 버전 동시 배포 + 롤백. DB에 `version` 컬럼과 `is_active` 플래그를 추가하고, canary 배포(10% 트래픽)까지 지원. 이것은 실제 B2B SaaS 운영에서 필수적인 기능이다.

**Phase 5 (shared pip 패키지화)**: 현재 `sync-shared.sh`로 디렉토리를 rsync 복사하는 방식을 `pip install soundmind-shared`로 대체. 시맨틱 버전 관리 + Private PyPI 레지스트리. 이것은 9개 프로젝트 간 의존성 관리의 표준화이다.

**Phase 7 (Auto-scaling)**: 단일 컨테이너 -> 로드밸런서(Nginx/Traefik) + 다중 인스턴스. 스케일링 정책(응답시간 > 5초 -> scale-up, 응답시간 < 1초 10분 유지 -> scale-down). Phase 4(모니터링)의 메트릭 데이터에 의존.

### 6.4 future_work.md와 rag_strategy_evolution.md의 관계

두 문서는 상호 보완적이다:

| rag_strategy_evolution.md | future_work.md |
|---------------------------|----------------|
| Phase A (Document Intelligence) | = Phase 2 (문서 분석 고도화) 상세화 |
| Phase B (Strategy Intelligence) | = Phase 2의 확장 + 신규 |
| Phase C (Core Components) | 신규 (future_work.md에 없음) |
| Phase D (Pipeline Assembly) | = Phase 1 (커스텀 조립) 상세화 + 연동 |
| Phase E (Feedback Loop) | = Phase 4 (모니터링) 연동 + 신규 |

`rag_strategy_evolution.md`는 "RAG 전략의 지능화"라는 핵심 축을 다루고, `future_work.md`는 "플랫폼 전체의 운영 성숙도"라는 넓은 축을 다룬다. 두 문서를 결합하면 전체 진화 방향이 보인다.

---

## 7. 이력서 보충 스토리

### 7.1 프로젝트의 핵심 스토리라인

8개 문서를 종합하면, SoundMind Analysis Platform의 핵심 스토리는 다음과 같다:

> **"RAG 파이프라인 자체를 자동으로 설계하고 배포하는 메타 시스템을 단독 설계/구현했다."**

이것은 단순히 "RAG 시스템을 만들었다"보다 한 차원 높은 성취이다. 문서의 특성을 이해하고(Document Intelligence), 최적의 RAG 전략을 결정하고(Strategy Intelligence), 실행 가능한 파이프라인을 조립하여(Pipeline Assembly) Docker로 배포하는 전체 파이프라인을 자동화했다.

### 7.2 기술적 차별화 포인트

**1. Dual-LLM 교차 검증 아키텍처**
- Gemini(PDF 네이티브, 시각적 구조 인식) + GPT-4o(텍스트 기반 교차 검증)
- 단일 LLM 편향을 보정하는 이중 검증 구조
- JSON Structured Outputs + 2회 재시도 + 규칙 기반 폴백으로 LLM 출력 안정성 확보
- 이력서 표현: "Dual-LLM 교차검증 파이프라인 (Gemini PDF 네이티브 + GPT-4o 텍스트 검증)"

**2. 파이프라인 팩토리 자동화**
- 분석 결과에서 원클릭으로 Docker 컨테이너 배포
- Jinja2 템플릿 기반 docker-compose + Dockerfile 동적 렌더링
- 포트 자동 할당(9201~9299) + asyncio.Lock 동시성 보호
- 헬스 체크 폴링(최대 60초) + 자동 상태 업데이트
- 이력서 표현: "Docker 원클릭 배포 자동화 (최대 99개 동시 파이프라인)"

**3. 3-Layer Strategy Architecture 설계**
- Document Intelligence -> Strategy Intelligence -> Pipeline Assembly 3계층
- 4차원 전략 공간 (Chunking x Retrieval x Indexing x Post-Processing)
- 하이브리드 매핑 (규칙 기반 후보 생성 + LLM 기반 최종 선택)
- RAG Strategy Knowledge Base 설계
- 이력서 표현: "3-Layer RAG Strategy Architecture 설계 (Document Intelligence -> Strategy Intelligence -> Pipeline Assembly)"

**4. 컴포넌트 포팅 및 아키텍처 통합**
- urstory-rag에서 10개 컴포넌트를 soundmind ABC 규약으로 변환/이식
- Protocol(duck typing) -> ABC(상속), async -> sync 변환
- 기존 파이프라인 무영향 보장 (신규 파일만 추가)
- StrategyEngine -> ComponentRegistry -> PipelineFactory 연동
- 이력서 표현: "10종 RAG 컴포넌트 이식 (Chunker, Retriever, Reranker, QueryProcessor, PostProcessor)"

**5. 3-Mode Document Parsing 전략**
- pymupdf4llm(텍스트 좌표) -> VLM(시각적 이해) -> Hybrid(선택적 VLM)
- VLM 인프라 보유: Qwen3-VL-30B/8B/2B + Granite-Docling-258M
- eval-platform A/B 테스트로 정량 비교 (구조 인식 정확도 95점 목표)
- 이력서 표현: "3-Mode Document Parsing (pymupdf4llm / VLM / Hybrid), VLM 도입으로 구조 인식 정확도 향상"

**6. 클린 아키텍처 기반 패키지 설계**
- rag-core(추상 인터페이스) -> components(구현체) -> pipelines(오케스트레이션) -> analysis_service(애플리케이션) 4계층
- uv 워크스페이스로 5개 패키지 모노레포 관리
- shared 패키지 크로스 플랫폼 동기화 (sync-shared.sh -> pip 패키지화 예정)
- 이력서 표현: "Clean Architecture 기반 RAG 패키지 설계 (4계층, 5패키지 모노레포)"

### 7.3 9개 프로젝트 생태계에서의 위치

Analysis Platform은 SoundMind 생태계(9개 프로젝트)에서 **중앙 허브** 역할을 한다:

```
                    ai-console (통합 UI)
                         |
ai-platform <--[Discovery]--> analysis-platform <--[평가]--> eval-platform
  (B2B SaaS)              (파이프라인 팩토리)              (품질 평가)
                              |
                    model-serving (vLLM, VLM)
                              |
                    model-storage (1.2TB)
```

- **ai-platform -> analysis-platform**: Registry API 폴링으로 배포된 파이프라인 자동 발견, 질의 프록시
- **analysis-platform -> eval-platform**: 배포된 파이프라인의 품질 평가 (LLM-as-Judge, A/B 테스트)
- **analysis-platform -> model-serving**: VLM 기반 문서 파싱, vLLM 기반 RAG 생성
- **ai-console -> analysis-platform**: 웹 UI에서 업로드/분석/빌드/배포 전 과정 관리

### 7.4 완성된 작업 vs 미완성 작업

**완료 (65/65 태스크)**:
- PLAN_analysis-platform-core.md: 30/30 태스크 (Backend Report & Analysis, Component Registry, Frontend Upload & Reports, Pipeline Builder UI)
- PLAN_component-porting.md: 35/35 태스크 (사전 준비, 순수 로직 4종, LLM 의존 5종, 인프라 의존 1종, StrategyEngine 연동)

**진행 예정 (phase1_e2e_plan.md)**:
- Phase 1: E2E 동작 검증 (StructureAwareChunker 교체, WeaviateStore 구현, 스모크 테스트)
- Phase 2~9: 플랫폼 연동, 분과 메타데이터, 메트릭 수집, 통합 대시보드, VLM 파싱, 버전 관리, Prometheus, CI/CD

**장기 비전 (rag_strategy_evolution.md + future_work.md)**:
- 3-Layer Strategy Architecture 완성
- 4차원 전략 공간의 컴포넌트 전부 구현
- Feedback Loop으로 자기 개선 시스템
- Auto-scaling, 멀티 VectorDB, pip 패키지화

### 7.5 이력서 종합 문구 (보충)

기존 이력서 문구에 이 보고서의 분석을 반영하면:

```
SoundMind Analysis Platform | Sole Architect & Developer | 2025.07 - 현재

엔터프라이즈 RAG 파이프라인 팩토리 플랫폼 단독 설계/구현/운영
9개 프로젝트 생태계의 중앙 허브, 문서 분석 -> 전략 추천 -> 파이프라인 자동 배포

핵심 성과:
  - Dual-LLM 교차검증 분석 파이프라인 (Gemini PDF 네이티브 + GPT-4o 텍스트 검증)
    3단계 폴백 + JSON Structured Outputs로 분석 안정성 확보
  - Docker 원클릭 배포 자동화 (Jinja2 템플릿, 최대 99개 동시 파이프라인)
    포트 자동 할당 + asyncio.Lock 동시성 보호 + 헬스 체크 폴링
  - 3-Layer RAG Strategy Architecture 설계
    Document Intelligence -> Strategy Intelligence -> Pipeline Assembly
    4차원 전략 공간 (Chunking x Retrieval x Indexing x Post-Processing)
  - 10종 RAG 컴포넌트 이식 (urstory-rag -> soundmind ABC 규약 변환)
    StructureAwareChunker, QualityGate, KoreanCrossEncoderReranker,
    ContextualEnrichment, MultiQuery, HyDE, CitationExtractor 등
  - 3-Mode Document Parsing 설계 (pymupdf4llm / VLM / Hybrid)
    4종 VLM (Qwen3-VL-30B/8B/2B, Granite-Docling) 연동
  - Clean Architecture 기반 패키지 설계
    rag-core(ABC) -> components(구현) -> pipelines(오케스트레이션) 4계층
    uv 워크스페이스 5패키지 모노레포, shared 패키지 크로스 플랫폼 동기화

기술적 의사결정:
  - Pull-based Discovery 채택 (PUSH 등록 과잉 설계 식별 및 제거)
  - 고정 토폴로지 + 파라미터 튜닝 범위 결정 (동적 토폴로지 의도적 제외)
  - Compatibility Matrix 검증 (LLM 프롬프트 + Build API 이중 검증)
  - 동기/비동기 하이브리드 (ABC는 sync 유지, LLM 컴포넌트만 async 옵셔널)
  - 런타임 Docker Compose 분리 (git 관리 vs 런타임 생성 충돌 방지)

Tech: FastAPI, Python 3.11, Next.js 15, React 19, TypeScript,
     LangGraph, Docker Compose, SQLite, Weaviate, Qdrant,
     Gemini 2.5-flash, GPT-4o, Infinity, Jinja2, uv, pdfplumber
```

### 7.6 프로젝트가 보여주는 역량

이 프로젝트를 통해 입증되는 역량을 정리하면:

1. **시스템 설계 역량**: 단일 서비스가 아닌 9개 프로젝트 생태계의 아키텍처를 설계하고, 서비스 간 통신(Pull-based Discovery), 데이터 동기화(shared 패키지), 인프라 분리(control plane vs data plane)를 체계적으로 구현
2. **LLM 엔지니어링 역량**: Dual-LLM 교차 검증, Structured Outputs, JSON 파싱 안정성, 프롬프트 설계(분석과 추천 분리), 폴백 전략
3. **RAG 전문성**: 4차원 전략 공간 정의, 20+ 종의 RAG 전략 분류 및 적합성 매핑, 10종 컴포넌트 구현/이식
4. **운영 성숙도**: graceful degradation, 포트 동시성 보호, 서버 재시작 시 일관성 보장, 헬스 체크 폴링, deprecated API 래핑
5. **풀스택 구현 능력**: Backend(FastAPI), Frontend(Next.js 15/React 19), Infrastructure(Docker Compose), Database(SQLite/PostgreSQL/Weaviate/Qdrant) 전 영역 단독 구현
6. **문서화 및 기획 역량**: PRD, 기술 설계, 태스크 계획, 장기 로드맵까지 체계적으로 문서화. Digging Review를 통한 설계 품질 개선.
