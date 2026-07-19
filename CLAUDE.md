# Personal Academic Homepage - Claude Code Instructions

## Project Overview
김형섭(Hyeong-seob Kim, Harrison)의 개인 홈페이지 (GitHub Pages 배포).
al-folio 스타일의 영문 academic 페이지가 메인이며, 포지셔닝은
"연구를 기반으로 사회 시스템을 AX 전환하는 AI Research Engineer & Founder".

## Tech Stack
- Vanilla HTML/CSS (JavaScript 없음)
- 공용 스타일시트 `academic.css` (al-folio 스타일, Roboto + Roboto Slab + Pretendard)
- BEM 네이밍 (`about__bio`, `entries__role`, `pub__link`, `proj__title` 등)

## File Structure
```
├── index.html          # 메인 academic 홈 (영문): about, news, publications, talks, experience, education
├── cv.html             # CV (영문): 상세 경력 불릿 + Selected Projects + Awards + Certifications
│                       #   "Download PDF" 버튼 = window.print() (print CSS는 academic.css에 정의)
├── academic.css        # 공용 스타일 (index + cv, print 스타일 포함)
├── images/profile.jpg  # 프로필 사진
├── .nojekyll
│
│  # ── 아래는 레거시 자산 (링크 해제됨, 파일만 유지) ──
├── styles.css, scripts.js   # 구 카드형 포트폴리오 스타일/스크립트
├── en/                      # 구 영문 미러 포트폴리오
├── projects/*.html          # 구 프로젝트 상세 페이지 13개 — 필요 시 URL 직접 공유용
├── images/(aboutme|companies|projects)/  # 구 포트폴리오 이미지
├── wigtn/, docs/            # 기타 (WIGTN 소개 페이지, cover letter 초안)
```

## Content Rules
- **직책 표기**: Founder at WIGTN (AI Research Group) / AI Research Engineer at Braincrew /
  AI Researcher at RAPIDS LAB (MODULABS). 위치는 나라만 표기 (South Korea), 도시 생략.
- **IWSLT 표기**: "IWSLT 2026 (co-located with ACL 2026)" — 발표는 IWSLT 소속, ACL은 개최 맥락.
- **Publications**: accepted 논문만 등재 (in-prep 금지). Paper 링크는 ACL Anthology.
  WigtnOCR EMNLP 논문은 accepted 시점에 추가 예정.
- **메인은 간결하게**: 프로젝트 상세·경력 불릿은 cv.html에만. 메인 experience는 직책 한 줄.
- **이메일 아이콘**: Gmail 작성창 링크 (`mail.google.com/mail/?view=cm&fs=1&to=harrison@wigtn.com`).
- 제거된 것들 (재도입 금지): K-Digital Training 항목, toy projects, Tech Report(reports/),
  한국어 메인 페이지, "To appear"/"upcoming" 등 시한성 표기는 시점 지나면 즉시 제거.

## 새 콘텐츠 추가 패턴
- **뉴스**: `index.html`의 `.news__list`에 `<li class="news__item">` (날짜 역순).
- **논문**: index + cv 양쪽 publications에 `.pub` 항목 (Paper 링크 = Anthology).
- **프로젝트**: `cv.html`의 Selected Projects에 `.proj` 항목 — meta 라벨 + 제목 +
  1-2줄 설명 + 외부 링크 배지(`.pub__links`). 상세 설명 페이지는 만들지 않는다.

## 배포
main 브랜치 push = GitHub Pages 배포. 커밋은 Conventional Commits (영어).
