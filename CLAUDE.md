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
├── images/             # 이미지 폴더
│   ├── aboutme/        # About Me 섹션 이미지
│   ├── companylogo/    # Experience/Certificates 로고
│   └── projects/       # 프로젝트 이미지
└── docs/               # 프로젝트 문서
```

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
