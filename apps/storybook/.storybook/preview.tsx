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
      // DoD: 컴포넌트는 a11y 검사를 통과해야 완료로 친다. 'error' 를 유지한다.
      // 'todo' 로 내리면 위반이 테스트 UI 에만 표시되고 CI 가 통과한다.
      test: 'error',
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
        <div className="bg-surface p-6 text-on-surface">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
