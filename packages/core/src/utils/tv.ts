import { createTV } from 'tailwind-variants'

/**
 * spacing 슬롯 이름을 아는 `tv`. 내장 merge 는 `top-bar`·`w-nav` 같은 이름 있는 값을
 * spacing 으로 인식하지 못해 소비자의 `top-0`·`w-full` 과 충돌을 해소하지 않는다
 * (둘 다 남고 CSS 순서로 슬롯 값이 이긴다). `sem.spacing.*` 슬롯을 추가하면 여기에도 넣는다.
 */
export const tv = createTV({
  twMergeConfig: {
    theme: {
      spacing: [
        'control-x',
        'control-y',
        'stack',
        'field-gap',
        'cell-x',
        'cell-y',
        'bar',
        'nav',
        'press',
      ],
    },
  },
})
