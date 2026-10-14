# @junhadex/theme-tactile-surface

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
