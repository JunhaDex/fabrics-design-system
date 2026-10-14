# @junhadex/theme-neutral

fabrics 기준(neutral) 테마. `@junhadex/tokens`의 의미 슬롯에 값을 채우고
light/dark 모드를 제공한다.

테마는 빌드 시점에 하나만 선택하고, 모드는 `data-mode` 속성으로 런타임에
전환한다.

## 설치

```
@junhadex:registry=https://npm.pkg.github.com
```

GitHub Packages는 공개 패키지도 인증을 요구하므로, `~/.npmrc`에
`read:packages` 권한 토큰을 추가한다.

```
//npm.pkg.github.com/:_authToken=<PAT>
```

```
pnpm add @junhadex/theme-neutral
```

## 사용

```css
@import "tailwindcss";
@import "@junhadex/theme-neutral/theme.css";
@source "../node_modules/@junhadex/core/dist";
```

```html
<html data-mode="dark">
```

`theme.css`는 원시 토큰, 의미 슬롯, light/dark 모드를 포함한 단일 번들이다.

`theme.scoped.css`는 여러 테마를 한 문서에서 전환하는 미리보기(Storybook)용이다.
슬롯 값을 `[data-theme="neutral"]` 아래에만 담으므로, 원시 토큰·브리지·모션은
`@junhadex/tokens`에서 따로 가져온다. 소비 프로젝트는 `theme.css`를 쓴다.
