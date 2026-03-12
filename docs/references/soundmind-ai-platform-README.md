# Soundmind AI Platform

> **Author**: AI Research Engineer, Hyeongseob Kim
> **Last Updated**: 2026-03-04

## 1. Overview

**Soundmind AI Platform**은 기업 고객에게 AI 기반 문서 분석 및 지능형 에이전트 서비스를 제공하는 **B2B SaaS 플랫폼**입니다.

멀티 테넌트 아키텍처로 설계되어 각 기업 고객(회사)별로 독립된 데이터 영역을 보장하며, 사용자 인증, 세션 관리, 사용량 통계 등 엔터프라이즈급 기능을 제공합니다.

### Core Services

| Agent | 설명 | 상태 |
|-------|------|:----:|
| **RAG Agent** | 기업 문서 기반 지능형 Q&A. 문서 업로드 → 벡터 검색 → AI 답변 | ✅ Active |
| **AI Agent** | ReAct 기반 자율형 에이전트. 웹 검색, 파일 분석 등 도구 활용 | ✅ Active |

---

## 2. Key Features

### 2.1 Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Soundmind AI Platform                     │
├─────────────────────────────────────────────────────────────┤
│  Company A          │  Company B          │  Company C       │
│  ├── Users          │  ├── Users          │  ├── Users       │
│  ├── Sessions       │  ├── Sessions       │  ├── Sessions    │
│  ├── Documents      │  ├── Documents      │  ├── Documents   │
│  └── Usage Stats    │  └── Usage Stats    │  └── Usage Stats │
└─────────────────────────────────────────────────────────────┘
```

- **회사별 데이터 격리**: 각 기업의 문서, 대화 기록, 사용량이 완전히 분리
- **사용자 역할 관리**: Admin, Manager, Customer 역할 기반 권한 제어
- **사용량 추적**: 회사/사용자별 토큰 사용량, 세션 수, 메시지 수 통계

### 2.2 Authentication & Authorization

- **JWT 기반 인증**: Access Token + Refresh Token
- **역할 기반 접근 제어**: Admin 전용 API, 일반 사용자 API 분리
- **게스트 체험**: 제한된 기능으로 플랫폼 체험 가능

### 2.3 Session Persistence

- **대화 내용 영속화**: PostgreSQL 기반 세션/메시지 저장
- **세션 복원**: 로그아웃 후 재접속 시 이전 대화 및 문서 복원
- **문서-세션 연결**: 업로드한 문서가 세션에 연결되어 재사용 가능

### 2.4 Dual RAG Strategy

회사(테넌트)별로 최적의 RAG 파이프라인을 매핑하여 사용합니다.

| Pipeline | Vector DB | 특징 | 적합한 문서 |
|----------|-----------|------|------------|
| **General RAG** | Weaviate | Hybrid Search (Dense + Sparse), Semantic Chunking | 일반 문서, 자유 형식 텍스트 |
| **Structured RAG** | Qdrant | 구조화된 데이터 검색 최적화 | 정형 데이터, 표 기반 문서 |

**Pipeline Mapping**: Admin이 회사별로 사용할 RAG 파이프라인을 관리 화면에서 지정할 수 있습니다.

### 2.5 Admin Dashboard

> **플랫폼 전체를 관리하는 통합 관리자 대시보드**

Admin Dashboard는 `admin` 및 `manager` 역할의 사용자만 접근 가능한 관리 인터페이스입니다.
계정 관리, 사용 현황 분석, 문서 관리, 서비스 로그 모니터링의 4개 탭으로 구성됩니다.

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
├──────────┬──────────┬──────────────┬────────────────────────┤
│ 계정 관리 │ 사용 현황 │   문서 관리   │     서비스 로그         │
│ Accounts │  Stats   │  Documents   │        Logs            │
└──────────┴──────────┴──────────────┴────────────────────────┘
```

#### 2.5.1 계정 관리 (Accounts)

사용자 생성, 수정, 삭제 및 권한/서비스 접근 제어를 담당합니다.

| 기능 | 설명 | 권한 |
|------|------|:----:|
| **사용자 목록** | 전체 사용자를 이름, 이메일, 역할, 팀, 서비스, 상태와 함께 테이블로 조회 | Manager+ |
| **사용자 생성** | 이메일, 비밀번호, 회사 ID(필수), 이름, 팀, 역할, 활성 서비스 지정 | Manager+ |
| **사용자 수정** | 이름, 팀, 역할, 활성 서비스, 계정 활성/비활성 상태 변경 | Manager+ |
| **사용자 삭제** | 사용자 삭제 시 관련 세션, 메시지, 벡터DB 데이터 연쇄 삭제 | Admin Only |

**역할 기반 권한 체계 (3-Tier):**

| 역할 | 대시보드 접근 | 사용자 생성 | 사용자 삭제 | 역할 부여 범위 |
|------|:----------:|:--------:|:--------:|:----------:|
| **Admin** | ✅ | ✅ | ✅ | Admin, Manager, Customer |
| **Manager** | ✅ | ✅ | ❌ | Customer만 |
| **Customer** | ❌ | ❌ | ❌ | - |

**서비스 접근 제어:**
사용자별로 사용 가능한 에이전트를 개별 설정할 수 있습니다.

- `RAG Agent` — 문서 기반 지능형 Q&A
- `AI Agent` — ReAct 기반 자율형 에이전트

#### 2.5.2 사용 현황 (Stats)

회사별/사용자별 사용량을 분석하는 통계 대시보드입니다.

**전체 요약 카드:**

| 지표 | 설명 |
|------|------|
| **Total Users** | 플랫폼 전체 등록 사용자 수 |
| **Total Sessions** | 전체 대화 세션 수 |
| **Total Messages** | 전체 메시지 수 |

**회사별 통계 (Company Breakdown):**

각 회사(테넌트)를 카드 형태로 표시하며, 회사당 사용자 수/세션 수/메시지 수를 한눈에 확인할 수 있습니다. 카드를 클릭하면 해당 회사의 상세 분석 화면으로 진입합니다.

**회사 상세 분석 화면:**

```
┌──────────────────────────────────────────────────────┐
│  Company Detail: [회사명]                              │
├──────────────────────────────────────────────────────┤
│  📊 일별 메시지 추이 (30일)                             │
│  ┌─ BarChart ──────────────────────────────────────┐  │
│  │  ████  ██████  ████  ██  ████████  ████  ████   │  │
│  │  Day1  Day2    Day3  ... Day28     Day29  Day30  │  │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  📊 일별 토큰 사용량 (30일)                             │
│  ┌─ StackedBarChart ──────────────────────────────┐   │
│  │  ■ Input Tokens (Teal)                          │   │
│  │  ■ Output Tokens (Orange)                       │   │
│  └─────────────────────────────────────────────────┘  │
│                                                        │
│  ┌── Sessions Tab ──┬── Users Tab ──┐                 │
│  │ Session Table    │ User Table    │                 │
│  └──────────────────┴───────────────┘                 │
└──────────────────────────────────────────────────────┘
```

| 분석 항목 | 설명 |
|----------|------|
| **일별 메시지 차트** | 최근 30일간 일별 메시지 수를 막대 그래프로 시각화 (Recharts) |
| **일별 토큰 사용량 차트** | Input(Prompt) / Output(Completion) 토큰을 스택 막대 그래프로 분리 표시 |
| **세션 목록** | 세션 ID, 사용자, 에이전트 유형, 메시지 수, 토큰 사용량(In/Out/Total), 생성일 |
| **세션 메시지 열람** | 세션 행 클릭 시 모달로 전체 대화 내역(사용자/AI 메시지) 시간순 표시 |
| **사용자 목록** | 이름, 이메일, 팀, 역할, 세션 수, 메시지 수, 활성 상태 |

#### 2.5.3 문서 관리 (Documents)

플랫폼에 업로드된 전체 문서를 관리합니다.

| 기능 | 설명 | 권한 |
|------|------|:----:|
| **문서 목록 조회** | 파일명, 업로더, 형식, 크기, 청크 수, 상태, 업로드 일시 표시 | Manager+ |
| **문서 다운로드** | 원본 문서 파일 다운로드 | Manager+ |
| **문서 삭제** | 문서 및 연관 벡터DB 데이터 삭제 | Admin Only |

**문서 처리 상태:**

| 상태 | 표시 | 설명 |
|------|:----:|------|
| 완료 | 🟢 | 파싱, 청킹, 임베딩 완료 |
| 처리중 | 🟡 | 문서 처리 파이프라인 진행 중 |
| 실패 | 🔴 | 처리 중 오류 발생 |

#### 2.5.4 서비스 로그 (Logs)

모든 서비스의 로그를 실시간으로 모니터링하고 구조화된 검색을 제공합니다.

**A. 실시간 로그 (Raw Log View)**

| 기능 | 설명 |
|------|------|
| **서비스 필터** | All Services / RAG Engine / API Gateway / Web Console 선택 |
| **자동 새로고침** | 토글 ON 시 주기적으로 최신 로그 자동 로딩 |
| **수동 새로고침** | 즉시 최신 로그 로딩 |
| **페이지네이션** | Load More 버튼으로 과거 로그 추가 로딩 |

**B. 구조화 로그 (Structured Log View)**

DB에 저장된 구조화된 로그를 다양한 필터로 검색합니다.

| 필터 | 설명 |
|------|------|
| **서비스** | RAG Engine / API Gateway / 전체 |
| **로그 레벨** | ERROR, WARNING, INFO, DEBUG 버튼 필터 |
| **메시지 검색** | 로그 메시지 텍스트 검색 |
| **Task ID** | 특정 작업 ID로 관련 로그 추적 |

| 기능 | 설명 |
|------|------|
| **로그 테이블** | 타임스탬프, 서비스, 레벨, 메시지를 테이블로 표시 |
| **상세 확장** | 행 클릭 시 Logger, 위치(module.function:line), Extra Fields(JSONB), Exception 트레이스 표시 |
| **로그 정리** | 지정일(1~365일) 이전 로그 일괄 삭제 |
| **페이지네이션** | 전체 건수 표시, Previous/Next 탐색 |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client                                      │
│                         Web Console (React)                              │
│                           localhost:3000                                  │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API Gateway                                    │
│                    FastAPI + JWT Auth + SSE                               │
│                           localhost:9000                                  │
│  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Auth API │ │ Chat API │ │Session API│ │Admin API │ │AI Agent API  │ │
│  │/v1/auth/*│ │/v1/chat/*│ │/v1/session│ │/v1/admin │ │/v1/ai-agent  │ │
│  └──────────┘ └──────────┘ └───────────┘ └──────────┘ └──────────────┘ │
└────┬──────────────┬──────────────┬──────────────┬──────────────┬───────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
┌──────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌──────────┐
│PostgreSQL│ │General RAG │ │Structured  │ │ Weaviate │ │  Qdrant  │
│(Auth/Data)│ │ (Weaviate) │ │RAG (Qdrant)│ │(Vector DB)│ │(Vector DB)│
│ port:5432│ │  port:9001 │ │  port:9002 │ │ port:8080│ │ port:6333│
└──────────┘ └────────────┘ └────────────┘ └──────────┘ └──────────┘
                                                              │
                                                              ▼
                                                      ┌──────────────┐
                                                      │  Chat Agent  │
                                                      │   (ReAct)    │
                                                      │  port:8100   │
                                                      └──────────────┘
```

### Platform Services

| # | Service | Container | Port | Description |
|:-:|---------|-----------|:----:|-------------|
| 1 | **Web Console** | soundmind-web-console | 3000 | React 기반 통합 Web UI |
| 2 | **API Gateway** | soundmind-api-gateway | 9000 | BFF + JWT 인증 + SSE Streaming |
| 3 | **General RAG** | soundmind-rag-advanced | 9001 | Weaviate 기반 Hybrid Search + Reranker |
| 4 | **Structured RAG** | soundmind-rag-structured | 9002 | Qdrant 기반 구조화 데이터 검색 |
| 5 | **Chat Agent** | soundmind-chat-agent | 8100 | ReAct Agent with Multi-Provider LLM |
| 6 | **PostgreSQL** | soundmind-postgres | 5432 | 사용자, 세션, 대화, 문서 메타데이터 |
| 7 | **Weaviate** | soundmind-weaviate | 8080 | 벡터 DB — General RAG용 |
| 8 | **Qdrant** | soundmind-qdrant | 6333 | 벡터 DB — Structured RAG용 |

### External Model Serving

| Category | Model | Description |
|----------|-------|-------------|
| **LLM** | Qwen3 / Deepseek-R1 / Kanana-2 시리즈 (vLLM) | 답변 생성 (OpenAI Compatible) |
| **Embedding** | BGE-M3 (Infinity) | Dense + Sparse 임베딩 |
| **Reranker** | BGE-Reranker-v2-M3 | 검색 결과 재순위화 |

### Monitoring (Optional)

| Service | Port | Description |
|---------|:----:|-------------|
| **Grafana** | 3100 | 대시보드 시각화 |
| **Loki** | (internal) | 로그 집계 |
| **Promtail** | - | 로그 수집 에이전트 |

`docker compose --profile monitoring` 으로 활성화합니다.

---

## 4. Agent Services

### 4.1 RAG Agent

> **사내 문서 기반 지능형 Q&A 서비스**

| 기능 | 설명 |
|------|------|
| **Document Upload** | PDF, DOCX, TXT, XLSX, JSON, HWP, HWPX 문서 업로드 |
| **Hybrid Search** | Dense + Sparse 하이브리드 검색 |
| **Query Rewrite** | LLM 기반 검색 쿼리 최적화 |
| **Reranking** | BGE-Reranker로 검색 결과 재순위화 |
| **Streaming Response** | 실시간 토큰 스트리밍 |
| **Session Persistence** | 세션별 문서 및 대화 내용 저장/복원 |

#### 4.1.1 Document Parsing

7가지 문서 형식 지원 및 고급 파싱 기능:

| Format | Parser | Features |
|--------|--------|----------|
| **PDF** | pymupdf4llm | 레이아웃 인식, 테이블 추출, 이미지 내 텍스트 |
| **PDF (Scanned)** | PaddleOCR | 스캔 문서 OCR 자동 감지 및 처리 |
| **DOCX** | python-docx | 서식 유지, 테이블 추출 |
| **XLSX** | openpyxl | 시트별 처리, 셀 데이터 추출 |
| **TXT** | Built-in | UTF-8 인코딩 자동 감지 |
| **JSON** | Built-in | 구조화된 데이터 파싱 |
| **HWP/HWPX** | pyhwpx | 한글 문서 네이티브 지원 |

**OCR Fallback Pipeline:**
```
PDF Upload → Text Extraction (pymupdf4llm)
                    │
                    ├── 텍스트 존재 → 정상 처리
                    │
                    └── 텍스트 없음 (스캔 문서) → PaddleOCR 자동 실행
```

#### 4.1.2 Semantic Chunking

의미 기반 청킹으로 문맥 보존:

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Algorithm** | SemanticChunker | 문장 간 유사도 기반 분할 |
| **Breakpoint Threshold** | 0.90 | 의미 경계 감지 임계값 |
| **Min Chunk Size** | 100 tokens | 최소 청크 크기 |
| **Max Chunk Size** | 2,000 tokens | 최대 청크 크기 |
| **Embedding Model** | BGE-M3 | 청크 경계 결정용 임베딩 |

```
Document → Sentence Splitting → Embedding → Similarity Calculation
                                                      │
                    ┌─────────────────────────────────┘
                    ▼
            Breakpoint Detection (threshold=0.90)
                    │
                    ▼
            Semantic Chunks (100~2000 tokens)
```

#### 4.1.3 Hybrid Search & Embedding

Dense + Sparse 하이브리드 검색으로 정확도 극대화:

| Component | Model/Method | Description |
|-----------|--------------|-------------|
| **Dense Embedding** | BGE-M3 (Infinity) | 1024-dim 벡터, 의미적 유사도 |
| **Sparse Embedding** | BM25 | 키워드 매칭, 정확한 용어 검색 |
| **Hybrid Alpha** | 0.5 | Dense/Sparse 가중치 균형 |
| **Reranker** | BGE-Reranker-v2-M3 | 검색 결과 재순위화 |

**Hybrid Search Formula:**
```
Final Score = α × Dense Score + (1-α) × Sparse Score
            = 0.5 × Semantic Similarity + 0.5 × BM25 Score
```

**RAG Pipeline:**

```
Document Upload → Parsing → Semantic Chunking → Embedding → Vector DB Storage
                                                                    │
User Query → Query Rewrite → Hybrid Search (Dense+Sparse) → Reranking → LLM Generation
```

### 4.2 AI Agent

> **ReAct 기반 멀티 프로바이더 자율형 에이전트**

| 기능 | 설명 |
|------|------|
| **Multi-Provider LLM** | OpenAI, Gemini, Local LLM (vLLM) 지원 |
| **Tool Use** | 웹 검색 (Tavily), 파일 분석 등 |
| **Agent Building** | 사용자 정의 에이전트 빌드 |
| **Streaming Response** | SSE 기반 실시간 스트리밍 |
| **Session Persistence** | 대화 내용 영속화 |

---

## 5. Database Schema

```sql
-- 회사 (테넌트)
companies (id, name, company_id, created_at, updated_at)

-- 사용자
users (id, email, password_hash, name, company_id, team, role, active_services, is_active)

-- 세션 (대화)
sessions (id, user_id, agent_type, title, created_at, updated_at)

-- 메시지
messages (id, session_id, role, content, thinking, metadata, created_at)

-- 문서
documents (id, user_id, company_id, session_id, file_name, file_type, file_size, storage_path, chunk_count, status)

-- Refresh Token
refresh_tokens (jti, user_id, expires_at, created_at)
```

---

## 6. Quick Start

### Prerequisites

- Docker Engine 24.0+
- Docker Compose 2.20+
- External Model Serving (vLLM, Infinity)

### 1. Clone & Configure

```bash
git clone <repository-url>
cd soundmind-ai-platform

cp .env.example .env
vi .env  # API 키 및 설정 입력
```

### 2. Network Setup

```bash
docker network create model-serving-network
```

### 3. Start Services

```bash
# 플랫폼 시작
docker compose --profile platform up -d

# 모니터링 포함 시작
docker compose --profile platform --profile monitoring up -d

# 로그 확인
docker compose logs -f

# 서비스 중지
docker compose --profile platform down
```

### 4. Access

| Service | URL |
|---------|-----|
| Web Console | http://localhost:3000 |
| API Gateway | http://localhost:9000 |
| API Docs | http://localhost:9000/docs |
| Grafana | http://localhost:3100 (monitoring 프로필) |

### 5. Default Admin Account

```
Email: admin@soundmind.life
Password: (ADMIN_PASSWORD in .env)
```

---

## 7. API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/auth/login` | 로그인 (JWT 발급) |
| POST | `/v1/auth/refresh` | Access Token 갱신 |
| POST | `/v1/auth/logout` | 로그아웃 |
| POST | `/v1/auth/guest` | 게스트 로그인 |
| GET | `/v1/auth/me` | 현재 사용자 정보 |

### Chat (RAG Agent)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/chat/` | RAG 채팅 (단일 응답) |
| POST | `/v1/chat/stream` | RAG 채팅 (SSE 스트리밍) |

### Session

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/session` | 새 세션 생성 |
| GET | `/v1/session/list` | 세션 목록 조회 |
| GET | `/v1/session/{id}/messages` | 세션 메시지 조회 |
| DELETE | `/v1/session/{id}` | 세션 삭제 |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/documents/upload` | 문서 업로드 |
| GET | `/v1/documents/upload/{task_id}` | 업로드 상태 조회 |
| GET | `/v1/documents/list` | 사용자 문서 목록 |
| GET | `/v1/documents/session/{session_id}` | 세션 문서 목록 |
| GET | `/v1/documents/download/{doc_id}` | 문서 다운로드 |
| DELETE | `/v1/documents/{id}` | 문서 삭제 |

### AI Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/ai-agent/chat` | AI Agent 채팅 (단일 응답) |
| POST | `/v1/ai-agent/chat/stream` | AI Agent 채팅 (SSE 스트리밍) |
| POST | `/v1/ai-agent/upload` | 파일 업로드 |
| POST | `/v1/ai-agent/build` | 에이전트 빌드 |
| GET | `/v1/ai-agent/tools` | 사용 가능 도구 목록 |
| GET | `/v1/ai-agent/health` | 헬스 체크 |

### Admin — 사용자 관리 (Manager+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/users` | 전체 사용자 목록 조회 |
| POST | `/v1/admin/users` | 사용자 생성 (이메일 중복 검증, 회사 자동 생성) |
| PUT | `/v1/admin/users/{user_id}` | 사용자 정보 수정 |
| DELETE | `/v1/admin/users/{user_id}` | 사용자 삭제 + 연쇄 삭제 ⚠️ Admin Only |

### Admin — 통계 & 분석 (Manager+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/stats` | 전체 통계 (사용자/세션/메시지 수, 회사별 집계) |
| GET | `/v1/admin/companies/{id}/sessions` | 회사별 세션 목록 (토큰 사용량 포함) |
| GET | `/v1/admin/companies/{id}/users` | 회사별 사용자 목록 |
| GET | `/v1/admin/companies/{id}/daily-messages` | 일별 메시지 수 (최근 30일) |
| GET | `/v1/admin/companies/{id}/daily-tokens` | 일별 토큰 사용량 (Input/Output 분리) |
| GET | `/v1/admin/users/{user_id}/sessions` | 특정 사용자의 세션 목록 |
| GET | `/v1/admin/users/{user_id}/sessions/{session_id}/messages` | 세션 메시지 전체 조회 |

### Admin — 문서 관리 (Manager+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/documents/admin/list` | 전체 문서 목록 |
| GET | `/v1/admin/users/{user_id}/documents` | 사용자의 벡터DB 문서 목록 |
| DELETE | `/v1/admin/users/{user_id}/documents` | 사용자의 전체 문서 삭제 ⚠️ Admin Only |

### Admin — Pipeline Mapping (Manager+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/pipeline-mappings` | 전체 파이프라인 매핑 조회 |
| GET | `/v1/admin/pipeline-mappings/{company_id}` | 회사별 파이프라인 매핑 |
| PUT | `/v1/admin/pipeline-mappings/{company_id}` | 회사별 파이프라인 매핑 수정 |

### Admin — 서비스 로그 (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/admin/logs` | 구조화 로그 검색 (서비스, 레벨, 메시지, Task ID 필터) |
| GET | `/v1/admin/logs/raw` | 서비스별 원시 로그 파일 조회 (페이지네이션) |
| POST | `/v1/internal/logs` | 로그 수집 (내부 서비스 전용) |
| DELETE | `/v1/admin/logs/cleanup` | 지정일 이전 로그 일괄 삭제 |

### Docs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/docs/` | 기술 문서 목록 |
| GET | `/v1/docs/readme` | 메인 README |
| GET | `/v1/docs/{doc_id}` | 문서 내용 조회 |

---

## 8. Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|:--------:|
| `POSTGRES_PASSWORD` | PostgreSQL 비밀번호 | ✅ |
| `JWT_SECRET_KEY` | JWT 서명 키 | ✅ |
| `ADMIN_EMAIL` | 관리자 이메일 | ✅ |
| `ADMIN_PASSWORD` | 관리자 비밀번호 | ✅ |
| `OPENAI_API_KEY` | OpenAI API 키 | ✅ |
| `VLLM_BASE_URL` | vLLM 서버 URL | ✅ |
| `VLLM_MODEL` | vLLM 모델명 | ✅ |
| `GEMINI_API_KEY` | Gemini API 키 | Optional |
| `TAVILY_API_KEY` | Tavily 검색 API 키 | Optional |
| `SENTRY_DSN` | Sentry 에러 트래킹 | Optional |

### Worker Configuration

| Variable | Default | Description |
|----------|:-------:|-------------|
| `API_GATEWAY_WORKERS` | 4 | FastAPI 워커 수 |
| `CHAT_AGENT_WORKERS` | 4 | Chat Agent 워커 수 |
| `RAG_WORKERS` | 1 | RAG 워커 수 (TaskStore 단일 프로세스) |

---

## 9. Directory Structure

```
soundmind-ai-platform/
├── services/
│   ├── api_gateway/                  # BFF + JWT 인증
│   │   ├── src/
│   │   │   ├── api/routes/           # REST API 엔드포인트
│   │   │   ├── auth/                 # JWT 인증 로직
│   │   │   ├── database/             # SQLAlchemy 모델
│   │   │   └── services/             # 비즈니스 로직
│   │   └── alembic/                  # DB 마이그레이션
│   │
│   ├── web_console/                  # React 프론트엔드
│   │   └── src/
│   │       ├── components/           # UI 컴포넌트
│   │       ├── services/             # API 클라이언트
│   │       └── types/                # TypeScript 타입
│   │
│   ├── tools/
│   │   ├── general_rag_pipeline/     # General RAG (Weaviate)
│   │   └── structured_rag_pipeline/  # Structured RAG (Qdrant)
│   │
│   └── agents/
│       └── chat_agent/               # AI Agent (ReAct)
│
├── packages/
│   ├── shared/                       # 공유 패키지
│   ├── rag-core/                     # RAG 코어 라이브러리
│   └── pipelines/                    # 파이프라인 정의
│
├── docs/
│   ├── manual/                       # 아키텍처 문서
│   └── poc-inspection/               # POC 검증 체크리스트
│
├── infrastructure/                   # 모니터링 (Grafana/Loki)
├── docker-compose.yml
└── .env.example
```

---

## 10. Technology Stack

| Category | Technology |
|----------|------------|
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, LangGraph |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Database** | PostgreSQL 16, Weaviate 1.27, Qdrant 1.17 |
| **Auth** | JWT (PyJWT), bcrypt |
| **LLM** | Local LLM (vLLM), OpenAI, Google Gemini |
| **Embedding** | BGE-M3 (Infinity) |
| **Reranker** | BGE-Reranker-v2-M3 |
| **Orchestration** | Docker Compose |
| **Monitoring** | Sentry, Grafana + Loki (Optional) |

---

## 11. Development

### Local Development

```bash
# 의존성 설치
cd services/api_gateway && uv pip install -e .
cd services/web_console && npm install

# 인프라만 실행
docker compose --profile platform up -d postgres weaviate qdrant

# 개발 서버 실행
cd services/api_gateway && uvicorn src.main:app --reload --port 9000
cd services/web_console && npm run dev
```

### Database Migration

```bash
cd services/api_gateway
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Container Operations

```bash
# 특정 서비스 재빌드
docker compose up -d --build api-gateway

# 로그 확인
docker compose logs -f api-gateway --tail 100

# 컨테이너 접속
docker exec -it soundmind-api-gateway bash
```

---

## License

This project is proprietary software owned by Soundmind Labs.

---

## Contact

- **Organization**: Soundmind Labs (AI Labs Team)
- **Author**: AI Research Engineer, Hyeongseob Kim
