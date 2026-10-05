# @junhadex/theme-neutral

## 0.3.0

### Minor Changes

- [#5](https://github.com/JunhaDex/fabrics-design-system/pull/5) [`9d0c91d`](https://github.com/JunhaDex/fabrics-design-system/commit/9d0c91da382cb16ff0f9900d3d736e87ce8b9a86) Thanks [@JunhaDex](https://github.com/JunhaDex)! - 데이터 표시 컴포넌트 6종과 톤 매트릭스를 추가한다.
  
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

### Patch Changes

- Updated dependencies [[`9d0c91d`](https://github.com/JunhaDex/fabrics-design-system/commit/9d0c91da382cb16ff0f9900d3d736e87ce8b9a86)]:
  - @junhadex/tokens@0.3.0

## 0.2.0

### Minor Changes

- [#3](https://github.com/JunhaDex/fabrics-design-system/pull/3) [`7067294`](https://github.com/JunhaDex/fabrics-design-system/commit/7067294f8918219e6ebbceb9a0174aceaf28a9ab) Thanks [@JunhaDex](https://github.com/JunhaDex)! - 폼·피드백 컴포넌트 18종과 기반 레이어를 추가한다.
  
  **폼**: Label, Input, Textarea, Field, Checkbox, RadioGroup, Switch, Select, Slider, Toggle, ToggleGroup
  
  **피드백**: Alert, Toast, Tooltip, Popover, Progress, Spinner, Skeleton
  
  **기반 레이어**
  - 아이콘: `lucide` 코어 데이터 + `<Icon>` 렌더러. `icon` prop 은 `ReactNode` 라 커스텀 SVG 도 받는다
  - 모션: `sem.duration.*` / `sem.ease.*` 슬롯과 enter/exit 애니메이션. `prefers-reduced-motion` 은 슬롯 한 곳에서 걸린다
  
  **의미 슬롯 21개 추가** (22 → 43)
  - 입력/레일: `field`, `track`, `field-gap`
  - 톤: info/success/warning/danger 각각 `*-subtle` 과 `on-*-subtle`
  - 반전: `surface-inverse`, `on-surface-inverse`
  - 모션: `duration.fast/base/slow`, `ease.standard/enter/exit`
  
  **컴포넌트 API 규칙**
  - props 래핑 단일 컴포넌트로 통일한다. Radix 다중 파트 프리미티브도 `<Select options={…} />` 형태로 감싼다
  - 폼 컨트롤의 오류 상태는 별도 prop 없이 `aria-invalid` 하나를 근거로 삼는다
  - Toast 는 명령형 `toast()` API 를 쓴다. 앱 루트에 `<ToastProvider>` 가 하나 필요하다

### Patch Changes

- Updated dependencies [[`7067294`](https://github.com/JunhaDex/fabrics-design-system/commit/7067294f8918219e6ebbceb9a0174aceaf28a9ab)]:
  - @junhadex/tokens@0.2.0

## 0.1.1

### Patch Changes

- [`7decb97`](https://github.com/JunhaDex/fabrics-design-system/commit/7decb976701956ef425029b39a67e25e5b2fe4b2) Thanks [@JunhaDex](https://github.com/JunhaDex)! - 패키지별 README 추가 (레지스트리 페이지에 설치·사용법 노출)
- Updated dependencies [[`7decb97`](https://github.com/JunhaDex/fabrics-design-system/commit/7decb976701956ef425029b39a67e25e5b2fe4b2)]:
  - @junhadex/tokens@0.1.1

## 0.1.0

### Minor Changes

- [`4d1c889`](https://github.com/JunhaDex/fabrics-design-system/commit/4d1c889b85209b68760cdf81bd26f06be686eb00) Thanks [@JunhaDex](https://github.com/JunhaDex)! - v0.1 최초 골격: tokens(primitives/semantic, `@theme` CSS 변수), core(Button, layoutClass), theme-neutral(light/dark)

### Patch Changes

- Updated dependencies [[`4d1c889`](https://github.com/JunhaDex/fabrics-design-system/commit/4d1c889b85209b68760cdf81bd26f06be686eb00)]:
  - @junhadex/tokens@0.1.0
