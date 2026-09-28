import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

/**
 * React 라이브러리/앱 공용 기본 설정.
 *
 * 타입 정보를 쓰지 않는(non type-aware) 규칙만 사용한다. `projectService` 를 켜면
 * 워크스페이스마다 타입 체커가 기동해 lint 시간이 수 배로 늘어나는데, 그 비용을
 * 감수할 만한 규칙(no-floating-promises 등) 요구가 아직 없다. 필요해지면
 * `tseslint.configs.recommendedTypeChecked` 와 `languageOptions.parserOptions.projectService`
 * 를 추가한다.
 *
 * 포매팅은 Prettier 가 전담하므로 `eslint-config-prettier` 를 마지막에 두어
 * 충돌하는 스타일 규칙을 모두 끈다.
 */
export default tseslint.config(
  { ignores: ['dist/', 'storybook-static/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat['recommended-latest'],
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  prettier,
)
