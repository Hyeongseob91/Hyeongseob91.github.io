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
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
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
    'enterprise-rag': {
      title: 'Enterprise RAG Agent PlayGround',
      image: 'images/companies/soundmind.png',
      meta: {
        organization: 'Soundmind-Labs',
        role: 'Project Lead / Tech Lead',
        period: '2025.11 ~ 현재',
        architecture: 'MSA + Clean Architecture + Docker Compose'
      },
      disclaimer: {
        show: true,
        text: '본 프로젝트는 Soundmind-Labs 소속 AI Research Engineer로서, Project Lead로 진행하는 Agent Platform을<br>End-to-End로 직접 기획·설계·구현·배포까지의 종합 Pipeline 과정을 개인 역량 설명 목적으로 재구성하였습니다.<br>상용 소스코드 및 영업 정보는 포함되어 있지 않으며 시스템 엔지니어링 설계의 의사결정 경험만을 중심으로 정리했습니다.'
      },
      sections: [
        {
          title: 'Try Demo',
          highlight: true,
          content: '<a href="http://work.soundmind.life:12320" target="_blank" rel="noopener noreferrer"><strong>work.soundmind.life:12320</strong></a> 으로 접속하여 Try Demo 버튼을 통해 Guest Mode 체험이 가능합니다.'
        },
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: 'Business',
              content: 'AI 기술은 추상적이어서 고객사에게 설명하기 어렵고, 제안서만으로는 기술력을 증명하기 힘듭니다. 또한 고객이 직접 써보지 않으면 진짜 필요한 요구사항이 무엇인지 파악하기 어렵고, 사내 비개발 부서는 AI가 현재 어느 수준인지 체감하지 못해 새로운 서비스 기획 아이디어를 내기 어려웠습니다.'
            },
            {
              subtitle: 'Technical',
              content: '기본적인 RAG 시스템은 검색 정확도가 낮아 정확한 정보를 찾기 어렵고, LLM이 생성한 답변의 근거를 검증할 방법이 없으며, 파이프라인 내부 동작이 보이지 않아 "왜 이런 답변이 나왔는지" 설명할 수 없었습니다.'
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'Business',
              list: [
                'B2B 영업 도구: POC 단계에서 실제 작동하는 Agent Engine으로 기술력 증명',
                '요구사항 수집 도구: 고객이 직접 UI를 조작하며 발생하는 피드백으로 맞춤형 기능 도출',
                '사내 Ideation 도구: 전사 임직원이 AI 기술 수준을 체감하고 신규 서비스 기획 아이디어 제안'
              ]
            },
            {
              subtitle: 'Technical',
              list: [
                'Query Rewrite → Hybrid Search(Dense + Sparse + RRF) → Reranking → Streaming Generation',
                'RAG 파이프라인 각 단계의 Latency 모니터링 및 처리 과정 실시간 시각화',
                'Retrieval Insight: 쿼리 변환, 검색 점수, 재순위 결과를 평가 지표를 통해 공개'
              ]
            },
            {
              subtitle: 'Core Value',
              content: 'AI 기술의 비즈니스 가치를 증명하는 도구. 기술적으로는 "왜 이 답이 나왔는지" 검증 가능한 UX를 제공함으로서, 비즈니스적으로는 영업 계약 체결을 견인하는 전략적 자산을 목표로, 회사의 기술경쟁력 제고를 목표로 진행되는 장기 프로젝트 입니다.'
            }
          ]
        },
        {
          title: 'Architecture Overview',
          image: {
            src: 'images/projects/soundmind_ai_platform_architecture.png',
            alt: 'Soundmind AI Platform Architecture',
            caption: '5계층 MSA 아키텍처: Presentation → API Gateway → Service → Data → External Model Services'
          },
          list: [
            'Presentation Layer: sm-web-console - Login, Portal Select, Dashboard',
            'API Gateway Layer: sm-api-gateway - BFF + SSE Streaming',
            'Service Layer: sm-rag-service - Advanced RAG Pipeline',
            'Data Layer: Weaviate - Vector Database with Hybrid Search',
            'External Model Services: vLLM, Embedder, Reranker'
          ]
        },
        {
          title: 'Model & Infra Specs',
          subsections: [
            {
              subtitle: 'Model Stack',
              list: [
                '<strong>LLM:</strong> Qwen3 계열 Large-scale LLM (vLLM Serving, 모델 자동 감지 Config)',
                '<strong>Query Rewrite:</strong> 동일 LLM 모델 사용 (Thinking 모드 활용)',
                '<strong>Embedder:</strong> BGE 계열 Multilingual Model (Infinity Framework, Dense + Sparse 동시 지원)',
                '<strong>Reranker:</strong> BGE 계열 Cross-Encoder (Infinity Framework)'
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
          title: 'Metrics & Trade-offs',
          subsections: [
            {
              subtitle: 'Qualitative Evaluation (정성 평가)',
              list: [
                'Doc Check: ~50ms',
                'Query Rewrite: ~1s (최대 ~2s)',
                'Hybrid Retrieval + Rerank: ~0.3s',
                'Streaming Generation: 응답 길이에 비례 (최대 ~1min)'
              ]
            },
            {
              subtitle: 'Quantitative Evaluation (정량 평가) - 26.01 ~ 26.02 개발 中',
              list: [
                'Retriever: Context Precision, Context Recall, NDCG@K',
                'Generator: Faithfulness, Answer Relevancy',
                '평가 프레임워크: RAGAS (EACL 2024 표준)'
              ]
            },
            {
              subtitle: 'Engineering Trade-off',
              list: [
                '"응답 속도"보다 "검색 성능과 신뢰성"을 우선',
                '"빠른 데모"보다 "안정적으로 운영 가능한 구조" 선택',
                'Query Rewrite + Thinking Model 사용으로 비용 증가 ↔ Retrieval + Generator 품질 개선',
              ]
            }
          ]
        }
      ],
      tags: ['LangGraph', 'RAG', 'Hybrid Search', 'Weaviate', 'FastAPI', 'Docker Compose', 'SSE', 'vLLM', 'BGE-M3']
    },
    'llm-loadtester': {
      title: 'Simple LLM Loadtester',
      image: 'images/projects/llm-loadtester-dashboard.png',
      imageContain: false,
      meta: {
        organization: 'Personal Project',
        role: '1인 개발 (기획, 설계, 백엔드, 프론트엔드)',
        period: '2025.01.11 - 2025.01.12',
        architecture: 'Python FastAPI + Next.js + Docker'
      },
      sections: [
        {
          title: 'Background',
          content: '<strong>"우리 LLM 서버, 동시 접속자 몇 명까지 가능할까요?"</strong><br><br>금요일 퇴근 무렵, 상사분의 질문에서 이 프로젝트가 시작되었습니다.<br><br>제가 있는 규모가 작은 조직에서는 "인프라 평가 / 성능 테스트"가 담당자에게 축적되기보다, 필요할 때마다 누군가가 임시로 맡아서 처리하게 됩니다. 그러면 <strong>"비개발자도 누구나 돌려볼 수 있는 사내 공용 LLM LoadTester"</strong>를 만들어보자는 생각으로 주말 프로젝트를 시작했습니다.'
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
            'LLM 특화 메트릭: TTFT, TPOT, E2E Latency, ITL, Throughput',
            'Goodput 메트릭: SLO 임계값 기반 품질 평가',
            '실시간 WebSocket 기반 진행 상황 모니터링',
            'GPU 메트릭 수집 (메모리, 사용률, 온도, 전력)',
            '인프라 추천 엔진'
          ]
        },
        {
          title: 'AI-Native Fast Build',
          content: '<strong>WIGTN과 AI-Native 개발</strong><br><br>저는 <strong>WIGTN</strong>이라는 주니어 개발자 크루를 이끌고 있습니다. 저희는 AI 시대에 주니어 개발자가 나아가야 할 방향은 AI를 활용하는 역량에 달려 있다고 생각합니다.<br><br>그래서 Coding Agent인 Claude Code에 설치하여 사용할 수 있는 Workflow Tool Set, <strong>Claude Code Skills Plugins</strong>를 구축했습니다. 본 프로젝트는 해당 플러그인을 활용한 Fast Build 기반 프로젝트로, <strong>단 2일 만에</strong> 완성도 높은 풀스택 애플리케이션을 구축했습니다.',
          subsections: [
            {
              subtitle: '사용한 도구',
              list: [
                '<strong>Claude Code</strong>: Anthropic의 AI 코딩 어시스턴트',
                '<strong>Claude Code Skills Plugins</strong>: 체계적인 개발 워크플로우 자동화',
                '/prd: 요구사항 문서 자동 생성',
                '/digging: PRD 취약점 분석',
                '/implement: 구현 계획 수립',
                '/auto-commit: 품질 검증 후 자동 커밋'
              ]
            },
            {
              subtitle: '개발 과정',
              list: [
                '<strong>Day 1</strong>: 요구사항 정의 → 아키텍처 설계 → 백엔드 핵심 로직 구현',
                '<strong>Day 2</strong>: 프론트엔드 대시보드 → 통합 테스트 → Docker 배포 설정'
              ]
            },
            {
              subtitle: '핵심 인사이트',
              content: 'AI 협업 개발은 단순히 코드를 대신 작성하는 것이 아닙니다. PRD 작성, 아키텍처 검토, 코드 리뷰, 테스트 등 전체 개발 라이프사이클을 가속화합니다.'
            }
          ]
        },
        {
          title: 'Try Claude Code Skills Plugins',
          highlight: true,
          content: '<a href="https://github.com/wigtn/wigtn-plugins-with-claude-code.git" target="_blank">🔗 Claude Code Skills Plugins GitHub</a>'
        },
        {
          title: 'Technical Details',
          subsections: [
            {
              subtitle: '아키텍처',
              content: 'MSA (Microservices Architecture) - API Service + Web Service'
            },
            {
              subtitle: '비동기 설계',
              content: 'asyncio + httpx로 고동시성 부하 생성'
            },
            {
              subtitle: '어댑터 패턴',
              content: '다양한 서버 타입 지원을 위한 확장 가능한 구조'
            },
            {
              subtitle: '실시간 통신',
              content: 'WebSocket으로 벤치마크 진행 상황 실시간 전달'
            },
            {
              subtitle: '데이터 시각화',
              content: 'Recharts를 활용한 인터랙티브 차트'
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
          title: 'Open Source & Impact',
          content: '<strong>누구나 무료로 사용할 수 있는 LLM 벤치마킹 도구</strong><br><br>이 프로젝트는 처음부터 오픈소스로 공개하기 위해 개발되었습니다.',
          subsections: [
            {
              subtitle: '대상 사용자',
              list: [
                '<strong>주니어 개발자</strong>: AI 협업 개발 방법론 학습 및 실습',
                '<strong>소규모 연구원</strong>: 복잡한 설정 없이 LLM 서빙 성능 실험',
                '<strong>비전공자/기획자</strong>: 직관적인 UI로 LLM 서비스 도입 검증'
              ]
            },
            {
              subtitle: '오픈소스 기여 의의',
              list: [
                '상용 벤치마킹 도구 대비 무료로 핵심 기능 제공',
                'Goodput 메트릭으로 실제 서비스 품질 평가 가능',
                '커뮤니티 기여 및 피드백을 통한 지속적 개선'
              ]
            }
          ]
        },
        {
          title: 'Reflection',
          content: '<strong>7개월차 주니어의 AI 협업 개발 경험</strong>',
          subsections: [
            {
              subtitle: '성과',
              list: [
                '<strong>2일 완성</strong>: 주말 동안 AI-Native 개발 방법론으로 풀스택 애플리케이션 완성',
                '<strong>개발 패러다임 전환</strong>: Claude Code Skills Plugins이 PRD → 구현 → 검증 전 과정을 지원',
                '<strong>풀스택 경험</strong>: FastAPI + Next.js + Docker 통합 경험',
                '<strong>실시간 시스템</strong>: WebSocket 기반 양방향 통신 구현'
              ]
            },
            {
              subtitle: '주니어로서의 인사이트',
              content: '과거에 시니어가 되기까지 10년이 걸렸던 경험의 축적을, AI라는 강력한 파트너와 함께한다면 5년, 3년으로 압축할 수 있지 않을까요?<br><br>저와 같은 고민을 하는 주니어, 비전공자 분들에게 작은 도움이 될 수 있다면 좋겠습니다.'
            },
            {
              subtitle: '향후 계획',
              list: [
                'Triton Inference Server 어댑터 완성',
                '벤치마크 비교 기능 추가',
                '커뮤니티 피드백 반영'
              ]
            }
          ]
        }
      ],
      tags: ['Python', 'FastAPI', 'Next.js', 'TypeScript', 'Docker', 'WebSocket', 'LLM', 'Claude Code', 'Open Source'],
      demoUrl: null
    },
    mcp: {
      title: 'VALORITHM - MCP 기반 게임 개발 AI 시스템',
      image: 'images/projects/valorithm_mcp_server.png',
      meta: {
        organization: 'Wanted Learning',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.04 ~ 2025.06',
        architecture: 'MCP Server + LangGraph Agent'
      },
      sections: [
        {
          title: 'Problem',
          content: 'FPS 게임을 개발하면서 가장 큰 Bottle Neck은 단순 반복 작업이었습니다. <br>예를 들어 총기 하나의 반동 패턴을 설정하는 데만 40분 가량이 걸렸고, 기획자가 "좀 더 위로 튀게 해주세요"라고 요청하면 개발자는 다시 수치를 조정하고 테스트하는 과정을 반복해야 했습니다. <br>3D 맵 화이트박싱의 경우 시야각 확인, 사물 배치 등의 커스텀을 거치면 한번의 맵 빌딩마다 8시간 가량의 시간이 소요되었습니다.<br><br>그래서 저희는 이런 반복 작업을 AI로 자동화하여 개발자 리소스 효율화를 통해 회사의 기회비용을 창출하고, 개발자 본인도 작업에 더 집중할 수 있는 환경을 구축하는 목표로 시작하였습니다.'
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'What We Built',
              list: [
                '새로운 게임 출시를 위한 기획 & 개발을 지원하는 3가지 AI 도구 설계 및 구축',
                'MCP(Model Context Protocol) 기반 도구 통합으로 자연어 명령 지원',
                'LangGraph + STT 기반 인게임 AI Agent "Javis" 구현'
              ]
            },
            {
              subtitle: 'Core Value',
              content: '<strong>MCP 도구와 AI Agent를 프로젝트 전반에 통합하여 기획부터 플레이까지의 워크플로우를 지능화하고, 단순 반복 작업의 제약 없이 누구나 아이디어를 즉시 구현할 수 있는 새로운 게임 개발 패러다임을 제시합니다.</strong>',
              image: {
                src: 'images/projects/valorithm_sequence_dev_flow.png',
                alt: 'VALORITHM 개발 흐름'
              }
            }
          ]
        },
        {
          title: 'AI Tools Overview',
          subsections: [
            {
              subtitle: '1. Discord MCP Agent',
              image: {
                src: 'images/projects/valorithm_discord.png',
                alt: 'Discord MCP Agent 아키텍처'
              },
              list: [
                '회의록 자동 요약 및 일정 리마인더',
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
                'NumPy 기반 3단계 사격 패턴 (초탄/중탄/후탄)',
                'Matplotlib 시각화 → Unreal Engine 즉시 적용',
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
                'OpenCV Canny Edge + Shapely/Open3D 활용',
              ]
            },
            {
              subtitle: '4. Javis AI Agent - PoC',
              image: {
                src: 'images/projects/valorithm_javis.png',
                alt: 'Javis AI Agent 아키텍처'
              },
              list: [
                'LangGraph + STT 기반 인게임 AI Agent "Javis" 설계',
                '개발 일정 상 PoC 수준의 간단한 구축만 Test 진행, 실제 게임에는 미적용'
              ]
            }
          ]
        },
        {
          title: 'What I Built & Technical Deep Dive',
          subsections: [
            {
              subtitle: 'MCP 기반 AI 시스템 설계',
              list: [
                'Claude와 Unreal Engine을 연결하는 MCP(Model Context Protocol) 서버 구축',
                'FastMCP 라이브러리를 이용한 서버 사이드 도구 등록 및 스키마 자동화 구현',
                '오픈 소스 "Unreal MCP Plugin"을 통한 엔진 직접 연동 지원'
              ]
            },
            {
              subtitle: 'Weapon Recoil Generator 개발',
              list: [
                'NumPy 기반의 3단계(초/중/후탄) 사격 반동 가중치 알고리즘 설계 및 구현',
                'np.cumsum() 연산을 통한 연속적인 총기 궤적 좌표 계산 로직 적용',
                '- 초탄: X축 최소 흔들림, Y축 수직 반동 집중',
                '- 중탄: 안정화 구간, 균일 분포 적용',
                '- 후탄: X축 강한 흔들림, 제어 난이도 상승',
                'Unreal MCP Plugin을 연동하여 엔진 내 에셋 즉시 반영 워크플로우 구축'
              ]
            },
            {
              subtitle: 'LangGraph Agent 검증 (PoC)',
              list: [
                'TypedDict를 활용한 에이전트 상태 관리 및 멀티턴 대화 로직 설계',
              ]
            }
          ]
        },
        {
          title: 'Metrics & Impact',
          subsections: [
            {
              subtitle: '정량적 성능 개선',
              list: [
                '총기 궤적 생성: 40분 → 30초 (약 98.7% 시간 단축)',
                '3D 화이트박싱: 8시간 → 2시간 (약 75% 시간 단축)',
              ]
            },
            {
              subtitle: '엔지니어링 의사결정',
              list: [
                'MCP 표준 채택: IDE 및 외부 LLM 환경과의 도구 호환성 확보',
                'LangGraph 도입: 복잡한 조건 분기가 필요한 대화 흐름의 가시성 및 제어권 확보',
                '기회비용 창출: 단순 반복 작업의 자동화로 핵심 개발 리소스 확보'
              ]
            }
          ]
        },
        {
          title: '성과 및 회고',
          subsections: [
            {
              subtitle: '주요 성과',
              gallery: [
                {
                  src: 'images/projects/valorithm_smithery_ai.png',
                  alt: 'Smithery.ai MCP Server',
                  caption: '1. smithery.ai에 배포된 MCP Server'
                },
                {
                  src: 'images/projects/valorithm_3d_map_build.png',
                  alt: '3D Map Building',
                  caption: '2. 3D Map building'
                }
              ],
              list: [
                '별도의 회의록 작성 없이도, Discord 채팅 기록을 자동 요약하여 매일 오전 10시 마다 공유',
                '총기 궤적 생성 40분 → 30초 (약 98.7% 시간 단축)',
                '3D 화이트박싱 8시간 → 2시간 (약 75% 시간 단축)',
                'MCP 표준 기반 도구 호환성 확보로 IDE/외부 LLM 환경 통합',
                '📎 <a href="https://www.canva.com/design/DAG9oBMaAzI/IVszVKdZleiL5Qbl-KIcZg/view?utm_content=DAG9oBMaAzI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb9d5937c48" target="_blank" rel="noopener noreferrer"><strong>시연 영상 확인하기 (Canva)</strong></a>'
              ]
            },
            {
              subtitle: '시행착오',
              content: '처음 MCP 도구를 설계할 때, Unreal Engine과의 연동 방식을 잘 모르던 상태였습니다. 그러던 중 오픈 소스 <strong>"Unreal MCP Plugin"</strong>을 발견했고, 이를 활용하여 엔진 내에서 직접 Remote 형식의 도구를 호출하는 방식으로 시스템 설계를 진행하였습니다.<br>그러나 문제는 여기서부터 시작이었습니다. 해당 Plugin의 경우 미국의 대학생이 개발한 개인 프로젝트였기 때문에 사실상 완성된 기능이 아니었고, 연동을 여러차례 도전했지만 결국 언리얼 엔진과 MCP 서버 간의 Remote 통신을 구현 할 수 없었습니다.<br>결국 저희는 Local 통신으로 시스템 설계를 변경하여 계획을 수정하게 되었습니다. <br><br>이 경험을 통해 오픈 소스 활용 시, 반드시 사전 검증 단계를 거쳐야 한다는 점과, 예상치 못한 상황에 유연하게 대처하기 위해서는 기본적인 엔지니어링 능력을 갖춰야, 대안을 내놓을 수 있다는 중요성을 다시금 깨닫게 되었습니다.'
            },
            {
              subtitle: '기술적 성장',
              content: '보통은 남들이 개발해서 배포한 MCP 도구를 호출하여, 프로젝트에 적용하는 경우가 많다고 생각합니다. 하지만 저는 이번 프로젝트를 통해 MCP 서버를 직접 설계하고 구축하는 경험을 하면서, 내부 동작 원리와 프로토콜에 대해 이해도가 높아졌습니다.<br>그리고 개인적으로 가장 큰 소득이라고 느끼는 \'서버\'의 역할에 대해서 이해하는 과정이었다고 생각합니다.<br>특히, 제가 배포했던 Smithery.ai 마켓플레이스의 경우 자체 서버를 제공하면서 개발자들을 유도했었는데, 개발 당시에는 장점에 대해서 체감하지 못하다가 배포가 끝난 후에야 이해하게 되었던 기억이 있습니다.<br><br>이를 통해서 유지/보수 관점에서 서버를 바라보는 시각을 가지게 되었고, 확장 가능한 설계란 무엇인지 서버의 개념을 통해 이해하는 계기가 되었습니다. 다음 프로젝트부터는 시스템 아키텍처 설계 단계부터 Infrastructure as Code의 개념을 접목시켜서, 더 나은 시스템을 구축할 수 있을 것 같습니다.'
            }
          ]
        }
      ],
      tags: ['MCP', 'LangGraph', 'RAG', 'FastMCP', 'NumPy', 'ChromaDB', 'Whisper', 'Unreal Engine', 'FastAPI']
    },
    komi: {
      title: 'KOMI - AI 기반 원격 재활 진료 서비스',
      image: 'images/projects/komi_realtime_feedback.png',
      meta: {
        organization: 'Wanted Learning',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.03 (1개월)',
        architecture: 'FastAPI + WebSocket + RAG Pipeline'
      },
      sections: [
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: 'Social Impact',
              content: '고령화와 만성질환 증가로 재활 수요가 급증하고 있지만, 거동이 불편한 노약자나 <strong>농어촌, 도서산간, 등대지기, 군부대</strong> 등 의료 시설이 부족한 지역의 사용자들은 재활 치료를 위한 병원 방문이 어렵습니다. 특히 물리치료사의 실시간 피드백 없이는 올바른 자세로 운동하기 힘든 상황입니다.'
            },
            {
              subtitle: 'Economic Impact',
              content: '건강보험 재정 고갈 위기가 심화되는 상황에서, 치료 중심이 아닌 <strong>예방적 건강관리 모델</strong>의 필요성이 대두되고 있습니다. 저비용·고효율의 재활 솔루션으로 의료비 부담을 줄이고 건보 재정 건전성에 기여할 수 있는 방안이 필요합니다.'
            },
            {
              subtitle: 'Technical Challenge',
              content: '<strong>- Real-time Streaming:</strong> WebSocket과 멀티스레딩을 활용한 영상 동기화 및 지연 시간 최소화가 필요합니다.<br><strong>- RAG Validation:</strong> LLM이 생성한 재활 피드백의 환각(Hallucination) 현상을 방지하고, 의료적 신뢰성을 확보하기 위한 객관적 검증 체계가 필요합니다.'
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'What we built',
              list: [
                'YOLO11 기반 Pose Estimation Engine (실시간 자세 감지)',
                '자세 평가 데이터셋 및 알고리즘 (Reference Pose 비교)',
                'LangChain 기반 RAG 시스템 (의료 문헌 검색 + 피드백 생성)',
                'WebSocket 기반 Real-time Communication (멀티캠 동기화)',
                'RAGAS 평가 프레임워크 (RAG 품질 검증)'
              ]
            },
            {
              subtitle: 'Core Value',
              list: [
                '<strong>Core Concept:</strong> 멀티 웹캠을 통해 실시간으로 사용자의 움직임을 분석하고, AI가 맞춤형 운동 피드백을 제공하는 원격 재활 진료 서비스. YOLO11 기반 포즈 감지와 LLM 기반 피드백 생성을 결합하여, 언제 어디서나 맞춤형 재활 가이드 제공',
                '<strong>Dual-View Analysis:</strong> 전면과 측면 카메라를 동시에 활용하여 3차원적인 자세 분석 수행. 단일 시점에서 놓치기 쉬운 깊이 정보와 관절 각도를 정밀하게 추출하여 분석 정확도 향상',
                '<strong>Evidence-based Feedback:</strong> VectorDB에 의료 논문 및 전문 재활 문헌을 저장하여, RAG 파이프라인을 통해 의학적 근거를 갖춘 맞춤형 교정 피드백 제공'
              ]
            }
          ]
        },
        {
          title: 'System Architecture',
          gallery: [
            {
              src: 'images/projects/komi_architecture.png',
              alt: 'KOMI Overall Architecture',
              caption: '1. 전체 시스템 워크플로우: 사용자 입력부터 피드백 생성까지'
            },
            {
              src: 'images/projects/komi_pose_estimation_architecture.png',
              alt: 'Pose Estimator Architecture',
              caption: '2. Pose-Estimator: YOLO11 기반 실시간 포즈 감지 시스템'
            },
            {
              src: 'images/projects/komi_rag_pipeline_architecture.png',
              alt: 'RAG Pipeline Architecture',
              caption: '3. LangChain 기반 RAG Pipeline: OpenAI Embedding + ChromaDB'
            },
            {
              src: 'images/projects/komi_web_server_architecture.png',
              alt: 'Multi-Modal WebSocket',
              caption: '4. Multi-Modal WebSocket: 2개 카메라 동기화 실시간 스트리밍'
            }
          ]
        },
        {
          title: 'Service Flow',
          subsections: [
            {
              subtitle: '정밀 분석 모드',
              content: '운동 선택 → 가이드 영상 학습 → 영상 녹화 → 프레임 추출 → YOLO11 포즈 감지 → 기준 자세 비교 → 관절별 정확도 산출 → LLM 피드백 생성 → 결과 시각화'
            },
            {
              subtitle: '실시간 분석 모드',
              content: '운동 선택 → 웹캠 연결 → Base64 인코딩 → WebSocket 실시간 전송 → 포즈 감지 → 정확도 스코어 계산 → 즉시 피드백 표시'
            }
          ],
          gallery: [
            {
              src: 'images/projects/komi_web_pages.png',
              alt: 'Main Screen',
              caption: '1. 메인 화면 - 운동 선택'
            },
            {
              src: 'images/projects/komi_guide.png',
              alt: 'Exercise Guide',
              caption: '2. 운동 가이드 - 올바른 자세 학습'
            },
            {
              src: 'images/projects/komi_segmentation.png',
              alt: 'Pose Analysis',
              caption: '3. 정밀 분석 - Segmentaion-based 영상 녹화 및 자세 분석'
            },
            {
              src: 'images/projects/komi_analyzer_result1.png',
              alt: 'Analysis Result 1',
              caption: '4. 분석 결과 - 관절별 정확도 표시'
            },
            {
              src: 'images/projects/komi_analyzer_result2.png',
              alt: 'Analysis Result 2',
              caption: '5. 분석 결과 - LLM 기반 개선 제안'
            },
            {
              src: 'images/projects/komi_realtime_feedback.png',
              alt: 'Realtime Analysis',
              caption: '6. 실시간 분석 - 즉각적인 자세 피드백'
            }
          ]
        },
        {
          title: 'What I Built',
          subsections: [
            {
              subtitle: '1. Pose Estimation Engine',
              content: '<code>YoloPoseModel</code> 클래스 기반 실시간 포즈 감지 엔진을 구축했습니다.',
              list: [
                'YOLO11n 모델을 활용한 실시간 자세 감지 엔진 구축',
                '17개 COCO Keypoints 추출: nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles',
                'OpenCV 기반 프레임 처리 및 키포인트 시각화 구현',
                '<code>conf_threshold=0.5</code> 이상 신뢰도 관절만 필터링',
                '<code>SKELETON</code> 배열 기반 관절 연결선 시각화 (팔, 다리, 몸통)',
                'Base64 인코딩 이미지 ↔ NumPy 배열 변환 처리'
              ]
            },
            {
              subtitle: '2. 자세 평가 데이터셋 및 알고리즘',
              content: '정확한 자세 비교를 위한 데이터셋과 <code>PoseAnalyzer</code> 클래스 기반 평가 알고리즘을 개발했습니다.',
              list: [
                '정확한 자세(Reference Pose) 데이터 수집 및 정제',
                '흐트러진 자세별 원인 분석 및 문제점 매핑',
                '자세-원인-해결책 3단계 데이터 구조 설계',
                '벡터 내적을 활용한 관절 각도 계산 (<code>_calculate_angle</code>)',
                'L2 거리 + 코사인 유사도 기반 유사도 평가',
                '참조 자세 대비 15도 이상 차이 시 오류 관절로 분류'
              ]
            },
            {
              subtitle: '3. LangChain 기반 RAG 시스템',
              content: 'LangChain + ChromaDB 기반 의료 문헌 검색 및 피드백 생성 시스템을 구축했습니다.',
              list: [
                '<code>OpenAIEmbeddings()</code>로 의료 PDF 문서 벡터화',
                '<code>ChromaDB</code> Vector Store 구축 및 검색 파이프라인 구현',
                '<code>retriever.as_retriever(search_type="similarity", k=5)</code> 유사 문서 검색',
                '<code>RunnableMap</code> → <code>PromptTemplate</code> → <code>ChatOpenAI(gpt-4o-mini)</code> 체인 구성',
                '관절별 오류 통계를 자연어 프롬프트로 변환 (<code>generate_summary_prompt</code>)',
                '의료 전문가 관점의 프롬프트 엔지니어링'
              ]
            },
            {
              subtitle: '4. RAGAS 평가 프레임워크 적용',
              content: 'RAG 시스템의 품질을 객관적으로 검증하기 위해 RAGAS 프레임워크를 도입했습니다.<br>- "검색이 정확한가?"<br>- "답변이 질문에 맞는가?"<br>- "답변이 근거에 충실한가?"<br>위와 같은 핵심 질문에 대한 정량적 지표를 확보하여, 단순 체감이 아닌 데이터 기반의 품질 관리 체계를 구축했습니다.'
            }
          ]
        },
        {
          title: '성과 및 회고',
          subsections: [
            {
              subtitle: '주요 성과',
              list: [
                'YOLO11 + LangChain 통합 재활 서비스 구현',
                '정밀 분석 / 실시간 분석 듀얼 모드 개발',
                'WebSocket 기반 멀티캠 동기화 구현',
                'RAGAS 평가 지표를 통한 RAG 성능 검증'
              ]
            },
            {
              subtitle: 'RAGAS 평가 결과',
              image: {
                src: 'images/projects/komi_ragas.png',
                alt: 'RAGAS Evaluation Results',
                caption: 'RAGAS 프레임워크를 활용한 RAG 파이프라인 객관적 성능 지표'
              },
              list: [
                'Context Precision: 1.0 (100%) - 검색된 문맥이 질문과 높은 관련성 확보',
                'Context Recall: 1.0 (100%) - 필요한 정보가 누락 없이 검색됨',
                'Answer Relevancy: 0.82 (82%) - 생성된 답변이 질문에 적절히 대응',
                'Faithfulness: 0.61 (61%) - 문맥 충실도는 개선 필요 영역으로 식별, 프롬프트 엔지니어링 고도화 방향 도출'
              ]
            },
            {
              subtitle: '시행착오',
              content: '이번 프로젝트에서 가장 어려웠던 부분은 의료 데이터 수집이었습니다.<br>의료 데이터는 개인정보 보호 이슈가 크고, AI-Hub에 공개된 데이터 역시 일정 비용이 필요해 초기 기획을 그대로 유지하기에는 현실적인 제약이 컸습니다.<br><br>이로 인해 당초 계획했던 재활 운동 교정 프로젝트를 \'자세 교정 중심 프로젝트\'로 전환하게 되었습니다.<br>그러나 프로젝트 방향을 변경한 이후에도 또 다른 문제에 직면했습니다.<br>팔 관절을 들어 올리지 못하는 원인을 사전에 정의하고 학습시켜 문제를 예측하려 했지만, 데이터 적재 후 정형외과 전문의에게 자문한 결과 단일 2D 카메라 기반 분석만으로는 의학적 기준을 설정하기 어렵다는 결론에 이르렀습니다. 실제 현장에는 너무 많은 Edge Case가 존재했습니다.<br><br>이 판단을 계기로, 저희는 의학적 해석을 무리하게 자동화하기보다는 \'정확한 동작 수행 여부\'에 집중하는 방향으로 문제를 재정의하였고, 그 결과 현재와 같은 형태의 프로젝트로 발전하게 되었습니다.<br><br>한편, 기획 단계에서 고려했던 민간 보험사 연계 B2B 모델은 1개월이라는 제한된 기간과, 변경된 프로젝트 목표 설정으로 인해 핵심 기능 구현에 집중하면서 완성하지 못한 부분으로 남았습니다. 다만 사용자의 재활 운동 수행도에 따른 보험료 할인 인센티브 제공, B2B 피트니스 센터·재활병원 연동, B2C 홈트레이닝 앱 확장, 게이미피케이션 요소 추가 등은 향후 확장 가능성으로 남겨두었습니다.'
            },
            {
              subtitle: '기술적 성장',
              content: '본 프로젝트를 통해서 가장 크게 얻은것은, 기술적으로 가능한 것과, 책임 있게 제공할 수 있는 것의 경계를 고민하게 된 부분인 것 같습니다.<br><strong>"요즘 시대에 AI가 못하는게 어디있냐"</strong>라는 얘기를 많이 듣게 되는데요. 이러한 인식의 개선이 반드시 필요하다고 느꼈고, 사람과 AI의 차이가 어디서 오는것인지 명확하게 나타난 프로젝트였다고 생각합니다.<br><br>또한 LangChain 라이브러리를 처음 활용한 프로젝트로서 LLM을 활용한 RAG 시스템 구축 경험을 쌓을 수 있었습니다. RAGAS 평가 기준을 도입하여 객관적인 성능 지표를 확보한 점도 좋았던 것 같습니다. 앞으로도 RAG 시스템의 신뢰성과 품질을 지속적으로 개선하는 데 이 경험이 큰 도움이 될 것이라 생각합니다.'
            }
          ]
        }
      ],
      tags: ['YOLO11', 'Pose Detection', 'LangChain', 'RAG', 'ChromaDB', 'WebSocket', 'FastAPI', 'Streamlit', 'OpenCV']
    },
    bemymuse: {
      title: 'BE MY MUSE - KoGPT-2 기반 감성 작사 AI',
      image: 'images/projects/bemymuse_lyrics.png',
      meta: {
        organization: 'Wanted Learning',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.01 (1개월)',
        architecture: 'FastAPI + Fine-Tuning Pipeline'
      },
      sections: [
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: '공모전 배경',
              content: 'MUSE Label의 "BE MY MUSE" 공모전은 작곡된 음악을 듣고, 해당 음악에 어울리는 가사를 작성하여 제출하는 대회였습니다. 제공된 음악은 감수성 높은 발라드였고, 우리 팀은 "직접 작사하지 말고, AI에게 맡겨보자"라는 아이디어로 프로젝트를 시작했습니다.'
            },
            {
              subtitle: 'Technical Challenge',
              content: '한국어에 강한 KoGPT-2를 선택했지만, 이 모델은 뉴스, 소설, 보고서 등 문어체 텍스트로 학습되어 있었습니다. 감수성 높은 발라드 가사를 생성하기에는 부적합했고, 모델이 감성적인 가사를 생성할 수 있도록 Fine-Tuning이 필요했습니다.'
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'Core Concept',
              content: '문어체로 학습된 KoGPT-2를 감수성 높은 가사 데이터로 Fine-Tuning하여, 3개의 키워드만 입력하면 발라드에 어울리는 감성적인 가사를 자동 생성하는 모델을 개발했습니다.'
            },
            {
              subtitle: 'Key Features',
              list: [
                '멜론 차트 기반 7,439곡 한국어 가사 데이터셋 구축',
                'KoGPT-2 Fine-Tuning을 통한 감성 가사 생성 모델 개발',
                'BLEU, ROUGE, Perplexity 기반 생성 품질 평가',
                '43개 감정 카테고리 기반 감성 분석 (KOTE 모델)'
              ]
            }
          ]
        },
        {
          title: 'What I Built',
          subsections: [
            {
              subtitle: '1. 데이터 수집',
              content: '전체 수집 된 7,439곡 중 힙합 장르 데이터 수집을 담당했습니다. <br>Selenium을 활용한 멜론 차트 동적 크롤링으로 가사 데이터를 확보했습니다.'
            },
            {
              subtitle: '2. 모델 Fine-Tuning',
              list: [
                'RTX 4090 GPU 2장을 활용한 학습 환경 구축',
                'KoGPT-2 (skt/kogpt2-base-v2) 모델 Fine-Tuning 전 과정 단독 수행',
                'temperature, top_k, top_p 등 생성 파라미터 최적화',
                '학습률, 배치 사이즈, 에폭 수 등 하이퍼파라미터 튜닝',
                '과적합 방지를 위한 최적 학습 횟수를 결과를 통해 도출'
              ]
            },
            {
              subtitle: '3. 모델 평가',
              list: [
                '3개 키워드 입력 → 가사 생성 결과물 평가',
                'BLEU Score: 생성된 텍스트의 n-gram 정확도 측정',
                'ROUGE Score: 참조 텍스트와의 중복 정도 평가',
                'Perplexity: 언어 모델의 확신도 및 자연스러움 측정'
              ]
            }
          ]
        },
        {
          title: 'Data Pipeline',
          list: [
            '데이터 수집: Selenium을 활용한 멜론 차트 동적 크롤링 (7,439곡)',
            '전처리: 중복 제거, 정규화, 토큰화 → 4,840곡 학습 데이터셋 확보',
            '토크나이저: KoGPT2 토크나이저 활용, 특수 토큰 추가',
            '학습 형식: [BOS] 키워드: {keyword} 가사: {lyrics} [EOS]'
          ]
        },
        {
          title: 'Model Architecture',
          image: {
            src: 'images/projects/bemymuse_validation_graph.png',
            alt: 'Training Validation Graph',
            caption: 'KoGPT2 Fine-tuning 학습 곡선 - Epoch별 Loss 변화'
          },
          subsections: [
            {
              subtitle: 'Fine-tuning 설정',
              list: [
                'Base Model: SKT KoGPT2-base-v2 (125M parameters)',
                'GPU: RTX-4090 (24GB VRAM)',
                'Hyperparameters: lr=5e-5, batch_size=8, epochs=10',
                'Optimizer: AdamW with weight decay'
              ]
            },
            {
              subtitle: '생성 파라미터 최적화',
              list: [
                'temperature: 0.8 (창의성과 일관성 균형)',
                'top_k: 50, top_p: 0.95 (다양성 확보)',
                'repetition_penalty: 1.2 (반복 방지)'
              ]
            }
          ]
        },
        {
          title: 'Service Demo',
          subsections: [
            {
              subtitle: '1. 서비스 시작 화면',
              image: {
                src: 'images/projects/bemymuse_service_start.png',
                alt: 'Service Start Screen',
                style: 'width: 50%; height: auto;'
              }
            },
            {
              subtitle: '2. AI가 생성한 가사 결과',
              image: {
                src: 'images/projects/bemymuse_lyrics.png',
                alt: 'Generated Lyrics',
                style: 'width: 50%; height: auto;'
              }
            },
            {
              subtitle: '3. 감성 분석 시각화',
              image: {
                src: 'images/projects/bemymuse_service_kote.png',
                alt: 'Emotion Analysis',
                style: 'width: 50%; height: auto;'
              }
            },
            {
              subtitle: '4. 성능 평가 결과',
              image: {
                src: 'images/projects/bemymuse_service_metrics.png',
                alt: 'Performance Evaluation',
                style: 'width: 50%; height: auto;'
              }
            }
          ]
        },
        {
          title: 'Metrics & Evaluation',
          subsections: [
            {
              subtitle: '정량적 평가 지표',
              content: '<strong>일반적인 NLP 태스크 기준</strong><br>• BLEU: 0~1 범위, 0.3 이상이면 양호 (번역 태스크 기준)<br>• ROUGE: 0~1 범위, 높을수록 참조 텍스트와 유사 (요약 태스크 기준)<br>• Perplexity: GPT-2 벤치마크 기준 약 16~20, 낮을수록 자연스러운 문장<br><br><strong>BeMyMuse Model Task 해석</strong><br>공모전 주제가 직접 작사한 가사, 즉 <strong>창의성</strong>이 중요한 과제였으므로, BLEU/ROUGE가 너무 높으면 오히려 기존 가사와 유사하여 표절 논란이 있을 수 있다고 생각했습니다.<br>따라서 <strong>적절히 낮은 BLEU/ROUGE + 낮은 Perplexity</strong>가 <strong>"창의적이면서 자연스러운 가사"</strong>의 지표가 됩니다.'
            },
            {
              subtitle: '감성 분류 검증',
              content: 'KOTE (Korean Online That Evaluation) 모델을 활용하여 생성된 가사를 43개 감정 카테고리로 분류했습니다.<br><br>발라드 가사에 적합한 감정(슬픔, 그리움, 사랑, 외로움 등)이 높은 비율로 검출되는지 확인하여, Fine-Tuning된 모델이 목표로 한 감성적 가사를 생성하는지 검증했습니다.'
            }
          ]
        },
        {
          title: '성과 및 회고',
          subsections: [
            {
              subtitle: '주요 성과',
              list: [
                '4,840곡의 정제된 노래 가사 데이터셋 구축',
                'KoGPT-2 Fine-tuning으로 자연스러운 가사 생성 모델 개발',
                'FastAPI + Streamlit UI 완성도 높은 서비스 구현',
                '감성 분석과 문맥 구조 시각화로 AI 창작 지원 도구의 가능성 입증'
              ]
            },
            {
              subtitle: '시행착오',
              content: '처음에는 KoNLPy와 국립국어원 말뭉치를 기반으로 랜덤 조합 방식의 가사 생성을 시도했습니다. 하지만 한글은 조사, 어미 변화 등 문법 구조가 복잡하여 단순 조합으로는 자연스러운 문장을 만들 수 없다는 것을 깨달았습니다.<br>사실 이때 정말 많이 고생했습니다. 딥러닝에 대한 이해도와, 엔지니어링 지식이 부족하기도 했지만, 한국어가 갖고 있는 고유한 특성들을 파악하지 못했기 때문입니다. 이는 제가 한국에서 태어나, 자연스럽게 한국어를 사용하다보니 느끼지 못했던 문제였습니다.<br><br>하지만 생성형 AI에 대한 공부를 꾸준히 하면서, 한국어의 복잡한 문법 구조도 대규모 언어 모델이 충분히 학습할 수 있다는 확신이 들었고, KoGPT-2 모델을 선택하여 Fine-Tuning을 계속 진행하게 되었습니다. 아직 Perplexity 수치가 다소 높아 개선의 여지는 있지만, 모델이 점차 한국어 문법과 감성적 표현을 학습해가는 모습을 보면서 큰 보람을 느꼈고 더 높은 목표를 갖게 된 것 같습니다.'
            },
            {
              subtitle: '기술적 성장',
              content: '이 프로젝트를 통해 Pre-Training과 Post-Training(Fine-Tuning)의 차이, SFT(Supervised Fine-Tuning)의 개념을 이해하게 되었습니다.무엇보다 LLM은 "지능"이 아니라 <strong>"확률 예측 기반의 토큰 생성기"</strong>라는 본질을 알게 된 것이 가장 큰 수확이었습니다.<br>이 이해를 바탕으로 모델의 한계와 가능성을 객관적으로 판단할 수 있게 되었습니다.<br>그리고 한글이라는 언어는 Token의 효율화가 아직 덜 되어 있어, 영어 기반 모델보다 더 많은 데이터와 학습이 필요하다는 점도 깨달았습니다. 이는 저에게 앞으로도 한국어 NLP 모델을 개발하기 위한 중요한 목적의식이 되었다고 생각합니다.'
            }
          ]
        }
      ],
      tags: ['KoGPT2', 'Fine-Tuning', 'NLP', 'Transformers', 'PyTorch', 'FastAPI', 'Streamlit', 'BLEU', 'ROUGE', 'Selenium']
    },
    perfectpose: {
      title: 'PerfectPoses - AI 자세 인식 파티 게임',
      image: 'images/projects/perfectposes_game_main.gif',
      meta: {
        organization: 'Wanted Learning',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.03 (24시간)',
        architecture: 'FastAPI + WebSocket + Real-time AI'
      },
      sections: [
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: 'Project Background',
              content: '<strong>"24시간 안에 기획부터 배포까지"</strong> - 본 프로젝트는 Fast Builder Challenge로 진행된 미션이었습니다.<br>저희는 24시간 안에 E2E 서비스 구축을 완성해야 했기에, 많은 Reference를 검토하였고 최종적으로 Steam의 "Perfect Poses"를 기반으로 플레이어가 화면에 제시된 자세를 따라하면 AI가 실시간으로 정확도를 측정하여 점수를 부여하는 리듬 게임을 개발하기로 하였습니다.'
            },
            {
              subtitle: 'Technical Challenge',
              content: '가장 큰 도전은 <strong>AI 팀(Python)과 Unreal 팀(C++) 간의 실시간 데이터 브릿지</strong>를 구축하는 것이었습니다.<br>웹캠을 30fps로 설정하여 캡처되는 영상을 YOLO-Pose로 Detecting하고, 17개 관절 좌표를 최적화된 WebSocket을 통해 Unreal Engine에 지연 없이 전달하여, 짧은 개발 기간 내에 완성도 높은 게임플레이 경험을 제공해야 했습니다.'
            },
            {
              subtitle: 'Fast Builder Mindset',
              content: '완벽한 코드보다 <strong>"동작하는 프로토타입"</strong>을 우선시 했습니다.<br>기술적 완성도와 시간 제약 사이에서 빠른 의사결정이 요구되었고, 협업간의 명확한 인터페이스 정의가 핵심이었습니다.'
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'What We Built',
              list: [
                'YOLO11-Pose 기반 실시간 17개 관절 좌표값 검출 엔진',
                'FastAPI 비동기 WebSocket 서버 (AI ↔ Unreal 브릿지)',
                'Meta AI SAM 라이브러리를 활용한 Player Segmentation 모듈',
                'Unreal Engine 5 게임 클라이언트 (자세 매칭 + 스코어링)',
                'Bllossom (한국어 LLM) 활용 자세 피드백 생성'
              ]
            },
            {
              subtitle: 'Core Value',
              content: '24시간이라는 시간 제약 속에서 <strong>기획 → 설계 → 개발 → 테스트 → 배포</strong>까지 End-to-End 파이프라인을 완성했습니다.<br>AI 팀과 Unreal 팀이 병렬로 작업할 수 있도록 <strong>API 인터페이스를 먼저 정의</strong>하고, 각 팀이 독립적으로 개발한 후 통합하는 전략을 채택했습니다. 이를 통해 실무에서 늘 있을 수 있는, 서로 다른 조직과의 협업 프로젝트 경험을 간접적으로나마 체험하기로 하였습니다.'
            }
          ]
        },
        {
          title: 'Project Workflow',
          image: {
            src: 'images/projects/perfectposes_workflow.png',
            alt: 'PerfectPoses Project Workflow',
            caption: '24시간 Fast Builder 프로젝트 흐름: <strong>기획 → 인터페이스 정의 → 병렬 개발 → 통합 → 배포</strong>'
          },
          subsections: [
            {
              subtitle: 'Data Flow',
              content: '웹캠 캡처 (30fps) → OpenCV 전처리 → YOLO11-Pose 추론 → 17개 관절 좌표 추출 → JSON 직렬화 → FastAPI REST API → Unreal Engine 렌더링 → 자세 매칭 & 스코어 계산'
            },
            {
              subtitle: 'Communication Protocol',
              content: 'AI 서버와 Unreal 클라이언트 간 통신은 <strong>JSON over HTTP</strong>로 구현했습니다. Unreal에서 주기적으로 `/api/pose` 엔드포인트를 폴링하여 최신 자세 데이터를 가져오는 방식입니다. 실시간성이 중요한 게임이므로 응답 지연을 최소화하기 위해 비동기 처리와 싱글톤 모델 인스턴스 패턴을 적용했습니다.'
            }
          ]
        },
        {
          title: 'What I Built',
          subsections: [
            {
              subtitle: '1. Project Leading (PL)',
              content: '중고 신입의 강점을 살려서, 이전 PM 경력을 바탕으로 프로젝트 전반을 리딩했습니다.',
              list: [
                '<strong>킥오프 & 기획 확정:</strong> 레퍼런스 게임 분석 → AI 핵심 기능 협력 계획 정의 → MVP 범위 설정',
                '<strong>팀 구성 & 역할 분배:</strong> AI 3명 / Unreal 3명 역할 명확화, 병렬 작업 가능하도록 태스크 분리',
                '<strong>인터페이스 선정의:</strong> AI-Unreal 간 API 명세서를 방향 수립 이후, 3시간 내 확정하여 양 팀 독립 개발 가능하도록 조치',
                '<strong>일정 관리:</strong> 24시간을 4단계(기획/개발/통합/마무리)로 분할하고, 단계 별 발표 전략 수립',
                '<strong>리스크 관리:</strong> 통합 테스트 시점을 중간에 배치하여 조기 이슈 발견 및 대응 전략 마련'
              ]
            },
            {
              subtitle: '2. YOLO-Pose Engine',
              content: '<code>PoseEstimator</code> 클래스 기반 실시간 포즈 감지 엔진을 구축했습니다.',
              gallery: [
                {
                  src: 'images/projects/perfectposes_pose_estimation1.jpg',
                  alt: 'YOLO-Pose 실시간 추론 테스트 1'
                },
                {
                  src: 'images/projects/perfectposes_pose_estimation2.gif',
                  alt: 'YOLO-Pose 실시간 추론 테스트 2'
                }
              ],
              list: [
                'YOLO11n-pose 모델 활용 (경량화로 실시간 처리 가능)',
                '17개 COCO Keypoints 추출: nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles',
                '<code>conf_threshold=0.5</code> 이상 신뢰도 관절만 필터링',
                '싱글톤 패턴으로 모델 로딩 오버헤드 제거',
                'OpenCV 기반 프레임 처리 및 키포인트 시각화'
              ]
            }
          ]
        },
        {
          title: 'Service Demo',
          content: '📎 <a href="https://www.canva.com/design/DAG9v3E2r_Y/xg9HqKSgq7AJfvZ5TQv-zw/view?utm_content=DAG9v3E2r_Y&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h917814d62f" target="_blank" rel="noopener noreferrer"><strong>시연 영상 확인하기 (Canva)</strong></a>'
        },
        {
          title: '성과 및 회고',
          subsections: [
            {
              subtitle: '주요 성과',
              list: [
                '<strong>24시간 내, MVP 단계의 E2E 게임 서비스 완성</strong> (기획 → 배포)',
                'AI 3명 + Unreal 3명 팀 효율적 협업 체계 구축',
                'YOLO-Pose + SAM + FastAPI + UE5 기술 스택 통합',
                '평균 API 응답 시간 <strong>< 50ms</strong> 달성',
                '실시간 30fps 웹캠 기반 자세 감지 구현'
              ]
            },
            {
              subtitle: '시행착오',
              content: '초기 기획에서는 YOLO-Pose로 추출한 Keypoints를 기반으로 Unreal Engine 내에서 <strong>사람을 따라하는 캐릭터 모션</strong>을 구현하기로 계획했습니다. 하지만 통합 테스트 단계에서 문제를 발견하게 되었는데, AI 서버에서 전달한 Keypoints 좌표 변경값은 정상적으로 인식되었지만, Unreal 측 캐릭터 UI가 이를 자연스러운 움직임으로 변환하지 못했습니다. 사람처럼 자연스럽게 움직이려면 관절별 회전값과 뼈 구조에 대한 깊은 이해가 필요했고, 24시간이라는 제한된 시간 안에 이를 구현하기는 현실적으로 불가능했습니다.<br>이때, 저는 처음으로 많이 당황했던 것 같습니다. 게임 개발 경험이 전무했기 때문에, 어떤 대안을 내놓아야 하는지 감을 잡지 못했던 기억이 납니다.<br><br>하지만 팀원들의 아이디어와 빠른 실행력으로 전략을 수정하여, 복잡한 캐릭터 애니메이션 대신 <strong>Point-to-Point 레이저 연결 방식</strong>으로 UI를 단순화했습니다. 그 결과 "언리얼 엔진치고는 저퀄리티"라는 아쉬움은 남았지만, 핵심 게임 로직과 자세 인식 기능을 시간 내에 완성할 수 있었습니다. 이 경험을 통해 MVP 단계에서는 완성도보다 핵심 기능 구현에 먼저 집중하는 것이 중요하다는 것을 체감했습니다.'
            },
            {
              subtitle: '기술적 성장',
              content: '이 프로젝트를 통해 저는 <strong>\'완벽한 코드\'</strong> 보다 <strong>\'동작하는 프로토타입\'</strong>이 더 중요할 수 있다는 사실을 체감했습니다.<br>제한된 시간 안에서 어떤 기능에 집중하고 무엇을 과감히 내려놓을지 판단하는 것이 프로젝트 완성도를 결정했다고 생각합니다.<br><br>특히, <strong>인터페이스를 먼저 정의하는 것</strong>이 협업 개발에서 굉장히 중요하다는것을 느꼈습니다.<br>API 스펙을 초기에 확정함으로써 AI 팀과 Unreal 팀은 서로를 기다리지 않고 독립적으로 개발할 수 있었습니다.<br><br>또 하나의 배움은, <strong>통합 테스트 과정</strong>이었습니다.<br>개별 기능은 정상 동작했지만, 시스템을 연결하는 순간 예상치 못한 문제가 드러났고, 만약 프로젝트 기획에서 테스트 시점을 마지막에 배치했다면 아마 완성하지 못했을 프로젝트였을거라고 생각합니다.<br>이후 TDD와 단위·통합 테스트의 개념을 접하며, 테스트가 더 높은 품질의 코드를 만들기 위한 기반이라는 인식을 갖게 되었습니다.'
            },
          ]
        }
      ],
      tags: ['YOLO11-Pose', 'FastAPI', 'SAM', 'Unreal Engine 5', 'OpenCV', 'PyTorch', 'REST API', 'Real-time', 'Game Dev']
    },
    econdigest: {
      title: 'EconDigest - 경제 유튜브 요약',
      image: 'images/projects/econdigest_frontend_start.png',
      meta: {
        organization: 'Wanted Learning',
        role: 'Project Lead / Tech Lead(AI)',
        period: '2025.01 (1개월)',
        architecture: 'FastAPI + STT/LLM Pipeline'
      },
      sections: [
        {
          title: 'Problem',
          subsections: [
            {
              subtitle: 'Business Challenge',
              content: '<strong>시성비(시간 대비 효율) 트렌드</strong> - 영상이나 음성 콘텐츠에서 원하는 부분만 빠르게 취사선택하려는 소비자가 늘어남에 따라, 요약 서비스의 필요성이 대두되었습니다.'
            },
            {
              subtitle: 'Social Challenge',
              content: '<strong>시니어 금융 리터러시</strong> - 5060 세대가 모바일 자산관리 및 금융 거래에 적극적으로 참여하고 있으나, 복잡한 정보를 습득하는 데 여전히 어려움을 겪고 있습니다.'
            },
            {
              subtitle: 'User Pain Points',
              list: [
                '긴 영상 시청에 대한 부담',
                '전문 금융 용어 이해의 어려움',
                '중요한 내용을 놓치는 문제'
              ]
            }
          ]
        },
        {
          title: 'Solution',
          subsections: [
            {
              subtitle: 'What We Built',
              content: '<strong>AI 기반 경제 유튜브 채널 요약 서비스</strong><br><br>클릭 한 번으로 영상을 요약 보고서로 변환하는 웹 애플리케이션입니다. Whisper(STT)와 Gemma 2(LLM)를 활용한 "음성 추출 → 텍스트 변환 → 요약" 파이프라인을 구축했습니다.'
            },
            {
              subtitle: 'Core Value',
              list: [
                '<strong>효율적인 정보 전달</strong>: 경제 및 금융 영상의 내용을 분석하여 높은 효율의 문서화된 정보를 생성',
                '<strong>금융 지식 격차 해소</strong>: 정보 접근성이 낮은 타겟 사용자들이 경제 정보를 더 쉽게 접하도록 지원'
              ]
            },
            {
              subtitle: 'Target Users',
              list: [
                'AI/금융 비전문가 (시니어층)',
                '바쁜 직장인 및 학생'
              ]
            }
          ]
        },
        {
          title: 'Architecture Overview',
          list: [
            '<strong>오디오 추출</strong>: yt-dlp + FFmpeg (192kbps MP3)',
            '<strong>음성-텍스트 변환</strong>: OpenAI Whisper-large-v3 (잡음에 강하고 한국어 인식 정확도 높음)',
            '<strong>텍스트 요약</strong>: Google Gemma-2-2b-it (QLoRA 파인튜닝, 4-bit 양자화)',
            '<strong>백엔드</strong>: FastAPI (3개 라우터: Audio, STT, Summary)',
            '<strong>프론트엔드</strong>: Streamlit'
          ]
        },
        {
          title: 'What I Built',
          subsections: [
            {
              subtitle: 'Project Leadership',
              list: [
                'Team Lead로서 전체 파이프라인 설계 및 통합',
                '팀원 역할 분담 및 일정 관리'
              ]
            },
            {
              subtitle: 'Backend Development',
              list: [
                'FastAPI 기반 RESTful API 설계',
                '3개 서비스 모듈화 (Audio, STT, Summary)',
                'yt-dlp + FFmpeg 오디오 추출 파이프라인',
                'HTTPException 기반 에러 처리 및 GPU 메모리 관리'
              ]
            },
            {
              subtitle: 'Frontend Development',
              list: [
                'Streamlit 기반 단일 버튼 UI',
                '진행 상황 표시 및 결과 Expander 패널',
                '동영상 재생 윈도우 통합'
              ]
            },
            {
              subtitle: 'AI Pipeline Integration',
              list: [
                'Whisper → Gemma 2 파이프라인 연결',
                '3-step 번역 프롬프트 설계 (한→영→요약→한)',
                '후처리: 단어 중복 제거, 공백 정리'
              ]
            }
          ]
        },
        {
          title: 'Service Demo',
          gallery: [
            {
              src: 'images/projects/econdigest_frontend_start.png',
              alt: '서비스 시작 화면',
              caption: '서비스 시작 화면'
            },
            {
              src: 'images/projects/econdigest_frontend_input.png',
              alt: 'YouTube URL 입력',
              caption: 'YouTube URL 입력'
            },
            {
              src: 'images/projects/econdigest_frontend_button.png',
              alt: '요약 버튼 클릭',
              caption: '요약 버튼 클릭'
            },
            {
              src: 'images/projects/econdigest_frontend_progress.png',
              alt: '처리 진행 중',
              caption: '처리 진행 중'
            },
            {
              src: 'images/projects/econdigest_frontend_result.png',
              alt: '요약 결과',
              caption: '요약 결과'
            },
            {
              src: 'images/projects/econdigest_backend.png',
              alt: '백엔드 API',
              caption: '백엔드 API'
            }
          ]
        },
        {
          title: 'Model Fine-Tuning',
          subsections: [
            {
              subtitle: 'STT (Whisper)',
              content: 'LoRA 기법으로 파인튜닝을 시도했으나, 에포크가 진행될수록 오차율(CER, WER)이 지속적으로 상승하여 <strong>성능이 저하</strong>되는 것을 확인했습니다. 이에 따라 <strong>원본 Whisper-large 모델을 그대로 사용</strong>하는 것이 더 낫다는 결론을 내렸습니다.',
              image: {
                src: 'images/projects/econdigest_whisper_fine_tuning.png',
                alt: 'Whisper LoRA 파인튜닝 결과 - 에포크별 CER/WER 상승'
              }
            },
            {
              subtitle: 'LLM (Gemma 2)',
              content: '메모리 효율을 위해 <strong>QLoRA(양자화+LoRA)</strong> 기법을 사용하여 튜닝을 진행했습니다. 4-bit BitsAndBytes 양자화를 적용하여 VRAM 사용량은 줄었으나, <strong>오히려 요약 품질이 저하</strong>되어 튜닝하지 않은 원본 모델보다 못한 결과가 나왔습니다. 경량화와 성능 사이의 트레이드오프를 체감한 경험이었습니다.'
            }
          ]
        },
        {
          title: '성과 및 회고',
          subsections: [
            {
              subtitle: '주요 성과',
              list: [
                'yt-dlp + FFmpeg 기반 오디오 자동 추출 파이프라인 구축',
                'FastAPI 백엔드 + Streamlit 프론트엔드 통합',
                'QLoRA 적용으로 VRAM 효율화 (4-bit 양자화)'
              ]
            },
            {
              subtitle: '시행착오',
              list: [
                '<strong>STT LoRA 파인튜닝 실패</strong>: 파인튜닝 기술에 대한 이해 부족과 보유 인프라의 한계를 사전에 가늠하지 못한 채 진행하여 실패',
                '<strong>LLM QLoRA 경량화 역효과</strong>: 4-bit 양자화로 경량화는 달성했으나, 오히려 성능이 저하되어 튜닝하지 않은 원본 모델보다 못한 결과 도출',
                '<strong>긴 텍스트 문맥 누락</strong>: 청킹(Chunking) 전략의 필요성 인식',
                '<strong>동일 문장 중복 출력</strong>: 후처리 로직 추가로 해결'
              ]
            },
            {
              subtitle: '기술적 성장',
              content: '처음 접하는 STT/LLM 파이프라인과 파인튜닝 기술이었기에, 접근 방법 자체가 잘못된 부분이 많았습니다. 그러나 이 경험을 통해 <strong>모델 튜닝 전 베이스라인 성능 측정의 중요성</strong>, <strong>인프라 제약 조건 사전 파악</strong>, 그리고 <strong>양자화와 성능 간의 트레이드오프</strong>를 체감할 수 있었습니다. 실패를 통해 앞으로 어떤 방향으로 공부하고 나아가야 할지 명확해졌습니다.'
            },
            {
              subtitle: '향후 개선 방향',
              list: [
                '화자 분리(Speaker Diarization) 기능 개선',
                '5060 타겟에 맞춘 UI 최적화 (글자 크기 등)',
                '전문 경제 용어 추가 학습'
              ]
            }
          ]
        }
      ],
      tags: ['Whisper', 'Gemma-2', 'QLoRA', 'yt-dlp', 'FFmpeg', 'FastAPI', 'Streamlit', 'STT', 'LLM']
    }
  };

  // Open modal
  projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't open modal if clicking on GitHub link
      if (e.target.closest('.project-card__link')) return;

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
            contentHTML += `<p>${section.content}</p>`;
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
                contentHTML += `<p>${sub.content}</p>`;
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
      }
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
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
