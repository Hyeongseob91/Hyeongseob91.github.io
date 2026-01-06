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
        role: 'Architect / Backend / RAG Engineer',
        context: 'Company Project – Personal Engineering Scope',
        period: '2025.09 – 2025.12',
        deployment: 'Docker Compose 기반 MSA 오케스트레이션'
      },
      disclaimer: {
        show: true,
        text: '본 프로젝트는 Soundmind 소속 AI Research Engineer Lead로 단독으로 진행하였던 RAG Agent 연구·개발을 직접 기획·설계·구현한 기술적 요소를 개인 기술 역량 설명 목적으로 재구성하였습니다. 고객 데이터, 내부 문서, 상용 소스코드 및 영업 정보는 포함되어 있지 않으며, 시스템 아키텍처 설계, RAG 파이프라인 고도화, 엔지니어링 의사결정 경험만을 중심으로 정리했습니다.'
      },
      sections: [
        {
          title: 'Try Demo',
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
            src: 'images/projects/soundmind_ai_platform.png',
            alt: 'Soundmind AI Platform Architecture',
            caption: '5계층 MSA 아키텍처: Presentation → API Gateway → Service → Data → External Model Services'
          },
          list: [
            'Presentation Layer: sm-web-console - Login, Portal Select, Dashboard',
            'API Gateway Layer: sm-api-gateway - BFF + SSE Streaming',
            'Service Layer: sm-rag-service - Advanced RAG Pipeline',
            'Data Layer: Weaviate - Vector Database with Hybrid Search',
            'External Model Services: vLLM, BGE-M3 Embedder, BGE Reranker'
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
              src: 'images/projects/soundmind_rag_agent_userexprience.png',
              alt: 'Dashboard User Experience',
              caption: '4. Dashboard 사용 화면 - 실제 RAG 질의응답 시연'
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
                'Hybrid Retrieval + Rerank: ~0.7s',
                'Query Rewrite: 3~9s (최대 ~9s)',
                'Streaming Generation: 응답 길이에 비례 (최대 ~2min)'
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
    mcp: {
      title: 'VALORITHM - MCP 기반 게임 개발 AI 시스템',
      image: 'images/projects/valorithm_mcp_server.png',
      meta: {
        team: '7명 (AI 3명, Unreal 4명)',
        role: 'AI Part 팀장 / 전체 AI 아키텍처 설계',
        period: '2025.04 - 2025.06',
        deployment: 'MCP Server + FastAPI + LangGraph'
      },
      sections: [
        {
          title: 'Problem',
          content: 'FPS 게임을 개발하면서 가장 큰 병목은 단순 반복 작업이었습니다. 예를 들어 총기 하나의 반동 패턴을 조정하는 데만 40분 이상이 걸렸고, 기획자가 "좀 더 위로 튀게 해주세요"라고 요청하면 개발자는 다시 수치를 조정하고 테스트하는 과정을 반복해야 했습니다. 3D 맵 화이트박싱의 경우 시야각 확인, 사물 배치 등의 커스텀을 거치면 한번의 맵 빌딩마다 8시간 가량의 시간이 소요되었습니다. 신규 플레이어에게 게임 규칙을 설명하는 것도 매번 같은 내용을 반복하는 비효율이 있었습니다. 그래서 저희는 이런 반복 작업을 AI로 자동화하여 개발자 리소스 효율화를 통해 회사의 기회비용을 창출하고, 개발자 본인도 작업에 더 집중할 수 있는 환경을 구축하는 목표로 시작하였습니다.'
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
              content: 'MCP와 LangGraph 기반의 AI 에이전트를 프로젝트 전반에 통합하여 기획부터 플레이까지의 워크플로우를 지능화하고, 단순 반복 작업의 제약 없이 누구나 아이디어를 즉시 구현할 수 있는 새로운 게임 개발 패러다임을 제시했습니다.',
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
          title: 'Core Contributions & Technical Deep Dive',
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
                'Unreal MCP Plugin을 연동하여 엔진 내 에셋 즉시 반영 워크플로우 구축',
                '📎 <a href="https://www.canva.com/design/DAG9oBMaAzI/IVszVKdZleiL5Qbl-KIcZg/view?utm_content=DAG9oBMaAzI&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hb9d5937c48" target="_blank" rel="noopener noreferrer">시연 영상 확인하기</a>'
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
        }
      ],
      tags: ['MCP', 'LangGraph', 'RAG', 'FastMCP', 'NumPy', 'ChromaDB', 'Whisper', 'Unreal Engine', 'FastAPI']
    },
    komi: {
      title: 'KOMI - AI 원격 운동 자세 진단',
      image: 'images/projects/komi_main.png',
      meta: {
        team: '3명 (AI Engineer)',
        role: '팀장 (기획 & 기술 설계)',
        period: '2025.03.10 - 2025.04.03'
      },
      sections: [
        {
          title: '기획 의도',
          content: '거동이 불편하거나 의료 접근성이 제한된 사용자들의 재활 치료를 위해 기획된 AI 기반 원격 진료 서비스입니다. 사용자는 병원 방문 없이 웹캠을 통해 자세와 운동 피드백을 실시간으로 받을 수 있습니다.'
        },
        {
          title: '담당 기능',
          list: [
            'LangChain 기반 RAG 파이프라인 구축 (OpenAI Embedding + Chroma Vector DB)',
            'RAGAS 성능 평가 지표를 통한 시각화 검증',
            'OpenCV 기반 YOLO-Pose11n Model을 사용한 Pose Estimator 기능 구축',
            '실시간 자세 분석 결과 기반 LLM Prompt 생성 기능'
          ]
        },
        {
          title: '회고',
          content: 'LangChain 라이브러리를 처음 활용한 프로젝트로, 의료 데이터 수집의 한계와 AI의 역할에 대해 깊이 고민하게 된 계기가 되었습니다. AI는 "대체"가 아니라 "보조와 가이드"에 가깝다는 인식을 갖게 되었습니다.'
        }
      ],
      tags: ['LangChain', 'RAG', 'ChromaDB', 'OpenCV', 'YOLO-Pose', 'RAGAS', 'NumPy', 'Plotly']
    },
    bemymuse: {
      title: 'BeMyMuse - 감성 작사 AI',
      image: 'images/projects/bemymuse_validation_graph.png',
      imageContain: true,
      meta: {
        team: '3명 (AI Engineer)',
        role: '팀장 (기획 & 기술 설계)',
        period: '2025.01.04 - 2025.02.03'
      },
      sections: [
        {
          title: '기획 의도',
          content: '작사가를 도울 수 있는 AI 보조 프로그램 개발 프로젝트입니다. 단순한 키워드로 사용자가 의도하는 감성과 분위기를 반영한 가사를 자동 생성하여 창작 활동을 지원합니다.'
        },
        {
          title: '담당 기능',
          list: [
            'SKT KoGPT2-base-v2 모델 커스터마이징 및 파인튜닝',
            'RTX-4090 GPU 환경에서 PyTorch + CUDA 세팅',
            'temperature, top_k, top_p 등 생성 파라미터 최적화',
            'BLEU, ROUGE, Perplexity 성능 평가 및 시각화',
            'Selenium을 활용한 멜론 차트 동적 크롤링 (7,439곡 수집)'
          ]
        },
        {
          title: '회고',
          content: '파인튜닝의 개념을 배우며 언어모델의 생성 방식을 이해했습니다. GPU 메모리 오류, 과적합, 토크나이저 설정 등 다양한 문제를 해결하며 LLM 모델 사용에 자신감을 얻었습니다.'
        }
      ],
      tags: ['KoNLPy', 'KoGPT-2', 'Transformers', 'Hugging Face', 'PyTorch', 'Scikit-Learn', 'Selenium']
    },
    perfectpose: {
      title: 'PerfectPose - AI 자세 추론 게임',
      image: 'images/projects/perfectposes_workflow.png',
      meta: {
        team: '6명 (AI 3명, Unreal 3명)',
        role: '팀장 (공동 기획 & 기술 설계)',
        period: '2025.03.13 - 2025.03.14'
      },
      sections: [
        {
          title: '기획 의도',
          content: 'Pose Detection AI 기술을 활용하여 실시간으로 사람의 움직임을 분석하고, 화면에 나오는 자세와 동일한 자세를 취했을 때 점수를 얻는 게임입니다. Steam의 "Perfect Poses" 게임을 참고했습니다.'
        },
        {
          title: '담당 기능',
          list: [
            'YOLO-Pose8n 모델을 상속받는 PoseEstimator 클래스 설계',
            'start_camera: 웹캠 자동 감지 및 1인 트래킹 기능',
            'video_image_extraction: 초당 30프레임 캡처 및 저장',
            'capture_image_detecting: OpenCV 기반 KeyPoints 추출',
            'real_time_video_detecting: 17개 관절 좌표 실시간 분석 및 JSON 송신'
          ]
        }
      ],
      tags: ['OpenCV', 'YOLO-Pose', 'Unreal Engine', 'Cosine Similarity']
    },
    econdigest: {
      title: 'EconDigest - 경제 유튜브 요약',
      image: 'images/projects/youtube_main.png',
      meta: {
        team: '팀 프로젝트',
        role: '백엔드 개발',
        period: '2025'
      },
      sections: [
        {
          title: '프로젝트 개요',
          content: '"경제 유튜브, 핵심만 보자!" 금융·재테크 정보를 찾기 위해 방대한 영상을 일일이 시청할 필요 없이, 클릭 한 번으로 요약 보고서를 받아볼 수 있는 AI 웹 애플리케이션입니다.'
        },
        {
          title: '담당 기능',
          list: [
            'yt-dlp와 FFmpeg를 활용한 고음질 오디오 분리 및 자동 정리',
            'FastAPI 기반 백엔드 서버 구축 및 RESTful API 설계',
            'Streamlit을 활용한 단일 버튼 UI 구성'
          ]
        }
      ],
      tags: ['yt-dlp', 'FFmpeg', 'FastAPI', 'Streamlit', 'Hugging Face', 'QLoRA', 'Whisper']
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

        // Meta info - 확장된 메타 필드 지원
        let metaHTML = '';
        if (project.meta.team) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-users"></i> ${project.meta.team}</span>`;
        }
        if (project.meta.role) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-user-tie"></i> ${project.meta.role}</span>`;
        }
        if (project.meta.context) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-building"></i> ${project.meta.context}</span>`;
        }
        if (project.meta.period) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-regular fa-calendar"></i> ${project.meta.period}</span>`;
        }
        if (project.meta.deployment) {
          metaHTML += `<span class="modal__meta-item"><i class="fa-solid fa-server"></i> ${project.meta.deployment}</span>`;
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
          contentHTML += `<div class="modal__section">`;
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
                contentHTML += `
                  <img src="${sub.image.src}"
                       alt="${sub.image.alt || sub.subtitle}"
                       class="modal__subsection-image"
                       onclick="window.open('${sub.image.src}', '_blank')">
                `;
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
