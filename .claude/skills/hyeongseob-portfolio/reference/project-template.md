# projectData 상세 템플릿

프로젝트 모달에 표시될 데이터 구조입니다. `scripts.js`의 `projectData` 객체에 추가합니다.

## 기본 구조

```javascript
'project-id': {
  title: 'Project Title',
  image: 'images/projects/main.png',
  imageContain: false,  // true: object-fit: contain (이미지 전체 표시)
  meta: {
    team: '3명 (팀장)',
    role: 'AI Part / 아키텍처 설계',
    period: '2025.01 - 2025.03',
    context: '회사 프로젝트 / 개인 프로젝트',
    deployment: 'Docker Compose / Vercel / GitHub Pages'
  },
  disclaimer: {
    show: true,  // 회사 프로젝트인 경우 true
    text: '본 프로젝트는 회사 업무의 일환으로 진행되었습니다...'
  },
  sections: [...],
  tags: ['Python', 'FastAPI', 'React']
}
```

## sections 배열 옵션

### 기본 텍스트

```javascript
{
  title: 'Section Title',
  content: 'Text content here...'
}
```

### 리스트

```javascript
{
  title: 'Section Title',
  list: [
    'Item 1',
    'Item 2',
    'Item 3'
  ]
}
```

### 이미지

```javascript
{
  title: 'Section Title',
  image: {
    src: 'images/projects/diagram.png',
    alt: 'Architecture Diagram',
    caption: '시스템 아키텍처'  // 선택사항
  }
}
```

### 갤러리 (여러 이미지)

```javascript
{
  title: 'Gallery Section',
  gallery: [
    { src: 'images/projects/screen1.png', alt: 'Screen 1', caption: 'Caption 1' },
    { src: 'images/projects/screen2.png', alt: 'Screen 2', caption: 'Caption 2' },
    { src: 'images/projects/screen3.png', alt: 'Screen 3', caption: 'Caption 3' }
  ]
}
```

### Subsections (하위 섹션)

```javascript
{
  title: 'Main Section',
  subsections: [
    {
      subtitle: 'Subsection 1',
      content: 'Text content',
      image: { src: 'path.png', alt: 'Alt text' },
      list: ['Item 1', 'Item 2']
    },
    {
      subtitle: 'Subsection 2',
      content: 'Another text content'
    }
  ]
}
```

### 복합 구조 (이미지 + 텍스트 + Subsections)

```javascript
{
  title: 'Complex Section',
  content: 'Introduction text...',
  image: { src: 'path.png', alt: 'Main image' },
  subsections: [
    { subtitle: 'Sub 1', list: ['A', 'B'] },
    { subtitle: 'Sub 2', content: 'Details...' }
  ]
}
```

## 카테고리 분류

`index.html` 카드의 `data-category` 속성:

| 카테고리 | 설명 |
|----------|------|
| `enterprise` | 기업/회사 프로젝트 |
| `educational` | 교육/학습 프로젝트 |
| `personal` | 개인 사이드 프로젝트 |

## 체크리스트

새 프로젝트 추가 시:

- [ ] `index.html`에 `.project-card` 추가
- [ ] `data-project` 속성에 고유 ID 지정
- [ ] `data-category` 속성 설정
- [ ] `scripts.js`의 `projectData`에 데이터 추가
- [ ] 이미지 파일을 `images/projects/`에 저장
- [ ] 태그가 프로젝트 내용과 일치하는지 확인
