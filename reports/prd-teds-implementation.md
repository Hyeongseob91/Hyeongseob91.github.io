# PRD: TEDS 메트릭 구현

## 문서 정보
| 항목 | 내용 |
|------|------|
| 작성일 | 2026-01-29 |
| 작성자 | Hyeongseob Kim |
| 상태 | Draft → **Reviewed** |
| 관련 프로젝트 | [test-vlm-document-parsing](https://github.com/Hyeongseob91/test-vlm-document-parsing) |

---

## 1. 개요

### 1.1 배경
현재 VLM Document Parsing 리서치에서 테이블 평가는 Structure F1 메트릭을 사용한다. 그러나 이 메트릭은 테이블 **행의 존재 여부**만 측정하며, **구조적 정확도**(행/열 정렬, 셀 병합)는 평가하지 못한다.

```
현재 한계:
| A | B |  vs  | A | 1 |  → 둘 다 동일한 Structure F1 점수
| 1 | 2 |      | B | 2 |
```

### 1.2 목표
- **TEDS (Tree Edit Distance-based Similarity)** 메트릭을 구현하여 테이블 구조 정확도를 정밀 평가
- 기존 Structure F1과 병행하여 평가 체계 강화
- Advanced 파서(VLM)의 테이블 구조 보존 능력 정량화

> **Note**: Upstage dp-bench와의 직접 비교는 동일 테스트셋 사용 시에만 가능. 본 프로젝트는 자체 테스트 문서 사용.

### 1.3 성공 지표
| 지표 | 목표 |
|------|------|
| TEDS 측정 가능 | test_3 (Attention Is All You Need) 테이블에서 TEDS/TEDS-S 점수 산출 |
| 재현성 | PubTabNet 공식 구현과 동일한 결과 |
| 문서화 | Tech Report에 TEDS 결과 섹션 추가 |

---

## 2. 요구사항

### 2.1 기능 요구사항

#### FR-1: 마크다운 테이블 추출 및 변환
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-1.0 | 마크다운 문서에서 테이블 블록 추출 (정규식 기반) | P0 |
| FR-1.1 | 마크다운 테이블을 HTML `<table>` 태그로 변환 | P0 |
| FR-1.2 | 헤더 행(`<thead>`)과 본문(`<tbody>`) 구분 | P0 |
| FR-1.3 | 셀 정렬 속성 보존 (left, center, right) | P1 |
| FR-1.4 | 셀 병합(colspan, rowspan) 처리 | P2 |

#### FR-2: Ground Truth 준비
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-2.0 | GT 작성 가이드라인 문서화 | P0 |
| FR-2.1 | test_1 (정부 공문서) 테이블 HTML 작성 | P1 |
| FR-2.2 | test_2 (영수증 이미지) 테이블 HTML 작성 | P1 |
| FR-2.3 | test_3 (학술 논문) 테이블 HTML 작성 | P0 |
| FR-2.4 | Ground Truth JSON 스키마 정의 (버전 포함) | P1 |

**GT 작성 가이드라인:**
- 원본 PDF의 테이블 구조를 **정확히** 반영
- 셀 내용은 원본 텍스트 그대로 (OCR 오류 없이)
- 셀 병합은 `colspan`/`rowspan` 속성으로 표현
- 빈 셀은 `<td></td>`로 표현
- 특수문자, 수식은 텍스트로 표현 (예: `O(n²)` → `O(n^2)`)

#### FR-3: TEDS 계산 엔진
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-3.1 | PubTabNet TEDS 코드 통합 또는 재구현 | P0 |
| FR-3.2 | TEDS (구조 + 내용) 점수 계산 | P0 |
| FR-3.3 | TEDS-S (구조만) 점수 계산 | P0 |
| FR-3.4 | 테이블별 개별 점수 및 평균 점수 출력 | P1 |
| FR-3.5 | 편집 연산 목록 출력 (디버깅용) | P2 |

#### FR-4: 테이블 매칭 전략
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-4.1 | 순서 기반 매칭 (기본 전략) | P0 |
| FR-4.2 | 테이블 수 불일치 시 처리 로직 | P0 |
| FR-4.3 | 매칭 결과 로깅 | P1 |

**매칭 전략 정의:**
| 전략 | 설명 | 적용 조건 |
|------|------|----------|
| 순서 기반 | N번째 예측 테이블 ↔ N번째 GT 테이블 | 기본 |
| 부분 매칭 | 예측 < GT: 매칭된 것만 평가, 나머지 GT는 0점 | 테이블 수 불일치 |
| 초과 무시 | 예측 > GT: 초과분 무시 | 테이블 수 불일치 |

#### FR-5: Baseline 출력 처리
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-5.1 | Baseline 출력에서 테이블 패턴 검출 시도 | P1 |
| FR-5.2 | 테이블 미검출 시 TEDS = "N/A" 처리 | P0 |
| FR-5.3 | 결과 리포트에 "구조 없음" 명시 | P0 |

#### FR-6: 평가 파이프라인 통합
| ID | 요구사항 | 우선순위 |
|----|----------|----------|
| FR-6.1 | 기존 evaluate.py에 TEDS 평가 추가 | P0 |
| FR-6.2 | 결과 리포트에 TEDS 섹션 포함 | P0 |
| FR-6.3 | 파서별(Baseline/Advanced) TEDS 비교 | P0 |

### 2.2 비기능 요구사항

| ID | 요구사항 | 기준 |
|----|----------|------|
| NFR-1 | 성능 | 100셀 이하 테이블 TEDS 계산 < 1초 |
| NFR-2 | 의존성 | Python 3.10+, 최소 외부 라이브러리 |
| NFR-3 | 재현성 | 동일 입력 → 동일 출력 보장 |

### 2.3 에러/예외 처리 정책

| 상황 | 처리 방안 | 출력 |
|------|----------|------|
| 예측에 테이블 0개 | TEDS = 0.0 | 경고 로그 + 결과에 명시 |
| Baseline 구조 없음 | TEDS = N/A | "구조 없음"으로 표기 |
| 마크다운 파싱 실패 | TEDS = N/A | 에러 로그 + 원인 기록 |
| 테이블 수 불일치 | 부분 매칭 후 평가 | 불일치 경고 |
| 빈 테이블 (헤더만) | 정상 처리 | 구조만 평가 |
| HTML 파싱 실패 | TEDS = N/A | 에러 로그 |

---

## 3. 기술 설계

### 3.1 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEDS Evaluation Pipeline                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Parser     │    │   Table      │    │  Converter   │       │
│  │   Output     │ →  │   Extractor  │ →  │  MD → HTML   │       │
│  │  (Markdown)  │    │              │    │              │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                             │                    │               │
│                             ▼                    ▼               │
│                      ┌──────────────┐    ┌──────────────┐       │
│                      │   Table      │    │   Predicted  │       │
│                      │   Matcher    │    │   HTML       │       │
│                      │              │    │   Tables     │       │
│                      └──────────────┘    └──────────────┘       │
│                             │                    │               │
│  ┌──────────────┐          │                    │               │
│  │   Ground     │          ▼                    ▼               │
│  │   Truth      │ ──→ ┌──────────────────────────────┐         │
│  │   (HTML)     │     │        TEDS Engine           │         │
│  └──────────────┘     │  - Tree conversion           │         │
│                       │  - Edit distance calc        │         │
│                       │  - Score computation         │         │
│                       └──────────────────────────────┘         │
│                                      │                          │
│                                      ▼                          │
│                             ┌──────────────┐                    │
│                             │   Results    │                    │
│                             │   Report     │                    │
│                             └──────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 디렉토리 구조

```
test-vlm-document-parsing/
├── src/
│   ├── evaluation/
│   │   ├── __init__.py
│   │   ├── teds.py              # TEDS 계산 엔진 (NEW)
│   │   ├── table_extractor.py   # MD에서 테이블 추출 (NEW)
│   │   ├── md_to_html.py        # 마크다운 → HTML 변환 (NEW)
│   │   ├── table_matcher.py     # 테이블 매칭 로직 (NEW)
│   │   ├── structure_f1.py      # 기존 Structure F1
│   │   └── metrics.py           # 통합 메트릭 인터페이스
│   └── ...
├── data/
│   ├── ground_truth/
│   │   ├── README.md            # GT 작성 가이드라인 (NEW)
│   │   ├── test_1_tables.json   # GT HTML 테이블 (NEW)
│   │   ├── test_2_tables.json   # (NEW)
│   │   └── test_3_tables.json   # (NEW)
│   └── ...
└── tests/
    ├── test_teds.py             # TEDS 단위 테스트 (NEW)
    ├── test_table_extractor.py  # 추출기 테스트 (NEW)
    └── test_md_to_html.py       # 변환기 테스트 (NEW)
```

> **Note**: 실제 구현 전 프로젝트 구조 확인 필요. 위 구조는 제안사항.

### 3.3 데이터 스키마

#### Ground Truth JSON 스키마 (v1.0)
```json
{
  "schema_version": "1.0",
  "document_id": "test_3",
  "source": "Attention Is All You Need (Vaswani et al., 2017)",
  "tables": [
    {
      "table_id": "table_1",
      "page": 5,
      "description": "Table 1: Maximum path lengths, per-layer complexity...",
      "html": "<table><thead><tr><th>Layer Type</th><th>Complexity</th></tr></thead><tbody><tr><td>Self-Attention</td><td>O(n²·d)</td></tr></tbody></table>",
      "cell_count": 12,
      "row_count": 4,
      "col_count": 4
    }
  ],
  "total_tables": 2,
  "created_at": "2026-01-29",
  "created_by": "Hyeongseob Kim"
}
```

### 3.4 핵심 알고리즘

#### 테이블 추출 (정규식 기반)
```python
import re

TABLE_PATTERN = re.compile(
    r'^\|(.+\|)+\s*\n'      # 헤더 행
    r'^\|[-:| ]+\|\s*\n'     # 구분선
    r'(^\|(.+\|)+\s*\n)+',   # 본문 행들
    re.MULTILINE
)

def extract_tables(markdown: str) -> list[str]:
    """마크다운에서 테이블 블록 추출"""
    return TABLE_PATTERN.findall(markdown)
```

#### TEDS 계산 (PubTabNet 기반)
```python
def compute_teds(pred_html: str, gt_html: str, structure_only: bool = False) -> float | None:
    """
    Tree Edit Distance-based Similarity 계산

    Args:
        pred_html: 예측된 HTML 테이블
        gt_html: Ground Truth HTML 테이블
        structure_only: True면 TEDS-S (구조만), False면 TEDS (구조+내용)

    Returns:
        0.0 ~ 1.0 사이의 유사도 점수, 실패 시 None
    """
    try:
        pred_tree = html_to_tree(pred_html, structure_only)
        gt_tree = html_to_tree(gt_html, structure_only)
    except ParseError as e:
        logger.error(f"HTML 파싱 실패: {e}")
        return None

    edit_distance = tree_edit_distance(pred_tree, gt_tree)
    max_size = max(len(pred_tree), len(gt_tree))

    if max_size == 0:
        return 1.0  # 둘 다 빈 테이블

    return 1.0 - (edit_distance / max_size)
```

#### 테이블 매칭
```python
def match_tables(
    pred_tables: list[str],
    gt_tables: list[dict]
) -> list[tuple[str | None, dict]]:
    """
    예측 테이블과 GT 테이블 매칭 (순서 기반)

    Returns:
        [(pred_html, gt_info), ...] - pred가 None이면 미검출
    """
    results = []
    for i, gt in enumerate(gt_tables):
        if i < len(pred_tables):
            results.append((pred_tables[i], gt))
        else:
            results.append((None, gt))  # 미검출 → TEDS = 0
            logger.warning(f"테이블 {gt['table_id']} 미검출")

    if len(pred_tables) > len(gt_tables):
        logger.warning(f"예측 테이블 {len(pred_tables) - len(gt_tables)}개 초과 (무시)")

    return results
```

---

## 4. 구현 계획

### 4.1 마일스톤

| Phase | 작업 | 산출물 | 기간 | 의존성 |
|-------|------|--------|------|--------|
| **Phase 0** | 프로젝트 구조 확인 | 구조 문서화 | 0.5일 | - |
| **Phase 1** | Ground Truth 준비 | test_3 테이블 HTML, 가이드라인 | 1일 | Phase 0 |
| **Phase 2** | 테이블 추출기 | `table_extractor.py` | 0.5일 | Phase 0 |
| **Phase 3** | MD → HTML 변환기 | `md_to_html.py` | 0.5일 | Phase 2 |
| **Phase 4** | TEDS 엔진 통합 | `teds.py` | 1일 | Phase 3 |
| **Phase 5** | 테이블 매칭 & 에러처리 | `table_matcher.py` | 0.5일 | Phase 4 |
| **Phase 6** | 평가 파이프라인 통합 | `evaluate.py` 수정 | 0.5일 | Phase 5 |
| **Phase 7** | 테스트 & 검증 | 단위 테스트, 결과 검증 | 0.5일 | Phase 6 |
| **Phase 8** | Tech Report 업데이트 | HTML 문서 수정 | 0.5일 | Phase 7 |

**총 예상 기간: 5.5일**

### 4.2 의존성

| 라이브러리 | 버전 | 용도 | 필수 |
|-----------|------|------|------|
| `apted` | 1.0.3+ | Tree Edit Distance 계산 | Yes |
| `lxml` | 4.9+ | HTML 파싱 | Yes |
| `mistune` | 3.0+ | MD → HTML 변환 | Yes |

### 4.3 테스트 전략

| 테스트 유형 | 대상 | 케이스 |
|------------|------|--------|
| 단위 테스트 | `table_extractor.py` | 정상 테이블, 빈 문서, 깨진 테이블 |
| 단위 테스트 | `md_to_html.py` | 헤더/본문 분리, 정렬 속성, 특수문자 |
| 단위 테스트 | `teds.py` | 동일 테이블(=1.0), 완전 다름(≈0), 부분 일치 |
| 통합 테스트 | 전체 파이프라인 | test_3 문서 end-to-end |

---

## 5. 리스크 및 완화 방안

| 리스크 | 발생 확률 | 영향도 | 완화 방안 |
|--------|----------|--------|----------|
| 마크다운 테이블 파싱 오류 | 중 | 중 | 정규식 + 라이브러리 이중 검증 |
| 복잡한 테이블 (셀 병합) 처리 불가 | 중 | 낮 | P2로 분류, 단순 테이블 우선 |
| PubTabNet 코드 호환성 문제 | 중 | 중 | 사전 테스트, 필요시 재구현 |
| Baseline 출력에서 테이블 검출 불가 | 높 | 중 | N/A 처리 로직으로 대응 |
| 테이블 수 불일치 | 중 | 중 | 부분 매칭 전략 적용 |
| GT HTML 작성 오류 | 낮 | 높 | 가이드라인 + 검증 스크립트 |

---

## 6. 성공 기준

### 6.1 정량적 기준
- [ ] test_3 (Attention Is All You Need) 테이블 2개에 대해 TEDS/TEDS-S 점수 산출
- [ ] Advanced (VLM) TEDS > 0.5
- [ ] Baseline은 "N/A (구조 없음)"으로 정확히 처리

### 6.2 정성적 기준
- [ ] Tech Report에 TEDS 결과 섹션 추가 완료
- [ ] 에러 케이스에서 적절한 로깅 및 처리 확인
- [ ] 단위 테스트 커버리지 > 80%

---

## 7. 참고 자료

- [PubTabNet GitHub](https://github.com/ibm-aur-nlp/PubTabNet) - TEDS 공식 구현
- [Upstage dp-bench](https://huggingface.co/datasets/upstage/dp-bench) - 벤치마크 데이터셋
- [arXiv: Image-based table recognition](https://arxiv.org/abs/1911.10683) - TEDS 논문

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 0.1 | 2026-01-29 | 초안 작성 | Hyeongseob Kim |
| 0.2 | 2026-01-29 | Digging 결과 반영: 테이블 매칭, 에러 처리, Baseline 처리, GT 가이드라인 추가 | Hyeongseob Kim |
