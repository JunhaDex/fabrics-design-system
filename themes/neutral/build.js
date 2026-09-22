import StyleDictionary from 'style-dictionary'
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { configs } from './sd.config.js'

const require = createRequire(import.meta.url)

for (const config of configs) await new StyleDictionary(config).buildAllPlatforms()

// 소비 프로젝트가 @import 한 줄로 쓰도록 단일 theme.css 로 합친다.
const parts = [
  require.resolve('@junhadex/tokens/primitives.css'),
  require.resolve('@junhadex/tokens/bridge.css'),
  'dist/root.css',
  'dist/mode-light.css',
  'dist/mode-dark.css',
  'src/layer.css',
]
const css = await Promise.all(parts.map((p) => readFile(p, 'utf8')))
await writeFile('dist/theme.css', css.join('\n'))
console.log('✔︎ dist/theme.css')
