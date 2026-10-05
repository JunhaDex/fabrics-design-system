# @junhadex/core

fabrics 디자인 시스템 컴포넌트. Radix 프리미티브 + tailwind-variants 기반이며,
테마와 무관한 단일 코드로 토큰 슬롯만 참조한다.

## 설치

GitHub Packages에서 배포한다. 저장소 루트 `.npmrc`에 스코프 레지스트리를 지정한다.

```
@junhadex:registry=https://npm.pkg.github.com
```

GitHub Packages는 공개 패키지도 인증을 요구하므로, `~/.npmrc`에
`read:packages` 권한 토큰을 추가한다.

```
//npm.pkg.github.com/:_authToken=<PAT>
```

```
pnpm add @junhadex/core @junhadex/theme-neutral
```

## 소비 프로젝트 계약

Tailwind v4가 필수다. 앱의 CSS 진입점에 아래를 추가한다.

```css
@import "tailwindcss";
@import "@junhadex/theme-neutral/theme.css";
@source "../node_modules/@junhadex/core/dist";
```

Toast를 쓴다면 앱 루트를 `<ToastProvider>`로 감싼다. 토스트는 이 안에서만 화면에
나타난다.

```tsx
import { ToastProvider } from '@junhadex/core'

<ToastProvider>{children}</ToastProvider>
```

## 컴포넌트

**폼**: Label, Input, Textarea, Field, Checkbox, RadioGroup, Switch, Select,
Slider, Toggle, ToggleGroup

**피드백**: Alert, Toast, Tooltip, Popover, Progress, Spinner, Skeleton

**데이터 표시**: Badge, Separator, Tabs, Accordion, Table, DataTable

**그 외**: Button, Icon

## 사용

```tsx
import { Button, Field, Input, Select, toast } from '@junhadex/core'

<Button variant="primary" size="md">저장</Button>
<Button asChild variant="ghost"><a href="/docs">문서</a></Button>
```

Radix 다중 파트 프리미티브도 props를 받는 단일 컴포넌트로 감쌌다. 컴파운드
파트는 노출하지 않는다.

```tsx
<Select options={[{ value: 'cotton', label: '면' }]} placeholder="소재 선택" />
```

`Field`가 레이블·설명·오류의 접근성 연결을 대신한다. 컨트롤에 id를 직접 줄
필요가 없고, `error`를 주면 `aria-invalid`가 함께 선다.

```tsx
<Field label="이름" description="실명을 입력하세요." error="이름은 필수입니다." required>
  <Input />
</Field>
```

토스트는 명령형으로 띄운다. 동시에 3개까지 보이고 넘치면 오래된 것부터 밀려난다.

```tsx
toast.success('저장되었습니다')
toast.danger('저장하지 못했습니다', { description: '잠시 후 다시 시도하세요.' })
```

표는 `columns`/`rows`로 정의한다. `Table`은 상태가 없는 정적 표이고, `DataTable`이
정렬·선택·페이지네이션을 붙인다. 행 식별은 `getRowId`가 필수다 — 정렬 후에도 선택이
같은 행에 남으려면 index로는 안 된다.

```tsx
import { DataTable, type DataTableColumn } from '@junhadex/core'

const columns: DataTableColumn<Fabric>[] = [
  { key: 'code', header: '품번', cell: (row) => row.code },
  { key: 'name', header: '품명', cell: (row) => row.name, sortValue: (row) => row.name },
  { key: 'width', header: '폭(cm)', cell: (row) => row.width, align: 'end', sortValue: (row) => row.width },
]

<DataTable
  aria-label="원단 목록"
  columns={columns}
  rows={rows}
  getRowId={(row) => row.code}
  selectable
  paginated
/>
```

`sortValue`가 있는 열만 정렬 가능하다. 페이지네이션은 클라이언트 사이드이므로
`rows`에 전체 목록을 넘긴다. 서버가 잘라 준 한 페이지를 넘기면 다시 잘린다.

접근 가능한 이름(`caption` 또는 `aria-label`)을 주면 가로 스크롤 영역이
`role="region"`이 되어 키보드로 스크롤할 수 있다.

## 규칙

`className`은 레이아웃 속성(margin, width, grid 배치 등)만 병합된다. 색상·radius
등 룩앤필은 토큰과 variant prop으로만 제어한다.

폼 컨트롤의 오류 상태는 별도 prop이 아니라 `aria-invalid`로 제어한다. 단독
사용과 `Field` 경유가 같은 경로를 탄다.

아이콘은 `lucide` 코어 데이터를 `<Icon>`이 그린다. `icon` prop은 `ReactNode`라
커스텀 SVG도 받는다.

```tsx
import { Icon } from '@junhadex/core'
import { Check } from 'lucide'

<Icon node={Check} />
```
