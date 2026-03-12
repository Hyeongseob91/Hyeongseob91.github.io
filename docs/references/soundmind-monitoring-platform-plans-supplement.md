# SoundMind Monitoring Platform - 기획/설계 문서 분석 보충 보고서

## 1. README에서 파악되는 프로젝트 구조

SoundMind Monitoring Platform은 SoundMind 생태계(Analysis, AI, Eval Platform)의 시스템 로그를 중앙 수집하고 실시간 시각화하는 통합 모니터링 플랫폼이다.

**역할 분담**: Eval Platform이 "결과(Result)"를 다루는 반면, Monitoring Platform은 "과정(Process)"을 다룬다. "품질이 얼마나 좋은가?"가 아니라 "시스템이 정상 동작하고 있는가?"에 답한다.

**기술 스택**:
- Grafana 11.5.2: 로그 시각화 및 대시보드
- Loki 3.4.2: 로그 저장소 (TSDB 인덱스 + 파일시스템 청크)
- Promtail 3.4.2: Docker 소켓 기반 로그 수집 에이전트

**로그 수집 파이프라인**: Docker Container (stdout/stderr) -> Docker Socket -> Promtail (JSON 파싱 + 레이블 추출) -> Loki (인덱싱 + 저장) -> Grafana (LogQL 쿼리 + 시각화)

**사전 구성 대시보드 4종**:
1. System Overview: 전체 에러율, 플랫폼/서비스별 로그 볼륨, 에러 스트림, 레벨별 추이
2. Analysis Platform: 파이프라인 빌드/배포, 쿼리 요청, 문서 업로드/인덱싱
3. AI Platform: 사용자 인증, 채팅/세션, API Gateway 에러
4. Eval Platform: 평가 실행, A/B 테스트, 에러 모니터링

**레이블 전략**: Labels(인덱스, 카디널리티 낮음 5~10종: level, platform, service, container)와 Structured Metadata(카디널리티 높음: logger, module, function)를 구분하여 Loki의 인덱싱 효율을 최적화한다.

---

## 2. PRD/Plan 분석: 기획 의도와 문제 인식

### 2.1 향후 작업 계획 (future_work.md): 6단계 확장 로드맵

**Phase 1: 알림 설정 (Grafana Alerting)**
- 핵심 가치: 로그 수집은 동작하지만, 이상 상황을 **자동으로 알림받는** 기능이 없음
- 알림 규칙 예시: 5분 내 ERROR 50건 -> Slack+Email, 서비스 로그 10분간 0건 -> Slack, CRITICAL 1건 -> 즉시 Slack
- Grafana Unified Alerting + LogQL 기반 + JSON 파일 프로비저닝으로 코드 관리

**Phase 2: 메트릭 수집 확장 (Prometheus 연동)**
- 로그만으로는 파악 불가한 시스템 메트릭(CPU, 메모리, 네트워크, 디스크) 수집
- cAdvisor(컨테이너 리소스) + Node Exporter(호스트 시스템) + 애플리케이션 커스텀 메트릭(`/metrics`)
- Promtail -> Loki와 cAdvisor/Node Exporter -> Prometheus를 Grafana에서 통합

**Phase 3: 로그 분석 자동화**
- 에러 패턴 분류, 서비스 간 에러 상관관계, 로그 볼륨 이상 탐지
- LogQL Metric Queries (count_over_time, rate, sum by) 활용
- Loki Recording Rules로 복잡 쿼리 사전 계산

**Phase 4: 다중 환경 지원**
- dev/staging/production 분리
- 환경별 차별화된 리텐션(dev 3일, staging 7일, production 30일)과 알림 정책
- Promtail relabel_configs로 environment 레이블 자동 부여

**Phase 5: 대시보드 고도화**
- SLI(가용성, 응답시간, 에러율) 정의 -> SLO 대시보드 -> Error Budget 추적
- 비즈니스 메트릭: 일일 평가 실행 횟수, 파이프라인 빌드 성공률, 활성 채팅 세션

**Phase 6: 보안 강화**
- LDAP/OAuth SSO, RBAC(팀별 대시보드 접근 권한), Loki 멀티테넌시
- HTTPS(Nginx/Traefik Reverse Proxy), Docker Secrets/Vault

### 2.2 Service Health Dashboard PRD

System Overview 대시보드를 Service Health Dashboard로 개선하는 상세 설계이다.

**핵심 개선사항**:
1. **서버 셀렉터**: Dropdown 변수 `$server` (ML:35, ML:12, ML:07, ALL) -> 모든 LogQL에 필터 적용
2. **회사 브랜딩**: Grafana OSS에서 Text 패널로 로고 + 타이틀 표시 (Enterprise white_labeling 미사용)
3. **핵심 지표 Stat 패널 4개**: 총 로그 수, 활성 서비스 수, ERROR 수, WARNING 수
4. **서비스 상태 테이블**: 서비스별 상태를 "5분 내 로그 유무"로 판별 (Loki는 메트릭 DB가 아니므로)
5. **에러 비율 파이차트**: 플랫폼별 에러 분포

**다중 서버 확장 전략**: 각 서버에 Promtail만 설치하고 중앙 Loki(ML:35)로 push, server 레이블로 구분. Docker Compose에 `monitoring.server: "ML:XX"` 레이블 추가.

---

## 3. Future Work / 로드맵

| Phase | 우선순위 | 핵심 이유 |
|-------|---------|----------|
| Phase 1: 알림 설정 | 최우선 | 로그 수집은 동작하므로 알림만 추가하면 즉각적 가치 |
| Phase 2: 메트릭 수집 | 높음 | 로그만으로는 리소스 사용량 파악 불가 |
| Phase 3: 로그 분석 | 중간 | Phase 1, 2 데이터 축적 후 지능적 분석 |
| Phase 4: 다중 환경 | 중간 | 프로덕션 배포 본격화 시 필수 |
| Phase 5: 대시보드 고도화 | 낮음 | 운영 성숙도 상승 후 SLO/SLI 체계화 |
| Phase 6: 보안 강화 | 낮음 | 외부 접근 필요 시점에 구축 |

Service Health Dashboard는 별도로 Phase를 나누어 Promtail 설정 변경(Phase 1) -> 대시보드 JSON 수정(Phase 2) -> 각 서버 Docker Compose 레이블 추가(Phase 3) 순서로 구현 예정이다.

---

## 4. 이력서 보충 스토리

### 커밋에서는 안 보이는 비즈니스 맥락/기술 판단 이유

**1. "Grafana + Loki + Promtail 조합을 선택한 이유"**
ELK(Elasticsearch + Logstash + Kibana) 대비 리소스 소비가 현저히 낮다. Loki는 로그 내용을 인덱싱하지 않고 레이블만 인덱싱하는 아키텍처로, GPU 서버에서 모니터링 시스템이 차지하는 리소스를 최소화해야 하는 환경에 적합하다. 단일 서버에서 LLM 모델 서빙과 모니터링을 동시에 운영해야 하는 제약 조건 하의 선택이었다.

**2. "Docker 소켓 기반 자동 수집의 장점"**
Promtail이 Docker 소켓을 통해 컨테이너 로그를 자동 수집하므로, 각 서비스에 로깅 에이전트를 별도 설치하거나 코드를 수정할 필요가 없다. `monitoring.scrape: "true"` 레이블만 추가하면 자동으로 수집 대상이 된다. 이는 마이크로서비스 환경에서 **비침투적(non-intrusive) 모니터링**을 구현하는 핵심 설계이다.

**3. "레이블 전략에서 카디널리티를 구분한 이유"**
Loki에서 고카디널리티 레이블(logger, module, function은 수백~수천 종)을 인덱스 레이블로 사용하면 인덱스가 폭발하여 성능이 급격히 저하된다. 이를 Structured Metadata로 분리함으로써 인덱싱 효율을 유지하면서도 LogQL 쿼리에서 활용할 수 있도록 했다.

**4. "서비스 UP/DOWN을 로그 유무로 판별하는 한계와 대응"**
Loki는 메트릭 DB가 아니므로 진정한 헬스체크를 수행할 수 없다. "5분 내 로그가 없으면 DOWN으로 간주"하는 휴리스틱을 사용하되, Phase 2에서 Prometheus를 추가하면 HTTP 헬스체크 메트릭으로 정확한 상태 판별이 가능해진다. 이는 현재의 제약을 인지하면서도 MVP를 먼저 제공하는 실용적 접근이다.

**5. "4종 대시보드를 사전 프로비저닝한 이유"**
Grafana의 프로비저닝 기능(YAML + JSON)을 활용하여 대시보드를 코드로 관리한다. `docker compose up -d` 한 번으로 4종 대시보드가 자동으로 로드된다. 이는 "설치 후 즉시 사용 가능한(out-of-the-box)" 경험을 제공하기 위함이며, 다른 팀원이 Grafana 대시보드를 수동으로 구성할 필요가 없다.

**6. "soundmind-network 공유 Docker 네트워크의 설계 의도"**
모든 SoundMind 플랫폼이 동일한 Docker 네트워크(soundmind-network)에 참여하므로, 컨테이너 간 통신이 Docker DNS를 통해 자동으로 해결된다. Promtail도 이 네트워크에 참여하여 다른 플랫폼의 컨테이너 로그를 수집할 수 있다.
