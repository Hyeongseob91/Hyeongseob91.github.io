# Index.html 구조 및 디자인 사양서

본 문서는 `index.html`의 기능적 구조와 `styles.css`에 정의된 디자인 스펙을 상세히 기술합니다.

## 1. 디자인 시스템 (Design System)

### 1.1 색상 팔레트 (Color Palette)
| 변수명 | 색상코드 | 설명 |
| :--- | :--- | :--- |
| `--color-primary` | `#2563eb` | 메인 블루 (강조, 버튼, 링크) |
| `--color-primary-light` | `#3b82f6` | 밝은 블루 (호버, 보조 텍스트) |
| `--color-primary-dark` | `#1d4ed8` | 어두운 블루 |
| `--color-dark` | `#ffffff` | **메인 배경색** (네이밍과 달리 흰색 사용) |
| `--color-surface` | `#f8fafc` | 서브 배경색 (섹션 구분, 카드 배경) |
| `--color-surface-light` | `#f1f5f9` | 옅은 서브 배경 |
| `--color-border` | `#e2e8f0` | 테두리 색상 |
| `--color-text` | `#0f172a` | 기본 텍스트 (Dark Navy) |
| `--color-text-secondary` | `#475569` | 보조 텍스트 (설명문 등) |
| `--color-text-muted` | `#64748b` | 흐린 텍스트 (날짜, 부가 정보) |

### 1.2 타이포그래피 (Typography)
- **메인 폰트**: 'Pretendard', 'Inter', system-ui
- **코드 폰트**: 'JetBrains Mono'
- **기본 크기**: `16px` (Root) / `line-height: 1.6`

### 1.3 헤딩 사이즈 (Responsive Clamp)
- **H1**: `2.5rem ~ 6vw ~ 4rem` (Hero Name)
- **H2**: `2rem ~ 4vw ~ 3rem` (Section Titles)
- **H3**: `1.25rem ~ 2.5vw ~ 1.75rem` (Card Titles)
- **H4**: `1rem ~ 2vw ~ 1.25rem`

---

## 2. 섹션별 상세 구조 및 스타일

### 2.1 네비게이션바 (`nav.navbar`)
*   **배경**: 투명 → 스크롤 시 `rgba(255, 255, 255, 0.95)` (Backdrop Blur 10px)
*   **크기**: 높이 패딩 `1rem` (스크롤 시 `0.75rem`)
*   **메뉴 링크**:
    *   폰트: `0.875rem`, Uppercase, Weight 500
    *   색상: `--color-text-secondary` → 호버 시 `--color-text`
    *   효과: 하단 밑줄 애니메이션 (Left to Right)
*   **드롭다운 (Career)**:
    *   배경: `--color-surface` (`#f8fafc`)
    *   아이콘: 원형 불릿 (`list-style: none` 적용됨, 기존 화살표 제거)
    *   메뉴 아이템: Experience, Education, Certificates, Awards, Licenses

### 2.2 히어로 섹션 (`section.hero`)
*   **배경**: `linear-gradient(135deg, #ffffff, #f8fafc, #ffffff)` + Grid Pattern Overlay
*   **구성 요소**:
    *   **Greeting**: `1rem`, `--color-primary-light`, Uppercase
    *   **Name (H1)**: `3rem ~ 6rem`, Gradient Text (`text-fill-color: transparent`)
    *   **Title (H2)**: `1.5rem ~ 2.5rem`, `--color-primary-light`
    *   **Scroll Down**: 애니메이션 아이콘 (위아래 반복 이동)

### 2.3 소개 섹션 (`section.about`)
*   **배경**: `--color-dark` (`#ffffff`)
*   **레이아웃**: Grid (1:2 비율), 900px 이하 1컬럼
*   **이미지**: `aspect-ratio: 3/4`, Radius `1rem`
*   **텍스트**:
    *   본문: `1rem`, `line-height: 1.8`, `--color-text-secondary`
    *   강조: `--color-primary-light`, Weight 500

### 2.4 경력 섹션 (`section.experience`)
*   **배경**: `--color-surface` (`#f8fafc`)
*   **타임라인 디자인**:
    *   좌측 선: Gradient (`primary` -> `primary-light`)
    *   마커: `14px` 원형, Border 3px
    *   날짜: `0.875rem`, `--color-primary-light`
    *   제목: `1.25rem`, `--color-text`
    *   리스트 아이콘: '•' (원형 불릿)

### 2.5 교육 (`section.education`), 자격증 (`section.certificates`), 수상 (`section.awards`), 면허 (`section.licenses`)
*   **배경**:
    *   Education/Awards/Licenses: `#ffffff` 또는 `#f8fafc` 교차 배치 확인 필요 (현재 코드상 Education은 section class만 있고 배경색 지정은 `.education`에 없음 -> 기본 transparent/white 추정, but `timeline` 공통 스타일 사용)
    *   Certificates: 로고 이미지 포함 타임라인 (`.timeline--with-logo`)
        *   로고 크기: `40px x 40px`

### 2.6 기술 스택 (`section.skills`)
*   **배경**: `--color-dark` (`#ffffff`)
*   **카드 스타일 (.skills__category)**:
    *   배경: `--color-surface` (`#f8fafc`)
    *   테두리: `1px solid rgba(0,0,0,0.08)`
    *   호버 효과: Y축 -4px, Shadow 증가
*   **태그 (.skill-tag)**:
    *   배경: `rgba(37, 99, 235, 0.1)` (Primary 10%)
    *   폰트: `0.8rem`, Weight 500, `--color-text-secondary`

### 2.7 프로젝트 (`section.projects`)
*   **배경**: `--color-surface` (`#f8fafc`)
*   **카드 스타일 (.project-card)**:
    *   배경: `--color-dark` (`#ffffff`)
    *   이미지 높이: `200px` (Cover)
    *   카테고리 뱃지: 상단 좌측, Gradient 배경
    *   설명글: 3줄 말줄임표 (`line-clamp: 3`)
*   **기능**:
    *   "더 보기" 버튼: 숨겨진 프로젝트 카드 토글 (`.hidden` 클래스 제어)
    *   상세 모달: 클릭 시 팝업 (`.modal`), 상세 내용 표시

### 2.8 연락처 (`section.contact`)
*   **배경**: `--color-dark` (`#ffffff`)
*   **소셜 링크**:
    *   스타일: `56px` 원형 버튼
    *   배경: `--color-surface` -> 호버 시 `--color-primary` (아이콘 흰색 변경)
*   **프로필 팝업**:
    *   Email, Phone 정보 표시
    *   복사 버튼 기능 포함

### 2.9 푸터 (`footer`)
*   **배경**: `--color-surface`
*   **스타일**: Top Border `1px solid rgba(0,0,0,0.08)`, 텍스트 중앙 정렬
