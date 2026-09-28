import storybook from 'eslint-plugin-storybook'
import react from './react.js'

/**
 * Storybook 앱 설정. `react` 기본 설정에 스토리 형식 검사를 더한다.
 * DoD 의 "Storybook 스토리 + 상호작용 테스트"를 도구가 직접 검증하게 한다.
 */
export default [...react, ...storybook.configs['flat/recommended']]
