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
  // PROJECT FILTER & 더보기 (공유 헬퍼)
  // =====================================================
  const INITIAL_SHOW = 3;

  function updateMoreButton(btn, expanded, totalCount) {
    if (!btn) return;
    if (totalCount > INITIAL_SHOW) {
      btn.parentElement.classList.remove('projects__more-wrapper--hidden');
      btn.classList.toggle('projects__more-btn--expanded', expanded);
      btn.querySelector('.projects__more-btn-text').textContent = expanded ? '접기' : '더보기';
    } else {
      btn.parentElement.classList.add('projects__more-wrapper--hidden');
    }
  }

  // --- Professional Projects ---
  const filterButtons = document.querySelectorAll('.projects__filter-btn');
  const mainGrid = document.querySelector('#projects .projects__grid');
  const mainCards = mainGrid ? mainGrid.querySelectorAll('.project-card') : [];
  const moreBtn = document.getElementById('projectsMoreBtn');
  let currentFilter = 'all';
  let isExpanded = false;

  function applyFilter() {
    let visibleCount = 0;

    mainCards.forEach(card => {
      const matchesFilter = currentFilter === 'all' || card.dataset.category === currentFilter;

      if (matchesFilter) {
        visibleCount++;
        if (currentFilter === 'all' && !isExpanded && visibleCount > INITIAL_SHOW) {
          card.classList.add('project-card--hidden');
        } else {
          card.classList.remove('project-card--hidden');
        }
      } else {
        card.classList.add('project-card--hidden');
      }
    });

    const totalForFilter = Array.from(mainCards).filter(c =>
      currentFilter === 'all' || c.dataset.category === currentFilter
    ).length;
    const showBtn = currentFilter === 'all' && totalForFilter > INITIAL_SHOW;
    updateMoreButton(moreBtn, isExpanded, showBtn ? totalForFilter : 0);
  }

  applyFilter();

  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      filterButtons.forEach(b => b.classList.remove('projects__filter-btn--active'));
      this.classList.add('projects__filter-btn--active');
      currentFilter = this.dataset.filter;
      isExpanded = false;
      applyFilter();
    });
  });

  if (moreBtn) {
    moreBtn.addEventListener('click', function() {
      isExpanded = !isExpanded;
      applyFilter();
    });
  }

  // --- Toy Projects ---
  const toyGrid = document.querySelector('#projects-toy .projects__grid');
  const toyCards = toyGrid ? toyGrid.querySelectorAll('.project-card') : [];
  const toyMoreBtn = document.getElementById('toyMoreBtn');
  let toyExpanded = false;

  function applyToyLimit() {
    toyCards.forEach((card, index) => {
      card.classList.toggle('project-card--hidden', !toyExpanded && index >= INITIAL_SHOW);
    });
    updateMoreButton(toyMoreBtn, toyExpanded, toyCards.length);
  }

  applyToyLimit();

  if (toyMoreBtn) {
    toyMoreBtn.addEventListener('click', function() {
      toyExpanded = !toyExpanded;
      applyToyLimit();
    });
  }

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
    'soundmind-ecosystem': {
      title: 'SoundMind AI Ecosystem',
      image: 'images/projects/soundmind-ai-ecosystem-logo.png',
      imageContain: true,
      meta: {
        organization: 'Soundmind-Labs',
        role: 'AI Engineer & AI Researcher / AX Manager',
        period: '2025.07 ~ 현재',
        architecture: 'MSA (9 Projects · 161 APIs · 15+ Docker)'
      },
      disclaimer: {
        show: true,
        text: '본 프로젝트는 Soundmind-Labs 소속 AI Research Engineer로서 설계·구축한 AI Sales Enablement Platform입니다.<br>상용 소스코드 및 영업 정보는 포함되어 있지 않으며 아키텍처 설계와 기술적 의사결정 경험을 중심으로 정리했습니다.'
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>고객 문서 기반 RAG PoC를 자동 생성·배포·시연할 수 있는 AI Sales Enablement Platform</strong>',
          subsections: [
            {
              subtitle: '무엇을 하는 시스템인가',
              list: [
                '고객 문서를 업로드하면 <strong>Gemini 2.0 Flash + GPT-4o 3-Stage 병렬 분석</strong>으로 문서 특성을 자동 파악',
                'AI가 4차원 전략 공간(Chunking 5종 · Retrieval 5종 · Indexing 4종 · Post-Processing 4종)에서 <strong>최적 RAG Pipeline</strong>을 추천·생성·배포',
                '고객사 담당 영업팀은 <strong>PoC 데모를 즉시 구성</strong>하고, 고객사는 PlayGround에서 직접 체험',
                '분석 → 배포 → 평가 → 모니터링까지 <strong>전 과정을 하나의 워크플로우</strong>로 자동화',
                '고객사 문서 도입시 <strong>신규 엔진 Prototype 배포 리드타임 2주 → 5분 (99% 이상 단축)</strong>'
              ]
            },
            {
              subtitle: '규모',
              list: [
                '9개 프로젝트 · 161개 API · 103+ 단위 테스트',
                '최대 99개 RAG Pipeline 동시 운용 (포트 9201~9299)',
                '7개 파서 클래스 · 10개 확장자 지원 (PDF, DOCX, XLSX, XLS, TXT, MD, RST, JSON, HWP, HWPX)',
                'LLM: OpenAI · Gemini 등 클라우드 API + vLLM 기반 로컬 모델 서빙'
              ]
            },
            {
              subtitle: '주요 성과',
              content: '<table style="width:100%; border-collapse:collapse; font-size:0.9em;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">영역</th>' +
                '<th style="padding:8px 10px; text-align:left;">성과</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>배포 리드타임</strong></td><td style="padding:6px 10px;">신규 RAG 엔진 Prototype 배포 <strong>2주 → 5분</strong> (99% 이상 단축)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>RAG R&D</strong></td><td style="padding:6px 10px;">81개 Q&A · 11개 공공문서 · 3,678페이지 대상 Node-level Ablation Study 수행 → Reranking −12.8%p(핵심 기여) · Query Decomposition +6.8%p(성능 저하 요인) 정량화</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>문서 분석</strong></td><td style="padding:6px 10px;">Dual-LLM(Gemini + GPT-4o) 교차 검증 기반 26개 특성 프로파일링 → 4차원 Decision Tree 자동 추천</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>A/B 테스트</strong></td><td style="padding:6px 10px;">VLM 파싱(WigtnOCR) vs 기본 파싱: GPT-4o Judge 가중 평균 <strong>0.888 → 1.000</strong> (+0.113), 환각·정보 누락 해소</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>PoC 납품</strong></td><td style="padding:6px 10px;">DB 사업 회사 대상 8개 문서 · 34개 테스트 케이스 · Golden Path 3회 리허설 포함 검수 프로세스 완료</td></tr>' +
                '<tr><td style="padding:6px 10px;"><strong>인프라</strong></td><td style="padding:6px 10px;">15+ Docker 서비스 · Grafana + Loki + Promtail 실시간 모니터링 · 50명 동시 사용 대비 동시성 처리</td></tr>' +
                '</tbody></table>'
            }
          ]
        },
        {
          title: 'System Architecture',
          content: '본 프로젝트는 <strong>단독 개발 프로젝트</strong>로서, 기획부터 디자인, 시스템 개발 및 배포까지 솔로프리너로 진행했습니다. 현재 Beta 버전으로 End User 테스트를 진행 중입니다.<br><br>' +
            'SoundMind AI Ecosystem은 크게 <strong>3개 축</strong>으로 구성됩니다. 고객 대면 서비스(<strong>AI Platform</strong>), 내부 운영 도구(<strong>AI Console</strong> — Analysis · Eval · Monitoring), 그리고 이들이 공유하는 <strong>모델 서빙 인프라</strong>입니다.<br><br>' +
            '<strong>모델 서빙 인프라:</strong><br>' +
            '• <strong>LLM</strong> — Qwen3 시리즈, vLLM 서빙 (OpenAI 호환 API)<br>' +
            '• <strong>Embedder / Reranker</strong> — BGE-M3 + BGE-Reranker-v2-M3, Infinity 서빙. vLLM에서 BGE-M3 로드 시 아키텍처 호환 문제(XLMRobertaModel로 인식되어 sparse/colbert weight 누락)가 발생하여, 임베딩 모델 서빙에 특화된 Infinity로 전환<br><br>' +
            '<strong>이 글의 구성:</strong><br>' +
            '① <strong>RAG R&D</strong> — Advanced RAG 구축 → 정량 평가 → Ablation Study → "문서마다 다른 전략이 필요하다"는 인사이트 도출<br>' +
            '② <strong>AI Console</strong> — R&D 인사이트를 바탕으로 구축한 내부 운영 플랫폼 (Analysis · Eval · Monitoring)<br>' +
            '③ <strong>AI Platform</strong> — 고객이 즉시 PoC를 체험할 수 있는 Playground (RAG Agent · Chat Agent · AICC Agent)',
          image: {
            src: 'images/projects/soundmind-ai-ecosystem-architecture.png',
            alt: 'SoundMind AI Ecosystem Architecture',
            caption: 'AI Platform(고객 대면) ↔ AI Console(Analysis · Eval · Monitoring) + Cloud Server · Local Database · Local Model Serving'
          }
        },
        {
          title: 'RAG R&D — 공공기관 전용 범용 RAG 고도화 여정',
          content: 'Advanced RAG를 구축하고 정량 평가와 Ablation Study를 거치며 <strong>"문서마다 다른 전략이 필요하다"</strong>는 핵심 인사이트를 도출한 과정입니다. 이 R&D 결과가 Analysis Platform의 4차원 Decision Tree 자동 추천 시스템에 직접 반영되었습니다.',
          subsections: [
            {
              subtitle: '<span style="color:#2563eb;">1단계</span> — Advanced RAG 설계 및 구축',
              content: '회사에 RAG 파이프라인이 전무한 상태에서, B2B2G(기업 → 공공기관) 사업 모델로 NLP 시장에 진출하며 Naive RAG가 아닌 <strong>Advanced RAG를 처음부터 설계</strong>하기로 결정했습니다.<br><br>' +
                '<strong>모델 선정 — LLM · Embedder · Reranker:</strong><br>' +
                '클라우드 서버로 플랫폼을 제공하되 GPU는 On-premise 환경이었기에 Local Model 서빙이 필수였습니다. 추론 능력을 갖춘 대형 모델이 필요했고, 글로벌 벤치마크에서 높은 성능을 기록한 <strong>Qwen3 시리즈를 LLM으로 선정, vLLM으로 서빙</strong>했습니다.<br><br>' +
                'Embedder와 Reranker도 Qwen 시리즈로 통일하려 했으나 vLLM에서 아키텍처 호환 문제가 발생하여 배포에 실패했고, 범용 오픈소스 모델 중 한국어 평가 지표가 가장 높았던 <strong>BGE-M3(Embedder) + BGE-Reranker-v2-M3(Reranker)</strong>를 채택, 임베딩 모델 서빙에 특화된 <strong>Infinity</strong>로 서빙했습니다.<br><br>' +
                '이후 어떤 기술을 도입할 것인가를 리서칭한 뒤, 세 가지 핵심 컴포넌트를 선정했습니다.<br><br>' +
                '<strong>Query Expansion (Rewrite + Decomposition):</strong><br>' +
                'B2B2G 사업 특성상 End User의 도메인을 특정할 수 없지만, 고객이 정부기관이라는 것은 알 수 있었습니다. 공공문서는 정확도가 생명이므로, 동일한 질문을 다양하게 재작성(Rewrite)하여 관련 컨텍스트를 빠짐없이 확보하고, 복합 질의는 서브쿼리로 분해(Decomposition)하여 다중 관점의 정보를 수집하는 전략을 채택했습니다.<br><br>' +
                '<strong>Hybrid Search (Dense + Sparse + RRF):</strong><br>' +
                '정부문서에는 한자어, 공공기관 전용 용어 등 키워드 매칭이 중요한 어휘가 많아 Sparse Search(BM25)가 유효할 것으로 판단했습니다. Dense와 Sparse 검색을 조합하는 RRF 알고리즘을 활용하되, 당시 알고리즘 구현 경험이 부족했기에 <strong>Hybrid Search를 네이티브로 지원하는 Weaviate</strong>를 VectorDB로 도입했습니다. 이후 Flat 구조 문서에서는 메타데이터 필터링 기반 검색이 더 효과적임을 확인하여 <strong>Qdrant(Filter 기반)</strong>를 추가, 문서 복잡도에 따라 VectorDB를 이원화 설계했습니다.<br><br>' +
                '<strong>Reranking (Top-k=5):</strong><br>' +
                'BGE-Reranker-v2-M3는 범용 모델 중 한국어 평가 지표가 가장 높았고, 오픈소스 라이센스로 On-premise 배포에 제약이 없어 선택했습니다.<br><br>' +
                '<strong>Data Parsing 확장:</strong><br>' +
                '초기에는 Docling을 사용했으나 문서 파싱 레이턴시가 지나치게 높아 실용성이 떨어졌고, pdfplumber + PaddleOCR로 교체하여 처리 속도를 확보했습니다. 이후 정부기관 특수 목적상 HWP·HWPX 문서가 다수 존재했고 DOCX, XLSX 등 다양한 포맷도 필요하여, 확장자별 개별 OSS 파서들을 통합한 <strong>UnifiedFileParser(7개 파서 클래스 · 10개 확장자)</strong>를 구축했습니다.<br><br>' +
                '• <strong>PDFParser</strong> (.pdf) — 3단계 Fallback 체인: pymupdf4llm(1차, 레이아웃 인식 Markdown 추출) → pdfplumber(2차 fallback) → PaddleOCR(3차, 한국어 스캔 문서 OCR). 페이지당 텍스트 50자 미만이면 스캔 PDF로 판단하여 자동 OCR 전환<br>' +
                '• <strong>DOCXParser</strong> (.docx) — python-docx 기반 단락 + 표 추출, 문서 속성 포함<br>' +
                '• <strong>XLSXParser</strong> (.xlsx, .xls) — openpyxl (read_only=True, data_only=True), 전체 시트 순회 및 시트별 구조화<br>' +
                '• <strong>TXTParser</strong> (.txt, .md, .rst) — Built-in, 인코딩 자동 감지 (UTF-8 → CP949 → EUC-KR → Latin-1 순서 시도)<br>' +
                '• <strong>JSONParser</strong> (.json) — Built-in json 모듈, JSON 계층 구조를 사람 읽기용 텍스트로 변환<br>' +
                '• <strong>HWPParser</strong> (.hwp) — olefile 기반 OLE compound document 파싱, BodyText 섹션에서 HWPTAG_PARA_TEXT(tag=67) 레코드 추출 + zlib 해제<br>' +
                '• <strong>HWPXParser</strong> (.hwpx) — zipfile + BeautifulSoup 기반 OOXML 파싱, Contents/section*.xml에서 텍스트 추출'
            },
            {
              subtitle: '<span style="color:#2563eb;">2단계</span> — 정량 평가에서 드러난 문제',
              content: 'Advanced RAG를 구축한 뒤, 성능을 정량적으로 측정하기 위해 <strong>RAGAS 기반 평가 프레임워크를 직접 구축</strong>했습니다.<br><br>' +
                '<strong>LLM 기반 Silver Dataset 자동 생성:</strong><br>' +
                '데이터 엔지니어링의 <strong>Medallion Architecture(Bronze → Silver → Gold)</strong> 패턴을 평가 데이터 생성에 차용했습니다. 3,678페이지의 Raw 공공문서(<strong>Bronze</strong>)에서 Qwen3-235B가 난이도·질의 유형·추론 홉 수가 태깅된 81개 Q&A Ground Truth(<strong>Silver</strong>)를 자동 생성했습니다. 이 Silver 데이터셋으로 Node-level Ablation Study를 수행하여 컴포넌트별 기여도를 정량화(<strong>Gold</strong>)하고, 그 결과가 AI Console 자동 추천 엔진의 Decision Tree 임계값에 직접 반영되었습니다.<br><br>' +
                '<strong>RAGAS 평가의 한계:</strong><br>' +
                'RAGAS 프레임워크로 평가를 수행했으나, RAGAS의 핵심 메트릭인 ROUGE-L(0.050) / BLEU(0.002) 등은 Ground Truth와 RAG 응답 간의 <strong>토큰 단위 일치도(CER, WER 등)</strong>를 기반으로 점수를 산출합니다.<br><br>' +
                '그러나 생성형 AI는 동일한 맥락이라도 매번 다른 어휘와 문장 구조로 답변을 생성하기 때문에, 의미적으로 정확한 응답도 토큰이 다르면 낮은 점수가 나올 수밖에 없었습니다. 한국어의 교착어 특성(조사·어미 변형)이 이 문제를 더욱 심화시켰습니다.<br><br>' +
                '이를 계기로 토큰 매칭이 아닌 <strong>의미 단위로 응답 품질을 판단하는 LLM-as-a-Judge 기반 5차원 가중 평가로 전환</strong>했습니다.<br><br>' +
                '<strong>노드 단위 핵심 실험 결과:</strong><br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">실험</th>' +
                '<th style="padding:8px 10px; text-align:left;">비교</th>' +
                '<th style="padding:8px 10px; text-align:center;">결과</th>' +
                '<th style="padding:8px 10px; text-align:left;">비고</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">청킹</td><td>Recursive vs Semantic</td><td style="text-align:center;"><strong>600배 빠름</strong></td><td style="padding:6px 10px; color:#16a34a;"><strong>→ Recursive 채택</strong> (14ms vs 8,437ms, 커버리지 유사하나 속도 압도적)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">검색</td><td>Dense vs Hybrid</td><td style="text-align:center; color:#16a34a;"><strong>MRR +2.3%p</strong></td><td style="padding:6px 10px; color:#ea580c;"><strong>→ 문서별 분기 필요</strong> (Dense가 한국어에서 우위이나 키워드 매칭이 중요한 문서도 존재)</td></tr>' +
                '<tr><td style="padding:6px 10px;">리랭킹</td><td>적용 vs 미적용</td><td style="text-align:center; color:#16a34a;"><strong>MRR +3.9%p</strong></td><td style="padding:6px 10px; color:#16a34a;"><strong>→ 상시 활성화</strong> (지연시간 2.8배 증가에도 정밀도 향상이 더 중요)</td></tr>' +
                '</tbody></table><br>' +
                '<strong>다수 평가를 통해 드러난 구조적 한계:</strong><br>' +
                '실제 질의의 대부분은 Multi-Hop이 아닌 Flat 구조였지만, 수십 개의 컨텍스트를 한꺼번에 수집해야만 답변을 생성할 수 있는 패턴이 지배적이었습니다.<br><br>' +
                '예를 들어 "20개 분과에 대한 사업 기준을 설명하라"는 질의는 20개 이상의 컨텍스트가 필요한데, Reranker의 Top-k=5로는 턱없이 부족했습니다. 이런 유형의 문서를 분석해보면, 대부분 섹션의 결론이나 요구사항 같은 <strong>반복적인 구조</strong>를 가지고 있었습니다.<br><br>' +
                '이 인사이트에서 <strong>Qdrant 도입의 근거</strong>가 나왔습니다. 반복 구조 문서는 시맨틱 검색보다 JSON 메타데이터 기반 Filter 검색이 더 효과적이었고, 문서를 업로드할 때 섹션별 메타데이터를 구조화하여 저장하면 필요한 20개 이상의 컨텍스트를 정확하게 필터링할 수 있었습니다. Weaviate(Hybrid Search)와 Qdrant(Filter 기반)를 문서 특성에 따라 분기하는 VectorDB 이원화 설계가 이 경험에서 비롯되었습니다.<br><br>' +
                '<strong>E2E 종합 평가 결과 — Advanced RAG가 오히려 낮았다:</strong><br>' +
                '81개 Q&A 전수 평가, 5차원 가중 평균 기준:<br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">Metric</th>' +
                '<th style="padding:8px 10px; text-align:center;">가중치</th>' +
                '<th style="padding:8px 10px; text-align:center;">Naive RAG</th>' +
                '<th style="padding:8px 10px; text-align:center;">Advanced RAG</th>' +
                '<th style="padding:8px 10px; text-align:center;">차이</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Faithfulness</td><td style="text-align:center;">30%</td><td style="text-align:center;">0.813</td><td style="text-align:center;">0.738</td><td style="text-align:center; color:#dc2626;">−7.5%p</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Relevance</td><td style="text-align:center;">25%</td><td style="text-align:center;">0.825</td><td style="text-align:center;">0.763</td><td style="text-align:center; color:#dc2626;">−6.2%p</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#fef2f2;"><td style="padding:6px 10px;"><strong>Completeness</strong></td><td style="text-align:center;">20%</td><td style="text-align:center;">0.813</td><td style="text-align:center; color:#dc2626;"><strong>0.688</strong></td><td style="text-align:center; color:#dc2626;"><strong>−12.5%p</strong></td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Coherence</td><td style="text-align:center;">15%</td><td style="text-align:center;">0.925</td><td style="text-align:center;">0.938</td><td style="text-align:center; color:#16a34a;">+1.3%p</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Fluency</td><td style="text-align:center;">10%</td><td style="text-align:center;">0.963</td><td style="text-align:center;">0.950</td><td style="text-align:center; color:#dc2626;">−1.3%p</td></tr>' +
                '<tr style="background:#f8fafc; border-top:2px solid #e2e8f0;"><td style="padding:8px 10px;"><strong>가중 평균</strong></td><td style="text-align:center;">100%</td><td style="text-align:center;"><strong>0.848</strong></td><td style="text-align:center;"><strong>0.785</strong></td><td style="text-align:center; color:#dc2626;"><strong>−6.3%p</strong></td></tr>' +
                '</tbody></table>' +
                'Completeness가 <strong>−12.5%p</strong> 급락하여, 정보를 빠짐없이 담아야 하는 공공문서 Q&A에서 치명적인 약점을 드러냈습니다.<br>' +
                '"모든 컴포넌트를 추가하면 좋아질 것"이라는 가정이 틀렸음을 인정해야 했습니다.<br><br>' +
                '이 경험이 <strong>"문서 특성에 맞는 맞춤형 RAG 구조가 필요하다"</strong>는 핵심 인사이트로 이어졌고, 문서별로 최적화된 파이프라인을 자동 생성하는 플랫폼을 만드는 것을 목표로 설정하게 되었습니다.'
            },
            {
              subtitle: '<span style="color:#2563eb;">3단계</span> — "왜 안 되는가" 규명: Ablation Study',
              content: 'E2E 메트릭으로는 <strong>"어디가 문제인지"</strong> 알 수 없었습니다. Advanced RAG가 Naive보다 오히려 낮은 점수를 기록했지만, 4개 추가 컴포넌트 중 어느 것이 범인인지는 E2E만으로 특정할 수 없었습니다. 그래서 노드 단위 Ablation Study를 직접 설계·수행했습니다.<br><br>' +
                '<strong>핵심 발견:</strong><br>' +
                '• <strong>Reranking 제거 시 −12.8%p</strong> — 가장 임팩트 큰 핵심 컴포넌트<br>' +
                '• <strong>Query Decomposition 제거 시 +6.8%p, 레이턴시 32% 감소</strong>(129s→88s) — 오히려 성능을 깎고 있었음<br>' +
                '• Query Rewrite 제거 시 −0.8%p — 기여도 미미<br>' +
                '• Hybrid → Dense 전환 시 −5.0%p — 중간 수준 기여<br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">제거한 컴포넌트</th>' +
                '<th style="padding:8px 10px; text-align:center;">성능 변화</th>' +
                '<th style="padding:8px 10px; text-align:center;">레이턴시</th>' +
                '<th style="padding:8px 10px; text-align:left;">판정</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#f0fdf4;"><td style="padding:6px 10px;"><strong>Reranking</strong></td><td style="text-align:center; color:#dc2626;"><strong>−12.8%p</strong></td><td style="text-align:center;">—</td><td style="padding:6px 10px; color:#16a34a;"><strong>→ 상시 활성화</strong> (제거 시 성능 급락, 핵심 기여 요인)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#fef2f2;"><td style="padding:6px 10px;"><strong>Query Decomposition</strong></td><td style="text-align:center; color:#16a34a;"><strong>+6.8%p</strong></td><td style="text-align:center; color:#16a34a;">32%↓ (129s→88s)</td><td style="padding:6px 10px; color:#dc2626;"><strong>→ 조건부 활성화</strong> (제거하니 오히려 성능 향상)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Query Rewrite</td><td style="text-align:center;">−0.8%p</td><td style="text-align:center;">—</td><td style="padding:6px 10px;">→ 유지 (기여도 미미하나 제거 시 소폭 하락)</td></tr>' +
                '<tr><td style="padding:6px 10px;">Hybrid → Dense</td><td style="text-align:center; color:#dc2626;">−5.0%p</td><td style="text-align:center;">—</td><td style="padding:6px 10px; color:#ea580c;"><strong>→ 문서별 분기</strong> (Dense 우위 문서와 Hybrid 필요 문서 공존)</td></tr>' +
                '</tbody></table><br>' +
                '<strong>Query Decomposition이 해로웠던 이유:</strong><br>서브쿼리로 분해하는 과정에서 원래 질의의 핵심 의도가 희석되고, 각 서브쿼리가 가져오는 컨텍스트에 노이즈가 유입되어 오히려 답변 품질이 하락했습니다. Ground Truth의 80%가 Easy/Medium 난이도여서, 복잡한 추론 없이도 단일 질의로 충분히 답변 가능한 케이스가 대부분이었던 점도 영향을 미쳤습니다.<br><br>' +
                '<strong>Hybrid Search가 Dense 대비 떨어진 이유:</strong><br>한국어 공공문서에서 BM25의 키워드 매칭 정확도가 낮았습니다. 한국어는 조사·어미 변형이 많아 동일 키워드도 형태가 달라지고, 공공문서 특유의 한자어·축약어가 토크나이저와 잘 맞지 않아 Sparse 검색이 노이즈를 유입시켰습니다(Sparse 비중이 높을수록 MRR 하락: α=0.7→0.838, α=0.3→0.811). 다만 법률·규정 문서처럼 정확한 용어 매칭이 중요한 도메인에서는 Hybrid가 여전히 유효했기에, <strong>문서 특성에 따른 분기 설계</strong>로 이어졌습니다.<br><br>' +
                '<strong>핵심 인사이트:</strong><br>E2E 평가만으로는 "Advanced가 성능이 더 낮다"는 알 수 있지만, "Query Decomposition이 범인이다"는 알 수 없었습니다. Reranking의 +12.8%p 기여가 Query Decomposition의 −6.8%p 손해에 상쇄되고 있었고, 이를 분리해낸 것이 <strong>Node-level Ablation</strong>이었습니다.'
            },
            {
              subtitle: '<span style="color:#2563eb;">4단계</span> — 인사이트 → Ecosystem 설계',
              content: '<strong>"문서마다 다른 전략이 필요하다"</strong>가 R&D의 핵심 결론이었습니다.<br><br>' +
                '• Reranking은 항상 켜야 한다 → 전 파이프라인 Reranker 상시 활성화<br>' +
                '• Query Decomposition은 multi-hop 질의가 예상될 때만 → 조건부 활성화 (multi_hop_likelihood > 0.4)<br>' +
                '• 한국어 문서에서 BM25 성능 저하 → semantic_importance에 따라 Dense/Hybrid 분기<br>' +
                '• 문서 구조에 따라 최적 청킹이 다르다 → 구조 복잡도 기반 청킹 전략 분기<br><br>' +
                '<strong>추가 인사이트 — Data 구조화가 답변 품질을 결정한다:</strong><br>' +
                'Ablation Study를 진행하면서 또 하나의 핵심 인사이트를 얻었습니다. 문서의 <strong>Data 구조화 품질이 Semantic Chunking에 영향을 미치고, 그것이 검색 결과에 영향을 미쳐, 결국 최종 답변 생성 품질까지 연쇄적으로 결정</strong>한다는 것이었습니다. 특히 공공문서의 복잡한 표·차트·레이아웃이 텍스트 기반 파서로는 구조가 소실되어 청킹·검색·생성 전 단계에서 품질 저하를 유발했습니다.<br><br>' +
                '이 인사이트가 VLM(Vision-Language Model) 기반 문서 파싱 연구로 이어졌고, 별도 프로젝트 <a href="#" onclick="document.querySelector(\'[data-project=wigtn-ocr]\').click(); return false;"><strong>WigtnOCR</strong></a>(Qwen3-VL-2B를 LoRA fine-tuning하여, 비교 실험 4개 모델 중 Table TEDS 1위 달성)을 시작하게 되었습니다.<br><br>' +
                '<strong>사업 배경 — 왜 "플랫폼"이어야 했는가:</strong><br>' +
                '우리 회사는 음성 AI 전문 회사였고, NLP 사업 진출은 처음이었습니다. 보여줄 수 있는 PoC가 없는 상태에서 네트워크 기반으로 고객사 시연 기회를 만들어야 했는데, 매번 "2주의 PoC 기간을 주세요, 데이터를 주세요"라고 요청하는 것은 영업팀에게 현실적으로 어려운 일이었습니다.<br><br>' +
                '기회가 생겼을 때 <strong>영업팀이 즉시 클라우드 서버에 접속하여 고객 문서를 업로드하고 바로 시연할 수 있는 환경</strong>이 필요했습니다.<br><br>' +
                '이 필요와 R&D 인사이트가 결합되어, 문서 분석 → 맞춤형 파이프라인 자동 생성 → 원클릭 배포를 <strong>비개발자도 운용 가능한 플랫폼 콘솔</strong>로 구축하기로 결정했습니다.<br><br>' +
                '여기에 배포된 파이프라인의 품질을 바로 확인할 수 있는 <strong>평가 기능</strong>, 운영 상태를 실시간으로 파악하는 <strong>모니터링·로그 분석</strong>, 사용자·권한을 관리하는 <strong>Admin</strong> 기능까지 하나의 콘솔에 통합 설계하여, 지금의 <strong>SoundMind AI Ecosystem</strong> 아키텍처가 완성되었습니다.'
            }
          ]
        },
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // AI Console (내부 운영 도구)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
          title: 'AI Console — 내부 운영 플랫폼',
          content: 'RAG R&D 인사이트와 사업 요구가 결합되어 탄생한 <strong>비개발자 운용 가능한 통합 Admin 콘솔</strong>입니다. Next.js 기반 단일 웹 콘솔(:3100)에서 문서 분석·배포(<strong>Analysis</strong>), 품질 평가(<strong>Eval</strong>), 실시간 모니터링(<strong>Monitoring</strong>), 인프라·사용자 관리(<strong>Admin</strong>)까지 RAG 영업 사이클 전체를 운용합니다.'
        },
        {
          title: 'AI Console',
          gallery: [
            {
              src: 'images/projects/soundmind-ai-console-loginpage.png',
              alt: 'AI Console - Login',
              caption: '1. Login — AI Console 관리자 인증 화면'
            },
            {
              src: 'images/projects/soundmind-ai-console-dashboard.png',
              alt: 'AI Console - Dashboard',
              caption: '2. Dashboard — 서비스 상태, GPU 할당, 모델 서빙 현황, Pipeline 관리'
            }
          ]
        },

        // AI Console — Analysis
        {
          title: 'AI Console — Analysis (문서 분석 → RAG 자동 배포)',
          content: '고객 문서를 업로드하면 AI가 문서 특성을 다각도로 분석하고, 최적의 RAG Pipeline을 추천한 뒤 원클릭으로 Docker 컨테이너를 배포합니다. <strong>신규 엔진 Prototype 배포 리드타임 2주 → 5분 (99% 이상 단축).</strong><br><br>2-Tier 아키텍처: Analysis API(포트 9200, Control Plane) + 배포된 파이프라인(포트 9201~9299, Data Plane)',
          subsections: [
            {
              subtitle: '설계 배경 — 왜 Dual-LLM 병렬 분석인가',
              content: '단일 LLM으로 26개 특성을 분석하면, 해당 모델의 학습 편향이 결과에 그대로 반영됩니다.<br>' +
                '문서 구조 복잡도나 도메인 특화도 같은 판단은 모델마다 기준이 다르기 때문에, 하나의 모델만 신뢰하면 특정 문서 유형에서 과잉/과소 설계가 발생할 수 있습니다.<br><br>' +
                '• <strong>Gemini 2.0 Flash</strong> — PDF File API로 네이티브 분석, 1차 프로파일링 + 전략 추천 담당. Flash 모델로 비용 효율적인 대량 분석에 적합<br>' +
                '• <strong>GPT-4o</strong> — Gemini의 분석 결과를 독립적으로 교차 검증. Structured Outputs(json_schema strict mode)로 프로파일 정확성과 전략 적합성을 검증하여 confidence 보정<br><br>' +
                '서로 다른 학습 데이터와 추론 특성을 가진 <strong>두 모델이 독립적으로 판단하고, 불일치 시 신뢰도를 조정</strong>하는 구조로 단일 모델 편향을 방지했습니다.'
            },
            {
              subtitle: '문서 분석 기준 — 26개 특성 프로파일링',
              content: '문서 분석 기준은 <a href="https://github.com/urstory/urstory-rag" target="_blank" rel="noopener noreferrer"><strong>urstory-rag</strong></a>(한국어 최적화 프로덕션 RAG 오픈소스)의 한국어 RAG 전략 설계를 참고하여, 공공기관 문서 특성에 맞게 4개 프로파일 · 26개 특성으로 확장 설계했습니다.',
              list: [
                '<strong>구조 프로파일</strong> — 계층 깊이(1~4+), 섹션 독립성(0.0~1.0), 교차 참조 밀도, 지배적 구조 유형(서술형/표 중심/계층/혼합/QA), 반복 패턴',
                '<strong>콘텐츠 프로파일</strong> — 정보 밀도(sparse/moderate/dense), 밀도 분포, 엔티티 관계 구조, 도메인 특화도(0.0~1.0)',
                '<strong>검색 프로파일</strong> — 예상 질의 유형(factual/comparative/aggregation/causal/procedural), 키워드·시맨틱 중요도, 컨텍스트 윈도우 필요량, 다중 홉 가능성',
                '<strong>시각 프로파일</strong> — 표 복잡도(none~nested), 차트 존재 여부, 이미지 정보 밀도, 레이아웃 복잡도'
              ]
            },
            {
              subtitle: 'Stage 1 — Gemini 2.0 Flash + 텍스트 추출 (병렬)',
              content: '<strong>Gemini</strong>가 PDF File API로 문서를 네이티브 분석하여 26개 특성 프로파일과 RAG 전략을 직접 추천합니다(Structured Output, temp=0.1). 동시에 <strong>pdfplumber</strong>가 텍스트를 추출하여 GPT 검증용 원문을 준비합니다. asyncio.gather로 병렬 실행하여 분석 시간을 절반으로 단축. 300페이지/50MB 초과 시 대표 페이지 샘플링(앞 60%·중간 20%·끝 20%) 자동 적용.'
            },
            {
              subtitle: 'Stage 2 — GPT-4o 교차 검증',
              content: 'GPT-4o가 Gemini의 <strong>프로파일 정확성</strong>(구조 깊이, 도메인 특화도 등)과 <strong>전략 적합성</strong>(과잉/과소 설계 여부)을 json_schema strict mode로 검증합니다. confidence adjustment −0.3 ~ +0.2로 신뢰도를 보정하며, 결과는 "confirmed" / "modified" / "rejected" 3단계로 분류. GPT 미설정 시 Gemini 단독 결과에 ×0.8 페널티를 적용하여 안정성 확보.'
            },
            {
              subtitle: 'Stage 3 — Strategy Engine + 동적 파이프라인 조립',
              content: 'ReportGenerator가 Gemini 원본 + GPT 수정사항을 병합한 뒤, <strong>4차원 전략 공간</strong>(Chunking 5종 · Retrieval 5종 · Indexing 4종 · Post-Processing 4종, 이론적 조합 6,400+)에서 최적 조합을 결정합니다.<br><br>' +
                '<strong>Ablation Study에서 도출한 임계값이 직접 반영된 분기 로직:</strong><br>' +
                '• Reranking → 모든 후처리 전략에서 <strong>상시 활성화</strong> (제거 시 −12.8%p)<br>' +
                '• Query Decomposition → <strong>multi_hop_likelihood > 0.4일 때만</strong> 활성화 (무조건 적용 시 +6.8%p 성능 저하)<br>' +
                '• Retrieval → <strong>semantic_importance > 0.7이면 Dense, keyword_importance > 0.6이면 Hybrid</strong> (한국어 BM25 성능 저하 반영, 가중치 동적 계산)<br>' +
                '• VectorDB → metadata_filtered 전략 시 Qdrant, 나머지 Weaviate 자동 결정<br><br>' +
                'DynamicRAGPipeline이 ComponentRegistry + LangGraph StateGraph를 런타임에 동적 조립. 6가지 그래프 토폴로지: Linear, Classify-Filter, Hierarchical, Multi-Index, Graph-Enhanced, Agentic.'
            },
            {
              subtitle: '원클릭 배포',
              list: [
                'Jinja2 템플릿 기반 Docker Compose 자동 생성 → 원클릭 배포',
                'asyncio.Lock 동시성 보호 + 포트 자동 할당 (9201~9299)',
                '독립 컨테이너로 격리된 RAG Pipeline 자동 생성 및 서비스 등록',
                'Pipeline Factory: 전략 조합에 따라 파이프라인 이름 자동 생성 (예: regulatory-struct_aware-filtered-rag)'
              ]
            }
          ]
        },
        {
          title: 'AI Console — Analysis',
          gallery: [
            {
              src: 'images/projects/soundmind-analysis-document-upload.png',
              alt: 'Analysis - Document Upload & Reports',
              caption: '1. Reports — 문서 업로드 및 분석 결과 목록 (파이프라인 추천 · Confidence 표시)'
            },
            {
              src: 'images/projects/soundmind-analysis-strategy-recommendation.png',
              alt: 'Analysis - Strategy Recommendation & Profiling',
              caption: '2. 전략 추천 — Recommended Pipeline Architecture + 4개 프로파일 · 26개 특성 시각화'
            },
            {
              src: 'images/projects/soundmind-analysis-pipeline-deploy.png',
              alt: 'Analysis - Pipeline Builder & Deploy',
              caption: '3. Pipeline Builder — AI 추천 기반 설정 조정 + VLM Parsing(WigtnOCR) 선택 + 원클릭 배포'
            },
            {
              src: 'images/projects/soundmind-analysis-pipeline-deployed.png',
              alt: 'Analysis - Pipeline Deployed',
              caption: '4. 배포 완료 — Docker 컨테이너 자동 생성 및 서비스 등록 완료'
            }
          ]
        },

        // AI Console — Eval
        {
          title: 'AI Console — Eval (RAG 품질 평가)',
          content: '배포된 RAG Pipeline의 응답 품질을 정량적으로 평가하고, 전략 변경 전후의 효과를 통계적으로 검증합니다.',
          subsections: [
            {
              subtitle: '설계 배경 — 왜 LLM-as-a-Judge인가',
              content: 'RAG R&D 2단계에서 구축한 RAGAS 평가 프레임워크의 핵심 로직(5차원 가중 평가 + Silver Dataset 기반 GT 생성)을 <strong>AI Console Eval 플랫폼으로 이식</strong>했습니다.<br>' +
                'R&D에서 검증된 평가 체계를 그대로 제품화하여, 배포된 파이프라인의 품질을 비개발자도 즉시 평가할 수 있도록 했습니다.<br><br>' +
                '또한 <strong>Judge 모델과 응답 생성 모델의 분리</strong>가 핵심 설계 원칙입니다.<br>' +
                '동일 모델이 생성과 평가를 모두 수행하면 자기 편향(self-bias)이 발생하여 환각이 포함된 긴 답변에 높은 점수를 부여하는 문제를 실제 실험에서 확인했습니다.<br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">구성</th>' +
                '<th style="padding:8px 10px; text-align:center;">응답 생성 (RAG LLM)</th>' +
                '<th style="padding:8px 10px; text-align:center;">평가 (Judge)</th>' +
                '<th style="padding:8px 10px; text-align:left;">결과</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#fef2f2;"><td style="padding:6px 10px;">Before (자기평가)</td><td style="text-align:center;">Qwen3-30B (vLLM)</td><td style="text-align:center;">Qwen3-30B (vLLM)</td><td style="padding:6px 10px; color:#dc2626;"><strong>naive-rag 올만점</strong> — 환각 미감지</td></tr>' +
                '<tr style="background:#f0fdf4;"><td style="padding:6px 10px;">After (분리평가)</td><td style="text-align:center;">Qwen3-30B (vLLM)</td><td style="text-align:center;">GPT-4o (OpenAI API)</td><td style="padding:6px 10px; color:#16a34a;"><strong>fusion-rag 우세</strong> — 환각 정확히 감지</td></tr>' +
                '</tbody></table>'
            },
            {
              subtitle: 'LLM-as-a-Judge 5차원 가중 평가',
              content: 'G-Eval 스타일의 상세 루브릭과 Chain-of-Thought 추론을 적용하여, 각 차원별 1-5점 Likert 척도로 평가 후 0-1 정규화합니다.<br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">차원</th>' +
                '<th style="padding:8px 10px; text-align:center;">가중치</th>' +
                '<th style="padding:8px 10px; text-align:left;">평가 내용</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>Faithfulness</strong></td><td style="text-align:center;">30%</td><td style="padding:6px 10px;">응답이 검색된 문맥에 충실한가 (환각 여부)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>Relevance</strong></td><td style="text-align:center;">25%</td><td style="padding:6px 10px;">응답이 질문에 적절히 대응하는가</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>Completeness</strong></td><td style="text-align:center;">20%</td><td style="padding:6px 10px;">질문에 필요한 정보를 빠짐없이 포함하는가</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>Coherence</strong></td><td style="text-align:center;">15%</td><td style="padding:6px 10px;">응답이 논리적으로 일관되는가</td></tr>' +
                '<tr><td style="padding:6px 10px;"><strong>Fluency</strong></td><td style="text-align:center;">10%</td><td style="padding:6px 10px;">자연스럽고 읽기 쉬운 문장인가</td></tr>' +
                '</tbody></table>'
            },
            {
              subtitle: '실제 A/B 테스트 결과 — VLM 파싱 vs 기본 파싱',
              content: '동일 문서(2025년 공공AX 프로젝트 공모안내서, 69페이지)를 두 파이프라인에 각각 업로드하여 동일 질문으로 GPT-4o Judge 평가를 수행했습니다.<br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.85em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">파이프라인</th>' +
                '<th style="padding:8px 10px; text-align:left;">파서</th>' +
                '<th style="padding:8px 10px; text-align:left;">검색 전략</th>' +
                '<th style="padding:8px 10px; text-align:left;">Reranker</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Pipeline A: <strong>naive-rag</strong></td><td>pymupdf4llm (기본)</td><td>Dense only, top_k=5</td><td>없음</td></tr>' +
                '<tr><td style="padding:6px 10px;">Pipeline B: <strong>fusion-rag</strong></td><td>WigtnOCR VLM (4병렬)</td><td>Hybrid + Filtered, top_k=10</td><td>Qwen3 Reranker 8B</td></tr>' +
                '</tbody></table>' +
                '<strong>GPT-4o Judge 평가 결과:</strong><br><br>' +
                '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">평가 차원</th>' +
                '<th style="padding:8px 10px; text-align:center;">naive-rag (A)</th>' +
                '<th style="padding:8px 10px; text-align:center;">fusion-rag (B)</th>' +
                '<th style="padding:8px 10px; text-align:center;">차이</th>' +
                '<th style="padding:8px 10px; text-align:center;">승자</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Relevance (25%)</td><td style="text-align:center;">1.00</td><td style="text-align:center;">1.00</td><td style="text-align:center;">0</td><td style="text-align:center;">tie</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#fef2f2;"><td style="padding:6px 10px;"><strong>Faithfulness (30%)</strong></td><td style="text-align:center; color:#dc2626;">0.75</td><td style="text-align:center; color:#16a34a;"><strong>1.00</strong></td><td style="text-align:center; color:#16a34a;">+0.25</td><td style="text-align:center; color:#16a34a;"><strong>B</strong></td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Coherence (15%)</td><td style="text-align:center;">1.00</td><td style="text-align:center;">1.00</td><td style="text-align:center;">0</td><td style="text-align:center;">tie</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Fluency (10%)</td><td style="text-align:center;">1.00</td><td style="text-align:center;">1.00</td><td style="text-align:center;">0</td><td style="text-align:center;">tie</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0; background:#fef2f2;"><td style="padding:6px 10px;"><strong>Completeness (20%)</strong></td><td style="text-align:center; color:#dc2626;">0.75</td><td style="text-align:center; color:#16a34a;"><strong>1.00</strong></td><td style="text-align:center; color:#16a34a;">+0.25</td><td style="text-align:center; color:#16a34a;"><strong>B</strong></td></tr>' +
                '<tr style="background:#f8fafc; border-top:2px solid #e2e8f0;"><td style="padding:8px 10px;"><strong>Weighted Overall</strong></td><td style="text-align:center;"><strong>0.888</strong></td><td style="text-align:center; color:#16a34a;"><strong>1.000</strong></td><td style="text-align:center; color:#16a34a;"><strong>+0.113</strong></td><td style="text-align:center; color:#16a34a;"><strong>B</strong></td></tr>' +
                '</tbody></table>' +
                '<strong>GPT-4o Judge의 감점 근거:</strong><br>' +
                '• <strong>Faithfulness −0.25</strong> — Context에 없는 "민간부담금 70%", "현물은 인건비로만" 등 외부 지식을 혼입하여 답변 생성 (<strong>환각</strong>)<br>' +
                '• <strong>Completeness −0.25</strong> — ⑫검역관리·⑭특허정보·⑮법제정보 분과의 "연구소 참여 가능" 차이점을 놓침. 모든 분과가 동일하다고 잘못 기술<br><br>' +
                '→ VLM 파싱(WigtnOCR)으로 구조화된 Markdown이 더 정확한 Context를 제공하여, LLM이 <strong>환각 없이 완전한 답변</strong>을 생성함을 정량적으로 확인'
            },
            {
              subtitle: 'A/B 테스트 통계 검증',
              content: '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:12px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">검증 방법</th>' +
                '<th style="padding:8px 10px; text-align:left;">용도</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Mann-Whitney U test</td><td style="padding:6px 10px;">비모수 통계 검정 (정규성 가정 불필요)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Bootstrap CI (1000회 리샘플링)</td><td style="padding:6px 10px;">95% 신뢰구간 추정</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Cohen\'s d</td><td style="padding:6px 10px;">효과 크기 해석 (small/medium/large)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Holm-Bonferroni 보정</td><td style="padding:6px 10px;">다중 비교 시 Type I 오류 방지</td></tr>' +
                '<tr><td style="padding:6px 10px;">Redis 캐싱</td><td style="padding:6px 10px;">Baseline 결과 캐싱으로 A/B 테스트 비용/시간 절반</td></tr>' +
                '</tbody></table>' +
                ''
            },
            {
              subtitle: '추가 메트릭 (확장 가능)',
              content: '<table style="width:100%; border-collapse:collapse; font-size:0.9em; margin-bottom:4px;">' +
                '<thead><tr style="background:#f1f5f9; border-bottom:2px solid #e2e8f0;">' +
                '<th style="padding:8px 10px; text-align:left;">메트릭</th>' +
                '<th style="padding:8px 10px; text-align:left;">설명</th>' +
                '<th style="padding:8px 10px; text-align:left;">현재 상태</th>' +
                '</tr></thead><tbody>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;"><strong>LLM-as-a-Judge (5차원)</strong></td><td style="padding:6px 10px;">G-Eval 스타일 가중 평가</td><td style="padding:6px 10px; color:#16a34a;">활성 (GPT-4o)</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Context Precision / Recall</td><td style="padding:6px 10px;">검색된 문맥의 정밀도와 재현율</td><td style="padding:6px 10px;">GT 필요 시 활성화</td></tr>' +
                '<tr style="border-bottom:1px solid #e2e8f0;"><td style="padding:6px 10px;">Answer Correctness</td><td style="padding:6px 10px;">Ground Truth 대비 정답률</td><td style="padding:6px 10px;">GT 필요 시 활성화</td></tr>' +
                '<tr><td style="padding:6px 10px;">Chunking Quality (BC/CS)</td><td style="padding:6px 10px;">청킹 전략의 품질 평가 (MoC)</td><td style="padding:6px 10px;">WigtnOCR 연구에서 별도 평가 완료</td></tr>' +
                '</tbody></table>'
            }
          ]
        },
        // AI Console — Eval Screenshots
        {
          title: 'AI Console — Eval',
          gallery: [
            {
              src: 'images/projects/soundmind-eval-abtest-self-judge.png',
              alt: 'Eval - Self Judge (Before)',
              caption: '1. Before — Qwen3-30B 자기평가: RAGAS E2E 메트릭 + Judge 올만점 (환각 미감지)'
            },
            {
              src: 'images/projects/soundmind-eval-abtest-gpt4o-judge.png',
              alt: 'Eval - GPT-4o Judge (After)',
              caption: '2. After — GPT-4o 분리평가: Faithfulness·Completeness에서 fusion-rag 우세 (환각 정확 감지)'
            }
          ]
        },

        // AI Console — Monitoring
        {
          title: 'AI Console — Monitoring (실시간 모니터링)',
          content: '전체 에코시스템의 로그를 중앙에서 수집·시각화하여 장애를 조기에 감지하고, 서비스 상태를 실시간으로 파악합니다.',
          subsections: [
            {
              subtitle: '설계 배경 — 왜 Grafana + Loki인가',
              content: 'GPU 서버(RTX PRO 6000 ×2)에서 LLM 서빙과 RAG Pipeline이 동시에 운용되는 환경에서, ELK 스택의 리소스 소비는 부담이었습니다.<br><br>' +
                'Grafana + Loki + Promtail 조합은 <strong>Docker 소켓 기반 비침투적(non-intrusive) 자동 수집</strong>으로 앱 코드 수정 없이 전체 에코시스템을 모니터링하며, ELK 대비 현저히 낮은 리소스를 사용합니다.'
            },
            {
              subtitle: '인프라 구성',
              list: [
                'Grafana 11.5.2 + Loki 3.4.2 + Promtail 3.4.2 기반 중앙 로그 수집',
                'Docker 소켓 기반 자동 수집 — 새 컨테이너 추가 시 설정 변경 불필요',
                'Labels(인덱스용, 카디널리티 낮음: level, platform, service)와 Structured Metadata(카디널리티 높음: logger, module, function)를 분리하여 Loki 인덱싱 효율 최적화'
              ]
            },
            {
              subtitle: '대시보드',
              list: [
                '4개 전용 대시보드: System Overview · AI Platform · Analysis · Eval',
                'Model Serving 로그 대시보드 별도 운용',
                '서비스 상태, GPU 할당, Pipeline 관리, 사용자/권한 설정까지 운영 전반 커버'
              ]
            }
          ]
        },
        {
          title: 'AI Console — Monitoring',
          gallery: [
            {
              src: 'images/projects/soundmind-monitoring-system-overview.png',
              alt: 'Monitoring - System Overview',
              caption: '1. System Overview — 전체 에코시스템 실시간 로그 대시보드'
            },
            {
              src: 'images/projects/soundmind-monitoring-platform-detail.png',
              alt: 'Monitoring - Platform Detail',
              caption: '2. Platform Detail — 플랫폼별 상세 메트릭 및 에러 추적'
            }
          ]
        },

        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        // AI Platform (고객 대면)
        // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        {
          title: 'AI Platform — 고객 대면 Playground (B2B SaaS)',
          content: 'AI Console에서 생성·배포된 맞춤형 RAG Pipeline을, 고객이 현장에서 즉시 PoC 체험할 수 있는 <strong>Playground 서비스 플랫폼</strong>입니다. 영업팀이 클라우드 서버에 접속하여 고객 문서를 업로드하고 바로 시연할 수 있도록 설계되었으며, 3개의 독립 Agent 세션을 제공합니다. React 19 Web Console + FastAPI API Gateway(JWT 멀티테넌트 인증, SSE 스트리밍)로 구현되었습니다.',
          subsections: [
            {
              subtitle: 'Web Console',
              gallery: [
                {
                  src: 'images/projects/soundmind-ai-platform-loginpage.png',
                  alt: 'AI Platform - Login',
                  caption: '1. Login — JWT 기반 멀티테넌트 인증'
                },
                {
                  src: 'images/projects/soundmind-ai-platform-portal-page.png',
                  alt: 'AI Platform - Portal',
                  caption: '2. Portal — RAG Agent · Chat Agent · AICC Agent 서비스 선택'
                }
              ]
            },
            {
              subtitle: '인증 · 권한 — 5단계 진화',
              content: 'MVP 무인증에서 출발하여 PoC 납품 단계까지 점진적으로 확장했습니다. Company(slug) + Team + Session 3계층 멀티테넌트 격리를 적용하여 고객사별 데이터를 분리합니다.' +
                '<table style="width:100%; margin-top:12px; border-collapse:collapse; font-size:0.92em;">' +
                '<thead><tr style="background:#f1f5f9;">' +
                '<th style="padding:8px; border:1px solid #e2e8f0; text-align:center;">단계</th>' +
                '<th style="padding:8px; border:1px solid #e2e8f0;">인증 방식</th>' +
                '<th style="padding:8px; border:1px solid #e2e8f0;">핵심 변화</th>' +
                '</tr></thead><tbody>' +
                '<tr><td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">①</td><td style="padding:8px; border:1px solid #e2e8f0;">무인증</td><td style="padding:8px; border:1px solid #e2e8f0;">MVP 빠른 검증</td></tr>' +
                '<tr><td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">②</td><td style="padding:8px; border:1px solid #e2e8f0;">JWT</td><td style="padding:8px; border:1px solid #e2e8f0;">DB 연동 사용자 인증</td></tr>' +
                '<tr><td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">③</td><td style="padding:8px; border:1px solid #e2e8f0;">Guest Tier</td><td style="padding:8px; border:1px solid #e2e8f0;">회원가입 없이 체험 (refresh token 비활성화)</td></tr>' +
                '<tr><td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">④</td><td style="padding:8px; border:1px solid #e2e8f0;">3-tier RBAC</td><td style="padding:8px; border:1px solid #e2e8f0;">Admin · Manager · User · Guest 역할별 접근 제어</td></tr>' +
                '<tr><td style="padding:8px; border:1px solid #e2e8f0; text-align:center;">⑤</td><td style="padding:8px; border:1px solid #e2e8f0;">Guest BYOK</td><td style="padding:8px; border:1px solid #e2e8f0;">게스트가 자체 API 키로 클라우드 LLM 직접 호출</td></tr>' +
                '</tbody></table>'
            },
            {
              subtitle: '① RAG Agent — 문서 기반 Q&A',
              content: '고객이 업로드한 문서를 기반으로 질문에 답변하는 문서 특화 Q&A 에이전트입니다. AI Console Analysis에서 고객 문서 특성에 맞게 자동 생성·배포된 RAG Pipeline을 AI Platform이 자동으로 감지하여 연결합니다. 고객마다 서로 다른 맞춤형 파이프라인이 연결되므로, 동일한 플랫폼 위에서 고객별로 최적화된 검색·응답 경험을 제공합니다.',
              list: [
                '<strong>Dynamic Pipeline Routing</strong> — 고객사(Company)별 PipelineMapping 테이블에서 파이프라인 URL을 조회하여 동적으로 라우팅. 최대 99개 파이프라인 동시 운용(9201~9299), httpx.AsyncClient lazy 초기화 + 커넥션 풀링',
                '<strong>Graceful Degradation</strong> — 파이프라인 장애 시 Direct LLM 응답으로 자동 전환(fallback: true 메타데이터 포함), 사용자 요청이 끊기지 않는 설계',
                '<strong>Retrieval Insight 3-Panel</strong> — (1) Query Transformation: 원본 질의 → 5개 최적화 쿼리, (2) Hybrid Search Score: Dense/Sparse 점수 바 차트, (3) Reranking Impact: 순위 변동 시각화(#1 Gold · #2 Silver · #3 Bronze 뱃지). SSE 이벤트로 실시간 스트리밍',
                '<strong>SSE 실시간 스트리밍</strong> — agent_start → processing → llm_stream(토큰 단위) → final_response → done 이벤트 체인. StreamingThinkParser가 &lt;think&gt; 태그를 실시간 분리하여 추론 과정과 답변을 동시 렌더링'
              ]
            },
            {
              subtitle: 'RAG Agent',
              gallery: [
                {
                  src: 'images/projects/soundmind-rag-agent-main.png',
                  alt: 'RAG Agent - Main',
                  caption: '1. RAG Agent 메인 — 문서 기반 Q&A Playground'
                },
                {
                  src: 'images/projects/soundmind-rag-agent-chat-session.png',
                  alt: 'RAG Agent - Chat Session',
                  caption: '2. Chat Session — 문서 기반 Q&A 대화 및 SSE 실시간 스트리밍'
                },
                {
                  src: 'images/projects/soundmind-rag-agent-document-upload.png',
                  alt: 'RAG Agent - Document Upload',
                  caption: '3. 문서 업로드 — 고객 문서 업로드 및 파이프라인 연결'
                },
                {
                  src: 'images/projects/soundmind-rag-agent-qa.png',
                  alt: 'RAG Agent - Retrieval Insight',
                  caption: '4. Retrieval Insight — Query Transformation + Hybrid Score + Reranking Impact 시각화'
                }
              ]
            },
            {
              subtitle: '② Chat Agent — 자율형 AI 에이전트 (MVP 구현 완료)',
              content: '문서에 국한되지 않고, LLM이 스스로 상황을 판단하여 필요한 도구를 선택·호출하는 자율형 에이전트입니다. LangGraph ReAct 아키텍처 기반으로 복합 태스크를 단계적으로 수행합니다.',
              list: [
                '<strong>LangGraph StateGraph</strong> — agent(LLM 호출) → tools(도구 실행) 2노드 그래프, tool_calls 존재 여부로 조건부 라우팅, MemorySaver로 세션 상태 유지, 무한 루프 방지 10회 이터레이션 제한',
                '<strong>내장 도구 3종</strong> — Tavily Search(웹 검색, 최대 5결과), File Read(TXT/PDF, 보안 체크: .env/.ssh/.aws 차단), Report Agent(요약/분석/회의록/커스텀 4종 문서 생성 서브에이전트)',
                '<strong>MCP 확장</strong> — Model Context Protocol 클라이언트로 외부 도구 동적 추가 가능',
                '<strong>멀티 프로바이더</strong> — OpenAI / vLLM / Gemini 동일 인터페이스 지원, Guest BYOK(Bring Your Own Key)로 게스트 사용자 자체 API 키 사용'
              ]
            },
            {
              subtitle: 'Chat Agent',
              gallery: [
                {
                  src: 'images/projects/soundmind-chat-agent-build.png',
                  alt: 'Chat Agent - Build',
                  caption: '1. Chat Agent Toolkit — 모델·도구·MCP·Sub-agent 선택 후 Build'
                },
                {
                  src: 'images/projects/soundmind-chat-agent-chat-session.png',
                  alt: 'Chat Agent - Chat Session',
                  caption: '2. Chat Session — Tavily Search 도구 호출 및 응답'
                }
              ]
            },
            {
              subtitle: '③ AICC Agent — AI 컨택센터 (개발 예정)',
              content: 'RAG Agent의 문서 기반 응답 능력과 Chat Agent의 자율 도구 사용 능력을 결합하여, 고객 상담 시나리오에 특화된 AI 컨택센터 에이전트입니다. 개발 예정.'
            }
          ]
        },
        {
          title: 'Next Step',
          content: '현재 Beta 테스트를 진행 중이며, End User 피드백을 반영한 정식 배포를 준비하고 있습니다.',
          subsections: [
            {
              subtitle: 'WigtnOCR 연동 — VLM 기반 문서 파싱 고도화',
              content: '현재 텍스트 추출 중심의 파싱을 <strong>VLM(Vision-Language Model) 기반으로 확장</strong>하여, 표·차트·레이아웃 등 시각적 구조까지 보존합니다. 별도 연구 프로젝트로 진행 중인 <strong>WigtnOCR</strong>(Qwen3-VL-2B LoRA fine-tuning → 비교 실험 4개 모델 중 Table TEDS 1위, 15배 큰 30B 모델 성능 초과)의 성과를 Ecosystem에 직접 적용하여, A/B 테스트에서 확인된 VLM 파싱의 품질 우위(0.888 → 1.000)를 전체 파이프라인에 확대할 예정입니다.'
            },
            {
              subtitle: '정식 배포',
              list: [
                'Beta 테스트 피드백 기반 UX 개선 및 안정성 확보',
                '평가 → 분석 → 재배포 Feedback Loop으로 자동 최적화 사이클 구축',
                'AICC Agent(AI 컨택센터) 개발 및 3개 Agent 서비스 완성'
              ]
            }
          ]
        }
      ],
      tags: ['LangGraph', 'Advanced RAG', 'MSA', 'Dual Vector DB', 'VLM', 'FastAPI', 'Docker', 'LLM-as-Judge']
    },
    'wigvo': {
      title: 'WIGVO - PSTN 기반 AI 실시간 양방향 전화 통역 중계 플랫폼',
      image: 'images/projects/wigvo_logo.png',
      imageContain: true,
      meta: {
        organization: 'WIGTN Crew (ACL 2026 System Demonstrations Under Review, 제 1저자)',
        role: 'Lead Developer (설계·개발·배포 주도, 팀원 테스트 협업)',
        period: '2025.09 ~ 2026.03',
        architecture: 'Python 3.12 FastAPI · OpenAI Realtime API (Whisper-1) · GPT-4o-mini · Twilio Media Streams · Silero VAD · Next.js 16 · React Native/Expo · Supabase · Google Cloud Run'
      },
      disclaimer: {
        show: true,
        text: 'WIGTN Crew 독립 연구로 진행된 프로젝트입니다. 148건의 실제 통화 데이터로 검증되었습니다.<br><em>"Real-Time Bidirectional Speech Translation over Legacy PSTN Calls via Dual-Session Echo Gating"</em>'
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>PSTN 기반 AI 실시간 양방향 전화 통역 중계 플랫폼</strong><br><br>한 스타트업 대표에게 들은 이야기에서 시작된 프로젝트. 대구에서 근무하던 외국인 직원이 서울로 전근하면서 부동산을 구해야 했는데, 언어가 통하지 않아 전화 한 통 하기가 어려웠다고 한다. 번역 앱은 있지만 전화 통화에서는 한계가 있었고, 이런 경험을 겪는 사람이 많을 거라 생각해 그 벽을 허물고자 시작했다.<br><br>고음역 대역폭(16~24kHz)에서만 가능하다고 여겨지던 실시간 양방향 음성 번역을 PSTN 저음역 대역폭(8kHz G.711 μ-law)에서 구현하기 위해, 에코 제거 루프와 VAD를 독립 아키텍처로 설계하여 프로덕션 배포했다.',
          subsections: [
            {
              subtitle: '데모 & 링크',
              list: [
                '<strong>데모 비디오</strong>: <a href="https://youtu.be/_ixVEnHJxjk?si=9tsInmz6ExIMbh3x" target="_blank" rel="noopener noreferrer">YouTube</a>',
                '<strong>프로덕션</strong>: <a href="https://wigvo-web-gzjzn35jyq-du.a.run.app/" target="_blank" rel="noopener noreferrer">wigvo-web (Cloud Run)</a>',
                '<strong>GitHub</strong>: <a href="https://github.com/wigtn/wigvo-v2" target="_blank" rel="noopener noreferrer">wigtn/wigvo-v2</a>'
              ]
            },
            {
              subtitle: '누구를 위한 시스템인가',
              list: [
                '<strong>재한 외국인</strong> — 한국어로 전화할 수 없는 220만 거주 외국인 (2024)',
                '<strong>해외 체류 한국인</strong> — 현지 언어로 전화할 수 없는 280만 해외 한국인',
                '<strong>청각·언어 장애인</strong> — 음성 통화가 불가능한 39만 등록 장애인',
                '<strong>콜포비아</strong> — 전화 자체를 기피하는 MZ세대 (~40%)'
              ]
            }
          ]
        },
        {
          title: '기술적 문제 — 왜 PSTN이 어려운가',
          subsections: [
            {
              subtitle: '오디오 품질 차이',
              content: 'PCM16(16~24kHz) 환경은 광대역 오디오와 클라이언트사이드 AEC를 전제. PSTN은 G.711 μ-law 8kHz 협대역 코덱, 80~600ms 가변 지연, 코덱 압축 노이즈가 상시 존재.'
            },
            {
              subtitle: '에코 루프',
              content: 'AI가 번역한 TTS 음성이 PSTN을 통해 80~600ms 후 되돌아와 다시 STT → 번역 → TTS 파이프라인을 타는 무한 루프. <strong>초기 테스트 10건 중 8건에서 발생</strong>. 고음역 앱 환경의 클라이언트 AEC가 없는 PSTN에서는 소프트웨어로 직접 해결해야 한다.'
            },
            {
              subtitle: 'VAD 실패',
              content: 'OpenAI Server VAD는 깨끗한 광대역 오디오를 전제. PSTN 배경 노이즈(RMS 50~200)는 Server VAD 기준으로 "발화 중"으로 인식되어, <strong><code>speech_stopped</code>가 15~72초 뒤에야 발화되거나 아예 발화되지 않는다</strong>.'
            },
            {
              subtitle: '기존 시스템과의 비교',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>PSTN 양방향 음성 번역 시스템 비교</caption>',
                '<thead><tr>',
                '<th scope="col">시스템</th><th scope="col">PSTN</th><th scope="col">양방향</th>',
                '<th scope="col">S2S</th><th scope="col">에코 처리</th><th scope="col">접근성</th>',
                '</tr></thead><tbody>',
                '<tr><td>SeamlessM4T</td><td></td><td>O</td><td>O</td><td>N/A</td><td></td></tr>',
                '<tr><td>Moshi / Hibiki</td><td></td><td></td><td>O</td><td>N/A</td><td></td></tr>',
                '<tr><td>Google Duplex</td><td>O</td><td></td><td></td><td>N/D</td><td></td></tr>',
                '<tr><td>Samsung Galaxy AI</td><td>O</td><td>O</td><td>O</td><td>HW AEC</td><td></td></tr>',
                '<tr><td>SKT A.dot</td><td>O</td><td>O</td><td>O</td><td>통신사 인프라</td><td></td></tr>',
                '<tr class="tr--highlight"><td>WIGVO</td><td>O</td><td>O</td><td>O</td><td>소프트웨어</td><td>O</td></tr>',
                '</tbody></table>'
              ].join('')
            }
          ]
        },
        {
          title: 'Architecture — Dual-Session Echo Gating',
          content: '브라우저 클라이언트가 WebSocket으로 릴레이 서버에 연결하면, 서버가 <strong>2개의 독립된 Realtime LLM 세션</strong>과 Twilio 전화 게이트웨이를 관리합니다. AudioRouter가 Strategy 패턴으로 3개 파이프라인(V2V, T2V, FullAgent) 중 하나에 이벤트를 위임합니다.',
          image: {
            src: 'images/projects/wigvo_architecture.png',
            alt: 'WIGVO System Architecture',
            caption: 'Figure 1: WIGVO 시스템 아키텍처. Session A(빨강)는 사용자 음성을 G.711로 번역하여 Twilio로 전달, Session B(파랑)는 PSTN 오디오를 3-Stage 필터 파이프라인을 거쳐 처리.'
          },
          subsections: [
            {
              subtitle: '3계층 구조',
              list: [
                '<strong>Layer 1 — Transport</strong>: Twilio Media Streams(PSTN ↔ G.711 μ-law 8kHz) + Browser WebSocket(PCM 16kHz)',
                '<strong>Layer 2 — Pipeline</strong>: AudioRouter가 Strategy 패턴으로 V2V / T2V / Agent 모드에 이벤트를 위임',
                '<strong>Layer 3 — Sessions</strong>: Session A(브라우저→전화) + Session B(전화→브라우저)가 독립 시스템 프롬프트와 6턴 슬라이딩 컨텍스트 유지'
              ]
            },
            {
              subtitle: 'STT-번역 분리',
              content: 'Realtime API에 번역까지 맡기면 원문에 없는 내용을 추가하는 할루시네이션이 발생. STT는 Realtime API 내 Whisper-1을 유지하고, 번역만 <strong>GPT-4o-mini Chat API(temperature=0)</strong>로 분리. <code>context_prune_keep=0</code>으로 Realtime 자체 번역을 완전 차단.'
            }
          ]
        },
        {
          title: 'Stage 1 — Echo Gate (7단계 진화)',
          content: 'TTS 음성이 PSTN을 통해 되돌아오는 에코 루프를 소프트웨어로 차단합니다.',
          image: {
            src: 'images/projects/wigvo_pipeline.png',
            alt: 'PSTN Audio Processing Pipeline',
            caption: 'Figure 2: 3-Stage 오디오 필터 파이프라인. Echo Gate → Energy Gate → Silero VAD.'
          },
          subsections: [
            {
              subtitle: '결정적 돌파구 — Drop vs Replace',
              content: '오디오를 "차단(drop)"하면 Server VAD가 "스트림 중단"으로 해석하여 멈춤. μ-law 무음(0xFF)으로 "대체(replace)"하면 스트림 연속성은 유지되면서 VAD가 침묵으로 정상 인식. 이 "Drop vs Replace" 패러다임이 Echo Gate와 VAD 양쪽에서 동일하게 적용되는 핵심 원리.'
            },
            {
              subtitle: '최종 Echo Gate 3단 구조',
              list: [
                '<strong>에코 윈도우</strong> — TTS 재생 중 PSTN 오디오를 μ-law silence로 대체 + TTS 종료 후 0.5초 지터 마진',
                '<strong>Dynamic Settling</strong> — TTS 길이 × 0.3 (0.5s~1.5s 클램프)로 AGC 회복 노이즈 억제, RMS ≥ 500은 실제 발화로 통과',
                '<strong>일반 구간</strong> — RMS ≥ 150 에너지 임계치'
              ]
            },
            {
              subtitle: '7단계 진화 과정',
              list: [
                'Audio Fingerprint(Pearson 상관계수) — G.711 μ-law 비선형 양자화로 상관관계 붕괴, 전혀 동작 안함',
                '고정 Echo Gate(2.5초) — 에코 해결하나 대화 흐름 단절',
                'Dynamic Cooldown — TTS 길이 비례 차단, 차단 해제 직후 AGC 노이즈 스파이크 문제',
                '<strong>Silence Injection + RMS + Dynamic Settling + Silero</strong> — 최종 채택'
              ]
            },
            {
              subtitle: '성과',
              content: '에코 루프 발생률 <strong>초기 8/10건 → 프로덕션 0/148건</strong>'
            }
          ]
        },
        {
          title: 'Stage 2 — PSTN VAD 독립 아키텍처',
          subsections: [
            {
              subtitle: '문제',
              content: 'OpenAI Server VAD는 블랙박스라 에코 구간에서 프레임 단위 제어 불가. RMS 임계치를 150→80→30→20까지 시도했으나 PSTN에서 안정적인 단일 임계치는 존재하지 않았다. <strong>Local Silero VAD로 전환</strong>하여 PSTN 특성에 맞는 독립 아키텍처를 구성.'
            },
            {
              subtitle: '2단 독립 필터',
              list: [
                '<strong>Stage 1 — RMS Energy Gate</strong>: 에코 윈도우 내 RMS ≥ 500, Settling RMS ≥ 200, 일반 RMS ≥ 150',
                '<strong>Stage 2 — Silero VAD</strong>: 에너지 게이트 통과 프레임을 신경망 판단. 8kHz→16kHz zero-order hold 업샘플링',
                '비대칭 히스테리시스: onset 160ms(5프레임) / offset 800ms(25프레임)',
                '최소 발화 250ms, 최소 피크 RMS 300으로 약한 신호를 노이즈로 거부'
              ]
            },
            {
              subtitle: '성과',
              content: '<code>speech_stopped</code> 레이턴시 <strong>15~72초 → 480ms</strong>'
            }
          ]
        },
        {
          title: 'Stage 3 — Whisper 할루시네이션 3-Stage 필터',
          content: 'PSTN 노이즈가 Whisper-1에 입력되면 학습 데이터(유튜브, 방송)에서 학습한 "그럴듯한" 텍스트를 생성. "MBC 뉴스 이덕영입니다", "Thanks for watching" 같은 방송체 패턴이 번역 파이프라인으로 유입되어 수신자 전화기로 나가는 사고가 <strong>프로덕션에서 실제로 발생</strong>했다.',
          subsections: [
            {
              subtitle: '3-Stage 파이프라인',
              list: [
                '<strong>Pre-STT (Stage 0)</strong> — Echo Gate + Silence Injection으로 오염된 오디오 자체를 Whisper에 넣지 않음',
                '<strong>Post-STT (Stage 1)</strong> — 한국어 29패턴 + 영어 22패턴, 총 51개 방송체 블록리스트 + 최소 길이·침묵 timeout·반복 구절·신뢰도 조합 4-layer 텍스트 필터',
                '<strong>Post-Translation (Stage 2)</strong> — 3-level Guardrail: L1(통과, 0ms) · L2(TTS 즉시+백그라운드 교정, 0ms) · L3(차단+GPT-4o-mini 교정, ~800ms)'
              ]
            },
            {
              subtitle: '성과',
              content: '할루시네이션 유입률 <strong>0.3% 미만</strong>, 통화당 평균 0.7건 차단 (148건 기준). 95%+ 케이스가 L1 처리로 추가 레이턴시 없음.'
            }
          ]
        },
        {
          title: 'Strategy 패턴 — 3개 통신 파이프라인',
          content: '초기 God Object(AudioRouter)를 Strategy 패턴으로 분리하여 <strong>얇은 위임자 + 3개 독립 파이프라인</strong>으로 리팩토링 (73% 코드 감소).',
          subsections: [
            {
              subtitle: '파이프라인 구조',
              list: [
                '<strong>VoiceToVoice (V2V)</strong> — 양방향 음성 번역. Echo Gate + Silence Injection + 3단계 인터럽트 우선순위',
                '<strong>TextToVoice (T2V)</strong> — 청각·언어 장애인용. 텍스트 입력 → AI 번역 음성 전달',
                '<strong>FullAgent</strong> — 콜포비아용 AI 대리 통화. TextToVoice 상속 + Function Calling',
                '<strong>EchoGateManager</strong> — 공통 에코 방지 로직, 파이프라인 간 공유',
                '<strong>ChatTranslator</strong> — T2V/Agent Session B 번역, GPT-4o-mini'
              ]
            }
          ]
        },
        {
          title: 'Key Metrics — 148건 프로덕션 통화',
          subsections: [
            {
              subtitle: '레이턴시',
              list: [
                'Session A P50: <strong>555ms</strong> / P95: 1,169ms',
                'Session B P50: <strong>2,868ms</strong> (발화 길이와 상관 Pearson r=0.400)',
                '첫 메시지 P50: 1,215ms (cold start)'
              ]
            },
            {
              subtitle: '에코 및 안전성',
              list: [
                '에코 루프 발생: <strong>0 / 148건</strong> (프로토타입 80% → 0%)',
                '통화당 에코 게이트 활성화: 평균 7.0회',
                '통화당 VAD 오탐: 평균 1.8건',
                '통화당 할루시네이션 차단: 평균 0.7건',
                'Guardrail L2 148회 (정상 교정) / L3 0회'
              ]
            },
            {
              subtitle: '비용',
              list: [
                'V2V: $0.30/min · T2V: $0.29/min',
                '아키텍처 최적화 후: <strong>$0.18/min (33% 절감)</strong>',
                '모드별 분포: T2V 116건(68.6%) · V2V 52건(30.8%) · Agent 1건(0.6%)'
              ]
            }
          ]
        },
        {
          title: 'Latency Distribution',
          gallery: [
            {
              src: 'images/projects/wigvo_latency_histogram.png',
              alt: 'Latency Distribution Histogram',
              caption: 'Figure 3: E2E 레이턴시 분포. Session A(N=814턴)와 Session B(N=744턴) 라이브 PSTN 통화 실측.'
            },
            {
              src: 'images/projects/wigvo_utterance_scatter.png',
              alt: 'Utterance Length vs Latency',
              caption: 'Figure 4: 발화 길이 vs Session B E2E 레이턴시. Pearson r=0.400 (p<0.001).'
            }
          ]
        },
        {
          title: 'Demo',
          image: {
            src: 'images/projects/wigvo_screenshot_call.png',
            alt: 'WIGVO Call Interface',
            caption: 'Figure 5: WIGVO 웹 인터페이스 — V2V 통화 중 실시간 이중언어 자막, 채팅 이력, 통화 컨트롤.'
          },
          content: '세션 진행: (1) 시나리오 선택 → (2) AI 에이전트와 대화하여 용건·전화번호 전달 → (3) PSTN 통화 개시 + 양방향 번역 → (4) 실시간 자막 표시. 통화 중 모드 전환(V2V ↔ T2V ↔ FullAgent) 가능.'
        },
        {
          title: 'Ablation Study',
          subsections: [
            {
              subtitle: 'Echo Gate 설계 비교',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>Echo Gate 방식별 성능 비교</caption>',
                '<thead><tr>',
                '<th scope="col">방식</th><th scope="col">에코 루프</th>',
                '<th scope="col">대화 지연</th><th scope="col">채택</th>',
                '</tr></thead><tbody>',
                '<tr><td>Audio Fingerprint (Pearson)</td><td>해결 불가</td><td>—</td><td></td></tr>',
                '<tr><td>고정 Echo Gate (2.5초)</td><td>해결</td><td>단절</td><td></td></tr>',
                '<tr><td>Dynamic Cooldown</td><td>해결</td><td>개선</td><td></td></tr>',
                '<tr class="tr--highlight"><td>Silence Injection + RMS + Dynamic Settling + Silero</td><td>해결</td><td>최소화</td><td>O</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: 'Finding',
              content: 'PSTN 환경에서 에코 감지는 신호 상관관계 방식이 동작하지 않는다. 에코 구간을 직접 제어하면서 무음 프레임으로 대체하는 방식만이 안정적이다. Realtime API의 생성 특성은 STT에는 적합하지만 번역에는 부적합하며, <code>temperature=0</code> Chat API 분리가 정확도와 안정성을 동시에 개선한다.'
            }
          ]
        },
        {
          title: 'Tech Stack',
          subsections: [
            {
              subtitle: 'AI & Audio',
              list: [
                '<strong>STT</strong>: OpenAI Realtime API (Whisper-1)',
                '<strong>번역</strong>: GPT-4o-mini Chat API (temperature=0)',
                '<strong>VAD</strong>: Silero VAD (ONNX) + RMS Energy Gate',
                '<strong>전화</strong>: Twilio Media Streams (PSTN G.711 μ-law 8kHz)'
              ]
            },
            {
              subtitle: 'Backend & Frontend',
              list: [
                '<strong>Backend</strong>: Python 3.12, FastAPI, uvicorn, asyncio',
                '<strong>Frontend</strong>: Next.js 16, React 19, Zustand, shadcn/ui',
                '<strong>Mobile</strong>: React Native (Expo SDK 54)',
                '<strong>DB</strong>: Supabase (PostgreSQL + Auth + RLS)'
              ]
            },
            {
              subtitle: 'Infrastructure',
              list: [
                '<strong>Infra</strong>: Google Cloud Run, Cloud Build, Secret Manager',
                '<strong>Build</strong>: Docker, Kaniko',
                '<strong>평가</strong>: COMET, BLEU, chrF',
                '<strong>테스트</strong>: pytest (434개)'
              ]
            }
          ]
        }
      ],
      tags: ['FastAPI', 'OpenAI Realtime', 'Twilio', 'Silero VAD', 'Cloud Run', 'Next.js', 'React Native', 'Dual-Session Echo Gating', 'ACL 2026', 'COMET']
    },
    'wigtn-ocr': {
      title: 'WigtnOCR - VLM 기반 한국 공공기관 문서 전용 파싱 프레임워크',
      image: 'images/projects/wigtnocr-huggingface.png',
      meta: {
        organization: 'WIGTN Crew (EMNLP 2026 In Preparation)',
        role: 'Independent Researcher (파이프라인 설계·학습·평가·배포)',
        period: '2026.01 ~ 현재',
        architecture: 'Qwen3-VL-2B + LoRA + ms-swift + vLLM + BGE-M3 + FAISS'
      },
      disclaimer: {
        show: false,
        text: ''
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>VLM 기반 한국 공공기관 문서 전용 파싱 프레임워크</strong><br><br>SoundMind Inc.에서 B2B2G(정부 대상 간접 납품) RAG 서비스를 개발하며 직면한 문제에서 출발한 연구 프로젝트. End User가 어떤 구조의 문서를 활용하는지 사전에 알 수 없는 B2B2G 환경에서, 한국 정부 공공문서라는 도메인만은 확정되어 있었기 때문에, 한국 정부 공공문서를 정확하게 읽고 구조화하여 저장할 수 있으며 실무 인프라 여건(제한된 GPU, 비용)에 충족되는 SLM 기반 Document Parser를 만드는 것이 목표였다.<br><br>"큰 모델이 좋다"는 단계를 넘어, <strong>LLM의 지능을 SLM으로 어떻게 효율적으로 전이할 것인가</strong>가 현재 AI 엔지니어링의 핵심 화두다. Orca(Microsoft, 2023)가 제시한 지식 증류(Knowledge Distillation) 패러다임 — LLM의 추론 과정을 SLM에 학습시켜 소형 모델로 대형 모델 수준의 성능을 달성하는 접근 — 을 한국 공공문서 파싱이라는 도메인에 적용했다.<br><br>Qwen3-VL-2B-Instruct를 한국 공공문서 2,667장으로 LoRA fine-tuning한 결과, <strong>15배 큰 Teacher 모델(30B)과 동등하거나 초과하는 파싱 성능을 달성</strong>했으며, <strong>6개 파서 비교에서 Retrieval 성능 1위</strong>를 기록하여 "구조화 파싱 → 청킹 품질 개선 → 검색 성능 향상"의 end-to-end 인과 관계를 검증했다. 모델 가중치·학습 데이터·평가 코드를 전부 오픈소스로 공개했다.<br><br><strong>배포:</strong> <a href="https://huggingface.co/Wigtn/Qwen3-VL-2B-WigtnOCR" target="_blank" rel="noopener noreferrer">HuggingFace Model</a> · <a href="https://huggingface.co/datasets/Wigtn/KoGovDoc-Bench" target="_blank" rel="noopener noreferrer">HuggingFace Dataset</a> · <a href="https://github.com/Hyeongseob91/research-vlm-based-document-parsing" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="https://wigtn.com" target="_blank" rel="noopener noreferrer">WIGTN Crew</a>',
          subsections: [
            {
              subtitle: '연구 질문',
              content: '"30B Teacher의 파싱 능력을 2B Student로 압축하면서 한국 공공문서에 특화된 성능을 달성할 수 있는가? 그리고 구조화된 파싱이 실제 RAG 파이프라인의 청킹·검색 품질로 이어지는가?"',
              image: { src: 'images/projects/wigtnocr-highlights.png', alt: 'WigtnOCR 핵심 벤치마크 결과' }
            }
          ]
        },
        {
          title: '기술적 문제 — 왜 기존 파서로는 안 되는가',
          subsections: [
            {
              subtitle: '순수 OCR의 한계',
              content: 'PaddleOCR 같은 전통적 OCR은 텍스트 인식은 하지만 문서 구조를 이해하지 못한다. 실제 평가에서 WigtnOCR 대비 3~30배 적은 텍스트만 추출했으며, 한국 공공문서의 표·양식·복잡 레이아웃을 대부분 놓쳤다.'
            },
            {
              subtitle: 'Rule-based 파서의 한계',
              content: 'PyMuPDF4LLM 같은 rule-based 파서는 텍스트 추출은 빠르지만 구조 인식률이 0%에 가까워, 법령의 조/항/목 계층이나 표+다이어그램+텍스트 혼합 레이아웃을 전혀 보존하지 못했다.'
            },
            {
              subtitle: '최신 VLM 파서의 한계',
              content: 'dots.ocr(RedNote), olmOCR(AI2) 같은 최신 VLM 기반 파서들은 영어·중국어 중심으로 학습되어 한국 정부 문서(복잡한 표·양식·도장, 스캔 문서 혼재, 다단 레이아웃)에 최적화되지 않았다.'
            },
            {
              subtitle: '30B 모델의 실무 한계',
              content: '30B급 VLM은 파싱 품질이 우수하지만 듀얼 GPU가 필요하고 추론이 느려 실무 배포가 어렵다. 2B 모델이면 단일 GPU에서 빠르게 서빙 가능하고 Edge 배포도 현실적이다.'
            }
          ]
        },
        {
          title: 'Contribution Stack (3계층)',
          subsections: [
            {
              subtitle: 'Layer 1 — Benchmark',
              content: '<strong>KoGovDoc-Bench</strong>: 한국 정부 문서 평가셋 (val 294장, pseudo-GT 기반)'
            },
            {
              subtitle: 'Layer 2 — Fine-tuned Model',
              content: '<strong>Wigtn/Qwen3-VL-2B-WigtnOCR</strong>: LoRA domain-adaptive fine-tuning 가중치 (HuggingFace 공개)'
            },
            {
              subtitle: 'Layer 3 — Framework',
              content: '<strong>wigtnocr</strong>: pip install 가능한 OSS 라이브러리 (파싱→구조화 마크다운→청킹 통합 파이프라인)'
            }
          ]
        },
        {
          title: 'Stage 1-3: Pseudo-GT 생성 → 검증 → 정제',
          subsections: [
            {
              subtitle: 'Pseudo-GT 생성',
              content: 'PDF 페이지 이미지를 Qwen3-VL-30B-Instruct(Teacher)에 입력하여 구조화된 마크다운을 생성. KoGovDoc 10개 문서 3,637페이지 + arXiv 39개 논문 864페이지 = 총 4,501페이지 처리. 초기에 30B-Thinking 모델을 사용했으나 출력 불안정(think 태그 오염, 토큰 잘림)이 발생하여 Instruct 모델로 전환. <strong>Finding: document transcription에서는 reasoning 모델보다 instruction-tuned 모델이 안정적</strong>.'
            },
            {
              subtitle: 'GT 품질 검증',
              content: 'Qwen3.5-122B를 Judge로 사용하여 5점 척도 평가. "원본과 다른 부분"이 아니라 "출력물 자체가 학습 데이터로 쓸 만한 품질인가"를 판단하기 위해 이미지 없이 텍스트만으로 평가. 반복 루프, 텍스트 절단, 사고 과정 유출은 텍스트만 봐도 판별 가능. KoGovDoc 합격률 75.1%, arXiv 73.8%. 3점 미만 페이지는 학습에서 제외.'
            },
            {
              subtitle: '데이터 정제',
              list: [
                'kogov_008이 전체의 53%를 차지하는 편향 → <strong>max_doc_ratio=0.25</strong>로 제어',
                '30B-Thinking 모델의 reasoning 잔여물(영어 사고 과정)이 GT에 섞인 오염 발견 → 20개 삭제, 257개 정리',
                '최종 데이터: <strong>train 2,667개 + val 294개</strong>'
              ]
            }
          ]
        },
        {
          title: 'Stage 4: LoRA Fine-tuning',
          content: 'Base Model: Qwen3-VL-2B-Instruct. LoRA rank=8, alpha=32, target=all-linear로 Language Model의 모든 linear layer에 어댑터 부착. <strong>Vision Encoder와 Aligner는 동결</strong> — 사전 예비 실험(pilot test)에서 VLM의 시각 인식 능력은 충분(Structure F1 79%)하지만 텍스트 생성 정확도가 부족함을 확인했기 때문.',
          subsections: [
            {
              subtitle: '학습 설정',
              list: [
                'Hardware: 2× NVIDIA RTX PRO 6000 Blackwell (96GB each)',
                'DeepSpeed ZeRO-2, <strong>학습 시간 31분</strong>, final loss 0.075'
              ]
            },
            {
              subtitle: 'Ablation Study',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>LoRA Configuration 비교 (OmniDocBench)</caption>',
                '<thead><tr>',
                '<th scope="col">Config</th><th scope="col">LoRA r</th><th scope="col">Epochs</th><th scope="col">Text NED↓</th><th scope="col">TEDS↑</th>',
                '<th scope="col">TEDS-S↑</th><th scope="col">CDM F1↑</th><th scope="col">RO NED↓</th><th scope="col">Skip%↓</th><th scope="col">판정</th>',
                '</tr></thead><tbody>',
                '<tr class="tr--highlight"><td>v1 (최종)</td><td>8</td><td>3</td><td>0.288</td><td>0.649</td><td>0.732</td><td>0.884</td><td>0.211</td><td>5.8%</td><td>Best overall</td></tr>',
                '<tr><td>v2-best</td><td>32</td><td>3</td><td>0.309</td><td>0.600</td><td>0.697</td><td>—</td><td>0.215</td><td>0.7%</td><td>테이블 퇴보</td></tr>',
                '<tr><td>v2-last</td><td>32</td><td>5</td><td>0.306</td><td>0.610</td><td>0.695</td><td>0.892</td><td>0.214</td><td>0.0%</td><td>과적합</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: 'Finding',
              content: 'LoRA rank 8이 rank 32보다 우수 — rank를 올리면 수식은 소폭 개선되지만 테이블(-4.9pp)과 텍스트(+2.1pp)가 퇴보한다. Epoch 5는 Val Loss 상승으로 과적합. v2는 Skip Rate 0%를 달성하지만 핵심 파싱 품질이 희생되어 v1을 최종 모델로 확정.'
            }
          ]
        },
        {
          title: 'Stage 5: OmniDocBench 평가',
          content: 'CVPR 2025에서 발표된 OmniDocBench(1,355 PDF 페이지, 사람이 만든 GT)로 4개 모델을 비교 평가.',
          image: { src: 'images/projects/wigtnocr-omnidocbench.png', alt: 'OmniDocBench evaluation overview', caption: 'Figure: OmniDocBench 평가 결과 — 비교 실험 4개 모델(Qwen3-VL-30B, 2B, Marker, WigtnOCR) 중 WigtnOCR이 Table TEDS 1위' },
          subsections: [
            {
              subtitle: '성능 비교',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>OmniDocBench (CVPR 2025) — 4 Models Comparison</caption>',
                '<thead><tr>',
                '<th scope="col">모델</th><th scope="col">Text NED↓</th><th scope="col">Table TEDS↑</th>',
                '<th scope="col">TEDS-S↑</th><th scope="col">CDM F1↑</th><th scope="col">CDM Exp↑</th><th scope="col">RO NED↓</th><th scope="col">Skip%↓</th>',
                '</tr></thead><tbody>',
                '<tr><td>Qwen3-VL-30B (Teacher)</td>',
                '<td>0.289</td><td>0.523</td><td>0.657</td><td>0.939</td><td>0.692</td><td>0.227</td><td>5.5%</td></tr>',
                '<tr><td>Qwen3-VL-2B (Base)</td>',
                '<td>0.364</td><td>0.561</td><td>0.667</td><td>0.865</td><td>0.504</td><td>0.300</td><td>18.8%</td></tr>',
                '<tr><td>Marker (Rule-based)</td>',
                '<td>0.218</td><td>0.586</td><td>0.658</td><td>0.863</td><td>0.582</td><td>0.165</td><td>0.4%</td></tr>',
                '<tr class="tr--highlight"><td>WigtnOCR v1 (Ours)</td>',
                '<td>0.288</td><td>0.649</td><td>0.732</td><td>0.884</td><td>0.600</td><td>0.211</td><td>5.8%</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: '핵심 결과',
              list: [
                '<strong>Text NED</strong>: 30B Teacher와 동등 (0.288 vs 0.289)',
                '<strong>Table TEDS</strong>: 전체 1위 — 0.649 (30B의 0.523 대비 +12.6pp)',
                '<strong>Reading Order</strong>: 30B Teacher 초과 (0.211 vs 0.227)',
                'Base 2B 대비 — Text NED 21%↑, Table TEDS 16%↑, Reading Order 30%↑',
                'Student가 30B Teacher를 <strong>4/5 카테고리에서 매칭 또는 초과</strong> — pseudo-label distillation의 효과 입증'
              ]
            }
          ]
        },
        {
          title: 'Stage 6: KoGovDoc Val 평가',
          content: '학습에서 제외한 val 294장에 대해 페이지 전체 텍스트 기준 NED 평가.',
          subsections: [
            {
              subtitle: '결과',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>KoGovDoc Val — 3 Models Comparison</caption>',
                '<thead><tr>',
                '<th scope="col">Model</th><th scope="col">NED↓</th>',
                '<th scope="col">평가 성공</th><th scope="col">에러</th>',
                '</tr></thead><tbody>',
                '<tr class="tr--highlight"><td>WigtnOCR v1</td><td>0.285</td><td>289/294</td><td>5</td></tr>',
                '<tr><td>Qwen3-VL-30B (Teacher)</td><td>0.334</td><td>294/294</td><td>0</td></tr>',
                '<tr><td>Qwen3-VL-2B (Base)</td><td>0.390</td><td>294/294</td><td>0</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: '핵심 결과',
              content: 'WigtnOCR가 30B Teacher를 한국 공공문서에서도 초과 (NED 0.285 vs 0.334).'
            }
          ]
        },
        {
          title: 'Stage 7: BC/CS 청킹 품질 평가',
          content: '"구조화 파싱이 실제로 더 좋은 청크를 만드는가?"를 검증. MoC(ACL 2025)의 BC/CS 메트릭으로 6개 파서를 비교. Semantic chunking(BGE-M3)을 핵심 비교 전략으로 사용 — 두 파서 모두 동일한 방법으로 청킹하되, 입력 텍스트의 구조화 여부만 달라 공정 비교가 가능하다.',
          image: { src: 'images/projects/wigtnocr-bc-vs-retrieval.png', alt: 'BC vs Hit@1 scatter plot', caption: 'Figure: BC/CS 청크 품질과 Retrieval Hit@1 상관관계 — BC/CS 1위(MinerU)가 Retrieval 5위인 역설' },
          subsections: [
            {
              subtitle: 'KoGovDoc Semantic Chunking 결과 (6파서 비교)',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>BC/CS 청킹 품질 — Semantic Chunking</caption>',
                '<thead><tr>',
                '<th scope="col">Model</th><th scope="col">BC↑</th><th scope="col">CS↓</th>',
                '</tr></thead><tbody>',
                '<tr><td>MinerU</td><td>0.735</td><td>2.711</td></tr>',
                '<tr class="tr--highlight"><td>WigtnOCR-2B</td><td>0.706</td><td>2.859</td></tr>',
                '<tr><td>Qwen3-VL-30B</td><td>0.714</td><td>3.164</td></tr>',
                '<tr><td>Marker</td><td>0.683</td><td>3.206</td></tr>',
                '<tr><td>Qwen3-VL-2B</td><td>0.678</td><td>3.446</td></tr>',
                '<tr><td>PaddleOCR</td><td>0.654</td><td>3.420</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: 'Engineering Challenges',
              list: [
                '초기 페이지 단위 청킹 → 대부분 청크 1개여서 BC/CS 계산 불가 → <strong>문서 단위 합산으로 전환</strong>',
                'CS O(n²) 복잡도 → 대규모 문서(241청크, ~29,000쌍)에서 hang → <strong>MAX_CHUNKS_FOR_CS=50 균등 샘플링</strong>으로 해결',
                'WigtnOCR가 PaddleOCR 대비 <strong>3~30배 많은 텍스트를 추출</strong> — 한국 공공문서의 표·양식·복잡 레이아웃을 순수 OCR이 놓치기 때문'
              ]
            }
          ]
        },
        {
          title: 'Stage 8: Retrieval 평가 — End-to-End 검증',
          content: 'BC/CS가 좋다고 검색이 반드시 좋은 건 아니다. Stage 8에서 최종 검색 성능을 측정하여 인과 체인을 완성. Semantic chunking → BGE-M3 벡터화 → FAISS 검색, 564개 쿼리 평가.',
          image: { src: 'images/projects/wigtnocr-retrieval.png', alt: 'Retrieval performance comparison', caption: 'Figure: 6개 파서 Retrieval 성능 비교 — WigtnOCR Hit@1, Hit@5, MRR@10 전체 1위' },
          subsections: [
            {
              subtitle: 'Retrieval 결과 (6파서 비교)',
              content: [
                '<table class="modal__benchmark-table">',
                '<caption>KoGovDoc Retrieval — 564 Queries</caption>',
                '<thead><tr>',
                '<th scope="col">Model</th><th scope="col">Hit@1↑</th><th scope="col">Hit@5↑</th>',
                '<th scope="col">MRR@10↑</th><th scope="col">nDCG@10↑</th>',
                '</tr></thead><tbody>',
                '<tr class="tr--highlight"><td>WigtnOCR-2B</td><td>0.739</td><td>0.855</td><td>0.788</td><td>0.437</td></tr>',
                '<tr><td>Qwen3-VL-30B</td><td>0.716</td><td>0.839</td><td>0.771</td><td>0.411</td></tr>',
                '<tr><td>Marker</td><td>0.711</td><td>0.853</td><td>0.771</td><td>0.412</td></tr>',
                '<tr><td>Qwen3-VL-2B</td><td>0.709</td><td>0.814</td><td>0.756</td><td>0.444</td></tr>',
                '<tr><td>MinerU</td><td>0.608</td><td>0.789</td><td>0.682</td><td>0.384</td></tr>',
                '<tr><td>PaddleOCR</td><td>0.512</td><td>0.693</td><td>0.592</td><td>0.293</td></tr>',
                '</tbody></table>'
              ].join('')
            },
            {
              subtitle: '핵심 발견',
              list: [
                '<strong>WigtnOCR가 Hit@1(0.739), Hit@5(0.855), MRR@10(0.788)에서 전체 1위</strong>',
                'PaddleOCR 대비 Hit@1 +22.7pp, 30B Teacher 대비 +2.3pp',
                '<strong>MinerU는 BC/CS 1위이지만 Retrieval 5위</strong> — 청크 경계 품질이 좋다고 검색이 좋은 건 아니며, 텍스트 풍부도와 구조적 충실도가 end-to-end RAG 성능에 더 중요'
              ]
            }
          ]
        },
        {
          title: 'Practical Findings',
          list: [
            '<strong>Thinking vs Instruct</strong> — Document transcription에서 reasoning 모델은 출력 불안정(think 태그 오염, 토큰 잘림), Instruct 모델이 안정적',
            '<strong>LoRA rank 최적점</strong> — 데이터 2,667개 규모에서 r=8이 최적, r=32로 올리면 테이블 성능 퇴보 (-4.9pp)',
            '<strong>BC/CS ≠ Retrieval</strong> — BC/CS 청크 품질 메트릭이 Retrieval 성능을 예측하지 못한다는 발견. MinerU BC/CS 1위이지만 Retrieval 5위. 텍스트 풍부도와 구조적 충실도가 end-to-end RAG에 더 중요',
            '<strong>CS O(n²) 해결</strong> — MAX_CHUNKS_FOR_CS=50 균등 샘플링으로 대표성 유지하면서 계산량 제한',
            '<strong>페이지→문서 단위 전환</strong> — 페이지 단위 청킹은 텍스트가 짧아 BC/CS 계산 불가 → 문서 단위 합산으로 해결',
            '<strong>VLM 텍스트 추출량</strong> — WigtnOCR가 PaddleOCR 대비 3~30배 많은 텍스트 추출, 한국 공공문서의 표·양식·복잡 레이아웃을 순수 OCR이 놓치기 때문'
          ]
        },
        {
          title: 'Tech Stack',
          subsections: [
            {
              subtitle: 'Model & Training',
              list: [
                '<strong>Student</strong>: Qwen3-VL-2B-Instruct (fine-tuning 대상)',
                '<strong>Teacher</strong>: Qwen3-VL-30B-Instruct (Pseudo-GT 생성)',
                '<strong>Judge</strong>: Qwen3.5-122B (GT 품질 검증)',
                '<strong>Framework</strong>: ms-swift, LoRA, DeepSpeed ZeRO-2',
                '<strong>Serving</strong>: vLLM (Docker, TP=2)'
              ]
            },
            {
              subtitle: 'Evaluation & Retrieval',
              list: [
                '<strong>Benchmark</strong>: OmniDocBench (CVPR 2025) + KoGovDoc-Bench',
                '<strong>Chunking</strong>: Header-based / Semantic / Fixed-size (3전략, 문서 단위)',
                '<strong>Chunking 평가</strong>: MoC BC/CS (ACL 2025)',
                '<strong>PPL Model</strong>: Qwen2.5-1.5B-Instruct (BC/CS perplexity 계산)',
                '<strong>Embedding</strong>: BGE-M3 (Infinity server) — Semantic chunking + 검색 벡터화',
                '<strong>Vector DB</strong>: FAISS (벡터 저장 + 유사도 검색)'
              ]
            },
            {
              subtitle: 'Infrastructure & Deployment',
              list: [
                '<strong>GPU</strong>: 2× NVIDIA RTX PRO 6000 Blackwell (96GB each)',
                '<strong>배포</strong>: HuggingFace (Wigtn org), GitHub (wigtn), PyPI 예정',
                '<strong>논문</strong>: EMNLP 2026 Industry Track 투고 예정'
              ]
            }
          ]
        }
      ],
      tags: ['Qwen3-VL-2B', 'LoRA', 'Pseudo-Label Distillation', 'OmniDocBench', 'KoGovDoc-Bench', 'vLLM', 'Open Source', 'EMNLP 2026']
    },
    'wigtn-coding': {
      title: 'WIGTN-Coding — Claude Code 통합 개발 워크플로우 플러그인',
      image: 'images/projects/wigtn_logo.png',
      imageContain: true,
      meta: {
        organization: 'WIGTN Crew (Open Source)',
        role: 'Crew Leader / Main Contributor',
        period: '2025.10 ~ 현재',
        architecture: 'Claude Code Skills Plugin System (7 Commands · 14 Agents · 7 Skills · 4 Hooks)'
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>AI-Native Vibe Coding — From Idea to Deploy, Zero Friction.</strong><br><br>AI가 코드를 짜주는 시대에 엔지니어의 진짜 실력은 구현 속도가 아니라 설계를 검증하고 의사결정을 내리는 "판단의 밀도"에서 생긴다. 시니어가 부재한 주니어 5명의 팀에서, 판단의 과정 자체를 시스템화하여 팀 전체의 판단 표준을 시니어 수준으로 상향 평준화하기 위해 만들었다.<br><br>Claude Code에 설치하여 <code>/prd → /implement → /auto-commit</code> 슬래시 커맨드 한 줄로 기획부터 배포까지 전 과정을 자동화하는 통합 개발 워크플로우 플러그인.<br><br>GitHub Stars 14 · Forks 2',
          subsections: [
            {
              subtitle: '링크',
              list: [
                '<strong>GitHub</strong>: <a href="https://github.com/wigtn/wigtn-plugins-with-claude-code" target="_blank" rel="noopener noreferrer">wigtn/wigtn-plugins-with-claude-code</a>',
                '<strong>개발 철학</strong>: <a href="https://www.linkedin.com/pulse/10%EB%85%84-%EC%B0%A8-%EA%B1%B4%EC%84%A4-pm%EC%9D%B4-ai-%EC%97%94%EC%A7%80%EB%8B%88%EC%96%B4%EB%A1%9C-%EC%A0%84%ED%96%A5%ED%95%98%EB%A9%B0-%EC%84%A0%ED%83%9D%ED%95%9C-%EC%83%9D%EC%A1%B4%EB%B2%95-%EB%8B%A4%EC%9E%91%E5%A4%9A%E4%BD%9C%EA%B3%BC-%ED%8C%90%EB%8B%A8%EC%9D%98-%EC%8B%9C%EC%8A%A4%ED%85%9C%ED%99%94-hyeongseob-kim-srq1c/" target="_blank" rel="noopener noreferrer">LinkedIn Article — 판단의 시스템화</a>'
              ]
            }
          ]
        },
        {
          title: '왜 만들었나 — 판단의 밀도',
          subsections: [
            {
              subtitle: '문제 인식',
              content: '건설 현장 PM 10년의 경험에서 배운 것은, 좋은 엔지니어는 "빨리 짓는 사람"이 아니라 "올바르게 판단하는 사람"이라는 것이었다. AI가 코드를 초 단위로 뽑아내는 시대에 주니어의 생존 전략은 "판단의 밀도를 얼마나 촘촘하고 빠르게 가져가느냐"에 달려 있다.'
            },
            {
              subtitle: '해결 방향',
              content: '시니어가 부재한 주니어 5명의 팀에서, 엔지니어가 거쳐야 할 "판단의 과정" 자체를 시스템화했다. 80점 이상의 Quality Gate를 통과해야만 커밋이 허용되는 엄격한 루프로 팀 전체의 판단 표준을 상향 평준화. 단순한 코드 공유가 아닌 <strong>판단 로직의 오픈소스화</strong>.'
            }
          ]
        },
        {
          title: '핵심 설계 원칙 — "Claude가 모르는 것만 가르쳐라"',
          content: 'Anthropic의 skill-creator 도구로 플러그인을 분석한 결과, 54개 도구 중 55.6%가 "Claude가 이미 할 수 있지만 팀 방식을 강제하는 것(Encoded Preference)"이었다. 재설계 기준: Claude가 모르는 사실 → Skill 유지, Claude가 할 수 있지만 팀 방식 → Agent 전환, Claude가 이미 잘하는 것 → 삭제. Skills 22개를 삭제하고 핵심 7개만 남겼다.',
          subsections: [
            {
              subtitle: 'Claude Code 트리거 메커니즘 활용',
              list: [
                '<strong>Skills</strong> — Claude가 자율적으로 판단하여 로드 (Claude가 추론 불가능한 것만)',
                '<strong>Agents</strong> — description이 항상 노출, 매칭 시 주입 (팀 방식 강제)',
                '<strong>Commands</strong> — 사용자가 명시적으로 호출 (/prd, /implement, /auto-commit)'
              ]
            }
          ]
        },
        {
          title: '핵심 파이프라인 — /prd → /implement → /auto-commit',
          subsections: [
            {
              subtitle: '/prd — 기획 자동화',
              content: '자연어 아이디어를 구조화된 PRD로 변환. /digging으로 PRD 취약점을 4개 카테고리(완성도·실현가능성·보안·일관성)로 분석하여 구현 전에 문제를 차단.'
            },
            {
              subtitle: '/implement — 팀 병렬 빌드',
              content: 'PRD를 분석하여 Backend · Frontend · AI · Ops 팀을 동적으로 할당하고 동시에 투입. SHARED_CONTEXT로 팀 간 API 계약을 실시간 공유하여, 백엔드가 만든 API를 프론트엔드가 즉시 참조.'
            },
            {
              subtitle: '/auto-commit — Quality Gate',
              content: '100점 만점 코드 리뷰를 거쳐 80점 이상이어야 커밋 허용. 60~79점은 자동 개선 시도, 60점 미만은 차단. Security Critical 이슈 발견 시 점수 무관 강제 차단.'
            }
          ]
        },
        {
          title: '3계층 메모리 시스템',
          subsections: [
            {
              subtitle: '구조',
              list: [
                '<strong>Layer 1 — Auto Memory (MEMORY.md)</strong>: 프로젝트 핵심 기술 스택, 레포지토리 패턴 등 세션 간 영구 정보',
                '<strong>Layer 2 — SHARED_CONTEXT</strong>: 백엔드 API 계약을 프론트엔드가 실시간 참조하는 에이전트 간 정보 공유',
                '<strong>Layer 3 — TaskCreate</strong>: 현재 대화 내 태스크 의존성 추적, 선행 작업 완료 시 다음 작업 자동 수행'
              ]
            },
            {
              subtitle: '효과',
              content: '쓸수록 프로젝트를 더 잘 이해하고 팀의 맥락을 기억하는 "살아있는 개발 팀". 며칠씩 소요되던 아키텍처 결정이 5분 만의 검증으로 결론. 전체 파이프라인 속도 3배 이상 향상.'
            }
          ]
        },
        {
          title: '구성 요소',
          subsections: [
            {
              subtitle: '14 Agents',
              content: '기획(PRD 분석, 아키텍처 결정, Digging) · 구현(팀 병렬 빌드, FE/BE/Mobile/AI/DevOps) · 검증(100점 코드 리뷰, 병렬 리뷰, 포맷팅)'
            },
            {
              subtitle: '7 Commands',
              content: '/prd · /digging · /implement · /auto-commit · /code-review · /clarify · /loop'
            },
            {
              subtitle: '7 Skills',
              content: '디자인 시스템 레퍼런스(16가지 스타일) · 코드 리뷰 레벨 참조 · 팀 메모리 프로토콜 등 — Claude가 추론 불가능한 것만 남긴 핵심 7개'
            },
            {
              subtitle: '4 Hooks',
              content: '코드 품질 자동 검증 · 커밋 메시지 표준화 · 빌드 자동 검증 · 프리커밋 린트'
            }
          ]
        },
        {
          title: '실전 결과물 — 이 플러그인으로 만든 프로젝트들',
          list: [
            '<strong>WIGVU</strong> — 외국인을 위한 한국어 스터디 앱 (Next.js 16 + NestJS 10 + FastAPI MSA, App 배포 목표)',
            '<strong>WIGVO</strong> — PSTN 실시간 양방향 음성 번역 시스템 (ACL 2026 Under Review)',
            '<strong>TimeLens</strong> — Gemini Live Agent Challenge 출품작 (Google Global 해커톤)',
            '<strong>WIGTN-SPEAR</strong> — AI 서비스 특화 보안 스캐너 (OWASP LLM Top 10 + Web Top 10)',
            '<strong>LLM Loadtester</strong> — 비개발직군용 LLM 서빙 벤치마킹 도구 (오픈소스)'
          ]
        }
      ],
      tags: ['Claude Code', 'Plugin', 'AI-Native', 'Quality Gate', 'Agent Teams', 'Open Source']
    },
    'llm-loadtester': {
      title: 'Engineering LLM Loadtester — 비개발직군용 LLM 서빙 벤치마킹 도구',
      image: 'images/projects/llm-loadtester-dashboard.png',
      meta: {
        organization: 'Personal Project (Open Source)',
        role: '1인 개발',
        period: '2026.01 ~ 2026.02',
        architecture: '3-Tier: FastAPI(API) + Typer(CLI) + Next.js(Web) + Docker'
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>비개발직군도 브라우저에서 바로 LLM 서빙 성능을 테스트할 수 있는 Web 기반 벤치마킹 도구</strong><br><br>상사로부터 "LLM 서버의 동시 접속 가능 인원은 몇 명인가?"라는 질문을 받았다. 인프라 평가와 성능 테스트가 담당자에게 축적되지 않고, 필요할 때마다 임시로 담당자를 정해 처리하는 구조가 문제였다. "비개발자도 누구나 사용 가능한 사내 공용 LLM LoadTester"를 제안하고 직접 만들었다.<br><br>GitHub Stars 2 · WIGTN-Coding 플러그인으로 주말에 MVP 완성 후 고도화.',
          subsections: [
            {
              subtitle: '링크',
              list: [
                '<strong>GitHub</strong>: <a href="https://github.com/Hyeongseob91/engineering-llm-loadtester" target="_blank" rel="noopener noreferrer">Hyeongseob91/engineering-llm-loadtester</a>',
                '<strong>개발 후기</strong>: <a href="https://www.linkedin.com/posts/harrison-hyeongseob-kim_%EC%A4%91%EA%B3%A0-%EC%8B%A0%EC%9E%85-%EC%A3%BC%EB%8B%88%EC%96%B4%EC%9D%98-%EC%83%9D%EC%A1%B4%EA%B8%B0-1-ai-native-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B0%9C%EB%B0%9C-%ED%9B%84%EA%B8%B0-activity-7417243655469477888-5mo8" target="_blank" rel="noopener noreferrer">LinkedIn — AI-Native 프로젝트 개발 후기</a>'
              ]
            },
            {
              subtitle: '외부 반응',
              content: 'Ex-Google ML/AI 엔지니어(NextToken 빌더)로부터 콜드 아웃리치 메일 수신. GitHub 프로필에서 engineering-llm-loadtester 레포를 발견하고 "quite relevant"하다며 연락. 실제로 프로젝트 위에 interactive app을 만들어 피드백을 주고받는 경험.'
            }
          ]
        },
        {
          title: '왜 만들었나',
          subsections: [
            {
              subtitle: '실무 배경',
              content: '인프라 성능 테스트가 특정 담당자에게만 가능한 구조. LLM 서빙 성능을 평가하려면 CLI 도구(llmperf, vllm benchmark 등)를 직접 다뤄야 했고, 영업팀·MLOps·PM은 접근 자체가 어려웠다.'
            },
            {
              subtitle: '해결 방향',
              content: 'UI에서 직접 조정 가능한 반복 테스트 환경. 입력(타겟 서버, 트래픽 규모, 프롬프트, SLO 기준값)은 유연하게, 출력(TTFT, TPOT, p99, Goodput)은 데이터 기반으로 명확하게. "누군가를 거치지 않고 직접 도전할 수 있는 Fast Build의 매력".'
            }
          ]
        },
        {
          title: '핵심 기능',
          subsections: [
            {
              subtitle: 'LLM 특화 메트릭',
              list: [
                '<strong>TTFT</strong> (Time To First Token) — 첫 토큰까지의 응답 시간',
                '<strong>TPOT</strong> (Time Per Output Token) — 토큰당 생성 시간',
                '<strong>Goodput</strong> — SLO 임계값 기반 유효 처리량: "TTFT 500ms 이내 + TPOT 50ms 이내 요청 비율"',
                '<strong>E2E Latency / ITL / Throughput</strong> — tiktoken 기반 정확한 토큰 카운팅'
              ]
            },
            {
              subtitle: '실시간 모니터링',
              content: 'WebSocket 기반 진행 상황 + pynvml GPU 메트릭(VRAM, 온도, 사용률) 실시간 수집.'
            },
            {
              subtitle: 'AI 분석 리포트',
              content: 'Claude API 기반 벤치마크 결과 자동 분석. 병목 구간 식별 + 최적 GPU 인프라 자동 추천(<code>필요 GPU = ceil(목표 동시성 / 현재 최대 동시성) × (1 + headroom)</code>).'
            },
            {
              subtitle: '검증 시스템 (Validation Loop)',
              list: [
                '<strong>Prometheus 메트릭 검증</strong> — 측정값 ±5% 허용 범위 내 교차 확인',
                '<strong>Docker 로그 검증</strong> — 컨테이너 레벨 ±10% 허용 범위 내 재검증',
                'Adapter Pattern: vLLM · SGLang · Ollama · Triton 등 OpenAI 호환 서버 단일 인터페이스 대응'
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
              caption: '1. 대시보드 — 벤치마크 현황 및 히스토리'
            },
            {
              src: 'images/projects/llm-loadtester-new.png',
              alt: 'New Benchmark Configuration',
              caption: '2. 새 벤치마크 — 설정 및 실행'
            },
            {
              src: 'images/projects/llm-loadtester-result.png',
              alt: 'Benchmark Result',
              caption: '3. 결과 — 메트릭 차트 및 Goodput 분석'
            },
            {
              src: 'images/projects/llm-loadtester-analysis.png',
              alt: 'AI Analysis Report',
              caption: '4. AI 분석 리포트 자동 생성'
            }
          ]
        },
        {
          title: 'Tech Stack',
          subsections: [
            {
              subtitle: 'Backend',
              list: [
                '<strong>API</strong>: Python 3.12, FastAPI, asyncio',
                '<strong>CLI</strong>: Typer (터미널 직접 사용 가능)',
                '<strong>GPU 모니터링</strong>: pynvml',
                '<strong>검증</strong>: Prometheus + Docker 이중 교차 검증'
              ]
            },
            {
              subtitle: 'Frontend',
              list: [
                '<strong>Web</strong>: Next.js, React, Recharts (메트릭 시각화)',
                '<strong>실시간</strong>: WebSocket 기반 진행 상황 스트리밍'
              ]
            },
            {
              subtitle: 'Infrastructure',
              list: [
                '<strong>Docker</strong>: docker-compose 원클릭 배포',
                '<strong>CI</strong>: GitHub Actions (118 테스트)',
                '<strong>AI</strong>: Claude API (분석 리포트 생성)'
              ]
            }
          ]
        }
      ],
      tags: ['Python', 'FastAPI', 'Next.js', 'Docker', 'WebSocket', 'Goodput', 'Validation Loop', 'Open Source']
    },
    timelens: {
      title: 'TimeLens - 음성+카메라 멀티모달 AI 박물관 큐레이터',
      image: 'images/projects/timelens_hero.png',
      meta: {
        organization: 'WIGTN Crew (Gemini Live Agent Challenge — Google Global Hackathon)',
        role: 'Team Lead & Developer',
        period: '2026.03',
        architecture: 'Gemini Live API + Google ADK + Next.js 15 + React Native/Expo + Cloud Run + Firebase'
      },
      sections: [
        {
          title: 'Overview',
          content: '<strong>Google Global 해커톤 — Gemini Live Agent Challenge 출품작</strong><br><br>박물관 단체 관람의 불편함에서 출발한 AI 큐레이터 서비스. "나만의 속도로 보기 어렵고, 궁금한 것을 바로 물어볼 수 없다"는 문제를 해결한다. 카메라로 유물을 비추고(See), AI 큐레이터의 설명을 듣고(Hear), 음성으로 질문하는(Speak) 흐름이 끊김 없이 이어지는 것이 핵심.',
          subsections: [
            {
              subtitle: '데모 & 링크',
              list: [
                '<strong>데모 비디오</strong>: <a href="https://youtu.be/ITaMtVO5jFg?si=-lhV6uV97mytFLgb" target="_blank" rel="noopener noreferrer">YouTube</a>',
                '<strong>GitHub</strong>: <a href="https://github.com/wigtn/wigtn-timelens" target="_blank" rel="noopener noreferrer">wigtn/wigtn-timelens</a>',
                '<strong>개발기</strong>: <a href="https://harrison-kim.tistory.com/entry/Gemini-Live-Agent-Challenge-WigtnCrew-Time-Lens-%EA%B0%9C%EB%B0%9C%EA%B8%B0" target="_blank" rel="noopener noreferrer">블로그 포스트</a>'
              ]
            }
          ]
        },
        {
          title: '심사 기준 및 전략',
          subsections: [
            {
              subtitle: '심사 항목',
              list: [
                '<strong>Innovation & Multimodal UX (40%)</strong> — 음성, 시각, 이미지의 자연스러운 통합',
                '<strong>Technical Implementation & Agent Architecture (30%)</strong> — Google Cloud 네이티브 구현',
                '<strong>Demo & Presentation (30%)</strong> — 실제 동작 화면 시연'
              ]
            },
            {
              subtitle: '보너스 포인트',
              list: [
                '개발 과정 공개 콘텐츠 발행: +0.6점',
                'CI/CD 자동화 배포: +0.2점',
                'Google Developer Group 멤버: +0.2점'
              ]
            }
          ]
        },
        {
          title: 'Architecture — 듀얼 파이프라인',
          content: '단일 경로(Live API)만이 아닌, 연결 불안정 환경(박물관 Wi-Fi) 대응을 위한 다중 경로 설계.',
          image: {
            src: 'images/projects/timelens_architecture.jpeg',
            alt: 'TimeLens System Architecture',
            caption: 'Figure 1: TimeLens 시스템 아키텍처. Gemini Live API(메인) + ADK 멀티 에이전트(텍스트 폴백) 듀얼 파이프라인.'
          },
          subsections: [
            {
              subtitle: 'Gemini Live API 파이프라인 (메인)',
              list: [
                '음성 입력(PCM16/16kHz) + 카메라(JPEG 1fps)를 동일 WebSocket 세션에서 실시간 처리',
                '<strong>Function Calling 4개</strong>로 오케스트레이션 대체 — 라우팅 로직, 인텐트 분류기, 상태 머신 전부 제거',
                'barge-in 기능으로 AI 응답 중에도 자연스럽게 끊고 질문 가능'
              ]
            },
            {
              subtitle: 'ADK 멀티 에이전트 파이프라인 (텍스트 폴백)',
              list: [
                'timelens_orchestrator → curator / restoration / discovery / diary 4개 Sub-Agent',
                'Live API와 동일한 백엔드 API를 공유하여 코드 중복 제거',
                '어느 경로로 진입하든 동일한 함수를 호출 — 다른 건 진입점뿐'
              ]
            }
          ]
        },
        {
          title: 'Function Calling Workflow — 4개 도구',
          content: '처음에는 인텐트 분류기, if/else 체인, 상태 머신을 계획했다. 최종적으로 시스템 프롬프트 + Function Declaration 4개만 남기고 나머지를 모델에 위임한 결과가 더 좋았다. <strong>"모델은 당신의 라우팅 로직보다 똑똑하다"</strong>가 핵심 인사이트.',
          image: {
            src: 'images/projects/timelens_function_calling.png',
            alt: 'Function Calling Workflow',
            caption: 'Figure 2: Function Calling 워크플로우. 4개 도구가 UX 전환의 분기점 역할을 하며, 폴백 시 ADK 멀티 에이전트로 위임.'
          },
          subsections: [
            {
              subtitle: '4가지 도구',
              list: [
                '<strong>recognize_artifact()</strong> — 카메라 프레임 분석 + Google Search Grounding으로 유물 인식·정보 검색',
                '<strong>generate_restoration()</strong> — Gemini 2.5 Flash Image로 포토리얼리스틱 복원 이미지 생성',
                '<strong>discover_nearby()</strong> — GPS 기반 Google Places API로 주변 박물관·유적지 탐색',
                '<strong>create_diary()</strong> — 관람 세션 종료 시 Gemini 3 Pro Image로 방문 다이어리 자동 생성'
              ]
            }
          ]
        },
        {
          title: '에이전틱 카메라',
          content: '사용자가 음성으로 촬영을 트리거하는 핵심 UX. 15개 언어별 정규식 패턴(한국어: "이거 뭐야", "이거 봐" / 영어: "what is this", "look at this" / 일본어·중국어·힌디어 등)으로 음성 명령을 감지한다.',
          subsections: [
            {
              subtitle: '촬영 프로세스',
              list: [
                '음성 명령 감지 → 500ms 안정화 대기 (손 떨림 방지)',
                '고해상도 사진 촬영 → iOS 스타일 흰색 플래시 오버레이 (0.2초 페이드)',
                'Live API로 사용자 발화와 함께 전송 → AI 음성 피드백'
              ]
            }
          ]
        },
        {
          title: 'Service Flow',
          content: [
            '<div class="modal__z-flow">',

            '<div class="modal__z-row">',
            '<div class="modal__z-image"><img src="images/projects/timelens_01_landing.jpeg" alt="Landing" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 1</span><h4>랜딩 — 언어 선택</h4>',
            '<p>한국어·영어·일본어·중국어·힌디어 5개 언어 지원. "Museums Come Alive" — 카메라와 마이크 권한을 요청하고 세션을 시작합니다.</p></div>',
            '</div>',

            '<div class="modal__z-row modal__z-row--reverse">',
            '<div class="modal__z-image"><img src="images/projects/timelens_02_permissions.jpeg" alt="Permissions" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 2</span><h4>권한 설정</h4>',
            '<p>카메라와 마이크 접근 권한을 부여합니다. 권한이 없으면 텍스트 모드(ADK 폴백)로 자동 전환됩니다.</p></div>',
            '</div>',

            '<div class="modal__z-row">',
            '<div class="modal__z-image"><img src="images/projects/timelens_03_overview.jpeg" alt="Overview" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 3</span><h4>서비스 소개</h4>',
            '<p>"Point your camera at an artifact, and a thousand-year story begins." 평균 3초 인식, 10K+ 유적지, 24/7 AI Voice Docent.</p></div>',
            '</div>',

            '<div class="modal__z-row modal__z-row--reverse">',
            '<div class="modal__z-image"><img src="images/projects/timelens_06_session_init.png" alt="Session Init" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 4</span><h4>세션 초기화</h4>',
            '<p>Gemini Live 세션 연결. GPS 기반으로 현재 위치의 박물관을 자동 감지하고, AI 큐레이터를 깨웁니다.</p></div>',
            '</div>',

            '<div class="modal__z-row">',
            '<div class="modal__z-image"><img src="images/projects/timelens_07_curator_greeting.png" alt="Curator Greeting" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 5</span><h4>AI 큐레이터 인사</h4>',
            '<p>현재 전시 정보를 Google Search Grounding으로 실시간 검색하여 인사와 함께 전달합니다. 음성·텍스트 양방향 대화 가능.</p></div>',
            '</div>',

            '<div class="modal__z-row modal__z-row--reverse">',
            '<div class="modal__z-image"><img src="images/projects/timelens_05_recognition.png" alt="Artifact Recognition" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 6</span><h4>유물 인식</h4>',
            '<p>"이거 뭐야?" — 에이전틱 카메라가 음성 명령을 감지하여 촬영 후 recognize_artifact()를 호출. 유물의 이름, 시대, 역사적 배경을 설명합니다.</p></div>',
            '</div>',

            '<div class="modal__z-row">',
            '<div class="modal__z-image"><img src="images/projects/timelens_live_conversation.png" alt="Live Conversation" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 7</span><h4>실시간 멀티모달 대화</h4>',
            '<p>LIVE 모드에서 카메라 프레임과 음성이 동시에 처리됩니다. 유물을 보면서 자유롭게 질문하고, barge-in으로 AI 응답을 끊고 새 질문도 가능.</p></div>',
            '</div>',

            '<div class="modal__z-row modal__z-row--reverse">',
            '<div class="modal__z-image"><img src="images/projects/timelens_restoration.png" alt="Restoration" onclick="window.open(this.src, \'_blank\')"></div>',
            '<div class="modal__z-text"><span class="modal__z-step">STEP 8</span><h4>유물 복원 이미지</h4>',
            '<p>"원래 모습 보여줘" — generate_restoration()이 Gemini 2.5 Flash Image로 포토리얼리스틱 복원 이미지를 생성. Now/원래 시대 토글로 비교 가능.</p></div>',
            '</div>',

            '</div>'
          ].join('')
        },
        {
          title: '개발 과정에서 해결한 문제들',
          subsections: [
            {
              subtitle: '한국어 STT 전사 품질',
              content: 'Gemini outputTranscription이 한국어를 잘못 처리("괜찮 ." → "괜찮.", "큐레 이터" → "큐레이터"). 후처리 함수로 구두점 앞 공백 제거, 잘못 분리된 한글 음절 병합, 시스템 프롬프트에서 문장당 단어 15개 이하 제한.'
            },
            {
              subtitle: '박물관 Wi-Fi 연결',
              content: 'Firebase createSession()이 느린 연결에서 무한정 멈추는 문제. Promise.race에 5초 타임아웃 → 로컬 세션으로 폴백. 사용자는 전혀 인지 못함.'
            },
            {
              subtitle: 'ADK와 Zod 버전 충돌',
              content: 'ADK 내부 zod/v3과 프로젝트 Zod v4 충돌. @google/genai의 Schema 인터페이스 직접 사용으로 해결.'
            }
          ]
        },
        {
          title: 'Tech Stack — Google 생태계 활용',
          subsections: [
            {
              subtitle: 'AI / ML',
              list: [
                '<strong>Gemini 2.5 Flash</strong> — 메인 모델, Function Calling 기반 오케스트레이션',
                '<strong>Gemini 2.5 Flash Native Audio</strong> — 실시간 음성 처리',
                '<strong>Gemini 2.5 Flash Image</strong> — 유물 복원 이미지 생성',
                '<strong>Gemini 3 Pro Image</strong> — 방문 다이어리 생성',
                '<strong>Gemini Live API</strong> — 실시간 음성+카메라 멀티모달 WebSocket 세션',
                '<strong>Google ADK</strong> — 멀티 에이전트 텍스트 폴백 파이프라인',
                '<strong>Google Search Grounding</strong> — 실시간 유물 정보 검색'
              ]
            },
            {
              subtitle: 'Frontend & Mobile',
              list: [
                '<strong>Next.js 15</strong>, React 19 — 웹 클라이언트',
                '<strong>React Native (Expo SDK)</strong> — 모바일 클라이언트',
                'useLiveSession Hook — WebSocket 세션 관리',
                'CameraView & Chat UI Components'
              ]
            },
            {
              subtitle: 'Infrastructure',
              list: [
                '<strong>Google Cloud Run</strong> — 서버 배포',
                '<strong>Firebase Auth</strong> — 익명 인증 (5초 타임아웃 + 로컬 폴백)',
                '<strong>Firestore</strong> — 세션 데이터 저장',
                '<strong>Google Places API</strong> — 주변 박물관 탐색'
              ]
            }
          ]
        }
      ],
      tags: ['Gemini Live API', 'Google ADK', 'Function Calling', 'Cloud Run', 'Firebase', 'Next.js', 'React Native', 'Hackathon']
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

  // Block-level HTML detection for modal content rendering
  const isBlockLevelHtml = (content) =>
    typeof content === 'string' && /^<(table|div|ul|ol|dl|section|figure|blockquote|pre)/.test(content);

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
            contentHTML += isBlockLevelHtml(section.content)
              ? `<div>${section.content}</div>`
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
                contentHTML += isBlockLevelHtml(sub.content)
                  ? `<div>${sub.content}</div>`
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
