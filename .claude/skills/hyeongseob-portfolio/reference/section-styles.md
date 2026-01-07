# 섹션별 스타일 가이드

## 배경색 패턴

| 섹션 | 배경 | CSS 변수 |
|------|------|----------|
| Hero | 그라디언트 + Grid 패턴 | `linear-gradient(135deg, #fff, #f8fafc, #fff)` |
| About | `#ffffff` | `--color-dark` |
| Experience | `#f8fafc` | `--color-surface` |
| Education | `#ffffff` | - |
| Certificates | `#f8fafc` | `--color-surface` |
| Awards | `#ffffff` | - |
| Licenses | `#f8fafc` | `--color-surface` |
| Skills | `#ffffff` | `--color-dark` |
| Projects | `#f8fafc` | `--color-surface` |
| Contact | `#ffffff` | `--color-dark` |
| Footer | `#f8fafc` | `--color-surface` |

## 타임라인 컴포넌트 (`.timeline`)

Experience, Education, Certificates, Awards, Licenses 섹션에서 사용합니다.

### 기본 타임라인

```html
<div class="timeline">
  <div class="timeline__item">
    <div class="timeline__marker"></div>
    <span class="timeline__date">2025.01 - 현재</span>
    <h3 class="timeline__title">Title</h3>
    <p class="timeline__subtitle">Subtitle</p>
    <div class="timeline__description">
      <ul><li>Description item</li></ul>
    </div>
  </div>
</div>
```

### 로고 포함 타임라인

```html
<div class="timeline timeline--with-logo">
  <div class="timeline__item timeline__item--with-logo">
    <img src="images/companies/logo.png" alt="Company" class="timeline__logo">
    <div class="timeline__marker"></div>
    <span class="timeline__date">2024.06</span>
    <h3 class="timeline__title">Certificate Name</h3>
    <p class="timeline__subtitle">Issuer</p>
  </div>
</div>
```

### 스타일 스펙

| 요소 | 스타일 |
|------|--------|
| 좌측 선 | Gradient (`--color-primary` → `--color-primary-light`) |
| 마커 | 14px 원형, Border 3px |
| 날짜 | 0.875rem, `--color-primary-light` |
| 제목 | 1.25rem, `--color-text` |
| 로고 | 40px × 40px |

## 스킬 카드 (`.skills__category`)

```html
<div class="skills__category fade-in stagger-1">
  <h4 class="skills__category-title">
    <i class="fa-solid fa-brain"></i> AI/ML
  </h4>
  <h5 class="skills__subgroup-title">Frameworks</h5>
  <div class="skills__tags">
    <span class="skill-tag">PyTorch</span>
    <span class="skill-tag">LangChain</span>
  </div>
</div>
```

### 스타일 스펙

| 요소 | 스타일 |
|------|--------|
| 카드 배경 | `--color-surface` (#f8fafc) |
| 테두리 | 1px solid rgba(0,0,0,0.08) |
| 호버 | Y축 -4px, Shadow 증가 |
| 태그 배경 | rgba(37, 99, 235, 0.1) |
| 태그 폰트 | 0.8rem, weight 500 |

## 프로젝트 카드 (`.project-card`)

```html
<article class="project-card fade-in" data-project="project-id" data-category="enterprise">
  <div class="project-card__image-wrapper">
    <img src="images/projects/main.png" alt="Title" class="project-card__image">
  </div>
  <div class="project-card__content">
    <h3 class="project-card__title">
      <span class="project-card__category-text">[Enterprise]</span>
      <span class="project-card__title-main">Project Title</span>
    </h3>
    <p class="project-card__description">Description text...</p>
    <div class="project-card__tags">
      <span class="project-card__tag">Tag1</span>
      <span class="project-card__tag">Tag2</span>
    </div>
  </div>
  <div class="project-card__footer">
    <a href="https://github.com/..." class="project-card__github-btn">
      <i class="fa-brands fa-github"></i> GitHub
    </a>
  </div>
</article>
```

### 스타일 스펙

| 요소 | 스타일 |
|------|--------|
| 카드 배경 | `--color-dark` (#ffffff) |
| 이미지 높이 | 200px, object-fit: cover |
| 카테고리 뱃지 | 상단 좌측, Gradient 배경 |
| 설명글 | 3줄 말줄임표 (line-clamp: 3) |

## 반응형 Breakpoint

| Breakpoint | 적용 |
|------------|------|
| 900px 이하 | 그리드 1컬럼, 네비 햄버거 메뉴 |
| 600px 이하 | 폰트 축소, 패딩 감소 |

## 애니메이션 클래스

| 클래스 | 효과 |
|--------|------|
| `.fade-in` | 스크롤 시 페이드인 |
| `.stagger-1` ~ `.stagger-6` | 순차적 지연 애니메이션 |
| `.slide-up` | 아래에서 위로 슬라이드 |
