# SoundMind AI Console - 커밋 히스토리 분석 보고서

## 1. 프로젝트 개요
- **총 커밋 수**: 15개
- **기간**: 2026-03-05 ~ 2026-03-11 (7일)
- **주요 기여자**: Hyeongseob Kim (15)
- **기술 스택**: Next.js (App Router), TypeScript, Tailwind CSS, Docker
- **목적**: SoundMind 전체 플랫폼(AI Platform, Analysis Platform, Eval Platform)을 통합 관리하는 Admin Console/Dashboard

## 2. 타임라인: 주요 마일스톤

### Day 1: 기획 및 구현 (2026-03-05)
- `03-05` PRD 및 Task Plan 작성
- `03-05` PRD 업데이트 — 인증, 업로드 패널 병합, 로그 제거
- `03-05` Digging 리뷰 반영 — Admin 섹션, Eval 간소화
- `03-05` **Phase 1-4 일괄 구현** (**9,648줄**, 80개 파일) — 프로젝트 최대 규모 커밋
  - 인증 시스템 (Login, JWT, API 프록시)
  - Dashboard (서비스 헬스, 통계 카드)
  - Analysis Reports (목록/상세/빌드 페이지)
  - Evaluation (실험, A/B 테스트)
  - Admin (사용자 관리, 사용량)
  - Infra (헬스체크, 모니터링, 파이프라인)
  - UI 컴포넌트 (Badge, Button, Card, Input, Select, Table)
  - API 프록시 라우트 (각 백엔드 서비스로 요청 전달)
- `03-05` **UX 대규모 개선** (2,668줄) — 리포트/사용량/대시보드 UX 강화, 한국어 로컬라이제이션
  - GPU 통계 서버 스크립트 추가
  - 시계열 차트, 도넛 차트 컴포넌트
  - 대시보드 실시간 메트릭 (서버/모델 서빙)
  - Pipeline Builder 페이지 추가
- `03-05` Dashboard 모델 서빙 메트릭 수정, 차트 5분 제한
- `03-05` Evaluation 실험 삭제 기능, A/B 테스트 UX 개선

### Day 4-5: 리포트 및 파이프라인 고도화 (2026-03-09)
- `03-09` Reports UI — pipeline_type 대신 pipeline_name 표시
- `03-09` Dashboard에서 Grafana iframe 제거
- `03-09` **리포트 상세 페이지 재설계** — Gemini 분석 결과 Rich 디스플레이 (467줄 추가)
- `03-09` **Dynamic Pipeline UI** + Dashboard Pipeline Status + Pipeline Mapping 페이지 (1,049줄)

### Day 5-6: 안정화 (2026-03-10 ~ 03-11)
- `03-10` Deprecated pipeline types 제거, dynamic-only로 통일
- `03-10` Healthcheck wget → node fetch 전환
- `03-10` Pipeline 배포 에러 핸들링 개선
- `03-11` **Next.js fetch 캐시 비활성화** — 모든 API 프록시 라우트에 cache: 'no-store' 적용

## 3. 방향 전환 (Pivot Points)

### 3-1. 파이프라인 관리 방식: 정적 → 동적
- 초기: pipeline_type 기반 (미리 정의된 파이프라인 유형)
- 03-09: Dynamic Pipeline UI 도입 — 사용자가 파이프라인을 동적으로 구성
- 03-10: deprecated pipeline types 완전 제거, dynamic-only로 통일

### 3-2. 모니터링 방식: Grafana 임베딩 → 자체 대시보드
- 초기: Grafana iframe을 Dashboard에 임베딩
- 03-09: Grafana iframe 제거
- 03-05: 자체 시계열 차트 + 도넛 차트 + 서버/모델 메트릭 구현

### 3-3. PRD 3번 수정 후 구현
- PRD 초안 → 인증/업로드 패널 병합 → Digging 리뷰 반영 → 구현
- **의미**: 체계적 기획 프로세스 (PRD → Review → 구현)

## 4. 문제 해결 이력

| 날짜 | 문제 | 해결 |
|------|------|------|
| 03-05 | 모델 서빙 메트릭 부정확 | 메트릭 수정 + 차트를 5분 제한으로 조정 |
| 03-09 | Grafana iframe 임베딩 비효율 | 자체 대시보드 컴포넌트로 전환 |
| 03-10 | Docker healthcheck wget 미설치 | Node.js fetch로 전환 |
| 03-10 | Pipeline 배포 시 에러 핸들링 미흡 | 에러 핸들링 개선 |
| 03-11 | **Next.js fetch 캐시로 인한 API 데이터 stale** | 모든 API 프록시 라우트에 `cache: 'no-store'` 적용 |

## 5. 기술적 진화

### 5-1. 아키텍처
```
Admin Console 개념 (PRD) (03-05)
  → Phase 1-4 일괄 구현: 인증 + Dashboard + Analysis + Eval + Admin + Infra (03-05)
  → UX 대규모 개선: GPU 모니터링, 시계열 차트, Pipeline Builder (03-05)
  → Dynamic Pipeline 시스템 (03-09)
  → 안정화 및 캐시 이슈 해결 (03-10~11)
```

### 5-2. API 프록시 패턴
- Next.js App Router의 Route Handlers를 사용하여 백엔드 서비스(AI Platform, Analysis Platform, Eval Platform)에 대한 통합 API 프록시 구현
- 인증 토큰 자동 전달, 에러 핸들링, 캐시 제어

### 5-3. 프론트엔드 컴포넌트 시스템
- 재사용 가능한 UI 컴포넌트: Badge, Button, Card, Input, Select, Table, LoadingState
- 커스텀 훅: useAuth, useReports, useExperiments, useABTests, usePipelines, useUsage
- 대시보드 전용: DonutChart, TimeSeriesChart, ServiceHealthStrip, StatsCard

## 6. 규모 분석

### 최대 규모 커밋 TOP 3
1. Phase 1-4 일괄 구현 (03-05): **9,648줄** (80개 파일)
2. UX 대규모 개선 (03-05): **2,668줄** (43개 파일)
3. Dynamic Pipeline UI (03-09): **1,049줄** (8개 파일)

### 핵심 디렉토리
- **src/app/(authenticated)/**: 인증 후 접근 가능한 페이지들 (dashboard, analysis, evaluation, admin, infra)
- **src/app/api/**: 백엔드 서비스 프록시 라우트
- **src/components/**: UI 컴포넌트 (layout, ui, dashboard)
- **src/hooks/**: 데이터 페칭 커스텀 훅
- **src/types/**: TypeScript 타입 정의

### 통합 대상 서비스
- AI Platform (인증, 사용량)
- Analysis Platform (리포트, 파이프라인)
- Eval Platform (실험, A/B 테스트)
- Model Serving (메트릭)
- Monitoring Platform (서비스 헬스)

## 7. 이력서용 핵심 스토리 후보

### 스토리 1: "마이크로서비스 통합 Admin Console 설계 및 구축"
- **문제 정의**: AI Platform, Analysis, Eval, Model Serving 등 독립 서비스들이 각자의 UI를 가지고 있어, 운영자가 여러 서비스를 개별적으로 관리해야 하는 비효율
- **해결 과정**: Next.js App Router 기반 통합 콘솔 설계, API 프록시 패턴으로 백엔드 서비스 통합, 인증 시스템으로 접근 제어, 7일 만에 15개 커밋으로 완성
- **성과**: 5개 마이크로서비스를 단일 대시보드에서 통합 관리 가능, 실시간 GPU/서버 메트릭 + 분석 리포트 + 평가 실험을 한 곳에서 운영

### 스토리 2: "정적 파이프라인에서 동적 파이프라인 관리로 전환"
- **문제 정의**: 미리 정의된 파이프라인 유형만 사용 가능하여 새로운 분석 파이프라인 추가 시 코드 변경 필요
- **해결 과정**: Dynamic Pipeline UI 설계, Pipeline Mapping 페이지 구현, deprecated type 완전 제거로 깔끔한 전환
- **성과**: 운영자가 UI에서 직접 파이프라인을 구성/배포/매핑할 수 있는 동적 시스템 완성

### 스토리 3: "Next.js 캐시 이슈 디버깅 및 해결"
- **문제 정의**: Next.js App Router의 기본 fetch 캐시로 인해 API 프록시 응답이 stale 데이터를 반환
- **해결 과정**: 모든 API 프록시 라우트에 체계적으로 `cache: 'no-store'` 적용
- **성과**: 실시간 데이터 정합성 보장 (이 이슈는 Next.js App Router 사용 시 흔히 겪는 문제로, 면접에서 "실전 경험" 증명에 활용 가능)
