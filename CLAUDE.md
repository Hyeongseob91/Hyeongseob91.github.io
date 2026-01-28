# Portfolio Project - Claude Code Instructions

## Project Overview
김형섭의 개인 포트폴리오 웹사이트 (GitHub Pages 배포)
포트폴리오 메인 + 허브 구조: Portfolio (Main) + Hub (Blog/Tech Reports)

## Tech Stack
- Vanilla HTML/CSS/JavaScript
- BEM 네이밍 컨벤션
- CSS Custom Properties (변수)

## File Structure
```
├── index.html              # 메인 포트폴리오 페이지
├── styles.css              # 포트폴리오 스타일시트 (BEM 네이밍)
├── scripts.js              # 인터랙션 로직 (projectData 객체 포함)
├── images/                 # 이미지 폴더
│   ├── aboutme/            # About Me 섹션 이미지
│   ├── companies/          # Experience/Certificates 로고
│   └── projects/           # 프로젝트 이미지
├── hub/                    # 허브 페이지 (블로그/리포트 링크)
│   ├── index.html          # 허브 메인 페이지
│   └── hub.css             # 허브 전용 스타일 (BEM 네이밍)
├── reports/                # Tech Report 페이지
│   ├── report.css          # 리포트 공용 스타일 (BEM 네이밍)
│   ├── index.html          # 리포트 목록 페이지
│   ├── images/             # 리포트 이미지
│   └── [slug].html         # 개별 리포트 페이지
├── .nojekyll               # Jekyll 처리 방지
└── .claude/                # Claude Code 설정
```

## Design System (Quick Reference)

### Color Palette
| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#2563eb` | 강조, 버튼, 링크 |
| `--color-primary-light` | `#3b82f6` | 호버, 보조 강조 |
| `--color-surface` | `#f8fafc` | 섹션 배경, 카드 |
| `--color-text` | `#0f172a` | 본문 텍스트 |
| `--color-text-secondary` | `#475569` | 보조 텍스트 |

### Typography
- **폰트**: Pretendard, Inter, system-ui
- **코드 폰트**: JetBrains Mono
- **헤딩**: H1(2.5-4rem), H2(2-3rem), H3(1.25-1.75rem)

### 섹션 배경 패턴
- 흰색 (#ffffff): Hero, About, Education, Awards, Skills, Contact
- 회색 (#f8fafc): Experience, Certificates, Licenses, Projects, Footer

## Code Style

### HTML
- 시맨틱 태그 사용 (section, article, nav)
- BEM 클래스: `block__element--modifier`
- 접근성 속성 필수 (aria-label, alt)

### CSS
- CSS 커스텀 속성(변수) 활용
- BEM 네이밍 유지

### JavaScript
- ES6+ 문법
- 이벤트 위임 패턴

## 새 포스트 추가 (Hub)

`hub/index.html`의 해당 섹션(Blog 또는 Tech Reports)에서 `<a>` 태그를 추가/교체합니다.
최신 글이 위에 오도록 배치. 2~3개만 큐레이션합니다.

### 포스트 링크 템플릿
```html
<a href="https://harrison-kim.tistory.com/entry/..."
  class="hub-post" target="_blank" rel="noopener noreferrer">
  <span class="hub-post__title">포스트 제목</span>
  <span class="hub-post__date">YYYY.MM.DD</span>
</a>
```

## 새 Tech Report 추가

### Step 1: 리포트 HTML 파일 생성
`reports/[slug].html`을 아래 템플릿으로 생성합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>리포트 제목 | Harrison's Note</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">

  <!-- KaTeX (수식) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">

  <!-- Prism.js (코드 하이라이팅) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css">

  <!-- Report Styles -->
  <link rel="stylesheet" href="report.css">
</head>
<body>
  <header class="report-header">
    <div class="report-header__inner">
      <a href="../hub/" class="report-header__brand">Hyeongseob's Note</a>
      <nav class="report-header__nav">
        <a href="./" class="report-header__link">Tech Report</a>
        <a href="https://harrison-kim.tistory.com/" target="_blank" rel="noopener noreferrer"
          class="report-header__link">Blog</a>
        <a href="../" class="report-header__link report-header__link--cta">Portfolio</a>
      </nav>
    </div>
  </header>

  <main class="report-main">
    <article>
      <header>
        <a href="../hub/" class="report-article__back">&larr; Hub</a>
        <h1 class="report-article__title">리포트 제목</h1>
        <div class="report-article__meta">
          <time datetime="YYYY-MM-DD">YYYY.MM.DD</time>
          <span class="report-article__tags">
            <span class="report-article__tag">Tag1</span>
            <span class="report-article__tag">Tag2</span>
          </span>
        </div>
      </header>

      <div class="report-content">
        <!-- 본문 작성 -->
      </div>
    </article>
  </main>

  <footer class="report-footer">
    <p class="report-footer__copy">&copy; 2025 Hyeongseob Kim</p>
  </footer>

  <!-- KaTeX -->
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>

  <!-- Prism.js -->
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

  <script>
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ]
    });
  </script>
</body>
</html>
```

### Step 2: 본문 작성 (`report-content` 내부)
```html
<!-- 제목 -->
<h2>섹션 제목</h2>
<h3>하위 제목</h3>

<!-- 본문 -->
<p>텍스트 내용. <code>인라인 코드</code>와 <a href="#">링크</a>.</p>

<!-- 코드 블록 -->
<pre><code class="language-python">def hello():
    print("Hello")</code></pre>

<!-- 수식 (인라인) -->
<p>손실 함수는 $L = -\sum y \log \hat{y}$로 정의됩니다.</p>

<!-- 수식 (블록) -->
$$
\nabla_\theta J(\theta) = \mathbb{E}\left[\nabla_\theta \log \pi_\theta(a|s) \cdot R \right]
$$

<!-- 이미지 -->
<figure>
  <img src="images/report-slug-figure1.png" alt="설명">
  <figcaption>Figure 1: 캡션</figcaption>
</figure>

<!-- 인용 -->
<blockquote><p>인용 텍스트</p></blockquote>

<!-- 테이블 -->
<table>
  <thead><tr><th>모델</th><th>정확도</th></tr></thead>
  <tbody><tr><td>Baseline</td><td>85.2%</td></tr></tbody>
</table>
```

### Step 3: 허브에 링크 추가
`hub/index.html`의 Tech Reports 섹션에 링크 추가:
```html
<div class="hub-posts">
  <a href="../reports/slug.html" class="hub-post">
    <span class="hub-post__title">리포트 제목</span>
    <span class="hub-post__date">YYYY.MM.DD</span>
  </a>
</div>
```

### 이미지 저장 위치
`reports/images/` 폴더에 저장. 파일명 컨벤션: `[slug]-[name].png`

## 새 프로젝트 추가

1. `index.html`의 `#projects` 섹션에 카드 추가
2. `scripts.js`의 `projectData` 객체에 데이터 추가
3. 이미지는 `images/projects/` 폴더에 저장

### projectData 템플릿
```javascript
'project-id': {
  title: 'Project Title',
  image: 'images/projects/image.png',
  imageContain: false,  // true면 이미지 전체 표시
  meta: {
    team: 'Team Info',
    role: 'Role',
    period: 'Period',
    context: 'Context',
    deployment: 'Deployment'
  },
  disclaimer: {  // 회사 프로젝트인 경우
    show: true,
    text: 'Disclaimer text'
  },
  sections: [
    { title: 'Section', content: 'Text' },
    { title: 'Section', list: ['item1', 'item2'] },
    {
      title: 'Section',
      image: { src: 'path', alt: 'alt', caption: 'caption' },
      subsections: [
        {
          subtitle: 'Sub',
          content: 'Text',
          image: { src: 'path', alt: 'alt' },
          list: ['item1']
        }
      ]
    },
    {
      title: 'Gallery Section',
      gallery: [
        { src: 'path', alt: 'alt', caption: 'caption' }
      ]
    }
  ],
  tags: ['Tag1', 'Tag2']
}
```

## 배포
```bash
git add . && git commit -m "message" && git push origin main
```
