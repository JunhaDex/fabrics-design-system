---
'@junhadex/theme-neutral': minor
'@junhadex/tokens': minor
'@junhadex/core': minor
---

폼·피드백 컴포넌트 18종과 기반 레이어를 추가한다.

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
