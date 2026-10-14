import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/index.css'
import { themes } from './themes'

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
  // 테마는 <html data-theme>, 모드(light/dark)는 <html data-mode> 로 런타임 전환한다.
  globalTypes: {
    theme: {
      description: '테마',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: themes,
        dynamicTitle: true,
      },
    },
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
  // 테스트는 프로젝트마다 VITE_THEME 을 넣는다(vite.config.ts). storybook dev 에서는 neutral 로 시작한다.
  initialGlobals: { theme: import.meta.env.VITE_THEME ?? 'neutral', mode: 'light' },
  decorators: [
    (Story, { globals }) => {
      // 테마가 없으면 모든 슬롯이 비므로 첫 렌더 전에 건다(mode 는 테마 블록이 기본값을 갖는다).
      document.documentElement.dataset.theme = globals.theme
      useEffect(() => {
        document.documentElement.dataset.mode = globals.mode
      }, [globals.mode])
      // 면·전경색은 index.css 가 body 에 건다(Portal 콘텐츠 때문). 여기는 여백만.
      return (
        <div className="p-6">
          <Story />
        </div>
      )
    },
  ],
}

export default preview
