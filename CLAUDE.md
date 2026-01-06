# Portfolio Project - Claude Code Instructions

## Project Overview
김형섭의 개인 포트폴리오 웹사이트 (GitHub Pages 배포)

## Tech Stack
- Vanilla HTML/CSS/JavaScript
- BEM 네이밍 컨벤션
- CSS Custom Properties (변수)

## File Structure
```
├── index.html          # 메인 포트폴리오 페이지
├── styles.css          # 스타일시트 (BEM 네이밍)
├── scripts.js          # 인터랙션 로직 (projectData 객체 포함)
├── assets/             # 이미지 및 미디어
├── docs/               # 프로젝트 문서
└── skills/             # Claude Code Skills
```

## Code Style Guide

### HTML
- 시맨틱 태그 사용 (section, article, nav)
- BEM 클래스: `block__element--modifier`
- 접근성 속성 필수 (aria-label, alt)

### CSS
- CSS 커스텀 속성(변수) 활용
- 모바일 퍼스트 반응형
- BEM 네이밍 유지

### JavaScript
- ES6+ 문법
- 이벤트 위임 패턴
- DOM 조작 최소화

## Common Tasks

### 새 프로젝트 추가
1. `index.html`의 `#projects` 섹션에 카드 추가
2. `scripts.js`의 `projectData` 객체에 데이터 추가
3. 이미지는 `assets/` 폴더에 저장

### 프로젝트 카드 템플릿
```html
<article class="project-card fade-in" data-project="[project-id]" data-category="educational">
  <div class="project-card__image-wrapper">
    <img src="assets/[image].png" alt="[Project Name]" class="project-card__image">
  </div>
  <div class="project-card__content">
    <h3 class="project-card__title">
      <span class="project-card__category-text">[Category]</span>
      <span class="project-card__title-main">[Title]</span>
    </h3>
    <p class="project-card__description">[Description]</p>
    <div class="project-card__tags">
      <span class="project-card__tag">[Tag]</span>
    </div>
  </div>
</article>
```

### projectData 템플릿
```javascript
'project-id': {
  title: 'Project Title',
  image: 'assets/image.png',
  meta: {
    team: 'Team Info',       // 또는 role, context, period, deployment
    role: 'Role',
    period: 'Period'
  },
  disclaimer: {              // 회사 프로젝트인 경우
    show: true,
    text: 'Disclaimer text'
  },
  sections: [
    { title: 'Section', content: 'Text' },
    { title: 'Section', list: ['item1', 'item2'] },
    { title: 'Section', subsections: [
      { subtitle: 'Sub', content: 'Text' }
    ]}
  ],
  tags: ['Tag1', 'Tag2']
}
```

### 배포
```bash
git add . && git commit -m "message" && git push origin main
```

## Related Documents
- [Portfolio Redesign Plan](docs/portfolio-redesign-plan.md)
- [Index Structure](docs/index_structure.md)
- [Project Addition Plan](docs/Plan.md)
