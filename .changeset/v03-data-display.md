---
'@junhadex/theme-neutral': minor
'@junhadex/tokens': minor
'@junhadex/core': minor
---

데이터 표시 컴포넌트 6종과 톤 매트릭스를 추가한다.

**컴포넌트**
- `Badge` — tone 6종 × appearance(solid/subtle/outline) × size 2종
- `Separator` — horizontal/vertical, `decorative`
- `Tabs` — `items` 배열, `activationMode` 양쪽, horizontal/vertical, 넘침 시 가로 스크롤
- `Accordion` — `type` 판별 유니온(single/multiple), `headingLevel`, height 전환
- `Table` — 정적 표. `columns`/`rows`/`getRowId`, `caption`/`aria-label`, `loading`, `emptyMessage`
- `DataTable` — Table 에 단일 열 3-state 정렬, 다중 선택, 페이지네이션을 붙인 래퍼.
  모든 상태가 제어/비제어 양쪽을 지원한다

**의미 슬롯 12개 추가** (41 → 53)
- 톤 매트릭스를 6톤에 균일하게 채우는 색 10개: `neutral`, `on-neutral`,
  `neutral-subtle`, `on-neutral-subtle`, `brand-subtle`, `on-brand-subtle`,
  `on-success`, `on-warning`, `info`, `on-info`
- 표 셀 패딩 `sem.spacing.cell-x` / `cell-y`
- `motion.css` 에 `accordion-down` / `accordion-up` keyframes

**대비 기준 적용으로 기존 테마 값 4개 변경**
light `success` green.600 → green.700, light `warning` amber.500 → amber.600,
dark `on-brand` · `on-danger` white → gray.950. 솔리드 텍스트 4.5:1 과 outline
테두리 3:1 을 light/dark 양쪽에서 만족시킨다. **dark 모드에서 Button primary ·
danger 의 글자색이 흰색에서 어두운색으로 바뀐다.**

**알려진 제약**
서버 사이드 페이징·정렬은 지원하지 않는다. 페이지네이션은 `rows` 전체를 받아
잘라 쓰고, 제어형 정렬도 `sortValue` 로 다시 로컬 정렬한다.
