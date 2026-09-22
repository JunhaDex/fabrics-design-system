# @junhadex/tokens

fabrics 디자인 시스템의 원시(primitive) 토큰과 의미(semantic) 슬롯 정의.
DTCG 형식 JSON을 Style Dictionary v5로 빌드해 CSS 변수와 Tailwind `@theme`
블록을 생성한다.

토큰 값은 이 패키지가 아니라 테마 패키지(`@junhadex/theme-<name>`)가 채운다.
소비 프로젝트는 보통 이 패키지를 직접 설치하지 않고 테마 패키지를 import한다.

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
pnpm add @junhadex/tokens
```

## exports

| 경로 | 내용 |
|---|---|
| `@junhadex/tokens/primitives.css` | 원시 토큰 CSS 변수 |
| `@junhadex/tokens/bridge.css` | 의미 슬롯 → Tailwind `@theme` 매핑 |
| `@junhadex/tokens/sd.config.js` | 테마 패키지가 재사용하는 Style Dictionary 설정 |
