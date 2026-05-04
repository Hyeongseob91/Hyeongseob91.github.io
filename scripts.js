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
  // LOCALE
  // =====================================================
  const LOCALE = (document.documentElement.lang || 'ko').toLowerCase().startsWith('en') ? 'en' : 'ko';
  const LABELS = {
    ko: {
      collapse: '접기',
      more: '더보기',
      moreProjects: '더 많은 프로젝트 보기',
      collapseProjects: '프로젝트 접기'
    },
    en: {
      collapse: 'Collapse',
      more: 'Show more',
      moreProjects: 'Show more projects',
      collapseProjects: 'Collapse projects'
    }
  };
  const T = LABELS[LOCALE];

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
      btn.querySelector('.projects__more-btn-text').textContent = expanded ? T.collapse : T.more;
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
  // PROJECT CARDS → NEW TAB
  // =====================================================
  const projectCards = document.querySelectorAll('.project-card');

  // Open project detail page in same tab
  projectCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.project-card__link-btn') || e.target.closest('.project-card__link')) return;
      const projectId = this.dataset.project;
      if (projectId) {
        const prefix = LOCALE === 'en' ? '../projects/' : 'projects/';
        window.location.href = prefix + projectId + '.html';
      }
    });
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
        btnText.textContent = T.moreProjects;
      } else {
        // Show cards
        hiddenCards.forEach(card => {
          card.classList.add('show');
        });
        this.classList.add('expanded');
        btnText.textContent = T.collapseProjects;
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
