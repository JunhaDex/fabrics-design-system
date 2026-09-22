@../../CLAUDE.md
@../../docs/ssot/org-principles.md
@../../docs/ssot/repo-architecture.md

# common-design (fabrics-design-system)

fabrics 공통 디자인 시스템. 조직 공통 원칙은 위 `@import`로 상속하며, 이 파일은
프로젝트 고유 사항만 기술한다.

## 목적
다양한 스타일을 **테마(빌드 시점)** 와 **모드(런타임)** 두 층위로 지원하는
React 컴포넌트 라이브러리를 npm 패키지로 제공한다.

## 스택
| 영역 | 선택 |
|---|---|
| 언어 / 런타임 | TypeScript 6.x (7.x는 tsdown dts 미지원으로 보류), React 19 |
| 패키지 관리 | pnpm workspace + catalog, Turborepo |
| 프리미티브 | 통합 `radix-ui` 패키지 (개별 `@radix-ui/react-*` 사용 금지) |
| 스타일링 | Tailwind v4 (`@theme` + CSS 변수), `tailwind-variants` (slots, 내장 conflict resolution) |
| 토큰 | DTCG 형식 JSON, Style Dictionary v5로 CSS 변수/`@theme` 생성 |
| 번들러 | tsdown (`dts: true`) |
| 개발/문서 | Storybook 10 (Vite builder, docs/test/a11y). 로컬 `storybook dev` 기준, 자체 호스트 예정 |
| 테스트 | Vitest (Storybook Vitest addon) |
| 버전/배포 | changesets + GitHub Actions `changesets/action`, GitHub Packages (`@junhadex/*`, public) |
| 달력 | `react-day-picker` v9 (Radix에 Calendar 프리미티브가 없음) |

## 워크스페이스 구조
```
packages/tokens      DTCG 원시(primitive) 토큰 + 의미(semantic) 토큰 슬롯 정의 + Style Dictionary 빌드 파이프라인
packages/core        Radix 기반 컴포넌트. 테마와 무관한 단일 코드, 토큰 슬롯만 참조
themes/<name>        테마 패키지. 슬롯에 값을 채우는 토큰 + 선택적 스타일 레이어 CSS
apps/storybook       Storybook 문서 사이트 (토큰 SSOT 시각화)
```

## todo 관리
작업이 진행되면 루트 `../../docs/common-design-todo.md`를 실시간으로 갱신한다.
구조와 릴리스 시 처리는 `../../docs/TODO.md`의 "프로젝트 todo 파일" 절을 따른다.
시행착오는 기록하지 않고 최종 결정만 남긴다.

## 도메인 규칙 (grill me 결정 사항, 2026-09-22)
- **테마**: 룩앤필 단위. 소비 프로젝트가 빌드 시점에 하나만 import한다.
  밀도(compact/comfortable)는 테마에 고정한다.
  v1: `neutral`(기준), `brutalism`, `tactile-surface`. glassmorphism, liquid-glass는 이후 버전.
- **모드**: light / dark / corporate 등 값 집합. `data-mode` 속성으로 런타임 전환한다.
- **플랫폼 변형**: 테마·모드가 아니라 모든 테마가 반응형으로 대응한다.
- **토큰으로 환원되지 않는 효과**: 테마 패키지가 선택적 스타일 레이어로 동반한다.
  벤토 그리드 등 레이아웃 패턴은 테마가 아니라 `core`의 레이아웃 컴포넌트다.
- **className 오버라이드**: 레이아웃 속성(margin, width, grid 배치 등)만 병합 허용.
  색상·radius 등 룩앤필은 토큰과 variant prop으로만 제어한다.
- **토큰 SSOT**: 코드(`packages/tokens`, `themes/*`). Storybook으로 시각화. Figma는 추후.
- **컴포넌트 범위와 순서**: v0.2 폼/피드백 → v0.3 데이터 표시 → v0.4 레이아웃(모달,
  푸터, top nav, side nav, columns, 벤토 그리드) → v0.5 추가 테마 → v0.6 fabrics 도메인.
  컴포넌트를 먼저 쌓고 테마를 나중에 만든다. 버전별 목록은 `../../docs/common-design-todo.md`.
- **core 제외 대상**: Card, Avatar는 프로젝트별로 정의하므로 core에 넣지 않는다.
  fabrics 도메인 컴포넌트 목록은 첫 소비 프로젝트 기획 시 정의한다.
- **소비 프로젝트 계약**: Tailwind v4 필수. `@import "tailwindcss"` +
  `@import "@junhadex/theme-<name>/theme.css"` + `@source "…/@junhadex/core/dist"`.
- **DatePicker 구성**: Radix Popover + `react-day-picker` Calendar + Input 조합.
  Calendar의 classNames 주입으로 토큰 슬롯을 적용한다.
- **접근성·브라우저**: WCAG 2.2 AA, evergreen 최근 2개 메이저.

## 컴포넌트 완료 기준 (Definition of Done)
컴포넌트 하나는 아래 세 가지를 모두 갖춰야 todo에서 완료로 체크한다.
1. Storybook 스토리 (variant·size·상태를 controls로 노출)
2. `addon-a11y` 검사 통과 (`preview.tsx`의 `a11y.test`는 `'error'`로 유지)
3. Vitest 상호작용 테스트 (`addon-vitest`, `play` 함수 또는 별도 spec)
