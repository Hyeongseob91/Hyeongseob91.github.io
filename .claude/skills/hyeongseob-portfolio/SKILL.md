---
name: hyeongseob-portfolio
description: >
  김형섭 포트폴리오 웹사이트 개발 컨텍스트 제공.
  index.html, styles.css, scripts.js 수정 시 활성화.
  프로젝트 추가, 섹션 수정, 스타일 변경, 모달 기능 등 작업 지원.
  Keywords: portfolio, project, BEM, CSS Variables, projectData, modal
---

# Portfolio Website Context

## Quick Reference

| 파일 | 역할 | 주요 수정 포인트 |
|------|------|------------------|
| `index.html` | 메인 페이지 | 섹션 추가/수정, 프로젝트 카드 |
| `styles.css` | 스타일시트 | BEM 클래스, CSS 변수 |
| `scripts.js` | 인터랙션 | projectData 객체, 모달 로직 |

## 섹션 구조

```
├── nav.navbar           # 네비게이션
├── section.hero         # 히어로 (인트로)
├── section.about        # 소개
├── section.experience   # 경력
├── section.education    # 학력
├── section.certificates # 수료/자격
├── section.awards       # 수상
├── section.licenses     # 면허
├── section.skills       # 기술 스택
├── section.projects     # 프로젝트
├── section.contact      # 연락처
└── footer               # 푸터
```

## 프로젝트 추가 워크플로우

### Step 1: HTML 카드 추가

`index.html`의 `#projects` 섹션에 카드 추가:

```html
<article class="project-card fade-in" data-project="project-id" data-category="educational">
  <div class="project-card__image-wrapper">
    <img src="images/projects/image.png" alt="Title" class="project-card__image">
  </div>
  <div class="project-card__content">
    <h3 class="project-card__title">
      <span class="project-card__category-text">[Category]</span>
      <span class="project-card__title-main">Title</span>
    </h3>
    <p class="project-card__description">Description</p>
    <div class="project-card__tags">
      <span class="project-card__tag">Tag1</span>
    </div>
  </div>
  <div class="project-card__footer">
    <a href="https://github.com/..." class="project-card__github-btn">
      <i class="fa-brands fa-github"></i> GitHub
    </a>
  </div>
</article>
```

### Step 2: projectData 추가

`scripts.js`의 `projectData` 객체에 데이터 추가.

상세 템플릿: [reference/project-template.md](reference/project-template.md)

## BEM 네이밍 규칙

```
.block                 # 컴포넌트 (예: project-card)
.block__element        # 하위 요소 (예: project-card__title)
.block--modifier       # 상태/변형 (예: project-card--featured)
```

## CSS 변수 (자주 사용)

| 변수 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#2563eb` | 강조색 |
| `--color-surface` | `#f8fafc` | 배경색 |
| `--color-text` | `#0f172a` | 본문 |
| `--color-text-secondary` | `#475569` | 보조 텍스트 |

## 모달 시스템

프로젝트 카드 클릭 시 `scripts.js`의 `projectData`에서 데이터를 읽어 모달 표시.

### 지원 기능

- `meta`: team, role, period, context, deployment
- `disclaimer`: 회사 프로젝트 면책 조항
- `sections`: title, content, list, image, gallery, subsections
- `tags`: 기술 태그 배열

## 카테고리

| data-category | 설명 |
|---------------|------|
| `enterprise` | 기업/회사 프로젝트 |
| `educational` | 교육/학습 프로젝트 |
| `personal` | 개인 사이드 프로젝트 |

## Related Files

- [reference/project-template.md](reference/project-template.md) - projectData 상세 템플릿
- [reference/section-styles.md](reference/section-styles.md) - 섹션별 스타일 가이드
