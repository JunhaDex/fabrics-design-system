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

// slots → @theme inline (--color-surface: var(--sem-color-surface))
StyleDictionary.registerFormat({
  name: 'css/tailwind-bridge',
  format: ({ dictionary }) =>
    `@theme inline {\n${dictionary.allTokens
      .map((t) => `  --${t.name.slice(4)}: var(--${t.name});`)
      .join('\n')}\n}\n`,
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
