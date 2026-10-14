import StyleDictionary from 'style-dictionary'
import { readFile, writeFile } from 'node:fs/promises'
import { primitives, slots, isSlot, isDuration, cssPlatform } from './sd.config.js'

const dist = (file) => new URL(`dist/${file}`, import.meta.url)
const fromFile = (file) => (t) => t.filePath.endsWith(file)

/**
 * 테마 패키지 빌드. 테마 디렉터리(cwd)의 `tokens/theme.json`, `tokens/semantic/<mode>.json`,
 * `src/layer.css` 를 읽어 두 파일을 만든다.
 * - `dist/theme.css`: 소비 프로젝트용. `:root` 에 테마를 건다.
 * - `dist/theme.scoped.css`: 여러 테마를 한 문서에서 전환하는 미리보기(Storybook)용.
 *   `[data-theme="<name>"]` 아래에 슬롯 값과 레이어만 담는다. 원시 토큰·브리지·모션은
 *   테마와 무관하므로 `@junhadex/tokens` 에서 한 번만 가져온다.
 *
 * @param {string} name 테마 이름(`data-theme` 값)
 * @param {Record<string, string>} modes 모드 → color-scheme. 첫 모드가 `:root` 기본값이다.
 */
export const buildTheme = async (name, modes) => {
  const scope = `[data-theme="${name}"]`
  const [base] = Object.keys(modes)

  for (const [mode, colorScheme] of Object.entries(modes)) {
    const files = [
      {
        destination: `mode-${mode}.css`,
        format: 'css/mode-variables',
        filter: fromFile(`${mode}.json`),
        options: { selector: `[data-mode="${mode}"]`, colorScheme },
      },
      {
        destination: `scoped-mode-${mode}.css`,
        format: 'css/mode-variables',
        filter: fromFile(`${mode}.json`),
        options: { selector: `${scope}[data-mode="${mode}"]`, colorScheme },
      },
    ]
    // 기본 모드 블록에는 모든 슬롯(테마 기본값 + 기본 모드 색상)을 채운다.
    if (mode === base) {
      files.push(
        {
          destination: 'root.css',
          format: 'css/mode-variables',
          filter: isSlot,
          options: { selector: ':root', colorScheme },
        },
        {
          destination: 'scoped-root.css',
          format: 'css/mode-variables',
          filter: isSlot,
          options: { selector: scope, colorScheme },
        },
        // 스코프 값은 :root 의 reduced-motion 덮어쓰기보다 우선하므로 같은 스코프로 다시 건다.
        {
          destination: 'scoped-reduced-motion.css',
          format: 'css/reduced-motion',
          filter: isDuration,
          options: { selector: scope },
        },
      )
    }
    // include: 원시 토큰 + 슬롯 기본값, source: 테마 룩앤필 + 모드 값 (source 가 include 를 덮어쓴다).
    await new StyleDictionary({
      include: [primitives, slots],
      source: ['tokens/theme.json', `tokens/semantic/${mode}.json`],
      platforms: { css: cssPlatform(files) },
    }).buildAllPlatforms()
  }

  const read = (p) => readFile(p, 'utf8')
  const modeFiles = Object.keys(modes)
  const layer = await read('src/layer.css')

  // 소비 프로젝트가 @import 한 줄로 쓰도록 단일 theme.css 로 합친다.
  const css = await Promise.all([
    read(dist('primitives.css')),
    read(dist('bridge.css')),
    read(new URL('src/motion.css', import.meta.url)),
    read('dist/root.css'),
    ...modeFiles.map((m) => read(`dist/mode-${m}.css`)),
    // 슬롯 값을 덮어써야 하므로 테마 값(root/mode)보다 뒤에 온다.
    read(dist('reduced-motion.css')),
  ])
  await writeFile('dist/theme.css', [...css, layer].join('\n'))

  // 레이어는 nesting 으로 스코프 아래에 둔다. 따라서 레이어에는 스타일 규칙만 쓴다.
  const scoped = await Promise.all([
    read('dist/scoped-root.css'),
    ...modeFiles.map((m) => read(`dist/scoped-mode-${m}.css`)),
    read('dist/scoped-reduced-motion.css'),
  ])
  await writeFile('dist/theme.scoped.css', [...scoped, `${scope} {\n${layer}}\n`].join('\n'))
  console.log('✔︎ dist/theme.css, dist/theme.scoped.css')
}
