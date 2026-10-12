---
'@junhadex/theme-neutral': minor
'@junhadex/tokens': minor
'@junhadex/core': minor
---

레이아웃 컴포넌트 8종과 오버레이·내비게이션 슬롯을 추가한다.

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
