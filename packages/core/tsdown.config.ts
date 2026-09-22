import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'browser',
  dts: true,
  // dependencies / peerDependencies 는 기본적으로 번들하지 않는다. jsx-runtime 만 명시한다.
  deps: { neverBundle: ['react/jsx-runtime'] },
})
