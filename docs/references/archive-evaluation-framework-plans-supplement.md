# [Legacy] RAG Evaluation Framework - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

RAG Evaluation Framework는 RAG 파이프라인을 노드 수준에서 개별 평가하고, A/B 테스트를 통해 파이프라인 간 성능을 비교하며, Interactive Playground UI를 제공하는 포괄적 평가 프레임워크이다. 현재 archive 상태이며, 핵심 기능이 SoundMind Eval Platform으로 이관되었다.

**기술 스택**: Python 3.11+ / FastAPI 0.109+ / Streamlit 1.30+ / LangChain 0.1+

**평가 체계 (Node-level Evaluation)**:
```
Document -> [Chunking] -> [Embedding] -> [VectorDB] -> [Retrieval] -> [Generation]
                |                          |              |            |
                v                          v              v            v
           BC/CS Score              MRR/NDCG/P/R      LLM Judge    RAGAS
           (Chunking)               (Retrieval)     (Generation)   (E2E)
```

**평가 메트릭 전체 목록**:
- Chunking: BC Score(Boundary Coherence), CS Score(Chunk Similarity)
- Retrieval: MRR, NDCG@k, Precision@k, Recall@k, Hit Rate@k
- Generation: LLM-as-a-Judge (Relevance 0.25, Faithfulness 0.30, Coherence 0.15, Fluency 0.10, Completeness 0.20)
- E2E: RAGAS (Faithfulness, Answer Relevance, Context Precision/Recall)

**A/B 테스트**: Paired t-test, Independent t-test, Wilcoxon, Mann-Whitney U + Cohen's d + Holm-Bonferroni 보정

**파이프라인**: Naive(Fixed-size chunking, Dense search, No reranking) vs Advanced(Semantic chunking, Hybrid search with RRF, Query rewrite, Optional reranking)

**인프라**: Redis 캐싱(Circuit Breaker 패턴), API Gateway(인증, Rate Limiting, 요청 로깅), Playground UI(Interactive node testing + pipeline building)

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 PRD v2.0 (Node API 평가 프레임워크): 두 가지 핵심 문제 식별

**문제 1: Chunking 전략 불일치**
- test-vlm-document-parsing: 커스텀(sentence-transformers), threshold=0.3 고정, all-MiniLM-L6-v2
- soundmind-ai-platform: langchain_experimental.SemanticChunker, percentile threshold=0.90, bge-m3
- 결론: VLM 파싱 품질이 좋아도 실제 RAG에서 Semantic Chunking이 동작하는지 검증 불가

**문제 2: RAG 평가 체계 부재**
- Advanced RAG vs Naive RAG 성능 향상 정량적 측정 불가
- 어떤 노드(QueryRewrite, Retriever, Generator)가 성능에 기여하는지 파악 불가
- 노드 변경 시 전체 파이프라인 영향 측정 불가

**설계 원칙 4가지**: 완전 독립(별도 레포, 별도 Docker Compose), 비침투적(기존 RAG Service 코드 수정 없음), 재현 가능(Tech Report 작성을 위한 실험 재현성), 유연한 연결(Standalone/Integrated 모드)

### 2.2 RAG Playground Platform PRD: UI/API/캐시 고도화

**4가지 문제 진단**:
1. Streamlit UI 한계: 단일 파일 926줄, Node별 자유 조합/디버깅/실시간 피드백 어려움
2. API Gateway 부재: 인증/Rate Limiting/캐싱 없음
3. 결과 캐싱 없음: 동일 설정 반복 실행 시 매번 LLM/VectorDB 호출
4. 파이프라인 노드 결합도: 개별 노드 독립 테스트 어려움

**Node Protocol 설계**: BaseNode ABC (execute, validate, get_schema) + NodeRegistry(동적 등록/조회) + Pydantic I/O Schema로 모든 노드를 모듈화

**Redis 캐시 키 전략**: `rag:cache:{node_type}:{config_hash}:{input_hash}` - 노드 타입별 TTL 차별화 (Chunking 24h, Retrieval 1h, Generation 6h)

### 2.3 Architecture Decision Records (ADR)

실험 노트북의 결과를 근거로 기술 선택을 기록하는 체계를 설계했다:
```
notebooks/XX_comparison.ipynb -> results/XX/comparison.csv -> docs/decisions/ADR-XXX.md
       (실험 실행)                    (정량적 근거)                  (의사결정 기록)
```

예상 ADR: 청킹 전략, 임베딩 모델, 검색 전략, 리랭커 적용 여부, 생성 모델, E2E 파이프라인 최종 구성

### 2.4 Tech Report: 한국어 문서 RAG 파이프라인 최적화 실험

**규모**: 한국어 공공/기술 문서 11건(243MB, 3,678페이지), 81개 Q&A GT 쌍, 8단계 실험

**핵심 실험 결과**:

| 단계 | 결론 |
|------|------|
| 청킹 | Recursive 최적 (Semantic 대비 600배 빠르면서 커버리지 유사) |
| 임베딩 | BGE-M3 (1024d), Hit@10=0.778, MRR=0.674 |
| 검색 | Dense가 Hybrid 대비 MRR +2.3%p, 지연시간 최저 |
| 리랭킹 | MRR +3.9%p 향상이나 지연시간 2.8배 증가, 통계적 유의성 없음 |
| 생성 | Qwen3-235B, Judge 종합 0.786 |
| E2E | Naive vs Advanced 유의미한 차이 없음 (TIE) |
| Ablation | 리랭킹 +12.8%p(핵심), 쿼리분해 -6.8%p(해로움) |

**예상 밖의 발견**:
- 쿼리 분해(Query Decomposition) 제거 시 오히려 성능 상승: 서브쿼리 품질 문제, 정보 희석, GT의 81%가 Easy/Medium
- Dense vs Hybrid 단계별 불일치: 단독 검색에서는 Dense > Hybrid, E2E에서는 Hybrid > Dense
- ROUGE-L(0.0501)/BLEU(0.0018) 사실상 무의미 -> LLM Judge를 주 메트릭으로 사용해야 함

---

## 3. Future Work / 로드맵

이 프로젝트는 archive 상태이므로 향후 작업은 SoundMind Eval Platform으로 이관된다. Tech Report에서 제시한 향후 과제:

1. 데이터셋 확장: 최소 500개 이상 Q&A 쌍으로 통계적 검정력 확보
2. 멀티홉 질문 평가: 쿼리 분해 효과 재검증
3. 임베딩 모델 다양화: KoSimCSE, multilingual-e5 비교
4. 경량 모델 탐색: 7B~32B급 품질-비용-지연시간 Pareto 최적 탐색
5. 인간 평가 도입: LLM Judge 신뢰도 검증
6. 문서 유형별 적응형 청킹: 법령은 조문 단위, 매뉴얼은 섹션 단위

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "독립 프레임워크로 설계한 이유"**
기존 soundmind-ai-platform의 RAG 서비스 코드를 수정하지 않으면서 평가 체계를 구축해야 했다. 프로덕션 서비스에 평가 코드를 삽입하면 서비스 안정성에 영향을 줄 수 있고, 실험 재현성도 보장하기 어렵다. 별도 레포지토리, 별도 Docker Compose로 완전히 분리함으로써 "비침투적 평가"를 실현했다.

**2. "Standalone/Integrated 이중 모드의 배경"**
Standalone 모드(OpenAI + ChromaDB)는 GPU 없이도 즉시 실험 가능한 경량 환경이다. Integrated 모드(vLLM + Weaviate + Redis)는 실제 프로덕션과 동일한 스택으로 평가한다. 이중 모드는 "로컬 개발 -> 서버 배포" 워크플로우를 지원하기 위한 설계이다.

**3. "Node-level 평가의 가치"**
E2E 평가만으로는 "어떤 컴포넌트가 병목인가?"를 알 수 없다. Ablation Study에서 리랭킹 제거 시 12.8%p 하락, 쿼리 분해 제거 시 6.8%p 상승이라는 결과는 Node-level 평가 없이는 발견할 수 없는 인사이트이다. 특히 쿼리 분해가 "오히려 해로운" 컴포넌트였다는 발견은, 전체 파이프라인 점수만 봐서는 절대 알 수 없었을 것이다.

**4. "ROUGE/BLEU가 한국어 RAG에서 무의미하다는 실증"**
ROUGE-L 0.0501, BLEU 0.0018이라는 극도로 낮은 수치와 LLM Judge 0.786의 괴리는, 참조 기반 메트릭이 한국어 생성 평가에 부적합하다는 것을 정량적으로 입증한 것이다. 이 발견이 Eval Platform의 평가 방법론(LLM-as-Judge 중심)을 결정하는 근거가 되었다.

**5. "Circuit Breaker 패턴을 Redis 캐시에 적용한 이유"**
Redis가 장애 시 캐시 레이어가 시스템 전체를 멈추는 Single Point of Failure가 되지 않도록, Circuit Breaker를 적용하여 Redis 장애 시 캐시를 우회하고 직접 실행하는 graceful degradation을 구현했다.

**6. "ADR(Architecture Decision Records) 도입의 의미"**
실험 노트북 -> 정량적 결과 -> 의사결정 기록이라는 흐름은, "왜 이 기술을 선택했는가?"를 추적 가능하게 만든다. 특히 Tech Report용 실험에서 이 체계가 있으면 논문 수준의 재현성과 근거 제시가 가능하다.

**7. "프로젝트가 archive된 이유와 레거시 가치"**
이 프레임워크에서 검증된 평가 방법론(LLM-as-Judge, A/B 테스트 통계 검증, Node-level 평가)과 실험 결과(Tech Report)가 SoundMind Eval Platform의 설계 근거가 되었다. 코드는 archive되었지만, 축적된 지식과 방법론은 새 플랫폼에 이식되었다. 8단계 실험 파이프라인과 81개 GT 데이터셋은 향후 벤치마크 데이터로 재활용 가능하다.
