import StyleDictionary from 'style-dictionary'
import { primitives, slots, isPrimitive, isSlot, cssPlatform } from './sd.config.js'

const sd = new StyleDictionary({
  source: [primitives, slots],
  platforms: {
    css: cssPlatform([
      { destination: 'primitives.css', format: 'css/tailwind-theme', filter: isPrimitive },
      { destination: 'bridge.css', format: 'css/tailwind-bridge', filter: isSlot },
    ]),
  },
})
await sd.buildAllPlatforms()
