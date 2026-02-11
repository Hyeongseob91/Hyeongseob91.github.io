/**
 * Portfolio Scripts
 * - Navbar scroll effect
 * - Mobile menu toggle
 * - Scroll animations (Intersection Observer)
 * - Project modal
 * - Smooth scrolling
 */

document.addEventListener('DOMContentLoaded', function() {

  // =====================================================
  // NAVBAR SCROLL EFFECT
  // =====================================================
  const navbar = document.getElementById('navbar');
  const heroSection = document.getElementById('hero');

  function handleNavbarScroll() {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // =====================================================
  // MOBILE MENU TOGGLE
  // =====================================================
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navToggle.classList.contains('open'));
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  // =====================================================
  // SMOOTH SCROLLING
  // =====================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // =====================================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // =====================================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .timeline__item');
  animatedElements.forEach(el => observer.observe(el));

  // =====================================================
  // ACTIVE NAVIGATION LINK
  // =====================================================
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.navbar__link');

  function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinksAll.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);
  highlightNavLink(); // Initial check

  // =====================================================
  // PROJECT FILTER
  // =====================================================
  const filterButtons = document.querySelectorAll('.projects__filter-btn');
  const projectCardsAll = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(b => b.classList.remove('projects__filter-btn--active'));
      this.classList.add('projects__filter-btn--active');

      // Filter projects
      const filter = this.dataset.filter;

      projectCardsAll.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('project-card--hidden');
        } else {
          card.classList.add('project-card--hidden');
        }
      });
    });
  });

  // =====================================================
  // PROJECT MODAL
  // =====================================================
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalMeta = document.getElementById('modalMeta');
  const modalContent = document.getElementById('modalContent');
  const modalTags = document.getElementById('modalTags');

  // Project data
  const projectData = {
    'soundmind-platform': {
      title: 'Soundmind AI Platform',
      image: 'images/companies/soundmind.png',
      meta: {
        organization: 'Soundmind-Labs',
        role: 'Project Lead / Tech Lead',
        period: '2025.11 ~ 현재',
        architecture: 'MSA + Clean Architecture + Docker Compose',
        team: '1인 (기획·설계·구현·배포 전체)',
        contribution: '100%'
      },
      disclaimer: {
        show: true,
        text: '본 프로젝트는 Soundmind-Labs 소속 AI Research Engineer로서, Project Lead로 진행하는 AI Platform을<br>End-to-End로 직접 기획·설계·구현·배포까지의 종합 Pipeline 과정을 개인 역량 설명 목적으로 재구성하였습니다.<br>상용 소스코드 및 영업 정보는 포함되어 있지 않으며 시스템 엔지니어링 설계의 의사결정 경험만을 중심으로 정리했습니다.'
      },
      sections: [
        {
          title: 'Try Demo',
          highlight: true,
          content: '<a href="http://work.soundmind.life:12320" target="_blank" rel="noopener noreferrer"><strong>work.soundmind.life:12320</strong></a> 으로 접속하여 Try Demo 버튼을 통해 Guest Mode 체험이 가능합니다.'
        },
        {
          title: 'Problem — 왜 이 플랫폼을 만들어야 했는가',
          subsections: [
            {
              subtitle: 'Company Context',
              content: 'Soundmind는 음성 AI 칩 설계 전문가를 보유한 음성 관련 전문회사이자, 삼성전자 B2B 한국 파트너로서 특화폰 관련 SI 사업을 진행하는 기업입니다. AI 전문 인력으로 리더십을 구성하고, NLP·CV 영역으로 사업을 확장하기 시작하면서 NLP 팀에 합류하게 되었습니다.'
            },
            {
              subtitle: 'Problem — 기초 기술 부재와 다수 프로젝트 수주',
              content: 'NLP 팀에는 Agent 개발 능력, RAG Pipeline 등 기초 기술이 없는 상태였습니다. 기술 경쟁력 확보와 PoC를 위한 프로토타입 구축이 시급했습니다. 그런데 수주한 프로젝트 수는 많았고, 각 고객사마다 요구사항이 달랐기 때문에 개별 대응에는 한계가 있었습니다.'
            },
            {
              subtitle: 'Why Platform — 내가 제안한 해결책',
              content: '고객사별로 별도 개발하는 대신, <strong>하나의 플랫폼에서 신규 고객이 직접 체험할 수 있는 Playground를 제공하고, 고객사 ID에 따라 RAG Pipeline만 다르게 구성</strong>하면 훨씬 효율적으로 대응할 수 있다고 판단했습니다. 즉, 우리 기술 엔진을 납품받는 고객사(데이터센터 운영사)가 자사의 고객에게 AI 기술을 시연하고 영업할 수 있는 <strong>B2B2B 영업 도구</strong>를 만드는 것입니다. 이 아이디어를 직접 제안하고 설계·구현까지 주도하여 현재의 Soundmind AI Platform을 만들어냈습니다.'
            }
          ]
        },
        {
          title: 'Solution — Soundmind AI Platform',
          subsections: [
            {
              subtitle: 'Platform Overview',
              content: '기술 엔진 납품 고객사가 자사 고객에게 AI 기술을 시연할 수 있는 <strong>B2B2B Playground 플랫폼</strong>입니다. 관리자 모드를 통해 포탈별 Agent 구성과 사용자 관리가 가능하며, 완전한 영업 도구로 서비스 런칭을 앞두고 있습니다.',
              list: [
                '<strong>RAG Agent:</strong> 문서 기반 질의응답. Hybrid Search + Reranking + Streaming Generation으로 신뢰할 수 있는 답변과 근거를 제공',
                '<strong>AI Agent:</strong> Built-in Tools + Select Tools를 기반으로 고객 맞춤형 Agent를 빌드하여 PoC 가능. 업무 자동화, 데이터 분석 등 다양한 태스크 수행',
                '<strong>Admin Mode:</strong> 포탈 관리, 사용자 권한, Agent 설정을 제어하는 관리자 전용 모드. B2B 영업 시 고객사별 독립 환경 구성 가능'
              ]
            },
            {
              subtitle: 'Core Value',
              content: '2중 구조의 B2B2B 영업 도구. 기술적으로는 "왜 이 답이 나왔는지" 검증 가능한 UX를 제공하고, 비즈니스적으로는 고객사가 자사 고객에게 직접 기술력을 시연하여 영업 계약을 견인할 수 있는 전략적 자산입니다.'
            }
          ]
        },
        {
          title: 'Architecture Overview',
          image: {
            src: 'images/projects/soundmind_ai_platform_architecture.png',
            alt: 'Soundmind AI Platform Architecture',
            caption: 'System Architecture: Client → API Gateway → Services (RAG + AI Agent) → Data (PostgreSQL + Weaviate) → Model Serving (vLLM + Infinity)'
          },
          list: [
            'Presentation Layer: React 19 + TypeScript Web Console (RAG Agent, Chat Agent, Admin)',
            'API Gateway Layer: FastAPI BFF + SSE Streaming + Think Tag Parsing',
            'Service Layer: RAG Pipeline Advanced (LangGraph) + Chat Agent (ReAct + MCP Tools)',
            'Data Layer: Weaviate (Hybrid Search) + Redis (Session Persistence)',
            'External Model Services: vLLM (Qwen3-235B / R1-Llama-70B / VL-30B / 235B-NVFP4), Infinity (BGE-M3 + Reranker)'
          ]
        },
        {
          title: 'Model & Infra Specs',
          subsections: [
            {
              subtitle: 'Model Stack',
              list: [
                '<strong>LLM (Local):</strong> Qwen3-235B · Qwen3-235B-NVFP4 · DeepSeek-R1-Llama-70B · Qwen3-VL-30B (vLLM Serving)',
                '<strong>LLM (API):</strong> OpenAI GPT-4o · Google Gemini 2.5 Flash (Multi-Provider)',
                '<strong>Embedder:</strong> BGE-M3 (Infinity Framework, 1024-dim, Dense + Sparse 동시 지원)',
                '<strong>Reranker:</strong> BGE-Reranker-v2-M3 (Cross-Encoder, Infinity Framework)',
                '<strong>OCR:</strong> PaddleOCR 3.3.0 (스캔 PDF 한국어 지원)'
              ]
            },
            {
              subtitle: 'Infra Specs',
              list: [
                '<strong>GPU Server:</strong> Multi-GPU Server (High-end Workstation)',
                '<strong>Vector DB:</strong> Weaviate (Hybrid Search: BM25 + HNSW)',
                '<strong>Container:</strong> Docker Compose 기반 MSA 오케스트레이션',
                '<strong>Streaming:</strong> SSE (Server-Sent Events) 기반 Token Streaming'
              ]
            }
          ]
        },
        {
          title: 'Service Flow',
          gallery: [
            {
              src: 'images/projects/soundmind_rag_agent_loginpage.png',
              alt: 'Login Page',
              caption: '1. Login Page - 사용자 인증 화면'
            },
            {
              src: 'images/projects/soundmind_rag_agent_portalpage.png',
              alt: 'Portal Page',
              caption: '2. Portal Page - AI Agent 서비스 선택'
            },
            {
              src: 'images/projects/soundmind_rag_agent_dashboardpage.png',
              alt: 'RAG Agent Dashboard',
              caption: '3. RAG Agent Dashboard - 메인 작업 화면'
            },
            {
              src: 'images/projects/soundmind_rag_agent_model_inference.png',
              alt: 'RAG Agent Dashboard',
              caption: '4. RAG Agent Dashboard - 실시간 모델 추론 상태 표시'
            },
            {
              src: 'images/projects/soundmind_rag_agent_userexprience.png',
              alt: 'Dashboard User Experience',
              caption: '5. RAG Agent Dashboard - 모델 응답 및 인터랙티브 UX'
            },
            {
              src: 'images/projects/soundmind_rag_agent_reference.png',
              alt: 'Dashboard User Experience',
              caption: '6. RAG Agent Dashboard - 자료 출처 및 근거 문서 표시'
            }
          ],
          subsections: [
            {
              subtitle: 'Key Features',
              list: [
                'RAG Knowledge Base: 문서 업로드 및 청킹 상태 관리',
                'RAG Agent: 실시간 채팅 인터페이스 + Thought Process 표시',
                'RAG Pipeline: Latency 확인 및 처리 과정 시각화',
                'Retrieval Insight: Query Transformation, Hybrid Search Score, Reranking 결과',
                'Token Usage: 실시간 토큰 사용량 모니터링'
              ]
            }
          ]
        },
        {
          title: 'Deep Dive',
          subsections: [
            {
              subtitle: '1. Semantic Chunking + Safety Guard',
              list: [
                '의미 단절점(Breakpoint: 0.90) 기반 문서 분할',
                '2-Stage Chunking 구조로 너무 큰 청크는 재분할, 너무 작은 청크는 병합하여 검색 안정성 확보'
              ]
            },
            {
              subtitle: '2. Advanced Hybrid Retrieval',
              list: [
                'LLM 기반 Multi-Query Rewrite로 1개의 User Query를 5개의 다양한 Query로 Expasion',
                'Dense(의미적 유사도) + Sparse(키워드 매칭) 검색 결과를 RRF 알고리즘으로 결합',
                'Cross-encoder기반 Reranking 모델로 Top-K 정밀도 향상'
              ]
            },
            {
              subtitle: '3. Observability & Trust UX',
              list: [
                'SSEvent 기반 Token Streaming 응답 처리',
                '파이프라인 단계별 상태 이벤트 프로토콜 정의 & Latency 모니터링 및 처리 과정 시각화',
                'Retrieval Insight 패널을 통해 Query Transformation, Hybrid Search Score, Reranking 결과를 시각화'
              ]
            }
          ]
        },
        {
          title: 'LLM Performance & Latency Trade-off',
          subsections: [
            {
              subtitle: '모델 스케일업에 따른 변화',
              content: '초기에는 Qwen3-30B 모델로 서비스했으며, 응답 속도가 매우 빨라 사용자 경험이 좋았습니다. 그러나 답변 품질(정확도, 지시 이행력, 한국어 자연스러움)에서 한계가 있었고, 고객사 PoC를 통과하기 위해 더 높은 품질이 요구되었습니다.'
            },
            {
              subtitle: '30B → 235B 전환 결과',
              content: '<table><thead><tr><th>항목</th><th>Qwen3-30B</th><th>Qwen3-235B</th></tr></thead><tbody><tr><td>답변 품질</td><td>보통</td><td><strong>우수</strong></td></tr><tr><td>한국어 자연스러움</td><td>어색한 표현 빈번</td><td><strong>자연스러운 문장 생성</strong></td></tr><tr><td>지시 이행력</td><td>간혹 형식 무시</td><td><strong>지시사항 정확 반영</strong></td></tr><tr><td>TTFT (Time to First Token)</td><td><strong>~200ms</strong></td><td>~800ms</td></tr><tr><td>Throughput</td><td><strong>~60 tok/s</strong></td><td>~25 tok/s</td></tr></tbody></table>'
            },
            {
              subtitle: '현재 운영 전략',
              list: [
                '기본 모델은 <strong>Qwen3-235B</strong>로 설정하여 답변 품질을 우선 확보',
                'Latency 민감 시나리오(간단 질의, 분류 태스크)에는 <strong>30B 또는 NVFP4 양자화 모델</strong>로 라우팅',
                'Thinking Model(DeepSeek-R1-Llama-70B)은 복합 추론이 필요한 경우에만 선택적으로 사용',
                'SSE Streaming으로 체감 대기 시간을 최소화하여 TTFT 증가 영향을 완화'
              ]
            }
          ]
        }
      ],
      tags: ['LangGraph', 'RAG', 'ReAct Agent', 'Weaviate', 'FastAPI', 'React 19', 'Docker Compose', 'SSE', 'vLLM', 'MCP', 'RAGAS']
    },
    'rag-evaluation': {
      title: 'RAG Evaluation Framework',
      image: 'images/projects/rag-evaluation-framework-dashboard.png',
      meta: {
        organization: 'Soundmind-Labs → Open Source',
        role: '1인 개발 (기획, 설계, 구현)',
        period: '2026.01 ~ 현재',
        architecture: 'FastAPI + Streamlit + Redis + Weaviate',
        team: '1인',
        contribution: '100%'
      },
      sections: [
        {
          title: 'Problem — B2B 납품 전, 성능을 어떻게 증명할 것인가',
          subsections: [
            {
              subtitle: 'Business Context',
              content: 'Soundmind AI Platform의 RAG Agent는 B2B 영업 도구로 고객사에 납품될 예정입니다. 고객사에 "우리 RAG가 잘 동작합니다"라고 말하는 것과, Faithfulness 0.85, Context Precision 0.92 같은 정량 지표로 증명하는 것은 전혀 다릅니다. 납품 전에 Retriever와 Generator 각각의 성능을 객관적으로 입증할 수 있는 평가 체계가 필요했습니다.'
            },
            {
              subtitle: 'Technical Challenge',
              content: '기존 RAG 평가 도구들은 E2E(End-to-End) 점수만 제공하여 "어디서 문제가 발생하는지" 알 수 없었습니다. Chunking이 잘못된 건지, Retriever가 약한 건지, Generator 프롬프트가 문제인지 구분해야 개선 방향을 잡을 수 있습니다. 파이프라인의 각 Node별로 독립적인 평가가 가능하고, A/B 테스트로 변경 사항의 통계적 유의성까지 검증할 수 있는 프레임워크가 필요했습니다.'
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'Node-based Evaluation Architecture',
              content: 'BaseNode ABC 기반의 Node Registry Pattern으로 RAG 파이프라인의 각 단계를 독립적으로 평가할 수 있는 구조를 설계했습니다.',
              list: [
                '<strong>Chunking 평가:</strong> BC Score(Boundary Coherence), CS Score(Chunk Similarity)로 청킹 품질 측정',
                '<strong>Retrieval 평가:</strong> MRR, NDCG@k, Precision@k, Recall@k + 95% 신뢰구간',
                '<strong>Generation 평가:</strong> ROUGE-L, Cosine Similarity, Token 통계',
                '<strong>E2E 평가:</strong> RAGAS(Faithfulness, Answer Relevancy, Context Precision/Recall)'
              ]
            },
            {
              subtitle: 'LLM-as-a-Judge',
              list: [
                'Relevance(0.25), Faithfulness(0.30), Coherence(0.15), Fluency(0.10), Completeness(0.20) 가중 평가',
                '평가 신뢰도(Confidence) 추적 및 토큰 사용량 모니터링'
              ]
            },
            {
              subtitle: 'A/B Testing Framework',
              list: [
                'Paired t-test, Wilcoxon, Mann-Whitney U 등 통계 검정',
                'Cohen\'s d 효과 크기 분석 (small/medium/large 해석)',
                'Bonferroni, Holm-Bonferroni 다중 비교 보정'
              ]
            }
          ]
        },
        {
          title: 'Key Decisions',
          subsections: [
            {
              subtitle: '왜 Node Registry Pattern을 선택했는가?',
              content: '<strong>선택지:</strong> 고정 파이프라인 vs Node Registry<br><strong>판단 근거:</strong> RAG 파이프라인은 Chunking → Retrieval → Reranking → Generation의 순서가 고정적이지만, 각 단계의 전략(예: Fixed-size vs Semantic Chunking)을 자유롭게 교체하며 비교 실험해야 했습니다. Node Registry Singleton으로 노드를 독립적으로 등록/교체할 수 있는 구조를 선택했습니다.<br><strong>결과:</strong> Naive Pipeline(Fixed-size + Dense)과 Advanced Pipeline(Semantic + Hybrid + Reranking)을 동일 프레임워크에서 A/B 테스트 가능'
            },
            {
              subtitle: '왜 Redis Circuit Breaker를 도입했는가?',
              content: '<strong>문제:</strong> 반복 실험 시 Redis 장애가 전체 평가를 중단시키는 상황 발생<br><strong>해결:</strong> Circuit Breaker 패턴으로 Redis 장애 시 자동 fallback. 5회 연속 실패 시 회로 차단, 지수 백오프로 재시도<br><strong>결과:</strong> 인프라 장애와 독립적으로 평가 실험 지속 가능'
            }
          ]
        },
        {
          title: 'Architecture & Pipeline',
          subsections: [
            {
              subtitle: 'Built-in Pipeline Presets',
              image: {
                src: 'images/projects/rag-evaluation-framework-pipeline.png',
                alt: 'Naive vs Advanced Pipeline 비교',
                caption: 'Naive Pipeline Flow vs Advanced Pipeline Flow'
              },
              list: [
                '<strong>Naive Pipeline:</strong> Fixed-size Chunking → Dense Retrieval → Generation (Baseline)',
                '<strong>Advanced Pipeline:</strong> Semantic Chunking → Query Rewrite → Hybrid Search(Dense+BM25+RRF) → Cross-encoder Reranking → Generation'
              ]
            },
            {
              subtitle: 'Chunking Strategy Comparison',
              image: {
                src: 'images/projects/rag-evaluation-framework-chunking.png',
                alt: 'Recursive vs Semantic Chunking 비교',
                caption: 'Recursive Character Chunking vs Semantic Chunking (Embedding 기반 의미 분절)'
              }
            },
            {
              subtitle: 'Dual Connection Mode',
              list: [
                '<strong>Standalone:</strong> OpenAI + ChromaDB (빠른 온보딩)',
                '<strong>Integrated:</strong> vLLM + Weaviate + Infinity + Redis (프로덕션 환경)'
              ]
            }
          ]
        },
        {
          title: 'Playground UI',
          gallery: [
            {
              src: 'images/projects/rag-evaluation-framework-dashboard.png',
              alt: 'RAG Evaluation Dashboard',
              caption: '1. Dashboard — Pipeline Test 설정 및 Metrics Guide'
            },
            {
              src: 'images/projects/rag-evaluation-framework-pipeline-metrics.png',
              alt: 'Pipeline Metrics',
              caption: '2. Pipeline Metrics — 개별 질문별 상세 분석 및 AI 분석 리포트'
            },
            {
              src: 'images/projects/rag-evaluation-framework-abtest-metrics.png',
              alt: 'A/B Test Metrics',
              caption: '3. A/B Comparison — Base vs Advanced 평가 메트릭 비교'
            }
          ],
          subsections: [
            {
              subtitle: 'Streamlit 기반 인터랙티브 대시보드',
              list: [
                '<strong>Question & Run:</strong> 배치 테스트 케이스 실행 + 평가 결과 시각화',
                '<strong>A/B Comparison:</strong> 파이프라인 간 통계적 비교 (t-test, Cohen\'s d)',
                '<strong>Node Playground:</strong> 개별 노드 독립 테스트',
                '<strong>Pipeline Builder:</strong> 커스텀 파이프라인 조합',
                '<strong>Execution History:</strong> 실험 히스토리 브라우징'
              ]
            }
          ]
        },
        {
          title: '현재 직면한 과제',
          content: '프레임워크 구축 후 반복 실험을 진행하고 있으나, RAG 파이프라인의 평가 점수가 기대만큼 큰 폭으로 개선되지 않고 있습니다. Chunking 전략, Query Rewrite 품질, Reranking 모델 교체 등 개별 변수를 조절해도, 각 단계가 복합적으로 얽혀 있어 단일 요소 개선이 최종 답변 품질에 선형적으로 반영되지 않는 상황입니다. 현재 병목 구간을 식별하기 위한 단계별 ablation 실험을 설계하고 있습니다.'
        }
      ],
      tags: ['RAGAS', 'LLM Judge', 'A/B Test', 'FastAPI', 'Streamlit', 'Redis', 'Weaviate', 'LangChain', 'Open Source']
    },
    'llm-loadtester': {
      title: 'Simple LLM Loadtester',
      image: 'images/projects/llm-loadtester-dashboard.png',
      imageContain: false,
      meta: {
        organization: 'Soundmind-Labs → Open Source',
        role: '1인 개발 (기획, 설계, 백엔드, 프론트엔드)',
        period: '2025.01.11 - 2025.01.12',
        architecture: 'Python FastAPI + Next.js + Docker',
        team: '1인',
        contribution: '100%'
      },
      sections: [
        {
          title: 'Background',
          content: '<strong>"현재 GPU 서버에서 RAG Agent의 LLM을 서빙하면, SLA/SLO 기준을 얼마나 충족할 수 있을까?"</strong><br><br>Soundmind AI Platform의 RAG Agent가 서비스로 출시되기 전, 우리가 보유한 GPU 서버 인프라에서 실제 사용자 트래픽을 감당할 수 있는지 확인해야 했습니다. 동시 접속자 수에 따른 TTFT, TPOT 변화를 측정하고, SLO 임계값 대비 Goodput을 산출하여 인프라 의사결정의 근거를 마련하기 위한 프로젝트입니다.<br><br>동시에, 규모가 작은 조직에서는 인프라 평가가 담당자에게 축적되기보다, 필요할 때마다 누군가가 임시로 맡아서 처리하게 됩니다. 그래서 <strong>"비개발자도 누구나 돌려볼 수 있는 사내 공용 LLM LoadTester"</strong>를 만들어 오픈소스로 공개했습니다.'
        },
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: '기술적 문제',
              content: '기존 벤치마킹 도구들은 개발자 친화적이라, 비개발직군의 LLM 특화 메트릭(TTFT, TPOT, ITL) 시각화 지원이 부족합니다.'
            },
            {
              subtitle: '접근성 문제',
              content: '기존 도구들은 CLI 기반에 복잡한 설정이 필요해, 비개발 직군이나 비전공자가 쉽게 접근하기 어렵습니다.'
            },
            {
              subtitle: '품질 평가 문제',
              content: '단순 처리량만 측정하고, SLO 기반 품질 평가(Goodput)를 지원하지 않습니다.'
            }
          ]
        },
        {
          title: 'Solution',
          list: [
            'OpenAI 호환 API 서버 지원 (vLLM, SGLang, Ollama, LMDeploy, TensorRT-LLM)',
            'LLM 특화 메트릭: TTFT, TPOT, E2E Latency, ITL, Throughput (min/max/mean/p50/p95/p99)',
            'Goodput 메트릭: SLO 임계값 기반 품질 평가 (NVIDIA GenAI-Perf 참조)',
            'Cross-Validation: 클라이언트 측정값과 서버 메트릭(Docker Log, Prometheus) 교차 검증',
            'GPU 메트릭 수집 (pynvml: 메모리, 사용률, 온도, 전력)',
            '실시간 WebSocket 기반 진행 상황 모니터링',
            'Infrastructure 추천 엔진 (워크로드 프로파일링 기반)'
          ]
        },
        {
          title: 'AI-Native Fast Build — 2일 완성',
          content: 'WIGTN Crew에서 구축한 <strong>Claude Code Skills Plugins</strong>(/prd → /digging → /implement → /auto-commit)를 활용하여, 요구사항 정의부터 Docker 배포까지 <strong>2일</strong> 만에 풀스택 애플리케이션을 완성했습니다.',
          subsections: [
            {
              subtitle: '개발 타임라인',
              list: [
                '<strong>Day 1</strong>: 요구사항 정의 → 아키텍처 설계 → 백엔드 핵심 로직 구현',
                '<strong>Day 2</strong>: 프론트엔드 대시보드 → 통합 테스트 → Docker 배포'
              ]
            }
          ]
        },
        {
          title: 'Key Decisions',
          subsections: [
            {
              subtitle: '왜 Goodput을 핵심 지표로 도입했는가?',
              content: '<strong>문제:</strong> 기존 도구들은 Throughput(처리량)만 측정하여, 응답이 느려도 "처리는 됐다"로 카운트됨<br><strong>판단 근거:</strong> 실제 서비스에서는 SLO(TTFT < 500ms, TPOT < 50ms 등)를 만족하지 못하는 응답은 사용자 경험을 해침. NVIDIA GenAI-Perf의 Goodput 개념을 참조<br><strong>결과:</strong> SLO 임계값을 모두 만족하는 요청만 유효 처리량으로 계산하여, 인프라 의사결정의 정확도 향상'
            },
            {
              subtitle: '왜 Adapter Factory Pattern을 선택했는가?',
              content: '<strong>문제:</strong> vLLM, SGLang, Ollama 등 서버마다 API 스펙과 메트릭 포맷이 다름<br><strong>판단 근거:</strong> 서버별 분기 로직을 하드코딩하면 새 서버 추가 시 전체 코드 수정이 필요. 추상화된 어댑터 인터페이스로 서버별 차이를 캡슐화<br><strong>결과:</strong> 새 서버 타입 추가 시 어댑터 1개만 구현하면 됨. Triton 어댑터 확장 중'
            },
            {
              subtitle: '왜 Cross-Validation을 도입했는가?',
              content: '<strong>문제:</strong> 클라이언트에서 측정한 latency와 서버가 보고하는 latency가 불일치하는 경우 발생<br><strong>해결:</strong> Docker log 파싱 + Prometheus 엔드포인트 쿼리로 서버 측 메트릭을 수집하여 교차 검증<br><strong>결과:</strong> 네트워크 오버헤드, 큐잉 지연 등 측정 맹점을 식별 가능'
            }
          ]
        },
        {
          title: 'Technical Details',
          subsections: [
            {
              subtitle: '비동기 부하 생성 엔진',
              content: 'asyncio + httpx + Semaphore 기반 정밀한 동시성 제어. Streaming/Non-streaming 모드 지원, perf_counter()로 고정밀 latency 측정'
            },
            {
              subtitle: 'Goodput 산출 로직',
              content: 'TTFT, TPOT, E2E 각각의 SLO 임계값을 모두 만족하는 요청만 유효 처리량으로 계산. NVIDIA GenAI-Perf 벤치마크 방법론 참조'
            }
          ]
        },
        {
          title: 'Benchmark Results — 실제 서비스 가능 기준 산출',
          image: {
            src: 'images/projects/llm-loadtester-goodput.png',
            alt: 'Model Goodput Comparison',
            caption: '모델별 평균 Goodput 비교 — 모델 크기↑ → Goodput↓'
          },
          content: 'Soundmind AI Platform에서 사용하는 3개 모델을 대상으로 vLLM 서빙 환경에서 SLA/SLO 기준을 실측했습니다. <strong>SLO 기준: TTFT < 500ms</strong>',
          subsections: [
            {
              subtitle: 'Qwen3-VL-30B (vLLM) — Goodput 81.3%',
              content: '<strong>서비스 가능 판단: 동시 25명까지 SLO 100% 충족, 50명에서 88%</strong>',
              list: [
                '<strong>10 concurrent:</strong> 472.1 tok/s, TTFT p50 105.4ms, p99 208.8ms — Goodput 100%',
                '<strong>25 concurrent:</strong> 1,091.4 tok/s, TTFT p50 215.9ms, p99 391.3ms — Goodput 100%',
                '<strong>50 concurrent:</strong> 1,782.4 tok/s, TTFT p50 394.1ms, p99 551.2ms — Goodput 88%',
                '<strong>100 concurrent:</strong> 2,168.5 tok/s, TTFT p50 666.4ms, p99 901.3ms — Goodput 37%'
              ]
            },
            {
              subtitle: 'R1-Llama-70B (vLLM) — Goodput 60.0%',
              content: '<strong>서비스 가능 판단: 동시 25명까지 SLO 100% 충족, 50명에서 82%로 급감</strong>',
              list: [
                '<strong>10 concurrent:</strong> 145.9 tok/s, TTFT p50 152.0ms, p99 346.3ms — Goodput 100%',
                '<strong>25 concurrent:</strong> 405.0 tok/s, TTFT p50 266.0ms, p99 381.1ms — Goodput 100%',
                '<strong>50 concurrent:</strong> 677.4 tok/s, TTFT p50 454.2ms, p99 733.9ms — Goodput 82%',
                '<strong>100 concurrent:</strong> 1,113.6 tok/s, TTFT p50 889.3ms, p99 1,620.2ms — Goodput 18%',
                '<strong>200 concurrent:</strong> 1,643.2 tok/s, TTFT p50 1,258.4ms, p99 1,885.1ms — Goodput 0%'
              ]
            },
            {
              subtitle: 'Qwen3-235B (vLLM) — Goodput 53.0%',
              content: '<strong>서비스 가능 판단: 동시 10명에서 SLO 90%, 50명 이상은 서비스 불가</strong>',
              list: [
                '<strong>1 concurrent:</strong> 12.6 tok/s, TTFT p50 96.1ms, p99 157.1ms — Goodput 97%',
                '<strong>10 concurrent:</strong> 113.5 tok/s, TTFT p50 214.5ms, p99 617.3ms — Goodput 90%',
                '<strong>50 concurrent:</strong> 543.8 tok/s, TTFT p50 562.1ms, p99 747.5ms — Goodput 25%',
                '<strong>100 concurrent:</strong> 946.7 tok/s, TTFT p50 1,047.7ms, p99 1,461.1ms — Goodput 0%'
              ]
            },
            {
              subtitle: '인사이트',
              content: '모델 크기가 커질수록 서비스 가능 동시 접속자 수가 급감합니다. 30B는 50명까지, 70B는 25명까지, 235B는 10명까지가 SLO 충족 한계선입니다. 이 데이터를 기반으로 인프라 스케일링과 모델 선택의 의사결정 근거를 확보했습니다.'
            }
          ]
        },
        {
          title: 'Experiment Design',
          content: 'Web 기반 시각화 + Setting 값 변경을 통한 반복 테스트가 가능한 <strong>플랫폼</strong> 형태로 구성했습니다.',
          subsections: [
            {
              subtitle: 'Input: 실험 변수',
              content: '유연한 의사결정을 돕는 핵심 변수들을 UI에서 직접 조정하며 반복 테스트가 가능합니다.',
              list: [
                '<strong>타겟 서버</strong>: vLLM, SGLang, Ollama 등 OpenAI 호환 API 서버',
                '<strong>모델 설정</strong>: 테스트할 LLM 모델 선택',
                '<strong>트래픽 규모</strong>: 동시 요청 수 (1, 10, 50, 100)',
                '<strong>프롬프트 옵션</strong>: 입력/출력 토큰 길이 설정',
                '<strong>SLO 기준값</strong>: 서비스 목표 임계값 (TTFT, TPOT)'
              ]
            },
            {
              subtitle: 'Output: 성능 지표',
              content: '데이터 기반의 판단을 가능케 하는 지표들을 시각화합니다.',
              list: [
                '<strong>TTFT</strong> (Time To First Token): 첫 토큰까지의 지연 시간',
                '<strong>TPOT</strong> (Time Per Output Token): 토큰당 생성 시간',
                '<strong>p99 Latency</strong>: 99번째 백분위수 지연 시간',
                '<strong>Throughput</strong>: 초당 처리량 (tokens/sec)',
                '<strong>Goodput</strong>: SLO를 만족하는 유효 처리량'
              ]
            }
          ]
        },
        {
          title: 'Service Flow',
          gallery: [
            {
              src: 'images/projects/llm-loadtester-dashboard.png',
              alt: 'LLM Loadtester Dashboard',
              caption: '1. 대시보드 - 벤치마크 현황 및 히스토리'
            },
            {
              src: 'images/projects/llm-loadtester-new.png',
              alt: 'New Benchmark Configuration',
              caption: '2. 새 벤치마크 - 설정 및 실행'
            },
            {
              src: 'images/projects/llm-loadtester-result.png',
              alt: 'Benchmark Result',
              caption: '3. 결과 - 메트릭 차트 및 Goodput 분석'
            },
            {
              src: 'images/projects/llm-loadtester-analysis.png',
              alt: 'AI Analysis Report',
              caption: '4. AI 분석 리포트 자동 생성'
            }
          ]
        },
        {
          title: 'Next Steps',
          list: [
            'Triton Inference Server 어댑터 완성',
            '벤치마크 간 비교 기능 추가'
          ]
        }
      ],
      tags: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Docker', 'WebSocket', 'LLM', 'Claude Code', 'Open Source'],
      demoUrl: null
    },
    'vlm-document-parsing': {
      title: 'VLM 기반 문서 파싱 구조 보존 연구',
      image: 'reports/images/fig1_structure_f1_comparison.png',
      imageContain: true,
      meta: {
        organization: 'Soundmind-Labs (사내 R&D)',
        role: '1인 연구 (실험 설계, 구현, 분석, Tech Report 집필)',
        period: '2026.01 ~ 2026.02',
        architecture: '4-Parser Comparison × 4-Stage Evaluation Framework',
        team: '1인',
        contribution: '100%'
      },
      sections: [
        {
          title: 'Problem — RAG 파이프라인의 문서 이해 능력 향상',
          subsections: [
            {
              subtitle: 'Hypothesis',
              content: '<strong>"문서 파싱 단계에서 사전 구조화를 진행한 뒤 Semantic Chunking을 적용하면, 의미 분절점이 더 정확하게 판별되어 Retrieval에서 적합한 청크를 더 잘 가져올 것이다."</strong><br><br>Soundmind AI Platform의 RAG Agent 품질을 근본적으로 개선하기 위해, 파이프라인의 가장 상류(Upstream)인 문서 파싱 단계에 주목했습니다. 아무리 Retriever를 고도화하고 Generator 프롬프트를 최적화해도, 입력 문서에서 구조(제목, 리스트, 테이블)가 소실되면 다운스트림에서 복구할 수 없다는 것이 핵심 가설입니다.'
            },
            {
              subtitle: 'Technical Challenge',
              content: '기존 PDF 파서(PyMuPDF, pdfplumber)는 텍스트만 추출하고 문서 구조를 무시합니다. 이로 인해 Semantic Chunking 시 제목과 본문이 뒤섞이거나, 관련 없는 섹션이 하나의 청크로 합쳐지는 문제가 발생합니다. VLM(Vision-Language Model)으로 문서를 시각적으로 이해하고 Markdown으로 구조화하면, 제목 경계가 자연스러운 분절점이 되어 Retrieval 정밀도를 높일 수 있을 것이라 판단하여, RAG 파이프라인의 기술경쟁력 제고를 위한 독립 연구로 설계했습니다.'
            }
          ]
        },
        {
          title: 'Experimental Design — 4-Parser Comparison',
          subsections: [
            {
              subtitle: '대조 실험 설계',
              list: [
                '<strong>Text-Baseline:</strong> PyMuPDF 텍스트 추출 (구조 없음, Control)',
                '<strong>Image-Baseline:</strong> RapidOCR 텍스트 인식 (구조 없음, Control)',
                '<strong>Text-Advanced:</strong> PyMuPDF + Qwen3-VL-2B 구조화 (Treatment)',
                '<strong>Image-Advanced:</strong> RapidOCR + Qwen3-VL-2B 구조화 (Treatment)'
              ]
            },
            {
              subtitle: '4단계 평가 프레임워크 (RQ1 → RQ2 → RQ3 → RQ4)',
              list: [
                '<strong>RQ1 (전제 검증):</strong> CER, WER — 텍스트 추출 품질이 VLM 입력에 충분한가?',
                '<strong>RQ2 (구조 보존):</strong> Structure F1 — VLM이 문서 구조를 보존하는가?',
                '<strong>RQ3 (청킹 품질):</strong> BC, CS — 구조 보존이 Chunking 품질을 개선하는가?',
                '<strong>RQ4 (Retrieval 영향):</strong> Hit Rate@k, MRR — 개선된 청킹이 실제 검색 정밀도를 높이는가?'
              ]
            }
          ]
        },
        {
          title: 'Key Results',
          subsections: [
            {
              subtitle: 'RQ1: 텍스트 추출 품질 — VLM을 거치면 CER이 오히려 높아진다?',
              image: {
                src: 'reports/images/fig2_cer_comparison.png',
                alt: 'CER 비교 차트',
                caption: 'Figure 1. 파서별 CER/WER 비교'
              },
              content: '텍스트 추출 정확도를 Character Error Rate(CER)과 Word Error Rate(WER)로 평가했습니다. CER은 문자 단위, WER은 단어 단위의 오류율로, <strong>낮을수록 원본 텍스트에 가까운 추출</strong>을 의미합니다. 결과는 예상과 달랐습니다 — <strong>Text-Advanced가 CER/WER 모두 최하위</strong>를 기록합니다.<table><thead><tr><th>Parser</th><th>CER (↓)</th><th>WER (↓)</th><th>비고</th></tr></thead><tbody><tr><td><strong>Image-Advanced</strong></td><td><strong>33.09%</strong></td><td><strong>43.48%</strong></td><td>Best CER</td></tr><tr><td>Image-Baseline</td><td>40.79%</td><td>51.55%</td><td></td></tr><tr><td>Text-Baseline</td><td>51.25%</td><td>62.89%</td><td></td></tr><tr><td>Text-Advanced</td><td>64.11%</td><td>75.26%</td><td>Worst CER</td></tr></tbody></table>Text-Advanced의 CER이 가장 높은 이유: VLM이 문서 구조를 Markdown 태그(<code>#</code>, <code>-</code>, <code>|</code>)로 변환하면서 발생하는 <strong>의도된 결과</strong>입니다. 반면 Image-Advanced는 VLM을 거치면서도 CER이 가장 낮아, 텍스트 정확도와 구조화를 동시에 확보할 가능성을 보여줍니다. 그렇다면 구조 보존 성능은 어떨까요?'
            },
            {
              subtitle: 'RQ2: 구조 보존 — Baseline 0% vs Advanced 77~79%',
              image: {
                src: 'reports/images/fig1_structure_f1_comparison.png',
                alt: 'Structure F1 비교 차트',
                caption: 'Figure 2. 파서별 Structure F1 비교 — Baseline 0% vs Advanced 77~79%'
              },
              content: 'RQ1에서 CER 차이가 있었던 두 Advanced 파서가, 구조 보존(Structure F1)에서는 <strong>모두 압도적인 성능</strong>을 보여줍니다.<table><thead><tr><th>Parser</th><th>Structure F1</th><th>Precision</th><th>Recall</th></tr></thead><tbody><tr><td><strong>Image-Advanced</strong></td><td><strong>77.78%</strong></td><td>70.00%</td><td>87.50%</td></tr><tr><td><strong>Text-Advanced</strong></td><td><strong>79.25%</strong></td><td>72.41%</td><td>87.50%</td></tr><tr><td>Text-Baseline</td><td>0%</td><td>0%</td><td>0%</td></tr><tr><td>Image-Baseline</td><td>0%</td><td>0%</td><td>0%</td></tr></tbody></table>Baseline 파서들은 구조 요소를 <strong>전혀 보존하지 못합니다</strong>(F1 = 0%). 두 Advanced 파서 모두 77~79%로 유사한 성능을 보이며, F1 차이는 1.5pp에 불과합니다. RQ1의 CER과 종합하면, Image-Advanced가 텍스트 정확도와 구조 보존을 동시에 확보하는 균형 잡힌 파서입니다.'
            },
            {
              subtitle: 'Precision vs Recall — Advanced 파서 상세 비교',
              image: {
                src: 'reports/images/fig5_precision_recall.png',
                alt: 'Precision vs Recall 비교',
                caption: 'Figure 3. Advanced 파서별 Precision/Recall 비교 (TP, FP, FN 세부 수치 포함)'
              },
              content: '두 Advanced 파서 모두 Recall 87.5%로 동일하나, Text-Advanced가 Precision에서 2.4pp 우위(72.4% vs 70.0%). Image-Advanced는 FP가 1개 더 많지만 전체 F1 차이는 미미합니다.'
            },
            {
              subtitle: 'Trade-off 분석: 구조 보존의 비용은 Latency',
              image: {
                src: 'reports/images/fig3_tradeoff_scatter.png',
                alt: 'Structure F1 vs Latency 트레이드오프',
                caption: 'Figure 3. 구조 보존 성능 vs 처리 시간 트레이드오프'
              },
              content: 'RQ1~RQ2를 종합하면: <strong>CER 증가는 구조 보존의 의도된 비용</strong>이며, 실질적 비용은 VLM 추론에 따른 Latency 증가입니다.<table><thead><tr><th>Parser</th><th>CER (↓)</th><th>Structure F1 (↑)</th><th>Latency</th></tr></thead><tbody><tr><td>Text-Baseline</td><td>51.25%</td><td>0%</td><td>2.31s</td></tr><tr><td>Text-Advanced</td><td>64.11%</td><td>79.25%</td><td>42.92s</td></tr><tr><td><strong>Image-Advanced</strong></td><td><strong>33.09%</strong></td><td><strong>77.78%</strong></td><td><strong>35.75s</strong></td></tr></tbody></table>종합 비교 시 <strong>Image-Advanced가 가장 균형 잡힌 선택</strong>입니다. CER 최저(33%), Structure F1은 Text-Advanced와 1.5pp 차이(78% vs 79%), Latency도 17% 더 빠릅니다. 실시간 처리가 필요 없는 <strong>문서 전처리 파이프라인(오프라인 인덱싱)</strong>에서는 두 Advanced 파서 모두 수용 가능하며, 텍스트 정확도까지 고려하면 Image-Advanced가 유리합니다.'
            },
            {
              subtitle: 'Latency Breakdown — 파서별 처리 시간 비교',
              image: {
                src: 'reports/images/fig4_latency_breakdown.png',
                alt: 'Latency Comparison by Parser',
                caption: 'Figure 5. 파서별 처리 시간 비교 — Advanced 파서는 VLM 추론으로 인해 15~19x 느림'
              },
              content: 'Baseline 파서(0.27~2.31s)에 비해 Advanced 파서(35~43s)는 VLM 추론 비용이 추가됩니다. 다만 문서 전처리는 오프라인 인덱싱 단계에서 1회만 수행되므로, 쿼리 시점의 응답 속도에는 영향을 주지 않습니다.'
            },
            {
              subtitle: 'Prompt Engineering — 0%에서 77~79%로',
              content: '동일한 Qwen3-VL-2B 모델에서 <strong>프롬프트만 변경</strong>하여 Structure F1이 0%에서 77~79%로 개선되었습니다. 핵심은 Role Framing과 명시적 제약 조건의 차이입니다.<table><thead><tr><th></th><th>v1 — Extraction Expert</th><th>v2 — Transcription Engine</th></tr></thead><tbody><tr><td><strong>Role</strong></td><td>"You are an <em>expert</em> document extraction assistant"</td><td>"You are a document <em>transcription engine</em>"</td></tr><tr><td><strong>지시</strong></td><td>"Extract all information and present it in organized format"</td><td>"You <strong>MUST</strong> only transcribe what is actually visible"</td></tr><tr><td><strong>제약</strong></td><td>(없음)</td><td>"Do <strong>NOT</strong> add explanations, summaries, or interpretations"</td></tr><tr><td><strong>불확실성</strong></td><td>(없음 — 모델이 추측)</td><td>"If text is unclear, indicate with <code>[unclear]</code> rather than guessing"</td></tr><tr><td><strong>구조 매핑</strong></td><td>"Headers and section titles" (암묵적)</td><td>"1 Introduction" → <code>## 1. Introduction</code><br>"3.1 Method" → <code>### 3.1 Method</code> (명시적)</td></tr><tr><td><strong>Structure F1</strong></td><td style="color:#ef4444"><strong>0%</strong></td><td style="color:#22c55e"><strong>77~79%</strong></td></tr></tbody></table><strong>v1이 실패한 이유:</strong> "expert" 프레이밍은 모델에게 <em>해석과 재구성</em>을 유도합니다. 2B 소형 모델은 이를 hallucination으로 수행하여, 원본에 없는 구조를 만들어내거나 기존 구조를 무시했습니다.<br><br><strong>v2가 성공한 이유:</strong> "transcription engine" 프레이밍은 <em>있는 그대로의 전사</em>를 유도하고, <code>MUST</code>/<code>NEVER</code> 키워드와 번호→마크다운 레벨 매핑 규칙이 2B 모델의 제한된 추론 능력을 보완했습니다. 소형 모델일수록 암묵적 기대보다 <strong>명시적 제약 조건</strong>이 효과적이라는 것을 실험으로 확인했습니다.'
            },
            {
              subtitle: 'RQ4: Retrieval 영향 평가 (진행 중)',
              content: '개선된 청킹 품질이 실제 검색 정밀도(Hit Rate@k, MRR)를 높이는지 검증하는 실험을 진행 중입니다. 2026년 2월 내 완료 예정.'
            }
          ]
        },
        {
          title: 'Key Decisions',
          subsections: [
            {
              subtitle: '왜 Qwen3-VL-2B를 선택했는가?',
              content: '<strong>선택지:</strong> Qwen3-1.7B-Instruct (Text-only) vs Qwen3-VL-2B (Vision-Language)<br><strong>판단 근거:</strong> 본 연구의 문서 파싱 태스크만 고려하면 Text-only 모델(1.7B)로 충분했으나, 사내에서 운용 중인 또 다른 파이프라인이 Multi-Modal Input을 필요로 했습니다. 인프라 여건상 GPU 1장(96GB)에서 두 파이프라인에 모두 활용할 수 있는 <strong>범용성</strong>을 기준으로 VL 모델을 선택했습니다.<br><strong>결과:</strong> 2B VL 모델로도 Structure F1 77~79% 달성. 범용성과 성능을 동시에 확보<br><strong>향후 계획:</strong> 문서 파싱 전용 라인 고도화 시 Qwen3-1.7B-Instruct로 전환 예정이며, Curriculum Learning 기법을 적용하여 구조화 성능 개선을 검증할 계획'
            },
            {
              subtitle: '왜 Semantic Distance를 BC/CS 지표로 사용했는가?',
              content: '<strong>문제:</strong> MoC 논문의 BC/CS 지표는 Perplexity 기반이나, OpenAI API는 input token logprobs를 제공하지 않음<br><strong>해결:</strong> Embedding 기반 Cosine Similarity + Structural Entropy로 대체<br><strong>Trade-off:</strong> 스케일은 다르지만 동등한 신호를 제공하는 것을 확인'
            }
          ]
        },
        {
          title: 'Deliverables',
          list: [
            '10,700 LOC 평가 프레임워크 (Python)',
            '완전한 Tech Report (8 섹션 + 3 부록, 논문 수준)',
            'Streamlit 인터랙티브 대시보드 (5개 출판 품질 차트)',
            'CLI 도구 (parser 비교 + chunking 평가)',
            '오픈소스 공개 (MIT License)',
            '<a href="https://hyeongseob91.github.io/reports/vlm-document-parsing.html" target="_blank" rel="noopener noreferrer"><strong>📄 Tech Report 전문 보기</strong></a>',
            '<a href="https://github.com/Hyeongseob91/research-vlm-based-document-parsing" target="_blank" rel="noopener noreferrer"><strong>💻 GitHub Repository</strong></a>'
          ]
        }
      ],
      tags: ['Qwen3-VL', 'PyMuPDF', 'RapidOCR', 'Semantic Chunking', 'BGE-M3', 'RAGAS', 'Streamlit', 'Research']
    },
    mcp: {
      title: 'VALORITHM - MCP 기반 게임 개발 AI 시스템',
      image: 'images/projects/valorithm_mcp_server.png',
      meta: {
        organization: 'Wanted Learning (부트캠프)',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.04 ~ 2025.06',
        architecture: 'MCP Server + LangGraph Agent',
        team: '6인 (AI 3 + Unreal 3)',
        contribution: '40% (AI 시스템 설계, MCP 서버, Recoil Generator)'
      },
      sections: [
        {
          title: 'Problem',
          content: 'FPS 게임 개발에서 가장 큰 병목은 <strong>단순 반복 작업</strong>이었습니다. 총기 반동 패턴 설정에 40분, 3D 맵 화이트박싱에 8시간이 소요되었고, 기획자의 수정 요청마다 동일한 과정을 반복해야 했습니다.<br><br>범용 AI 도구가 아닌, <strong>해당 워크플로우에 특화된 맞춤형 AI 도구</strong>를 직접 설계하여 반복 작업을 자동화하고 개발 리소스를 확보하는 것이 핵심 접근이었습니다.'
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'What We Built',
              list: [
                'FPS 게임 기획 & 개발을 지원하는 3가지 MCP 도구 + 1 AI Agent 설계 및 구축',
                'MCP(Model Context Protocol) 기반 도구 통합으로 자연어 명령 지원',
                'Smithery.ai 마켓플레이스에 MCP Server 배포'
              ]
            },
            {
              subtitle: 'Core Value',
              content: 'MCP 도구와 AI Agent를 게임 개발 워크플로우 전반에 통합하여, 기획부터 플레이까지의 반복 작업을 자동화하고 개발자 생산성을 정량적으로 개선',
              image: {
                src: 'images/projects/valorithm_sequence_dev_flow.png',
                alt: 'VALORITHM 개발 흐름'
              }
            }
          ]
        },
        {
          title: 'AI Tools — 설계 및 구현',
          subsections: [
            {
              subtitle: '1. Discord MCP Agent',
              image: {
                src: 'images/projects/valorithm_discord.png',
                alt: 'Discord MCP Agent 아키텍처'
              },
              list: [
                'Discord 채팅 기록 자동 요약 및 매일 오전 10시 공유',
                'Claude API + Discord MCP Server 연동',
                'Oracle RDB + ChromaDB 이중 저장소'
              ]
            },
            {
              subtitle: '2. Weapon Recoil Generator',
              image: {
                src: 'images/projects/valorithm_recoil.png',
                alt: 'Weapon Recoil Generator 아키텍처'
              },
              list: [
                '자연어 명령으로 총기별 반동 궤적 자동 생성',
                'NumPy 기반 3단계 사격 패턴: 초탄(Y축 수직 반동), 중탄(안정화, 균일 분포), 후탄(X축 강한 흔들림)',
                'np.cumsum() 연산을 통한 연속적 궤적 좌표 계산',
                'Matplotlib 시각화 후 Unreal Engine 에셋으로 즉시 적용'
              ]
            },
            {
              subtitle: '3. 2D to 3D Map Generator',
              image: {
                src: 'images/projects/valorithm_3d.png',
                alt: '2D to 3D Map Generator 아키텍처'
              },
              list: [
                '2D 이미지 한 장으로 3D Mesh(.obj) 자동 생성',
                'OpenCV Canny Edge + Shapely/Open3D 활용'
              ]
            },
            {
              subtitle: '4. Javis AI Agent (PoC)',
              image: {
                src: 'images/projects/valorithm_javis.png',
                alt: 'Javis AI Agent 아키텍처'
              },
              list: [
                'LangGraph + STT 기반 인게임 AI Agent 설계',
                'TypedDict 기반 상태 관리 및 멀티턴 대화 로직',
                'PoC 수준 구축 및 검증 완료, 실제 게임 미적용'
              ]
            }
          ]
        },
        {
          title: 'Key Decisions',
          subsections: [
            {
              subtitle: 'MCP 표준 채택',
              content: 'IDE 및 외부 LLM 환경과의 도구 호환성 확보를 위해 MCP 프로토콜 기반으로 설계. FastMCP로 서버 사이드 도구 등록 및 스키마 자동화 구현'
            },
            {
              subtitle: 'Remote → Local 통신 전환',
              content: '오픈소스 Unreal MCP Plugin을 통한 Remote 통신을 계획했으나, 미완성 프로젝트로 연동 실패. Local 통신으로 아키텍처를 재설계하여 안정적 동작 확보'
            },
            {
              subtitle: 'LangGraph 도입',
              content: '복잡한 조건 분기가 필요한 인게임 대화 흐름에서, 상태 그래프 기반의 가시성과 제어권 확보'
            }
          ]
        },
        {
          title: 'Results',
          subsections: [
            {
              subtitle: '정량적 성과',
              gallery: [
                {
                  src: 'images/projects/valorithm_smithery_ai.png',
                  alt: 'Smithery.ai MCP Server',
                  caption: 'Smithery.ai에 배포된 MCP Server'
                },
                {
                  src: 'images/projects/valorithm_3d_map_build.png',
                  alt: '3D Map Building',
                  caption: '3D Map building 결과'
                }
              ],
              list: [
                '총기 궤적 생성: 40분 → 30초 (약 98.7% 시간 단축)',
                '3D 화이트박싱: 8시간 → 2시간 (약 75% 시간 단축)',
                'Discord 회의록 자동 요약으로 별도 작성 공수 제거',
                'MCP Server Smithery.ai 마켓플레이스 배포',
                '<a href="https://www.canva.com/design/DAG9oBMaAzI/IVszVKdZleiL5Qbl-KIcZg/view?utm_content=DAG9oBMaAzI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb9d5937c48" target="_blank" rel="noopener noreferrer"><strong>시연 영상 확인하기 (Canva)</strong></a>'
              ]
            }
          ]
        }
      ],
      tags: ['MCP', 'LangGraph', 'FastMCP', 'NumPy', 'OpenCV', 'ChromaDB', 'Whisper', 'Unreal Engine']
    },
    'rag-advanced-pipeline': {
      title: 'Triton vs Standard Serving — ML 추론 성능 비교 연구',
      image: 'images/projects/valorithm_main.png',
      meta: {
        organization: 'Personal Research',
        role: '1인 연구',
        period: '2026.02 ~ (진행 예정)',
        architecture: 'Triton Inference Server + TensorRT',
        team: '1인',
        contribution: '100%'
      },
      sections: [
        {
          title: 'Research Direction',
          content: 'Soundmind AI Platform의 RAG Agent는 현재 vLLM + FastAPI 기반으로 모델을 서빙하고 있습니다. 본 연구는 NVIDIA Triton Inference Server의 Multi-Model Serving 구조가 기존 Standard Serving 대비 얼마나 성능 이점이 있는지를 객관적 지표로 비교하기 위한 프로젝트입니다.',
          subsections: [
            {
              subtitle: '연구 목표',
              list: [
                '<strong>Standard Serving (Baseline):</strong> vLLM + FastAPI 기반 현재 서빙 구조의 성능 프로파일링',
                '<strong>Triton Serving (Treatment):</strong> Triton Inference Server + TensorRT 최적화 구조의 성능 측정',
                '<strong>객관적 비교:</strong> TTFT, TPOT, Throughput, GPU Utilization 등의 지표로 정량 비교',
                'Embedding/Reranking 모델의 TensorRT 변환을 통한 추론 latency 개선 실험'
              ]
            },
            {
              subtitle: '기대 효과',
              content: '본 연구 결과는 Soundmind AI Platform의 서빙 아키텍처 전환 여부를 판단하는 근거 자료로 활용될 예정이며, LLM Loadtester로 측정한 기존 SLA/SLO 데이터와 직접 비교할 수 있도록 설계합니다.'
            }
          ]
        }
      ],
      tags: ['Triton', 'TensorRT', 'ML Serving', 'NVIDIA', 'Optimization']
    }
  };

  // Open modal
  projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open modal if clicking on GitHub link or Coming Soon card
      if (e.target.closest('.project-card__link')) return;
      if (this.classList.contains('project-card--coming-soon')) return;

      const projectId = this.dataset.project;
      const project = projectData[projectId];

      if (project) {
        modalImage.src = project.image;
        modalImage.alt = project.title;
        // 이미지 contain 모드 지원 (전체 이미지가 보이도록)
        if (project.imageContain) {
          modalImage.classList.add('modal__image--contain');
        } else {
          modalImage.classList.remove('modal__image--contain');
        }
        modalTitle.textContent = project.title;

        // Meta info - 통일된 메타 필드 (소속, 역할, 기간, 설계)
        let metaHTML = '';
        if (project.meta.organization) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-building"></i> ${project.meta.organization}</span>`;
        }
        if (project.meta.role) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-user-tie"></i> ${project.meta.role}</span>`;
        }
        if (project.meta.period) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-regular fa-calendar"></i> ${project.meta.period}</span>`;
        }
        if (project.meta.architecture) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-layer-group"></i> ${project.meta.architecture}</span>`;
        }
        if (project.meta.team) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-users"></i> ${project.meta.team}</span>`;
        }
        if (project.meta.contribution) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-chart-pie"></i> 기여도 ${project.meta.contribution}</span>`;
        }
        modalMeta.innerHTML = metaHTML;

        // Content sections - Disclaimer 및 subsections 지원
        let contentHTML = '';

        // Disclaimer 추가 (최상단)
        if (project.disclaimer && project.disclaimer.show) {
          contentHTML += `
            <div class="modal__disclaimer">
              <i class="fa-solid fa-shield-halved"></i>
              <p>${project.disclaimer.text}</p>
            </div>
          `;
        }

        project.sections.forEach(section => {
          const sectionClass = section.highlight ? 'modal__section modal__section--highlight' : 'modal__section';
          contentHTML += `<div class="${sectionClass}">`;
          contentHTML += `<h4 class="modal__section-title">${section.title}</h4>`;

          // Section Image 지원
          if (section.image) {
            contentHTML += `
              <img src="${section.image.src}"
                   alt="${section.image.alt}"
                   class="modal__section-image"
                   onclick="window.open('${section.image.src}', '_blank')">
            `;
            if (section.image.caption) {
              contentHTML += `<p class="modal__section-image-caption">${section.image.caption}</p>`;
            }
          }

          // Image Gallery 지원 (여러 이미지)
          if (section.gallery) {
            contentHTML += `<div class="modal__image-gallery">`;
            section.gallery.forEach(img => {
              contentHTML += `
                <div class="modal__gallery-item">
                  <img src="${img.src}"
                       alt="${img.alt}"
                       onclick="window.open('${img.src}', '_blank')">
                  ${img.caption ? `<span>${img.caption}</span>` : ''}
                </div>
              `;
            });
            contentHTML += `</div>`;
          }

          // Video 지원 (mp4)
          if (section.video) {
            contentHTML += `
              <div class="modal__video-wrapper">
                <video class="modal__video" controls ${section.video.autoplay ? 'autoplay muted loop' : ''}>
                  <source src="${section.video.src}" type="video/mp4">
                  브라우저가 비디오를 지원하지 않습니다.
                </video>
                ${section.video.caption ? `<p class="modal__video-caption">${section.video.caption}</p>` : ''}
              </div>
            `;
          }

          if (section.content) {
            contentHTML += section.content.includes('<table')
              ? `<div class="modal__rich-content">${section.content}</div>`
              : `<p>${section.content}</p>`;
          }
          if (section.list) {
            contentHTML += `<ul>${section.list.map(item => `<li>${item}</li>`).join('')}</ul>`;
          }

          // Subsections 지원
          if (section.subsections) {
            section.subsections.forEach(sub => {
              contentHTML += `<div class="modal__subsection">`;
              contentHTML += `<h5 class="modal__subsection-title">${sub.subtitle}</h5>`;
              // Subsection Image 지원
              if (sub.image) {
                const imgStyle = sub.image.style ? `style="${sub.image.style}"` : '';
                contentHTML += `
                  <img src="${sub.image.src}"
                       alt="${sub.image.alt || sub.subtitle}"
                       class="modal__subsection-image"
                       ${imgStyle}
                       onclick="window.open('${sub.image.src}', '_blank')">
                `;
                if (sub.image.caption) {
                  contentHTML += `<p class="modal__section-image-caption">${sub.image.caption}</p>`;
                }
              }
              // Subsection Gallery 지원 (여러 이미지 병렬 배치)
              if (sub.gallery) {
                contentHTML += `<div class="modal__subsection-gallery">`;
                sub.gallery.forEach(img => {
                  contentHTML += `
                    <div class="modal__subsection-gallery-item">
                      <img src="${img.src}"
                           alt="${img.alt}"
                           onclick="window.open('${img.src}', '_blank')">
                      ${img.caption ? `<span>${img.caption}</span>` : ''}
                    </div>
                  `;
                });
                contentHTML += `</div>`;
              }
              if (sub.content) {
                contentHTML += sub.content.includes('<table')
                  ? `<div class="modal__rich-content">${sub.content}</div>`
                  : `<p>${sub.content}</p>`;
              }
              if (sub.list) {
                contentHTML += `<ul>${sub.list.map(item => `<li>${item}</li>`).join('')}</ul>`;
              }
              contentHTML += `</div>`;
            });
          }

          contentHTML += `</div>`;
        });
        modalContent.innerHTML = contentHTML;

        // Tags
        modalTags.innerHTML = project.tags.map(tag =>
          `<span class="project-card__tag">${tag}</span>`
        ).join('');

        // Add Live Demo button if demoUrl exists
        if (project.demoUrl && project.demoUrl.trim() !== '') {
          const demoBtn = document.createElement('a');
          demoBtn.href = project.demoUrl;
          demoBtn.target = '_blank';
          demoBtn.rel = 'noopener noreferrer';
          demoBtn.className = 'modal__demo-btn';
          demoBtn.innerHTML = '<i class="fa-solid fa-rocket"></i> Live Demo';

          // Insert demo button before tags
          modalTags.parentNode.insertBefore(demoBtn, modalTags);
        }

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Focus trap: store trigger and move focus into modal
        modal._triggerElement = this;
        modalClose.focus();
      }
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Restore focus to the element that opened the modal
    if (modal._triggerElement) {
      modal._triggerElement.focus();
      modal._triggerElement = null;
    }
  }

  // Focus trap inside modal
  if (modal) {
    modal.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab' || !modal.classList.contains('active')) return;

      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside content
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // =====================================================
  // SCROLL TO TOP (optional - for brand click)
  // =====================================================
  const navBrand = document.querySelector('.navbar__brand');
  if (navBrand) {
    navBrand.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =====================================================
  // SHOW MORE EDUCATIONAL PROJECTS
  // =====================================================
  const showMoreBtn = document.getElementById('showMoreEducational');
  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function() {
      const hiddenCards = document.querySelectorAll('.projects--educational .project-card.hidden');
      const btnText = this.querySelector('.show-more-btn__text');

      if (this.classList.contains('expanded')) {
        // Hide cards
        hiddenCards.forEach(card => {
          card.classList.remove('show');
        });
        this.classList.remove('expanded');
        btnText.textContent = '더 많은 프로젝트 보기';
      } else {
        // Show cards
        hiddenCards.forEach(card => {
          card.classList.add('show');
        });
        this.classList.add('expanded');
        btnText.textContent = '프로젝트 접기';
      }
    });
  }

  // =====================================================
  // CONTACT POPOVER
  // =====================================================
  const profileToggle = document.getElementById('profileToggle');
  const profilePopover = document.getElementById('profilePopover');

  // Toggle profile popover
  if (profileToggle && profilePopover) {
    profileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      profilePopover.classList.toggle('show');
    });
  }

  // Close popovers when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.contact__popover-wrapper')) {
      if (profilePopover) profilePopover.classList.remove('show');
    }
  });

  // Copy to clipboard
  const copyButtons = document.querySelectorAll('.contact__popover-copy');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const textToCopy = this.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Show copied feedback
        const icon = this.querySelector('i');
        icon.classList.remove('fa-copy');
        icon.classList.add('fa-check');
        this.classList.add('copied');

        setTimeout(() => {
          icon.classList.remove('fa-check');
          icon.classList.add('fa-copy');
          this.classList.remove('copied');
        }, 2000);
      });
    });
  });

});
