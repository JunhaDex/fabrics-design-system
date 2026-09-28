# @junhadex/core

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
