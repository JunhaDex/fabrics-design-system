import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  // 모드(light/dark)는 <html data-mode> 로 런타임 전환한다.
  globalTypes: {
    mode: {
      description: '테마 모드',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'light' },
  decorators: [
    (Story, { globals }) => {
      useEffect(() => {
        document.documentElement.dataset.mode = globals.mode
      }, [globals.mode])
      return (
        <div className="bg-surface text-on-surface p-6">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
