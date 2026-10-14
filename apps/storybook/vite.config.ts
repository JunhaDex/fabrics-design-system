/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { themes } from './.storybook/themes.ts'
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // 테마마다 프로젝트 하나. preview.tsx 가 VITE_THEME 으로 시작 테마를 정한다.
    // neutral 의 정확한 값을 고정한 스토리는 neutral-only 태그로 다른 테마에서 뺀다.
    projects: themes.map((theme) => ({
      extends: true,
      define: { 'import.meta.env.VITE_THEME': JSON.stringify(theme) },
      plugins: [
        // The plugin will run tests for the stories defined in your Storybook config
        // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
        storybookTest({
          configDir: path.join(dirname, '.storybook'),
          tags: theme === 'neutral' ? undefined : { exclude: ['neutral-only'] },
        }),
      ],
      test: {
        name: `storybook:${theme}`,
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [
            {
              browser: 'chromium',
            },
          ],
        },
      },
    })),
  },
})
