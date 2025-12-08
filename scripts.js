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
    mcp: {
      title: 'MCP 기반 LangGraph AI Agent',
      image: 'assets/image.png',
      meta: {
        team: '7명 (AI 3명, Unreal 4명)',
        role: 'AI Part 팀장',
        period: '2025.04 - 2025.06 (진행 중)'
      },
      sections: [
        {
          title: '기획 의도',
          content: 'MCP 기술을 활용하여 개발자의 리소스를 절감할 수 있는 워크플로우 개선에 초점을 맞춘 차세대 FPS 게임 개발 프로젝트입니다. MCP 기반의 AI Agent 및 AI Tool을 직접 설계 및 구현을 통해 언리얼 엔진 에디터 환경에서의 게임 개발 워크플로우를 근본적으로 개선하고, 반복적인 수작업 및 리소스 투입을 획기적으로 절감하는 것이 핵심 목표입니다.'
        },
        {
          title: '담당 기능',
          list: [
            '무기 반동 궤적 생성 AI Tool - NumPy 기반 반동 시드값으로 x/y 좌표 시퀀스 생성',
            'Matplotlib을 활용한 시각적 궤적 검토 기능',
            'Unreal MCP Plugin을 통한 언리얼 엔진 연동',
            'LangGraph를 활용한 RAG 파이프라인 기반 음성 통신 AI Agent 설계',
            'HuggingFace Whisper Model로 STT 기능 구축'
          ]
        }
      ],
      tags: ['LangGraph', 'LangChain', 'MCP', 'RAG', 'LLM', 'HuggingFace', 'ChromaDB', 'Docker', 'Whisper', 'STT']
    },
    komi: {
      title: 'KOMI - AI 원격 운동 자세 진단',
      image: 'assets/image3.png',
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
      image: 'assets/bemymuse_finetuning.png',
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
      image: 'assets/image7.png',
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
      image: 'assets/image5.png',
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
        modalTitle.textContent = project.title;

        // Meta info
        modalMeta.innerHTML = `
          <span class="modal__meta-item"><i class="fa-solid fa-users"></i> ${project.meta.team}</span>
          <span class="modal__meta-item"><i class="fa-solid fa-user-tie"></i> ${project.meta.role}</span>
          <span class="modal__meta-item"><i class="fa-regular fa-calendar"></i> ${project.meta.period}</span>
        `;

        // Content sections
        let contentHTML = '';
        project.sections.forEach(section => {
          contentHTML += `
            <div class="modal__section">
              <h4 class="modal__section-title">${section.title}</h4>
              ${section.content ? `<p>${section.content}</p>` : ''}
              ${section.list ? `<ul>${section.list.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
            </div>
          `;
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
