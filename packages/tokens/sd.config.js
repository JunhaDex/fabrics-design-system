import StyleDictionary from 'style-dictionary'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/** 원시 토큰 소스 glob. 테마 패키지가 include 한다. */
export const primitives = `${root}tokens/primitives/*.json`
/** 의미 슬롯 정의(기본값). 테마 패키지가 include 하고 source 로 덮어쓴다. */
export const slots = `${root}tokens/semantic/slots.json`

export const isSlot = (t) => t.path[0] === 'sem'
export const isPrimitive = (t) => !isSlot(t)

const line = (t) => `  --${t.name}: ${t.$value};`
/** `{a.b.c}` 참조를 `var(--a-b-c)` 로 바꾼다. 참조가 아니면 변환된 값을 그대로 쓴다. */
const refOrValue = (t) => {
  const o = t.original.$value
  return typeof o === 'string' && /^\{[^}]+\}$/.test(o)
    ? `var(--${o.slice(1, -1).replaceAll('.', '-')})`
    : t.$value
}

// primitives → @theme (Tailwind 유틸리티 생성)
StyleDictionary.registerFormat({
  name: 'css/tailwind-theme',
  format: ({ dictionary }) => `@theme {\n${dictionary.allTokens.map(line).join('\n')}\n}\n`,
})

export const isDuration = (t) => isSlot(t) && t.path[1] === 'duration'

// slots → @theme inline (--color-surface: var(--sem-color-surface))
// Tailwind v4 에 --duration-* 네임스페이스가 없어 duration 슬롯만 유틸리티가
// 생성되지 않는다. 같은 이름의 정적 유틸리티를 직접 정의한다
// (내장 duration-150 / duration-[3s] 와 공존한다).
// 내장 duration-* 는 --tw-duration 과 transition-duration 을 함께 설정하고
// transition-* 유틸리티가 그 변수를 읽는다. 같은 계약을 맞춘다.
StyleDictionary.registerFormat({
  name: 'css/tailwind-bridge',
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens.map((t) => `  --${t.name.slice(4)}: var(--${t.name});`)
    const utilities = dictionary.allTokens
      .filter(isDuration)
      .map(
        (t) =>
          `@utility ${t.name.slice(4)} {\n  --tw-duration: var(--${t.name});\n  transition-duration: var(--${t.name});\n}`,
      )
    return `@theme inline {\n${vars.join('\n')}\n}\n\n${utilities.join('\n\n')}\n`
  },
})

// 모션 무력화는 슬롯 한 곳에서 건다. 테마가 채운 값보다 뒤에 와야 이긴다.
StyleDictionary.registerFormat({
  name: 'css/reduced-motion',
  format: ({ dictionary }) =>
    `@media (prefers-reduced-motion: reduce) {\n  :root {\n${dictionary.allTokens
      .map((t) => `    --${t.name}: 1ms;`)
      .join('\n')}\n  }\n}\n`,
})

// slots 값 → selector 블록 (:root / [data-mode="..."]) 런타임 전환용
StyleDictionary.registerFormat({
  name: 'css/mode-variables',
  format: ({ dictionary, options }) =>
    `${options.selector} {\n${dictionary.allTokens
      .map((t) => `  --${t.name}: ${refOrValue(t)};`)
      .join('\n')}\n}\n`,
})

/** 공용 css 플랫폼 설정 */
export const cssPlatform = (files, buildPath = 'dist/') => ({
  transformGroup: 'css',
  buildPath,
  files,
})
