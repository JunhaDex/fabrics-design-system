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

## 사용

```tsx
import { Button } from '@junhadex/core'

<Button variant="primary" size="md">저장</Button>
<Button asChild variant="ghost"><a href="/docs">문서</a></Button>
```

`variant`: `primary` | `secondary` | `danger` | `ghost` (기본 `primary`)
`size`: `sm` | `md` | `lg` (기본 `md`)

`className`은 레이아웃 속성(margin, width, grid 배치 등)만 병합된다. 색상·radius
등 룩앤필은 토큰과 variant prop으로만 제어한다.
