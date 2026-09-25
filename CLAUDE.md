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
├── cv.html             # CV (영문): 상세 경력 불릿 + Selected Projects + Hackathons + Awards + Certifications
│                       #   "Download PDF" 버튼 = window.print() (print CSS는 academic.css에 정의)
├── academic.css        # 공용 스타일 (index + cv + 프로젝트 상세, print 스타일 포함)
├── projects/soundmind.html  # Soundmind 프로젝트 영문 상세 페이지 (academic.css의 detail-* 블록 사용)
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
- **직책 표기**: Founder & CEO at WIGTN (AI Research & Engineering Company) / AI Research Engineer at Braincrew /
  AI Researcher at RAPIDS LAB (MODULABS). 위치는 나라만 표기 (South Korea), 도시 생략.
  WIGTN 경력 불릿은 연구 → AX 실행(Braincrew delivery partnership, 2026-09 계약) → 오픈소스 순.
  WIGTN 항목에는 최종 고객사(Hyundai Motor, SK 계열)를 쓰지 않는다: 그 계약 당사자는 Braincrew이고
  WIGTN의 레퍼런스는 Braincrew다. 고객사 실명은 Braincrew 첫 불릿에만 둔다.
- **IWSLT 표기**: "IWSLT 2026 (co-located with ACL 2026)" — 발표는 IWSLT 소속, ACL은 개최 맥락.
  섹션명은 "Talks" (항목 1건이라 분리 불필요; 진짜 keynote급 초청이 생기면 그때 분리).
  성격은 항목별 괄호 표기: 제목 끝 "(Invited)" + venue 줄 "Oral Session II, IWSLT 2026 ...".
  조직위 발의 편성이므로 (Invited)는 정확하나, 프로그램 공식 Invited Talk는 Bansal·Carpuat
  2건뿐이므로 "Invited Talks"/"Invited Talk"/"Keynote"/"Invited Speaker" 라벨 금지.
- **Publications**: accepted 논문만 등재 (in-prep 금지). Paper 링크는 ACL Anthology.
  게재 완료면 "published in" (not "accepted to"). RCPS(EMNLP 2026 Industry Track)는 Accepted
  상태로 등재됨 — 게재 시 venue 문구·Anthology 링크 교체, repo 공개 시 Code 배지 추가.
  Non-archival 워크숍 논문도 Publications에 등재. venue 줄은 호스트 학회를 앞에 두고 끝에
  ", non-archival."을 붙인다: "Accepted to the NeurIPS 2026 Workshop on Trust-AI-Eval (TAE),
  non-archival." (MDI 항목). 발표 형식(poster/oral)과 워크숍 부제는 쓰지 않는다. Anthology가
  없으므로 Paper 링크는 카메라레디 공개 후 OpenReview. 워크숍 항목이 2건 이상 쌓이면 소제목
  분리를 검토한다.
- **저자 역할 표기**: 1저자는 저자 목록 첫 위치 + 본인 이름 볼드로만 표시 (별도 마커 금지).
  교신저자는 이름 뒤 위첨자 `*`(`<sup aria-label="corresponding author">`) + 항목 말미(venue 아래)에
  "* Corresponding author" 각주 (RCPS 항목에 적용됨; 본인 이름은 저자 목록 2번째 —
  카메라레디 확정 순서).
- **About bio 톤**: 커리어 전환 서사(건축공학 → AI) 유지. 논문·학회명 등 성과 나열은 bio에 넣지 않는다
  (publications 섹션이 담당). 슬로건형 첫 문장 금지.
  구조(2026-09-26 확정): 1문장 현재 역할과 하는 일 → 2문장 WIGTN 정체(연구+AX 실행) → 3문장 전환 서사.
  WIGTN은 사업자 등록된 회사: "company"로 표기, "group"·"independent research group" 표현 금지.
- **수치는 논문 확정치와 일치**: WIGVO는 "zero echo loops across 147 completed real calls"
  (155 시도 - 8 실패 = 147; "148"이나 "field tests" 표현 금지).
- **em-dash(—) 사용 금지**: 콜론이나 마침표로 대체. 프로젝트 제목 구분자도 콜론.
- **메인은 간결하게**: 프로젝트 상세·경력 불릿은 cv.html에만. 메인 experience는 직책 한 줄.
- **CV 섹션 순서**: Interests → Publications → Talks → Experience → Projects → Hackathons →
  Education → Honors → Certifications (연구 시그널 우선).
- **이메일 아이콘**: 표준 `mailto:harrison@wigtn.com` (Gmail compose URL 금지).
- 제거된 것들 (재도입 금지): K-Digital Training 항목, toy projects, Tech Report(reports/),
  한국어 메인 페이지, "To appear"/"upcoming" 등 시한성 표기는 시점 지나면 즉시 제거.

## 새 콘텐츠 추가 패턴
- **뉴스**: `index.html`의 `.news__list`에 `<li class="news__item">` (날짜 역순).
- **논문**: index + cv 양쪽 publications에 `.pub` 항목 (Paper 링크 = Anthology).
- **프로젝트**: `cv.html`의 Selected Projects에 `.proj` 항목 — meta 라벨 + 제목 +
  1-2줄 설명 + 외부 링크 배지(`.pub__links`). 상세 설명 페이지는 기본적으로 만들지 않는다.
  Selected Projects는 연구·프로덕트급만 둔다 (현재 WigtnOCR, Soundmind; GUAM은 결과 확정 시 추가).
  해커톤은 별도 **Hackathons** 섹션에 같은 `.proj` 마크업으로, meta = 행사명(+ 수상), 설명 1-2줄.
  오픈소스 개발 도구(WIGTN-Coding, LLM Loadtester)는 항목을 만들지 않고 WIGTN 경력 불릿에
  링크로 언급한다 (2026-09-26 재구성: 핵심 프로젝트 희석 방지).
  예외: 리서치 서사가 필요한 대형 프로젝트는 `projects/soundmind.html` 패턴을 따른다 —
  academic.css의 `detail-*` 블록 재사용, 영문, JavaScript 없음, em-dash 금지,
  CV 항목에 `Details` 배지로 연결. 레거시 한국어 상세 페이지는 삭제하지 않고 보존.

## 배포
main 브랜치 push = GitHub Pages 배포. 커밋은 Conventional Commits (영어).
