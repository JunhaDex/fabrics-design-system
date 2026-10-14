# @junhadex/theme-neutral

## 0.5.0

### Minor Changes

- [#9](https://github.com/JunhaDex/fabrics-design-system/pull/9) [`3b9374d`](https://github.com/JunhaDex/fabrics-design-system/commit/3b9374d623b83dffdd1b46c5628b95aea837e027) Thanks [@JunhaDex](https://github.com/JunhaDex)! - 테마 2종(초안)을 추가하고, 테마가 룩앤필을 바꿀 수 있도록 슬롯을 넓힌다.
  
  **새 테마 (초안)**
  - `@junhadex/theme-brutalism` — 크림 면, 검정 선, 직각 모서리, 하드 오프셋 그림자. compact 밀도(sm 컨트롤 28px)
  - `@junhadex/theme-tactile-surface` — 한 색 면 위 밝은/어두운 그림자 쌍으로 볼록·오목을 표현. comfortable 밀도(sm 컨트롤 40px)
  - 테마 선택 안내는 `@junhadex/core` README 의 "테마" 절 참고. 소비 계약(`theme.css` 하나 import)은 그대로다
  
  **의미 슬롯 6개 추가** (56 → 62)
  - `sem.shadow.control` / `control-pressed`, `sem.spacing.press` — 면이 있는 컨트롤의 그림자와 누름 상태(이동 거리)
  - `sem.shadow.field` — 입력 필드·Checkbox·Radio·Switch 트랙
  - `sem.font.body` — 기본 글꼴. Tailwind `--default-font-family` 로 잇는다
  - `sem.color.border-field` — 필드 경계. WCAG 1.4.11(3:1)을 위해 일반 `border` 와 분리
  - neutral 은 새 그림자·이동 슬롯이 비어 있어 모양이 같다
  
  **모드별 `color-scheme`**
  모드 선택자 블록에 `color-scheme` 을 출력한다(light → `light`, dark → `dark`). 스크롤바·폼 컨트롤 기본 색이 모드를 따른다.
  
  **tokens**
  테마 빌드를 `@junhadex/tokens/build-theme.js` 의 `buildTheme(name, modes)` 로 공용화했다. `theme.css` 와 함께
  `[data-theme]` 스코프의 `theme.scoped.css` 를 생성한다(여러 테마를 한 페이지에서 전환하는 문서 사이트용).
  
  **기존 동작 변경 (neutral 에서 보임)**
  - 입력 필드(Input·Textarea·Select 트리거·Checkbox·Radio) 테두리가 `border-field`(gray-500)로 진해진다. 기존
    gray-200/300 은 대비 1.2–1.5:1 로 빈 필드를 알아보기 어려웠다
  - Alert·Accordion 이 `shadow.raised` 를 쓴다. neutral 값은 `none` 이라 모양은 같다
  - Checkbox radius 를 `min(control radius, 4px)` 로 제한한다. neutral 은 6px → 4px. radius 가 큰 테마에서 Checkbox 가
    원이 되어 Radio 와 구분되지 않던 문제를 고친다
  - Button·Toggle 에 `whitespace-nowrap`. 좁은 행에서 한글 레이블이 음절 단위로 두 줄로 갈라지던 문제를 고친다

### Patch Changes

- Updated dependencies [[`3b9374d`](https://github.com/JunhaDex/fabrics-design-system/commit/3b9374d623b83dffdd1b46c5628b95aea837e027)]:
  - @junhadex/tokens@0.5.0

## 0.4.0

### Minor Changes

- [#7](https://github.com/JunhaDex/fabrics-design-system/pull/7) [`ef8dec4`](https://github.com/JunhaDex/fabrics-design-system/commit/ef8dec4b6db26b06c48b4122236e3fff5977038f) Thanks [@JunhaDex](https://github.com/JunhaDex)! - 레이아웃 컴포넌트 8종과 오버레이·내비게이션 슬롯을 추가한다.
  
  **내비게이션**
  - `TopBar` — `brand`·`actions` 슬롯, sticky, 위쪽 safe-area
  - `SideNav` — `items` 배열, TopBar 아래 sticky(`top-0 h-dvh` 로 덮어쓰기), 활성은 면 색 + 굵기
  - `BottomTabBar` — 모바일 하단 탭, 하단 safe-area, 활성은 아이콘 뒤 표시자 + 굵기
  - 공통: `NavItem`(`current` 로 활성 판정은 소비자가 한다), `aria-label` 필수,
    `linkComponent` 로 라우터 링크를 끼운다. 반응형 전환은 `className`(`md:hidden` 등)으로 정한다
  
  **오버레이**
  - `Dialog` — `title`·`description`·`footer`·`trigger`, 제어/비제어. md 미만은 하단 시트,
    이상은 가운데 모달. footer 버튼으로 닫으려면 `open`/`onOpenChange` 로 제어한다
  - `AlertDialog` — `onConfirm`·`tone`(neutral/danger). 바깥 클릭으로 닫히지 않고 Esc 는 취소
  
  **레이아웃**
  - `Footer` — `children`(왼쪽) + `links`(오른쪽), `linkComponent`
  - `Columns` — `cols` 2·3·4. 놓인 영역 폭(컨테이너 쿼리, 48rem)으로 펼친다
  - `BentoGrid` — `items` 의 `colSpan`/`rowSpan` 으로 배치. 2열 → 4열(컨테이너 쿼리)
  
  **의미 슬롯 3개 추가** (53 → 56)
  - `sem.color.scrim` — 모달 뒤 배경. 투명도까지 슬롯 값에 담는다
  - `sem.spacing.bar` / `nav` — 바 높이(3.5rem), 사이드 내비 폭(14rem)
  - `motion.css` 에 `fade-in`/`fade-out`, `sheet-in`/`sheet-out` keyframes
  
  **기존 동작 변경**
  `Toast` viewport 를 `z-50` → `z-60` 으로 올리고 `pointer-events-auto` 를 줬다. 열린
  Dialog 에 가려지고, 모달이 body 에 거는 `pointer-events: none` 때문에 닫기 버튼을
  누를 수 없던 문제를 고친다.

### Patch Changes

- Updated dependencies [[`ef8dec4`](https://github.com/JunhaDex/fabrics-design-system/commit/ef8dec4b6db26b06c48b4122236e3fff5977038f)]:
  - @junhadex/tokens@0.4.0

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
