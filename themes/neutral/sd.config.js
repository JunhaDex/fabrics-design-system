import { primitives, slots, cssPlatform } from '@junhadex/tokens/sd.config.js'

const fromFile = (file) => (t) => t.filePath.endsWith(file)

/**
 * 모드별 Style Dictionary 설정.
 * include: 원시 토큰 + 슬롯 기본값, source: 테마 룩앤필 + 모드 값 (source 가 include 를 덮어쓴다).
 */
export const modeConfig = (mode, files) => ({
  include: [primitives, slots],
  source: ['tokens/theme.json', `tokens/semantic/${mode}.json`],
  platforms: { css: cssPlatform(files) },
})

export const configs = [
  modeConfig('light', [
    // :root 에는 모든 슬롯(테마 기본값 + light 색상)을 채운다.
    { destination: 'root.css', format: 'css/mode-variables', filter: (t) => t.path[0] === 'sem', options: { selector: ':root' } },
    { destination: 'mode-light.css', format: 'css/mode-variables', filter: fromFile('light.json'), options: { selector: '[data-mode="light"]' } },
  ]),
  modeConfig('dark', [
    { destination: 'mode-dark.css', format: 'css/mode-variables', filter: fromFile('dark.json'), options: { selector: '[data-mode="dark"]' } },
  ]),
]
