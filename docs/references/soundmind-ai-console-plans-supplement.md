# SoundMind AI Console - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

SoundMind AI Console은 AI/ML 운영을 위한 통합 웹 기반 관리 및 분석 플랫폼이다. 기존에 분산되어 있던 3개의 독립 웹 콘솔과 Grafana를 하나의 통합 콘솔로 합친 프로젝트이다.

**기술 스택**: Next.js 14 (App Router) / React 18 / TypeScript 5 / Tailwind CSS 3.4 / SWR 2.4 / Recharts 3.7 / Grafana(임베딩)

**5대 기능 영역**:
1. **대시보드**: 서비스 헬스 스트립, 서버 리소스(CPU/Memory/Network), GPU 리소스(LLM 80%/VLM 15% 할당), 모델 서빙 상태, Grafana 대시보드 통합
2. **분석(Analysis)**: PDF 업로드 -> 2단계 AI 분석(Gemini -> GPT 교차 검증) -> 7단계 RAG 파이프라인 아키텍처 추천 -> 원클릭 배포
3. **평가(Evaluation)**: 실험(Experiments), A/B 테스트(LLM-as-a-Judge, GPT-4o), 통계적 유의성 분석
4. **인프라(Infrastructure)**: 파이프라인 관리, Grafana 모니터링, 서비스 헬스 체크
5. **관리자(Admin)**: 사용자 CRUD(Admin/Manager/User/Guest 역할 체계), 회사별/사용자별 사용량 대시보드

**프로젝트 구조**: Next.js App Router의 `(authenticated)` 라우트 그룹으로 보호된 페이지 구성. `src/app/api/` 디렉토리에 API 프록시 라우트를 두어 Analysis API(9200), Eval API(9300), AI Gateway(9000) 등 백엔드 서비스로 요청을 중계한다.

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 핵심 문제 정의: 분산된 3+1개 콘솔

PRD에서 명확히 진단한 문제:
- Analysis Web Console (3200), Eval Web Console (3300), Grafana (3100)가 각각 별도 URL과 인증 체계
- 분석 -> 배포 -> 평가 -> 모니터링의 워크플로우가 탭 전환으로 끊김
- UI/UX 일관성 부재 (Analysis는 Next.js, Eval은 React/Vite, Grafana는 별도 도구)
- 공통 컴포넌트(파이프라인 목록, 상태 뱃지 등) 중복 구현

### 2.2 설계 원칙: 프록시 아키텍처

가장 주목할 설계 결정은 **백엔드 API를 전혀 변경하지 않고, 프론트엔드 통합만으로 해결**한다는 것이다. AI Console은 Next.js API Routes를 프록시로 사용하여 기존 백엔드(Analysis API 9200, Eval API 9300, AI Gateway 9000)를 그대로 호출한다.

프록시별 인증 전략도 차별화되어 있다:
- Analysis/Eval 프록시: 브라우저에서 JWT, 백엔드에는 X-Api-Key(서버 환경변수)
- Admin 프록시: JWT를 그대로 전달 (AI Gateway가 admin role 검증)
- Health 프록시: 인증 불필요

### 2.3 포트 재배치 전략

기존 Grafana(3100)가 차지하던 포트를 AI Console이 가져가고, Grafana는 3199(또는 3200)로 밀어냈다. 이는 사내 사용자들이 "3100 = 모니터링"으로 기억하고 있을 가능성을 고려하여, 가장 접근 빈도가 높은 포트에 통합 콘솔을 배치한 판단이다.

### 2.4 플랫폼 역할 재정의

통합 후 플랫폼 역할이 명확히 분리된다:
- **AI Platform (3000)**: 고객용 순수 Chat 인터페이스 (Admin 기능 제거)
- **AI Console (3100)**: 사내 운영/관리 통합 (Analysis + Eval + Admin + Monitoring)

이로써 고객용과 사내용의 관심사가 완전히 분리된다.

---

## 3. Future Work / 로드맵

### 완료 현황 (PLAN에서 확인)

| Phase | 상태 | 내용 |
|-------|------|------|
| Phase 1 | 완료 | 프로젝트 부트스트랩, Auth, App Shell |
| Phase 2 | 완료 | Analysis Section 이관 |
| Phase 3 | 완료 | Evaluation Section 이관 |
| Phase 4 | 완료 | Infrastructure & Admin Section |
| Phase 5 | 진행 중 | Polish & Cleanup |

29/34 태스크가 완료되었으며, 남은 5개 태스크는:
- 사이드바 collapse 기능
- Breadcrumb 네비게이션
- 로딩/에러 상태 개선
- 기존 web-console 컨테이너 3개 제거
- README 및 환경 설정 문서

### 향후 확장 가능성

PRD의 Migration Plan에서 "기존 3개 콘솔과 병행 운영하며 기능 검증 -> 검증 완료 후 기존 콘솔 컨테이너 제거"라는 Blue-Green 전환 전략을 사용한다. Phase 5 완료 후 `soundmind-analysis-web-console`, `soundmind-eval-web-console` 컨테이너가 제거될 예정이다.

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "4개 도구를 2개로 통합한 이유와 과정"**
사내 임직원이 ML 파이프라인 운영을 위해 3개의 URL과 Grafana를 전환하며 작업해야 했다. 특히 "문서 분석 -> 파이프라인 배포 -> 평가 -> 모니터링"이라는 End-to-End 워크플로우에서 컨텍스트 스위칭 비용이 컸다. 이를 해결하기 위해 프론트엔드 통합만으로 문제를 해결하는 접근을 선택했다. 백엔드 변경 없이 프록시 패턴으로 기존 API를 재사용하면서도 일관된 UX를 제공한다.

**2. "왜 Next.js를 선택했는가?"**
기존 Analysis Platform이 이미 Next.js를 사용하고 있었기 때문에 학습 비용과 코드 재활용 측면에서 유리했다. SSR + API Routes를 활용한 프록시 구조는 서버 사이드에서 API Key 같은 민감 정보를 관리할 수 있어 보안적으로도 적합했다.

**3. "하이브리드 모니터링 전략"**
Grafana를 완전히 대체하지 않고 iframe으로 임베딩하는 하이브리드 접근을 선택했다. 핵심 메트릭(서비스 헬스, 리소스 사용량)은 자체 UI로 구현하되, 심층 로그 분석과 복잡한 메트릭 탐색은 Grafana에 위임한다. 이는 "Grafana의 강점을 버리지 않으면서 사용자 진입점을 통합"하는 실용적 판단이다.

**4. "Admin 기능을 AI Platform에서 분리한 이유"**
고객용 AI Platform에 Admin Dashboard(사용자/회사/세션 관리)와 Token Usage 메트릭이 섞여 있었다. 이를 AI Console로 이관함으로써 AI Platform은 순수 고객용 Chat 인터페이스로 유지된다. PostgreSQL 직접 쿼리가 필요한 Admin 기능은 Grafana로 대체할 수 없기 때문에 자체 UI가 필수적이었다.

**5. "Phase 1~4를 하루 만에 완료한 실행력"**
PLAN의 Execution Log를 보면, Phase 1부터 Phase 4까지 모두 2026-03-05 단일 날짜에 완료되었다. 29개 태스크를 하루에 처리한 것은, PRD에서 기능 요구사항과 API 프록시 매핑을 사전에 철저히 설계한 덕분이다. 설계 문서의 상세함이 구현 속도를 결정한 사례이다.

**6. "JWT 인증 체계 재사용 전략"**
새로운 인증 시스템을 만들지 않고, AI Gateway의 기존 JWT 체계(HS256, 동일 SECRET_KEY)를 그대로 공유했다. Access Token 30분 + Refresh Token 7일 구조를 재사용하면서, admin/manager만 Console에 접근 가능하도록 역할 기반 접근 제어를 추가했다.
