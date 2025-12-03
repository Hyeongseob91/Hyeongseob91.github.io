# Portfolio Redesign Plan

## 목표
Klipsan 스타일의 모던하고 몰입감 있는 포트폴리오로 재구성
- 모노톤 + 블루 컬러 스킴
- Full-screen 히어로 섹션
- 라이브 Multi-Agent 데모 통합
- **React + Tailwind CSS** 기반
- GitHub Pages 정적 배포

---

## 1. 디자인 시스템

### 컬러 팔레트 (Tailwind 기반)
```css
/* tailwind.config.js에서 확장 */
colors: {
  primary: '#2563eb',      /* blue-600 */
  dark: '#0f172a',         /* slate-900 */
  surface: '#1e293b',      /* slate-800 */
  text: '#f8fafc',         /* slate-50 */
  muted: '#94a3b8',        /* slate-400 */
  accent: '#3b82f6',       /* blue-500 */
}
```

### 타이포그래피
- 헤드라인: Inter (Tailwind 기본) + Pretendard (한글)
- 본문: Pretendard (한글 지원)
- 코드: JetBrains Mono

### 레이아웃 원칙
- Full-width 섹션
- 스크롤 애니메이션 (Intersection Observer)
- 투명 → 솔리드 네비게이션 바

---

## 2. 섹션 구조

### Section 1: Hero (Profile)
- Full-screen 배경 (다크 그라디언트 또는 파티클 효과)
- 이름 + 타이틀 (AI Engineer)
- 간단한 한줄 소개
- 스크롤 다운 인디케이터 애니메이션
- 소셜 링크 (GitHub, LinkedIn)

### Section 2: Career Timeline
**지난 이력 (Past)**
- 타임라인 스타일 레이아웃
- 건설업 경력 (2014-2024)
- 주요 성과 하이라이트

**현재 이력 (Current)**
- AI Engineer 전환
- 진행 중인 학습/프로젝트
- 기술 스택 시각화

### Section 3: Projects (핵심 섹션)
**3-1. Live Demo: LangGraph Multi-Agent**
- **호스팅 추천:**
  1. **Streamlit Cloud (무료, 추천)** - LangGraph/LangChain 앱에 최적
  2. **Hugging Face Spaces (무료)** - ML 프로젝트에 좋음
  3. **Railway/Render** - FastAPI 백엔드 사용 시
- iframe으로 포트폴리오에 임베드
- 아키텍처 다이어그램 (Mermaid.js 또는 이미지)
- 기술 스택 뱃지

**3-2. 프로젝트 갤러리**
- 카드 그리드 레이아웃 (현재 아코디언 대체)
- 호버 효과로 상세 정보 표시
- 필터링 기능 (카테고리별)

**3-3. (선택) 추가 섹션**
- Context Engineering / Prompting 쇼케이스
- Sora2/Nanobanana 생성 결과물 갤러리

### Section 4: Contact
- 미니멀 디자인
- 이메일, GitHub, LinkedIn
- 간단한 문의 폼 (선택)

---

## 3. 기술 구현

### React 프로젝트 구조
```
src/
├── components/
│   ├── Navbar.jsx           # 투명/솔리드 네비게이션
│   ├── Hero.jsx             # 풀스크린 프로필 섹션
│   ├── Career.jsx           # 타임라인 (Past/Current)
│   ├── Projects.jsx         # 프로젝트 갤러리
│   │   ├── ProjectCard.jsx  # 개별 프로젝트 카드
│   │   └── LiveDemo.jsx     # Multi-Agent 데모 임베드
│   └── Contact.jsx          # 연락처 섹션
├── hooks/
│   └── useScrollAnimation.js # Intersection Observer 훅
├── data/
│   └── projects.json        # 프로젝트 데이터
├── App.jsx
├── main.jsx
└── index.css                # Tailwind directives
```

### 기술 스택
| 기술 | 용도 |
|------|------|
| **Vite** | 빌드 도구 (빠른 개발/빌드) |
| **React 18** | UI 프레임워크 |
| **Tailwind CSS** | 스타일링 |
| **Framer Motion** | 스크롤 애니메이션 (선택) |
| **gh-pages** | GitHub Pages 배포 |

### Tailwind 설정 (tailwind.config.js)
```javascript
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        dark: '#0f172a',
        surface: '#1e293b',
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

### GitHub Pages 배포 설정
```javascript
// vite.config.js
export default {
  base: '/Hyeongseob91.github.io/', // 또는 '/' (username.github.io인 경우)
  build: {
    outDir: 'dist',
  },
}
```

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  }
}
```

### 주요 컴포넌트 기능
1. **Navbar:** 스크롤 위치에 따라 투명 ↔ 솔리드 전환
2. **Hero:** 타이핑 애니메이션, 파티클 배경 (선택)
3. **Career:** 타임라인 애니메이션, 스크롤 트리거
4. **Projects:** 필터링, 카드 호버 효과, 모달 상세보기
5. **LiveDemo:** iframe 임베드, 로딩 상태 처리

---

## 4. 파일 구조

```
Hyeongseob91.github.io/
├── public/
│   └── assets/
│       ├── images/              # 프로젝트 이미지
│       ├── architecture/        # 아키텍처 다이어그램
│       └── icons/               # 소셜 아이콘
├── src/
│   ├── components/              # React 컴포넌트
│   ├── hooks/                   # 커스텀 훅
│   ├── data/                    # JSON 데이터
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   └── portfolio-redesign-plan.md
├── index.html                   # Vite 진입점
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 5. 구현 단계

### Phase 1: 프로젝트 초기화
- [ ] Vite + React 프로젝트 생성
- [ ] Tailwind CSS 설정
- [ ] 폰트 설정 (Pretendard, Inter)
- [ ] 기존 assets 마이그레이션

### Phase 2: 컴포넌트 개발
- [ ] Navbar 컴포넌트 (스크롤 효과)
- [ ] Hero 컴포넌트 (풀스크린 프로필)
- [ ] Career 컴포넌트 (타임라인)
- [ ] Projects 컴포넌트 (카드 그리드)
- [ ] Contact 컴포넌트

### Phase 3: 데이터 및 콘텐츠
- [ ] 프로젝트 데이터 JSON 구조화
- [ ] 기존 콘텐츠 마이그레이션
- [ ] 이미지 최적화

### Phase 4: 애니메이션 및 인터랙션
- [ ] 스크롤 애니메이션 (Intersection Observer 또는 Framer Motion)
- [ ] 네비게이션 스크롤 효과
- [ ] 카드 호버 효과
- [ ] 페이지 전환 효과 (선택)

### Phase 5: 라이브 데모 통합
- [ ] LangGraph Multi-Agent 앱 Streamlit 배포
- [ ] iframe 임베드 컴포넌트
- [ ] 아키텍처 다이어그램 추가

### Phase 6: 배포 및 최적화
- [ ] GitHub Pages 배포 설정 (gh-pages)
- [ ] 반응형 테스트 (모바일/태블릿/데스크탑)
- [ ] Lighthouse 성능 최적화
- [ ] SEO 메타태그 (react-helmet)
- [ ] 404 페이지 처리 (SPA 라우팅)

---

## 6. 생성/수정 파일 목록

### 새로 생성할 파일
| 파일 | 설명 |
|------|------|
| `src/components/Navbar.jsx` | 네비게이션 바 컴포넌트 |
| `src/components/Hero.jsx` | 히어로 섹션 컴포넌트 |
| `src/components/Career.jsx` | 경력 타임라인 컴포넌트 |
| `src/components/Projects.jsx` | 프로젝트 갤러리 컴포넌트 |
| `src/components/ProjectCard.jsx` | 프로젝트 카드 컴포넌트 |
| `src/components/LiveDemo.jsx` | 라이브 데모 임베드 컴포넌트 |
| `src/components/Contact.jsx` | 연락처 컴포넌트 |
| `src/hooks/useScrollAnimation.js` | 스크롤 애니메이션 훅 |
| `src/data/projects.json` | 프로젝트 데이터 |
| `src/App.jsx` | 메인 앱 컴포넌트 |
| `src/main.jsx` | 진입점 |
| `src/index.css` | Tailwind 스타일 |
| `vite.config.js` | Vite 설정 |
| `tailwind.config.js` | Tailwind 설정 |
| `postcss.config.js` | PostCSS 설정 |

### 마이그레이션할 파일
| 기존 파일 | 새 위치 |
|----------|---------|
| `assets/*.png, *.jpg, *.gif` | `public/assets/images/` |
| `assets/me.jpg` | `public/assets/images/profile.jpg` |

### 삭제/대체될 파일
| 파일 | 상태 |
|------|------|
| `index.html` (기존) | React index.html로 대체 |
| `styles.css` | src/index.css로 대체 |
| `scripts.js` | React 컴포넌트로 대체 |

**경로:** `/home/rukai/projects/Hyeongseob91.github.io/`

---

## 7. 라이브 데모 호스팅 가이드

### 추천: Streamlit Cloud (무료)
1. LangGraph 앱을 Streamlit으로 래핑
2. GitHub 연동 후 자동 배포
3. `<iframe src="https://your-app.streamlit.app" />` 로 임베드

### 대안: Hugging Face Spaces
1. Gradio 또는 Streamlit 지원
2. GPU 옵션 가능 (유료)
3. ML 모델 데모에 최적화

---

## 8. 참고 사항

- **GitHub Pages:** 정적 호스팅이므로 백엔드 로직은 외부 서비스 필요
- **아키텍처 다이어그램:** Mermaid.js 또는 Excalidraw 이미지 권장
- **반응형:** Tailwind의 `sm:`, `md:`, `lg:` 브레이크포인트 활용
- **SPA 라우팅:** GitHub Pages에서 404.html 또는 HashRouter 필요

---

## 9. Quick Start (다음 세션용)

### 프로젝트 초기화 명령어
```bash
cd /home/rukai/projects/Hyeongseob91.github.io

# 기존 파일 백업 (선택)
mkdir -p backup && cp index.html styles.css scripts.js backup/

# Vite + React 프로젝트 생성
npm create vite@latest . -- --template react

# Tailwind CSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 추가 패키지
npm install gh-pages framer-motion
```

### 다음 단계
1. 위 명령어로 프로젝트 초기화
2. tailwind.config.js 설정
3. 컴포넌트 개발 시작 (Hero → Navbar → Career → Projects → Contact)

---

## 10. 현재 포트폴리오 콘텐츠 요약 (마이그레이션용)

### 프로젝트 목록
1. **MCP 기반 LangGraph AI Agent** (진행중) - Unreal 융합
2. **KOMI** - LangChain RAG 원격 운동 자세 진단
3. **BeMyMuse** - KoGPT-2 감성 작사 Fine-Tuning
4. **PerfectPose** - Pose Detection AI 게임
5. **EconDigest** - AI 경제 유튜브 요약

### 경력 사항
- 현대건설 (2022-2024): 주택사업본부 PM
- 동극건업 (2016-2022): 공무부 PM
- 두산건설 (2014-2016): 건축사업본부 PM

### 교육
- 원티드랩 POTEN UP 1기 (2024-2025)
- 건축공학 학사 (2023-2024)
- 경복대학교 건축디자인 (2009-2015)
