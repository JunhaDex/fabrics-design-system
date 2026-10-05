import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Accordion, type AccordionItem } from '@junhadex/core'

const items: AccordionItem[] = [
  { value: 'spec', label: '규격', content: '폭 150cm, 중량 220g/㎡' },
  { value: 'care', label: '관리', content: '30도 이하 손세탁' },
  { value: 'stock', label: '재고', content: '3개 창고 보유' },
]

const meta = {
  title: 'Core/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  args: { items },
  render: (args) => (
    <div className="w-80">
      <Accordion {...args} />
    </div>
  ),
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** 한 번에 하나만 열린다. `collapsible` 없이는 열린 항목을 닫을 수 없다. */
export const Single: Story = {
  args: { type: 'single', collapsible: true, defaultValue: 'spec', onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const spec = canvas.getByRole('button', { name: '규격' })
    await expect(spec).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(canvas.getByRole('button', { name: '관리' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('care')
    await waitFor(() => expect(spec).toHaveAttribute('aria-expanded', 'false'))
  },
}

/** 여러 항목이 동시에 열린다. 콜백은 배열을 받는다. */
export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['spec'], onValueChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '관리' }))

    await expect(args.onValueChange).toHaveBeenCalledWith(['spec', 'care'])
    await expect(canvas.getByRole('button', { name: '규격' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await expect(canvas.getByRole('button', { name: '관리' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  },
}

/** Radix Header 기본값은 `<h3>` 이다. 페이지 제목 구조에 맞춰 바꾼다. */
export const HeadingLevel: Story = {
  args: { type: 'single', collapsible: true, headingLevel: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(3)
  },
}

/**
 * Radix Collapsible 은 마운트 직후 한 프레임 동안 애니메이션을 억제한다(첫 렌더에
 * 열림 전환이 번지는 것을 막기 위해). 억제 플래그는 rAF 에서 풀리므로, 전환을
 * 검증하려면 클릭 전에 프레임을 넘겨야 한다. 실제 사용자는 한 프레임 안에
 * 클릭할 수 없어 제품 동작과는 무관하다.
 */
const nextFrame = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  )

/** 높이 전환은 Radix 가 심는 `--radix-accordion-content-height` 를 읽는다. */
export const HeightTransition: Story = {
  args: { type: 'single', collapsible: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await nextFrame()
    await userEvent.click(canvas.getByRole('button', { name: '규격' }))

    const region = canvas.getByRole('region', { name: '규격' })
    await waitFor(() => expect(getComputedStyle(region).animationName).toBe('accordion-down'))

    const style = getComputedStyle(region)
    // 측정값이 들어와야 keyframes 의 to { height } 가 해석된다.
    await expect(style.getPropertyValue('--radix-accordion-content-height')).toMatch(/^[\d.]+px$/)
    // --sem-duration-base 를 참조한다.
    await expect(style.animationDuration).toBe('0.15s')
  },
}

/**
 * `prefers-reduced-motion` 은 `reduced-motion.css` 가 `:root` 의
 * `--sem-duration-base` 를 1ms 로 덮어 걸린다. 미디어 쿼리는 브라우저 테스트에서
 * 에뮬레이션할 수 없으므로 같은 선택자(`:root`)에 같은 슬롯을 덮어써서 확인한다.
 *
 * 덮어쓰기는 반드시 `:root` 에 해야 한다. `--animate-*` 안의 `var(--sem-duration-base)`
 * 는 그 커스텀 속성이 **선언된 요소**(`:root`)에서 치환되므로, 중간 래퍼에 슬롯을
 * 덮어써도 이미 치환이 끝난 값이 상속될 뿐 바뀌지 않는다.
 */
export const ReducedMotion: Story = {
  args: { type: 'single', collapsible: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = document.documentElement
    root.style.setProperty('--sem-duration-base', '1ms')

    try {
      await nextFrame()
      await userEvent.click(canvas.getByRole('button', { name: '규격' }))
      const region = canvas.getByRole('region', { name: '규격' })
      await waitFor(() => expect(getComputedStyle(region).animationDuration).toBe('0.001s'))
    } finally {
      root.style.removeProperty('--sem-duration-base')
    }
  },
}

/** 비활성 항목은 열 수 없다. */
export const Disabled: Story = {
  args: {
    type: 'single',
    collapsible: true,
    items: [items[0], { ...items[1], disabled: true }, items[2]],
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const care = canvas.getByRole('button', { name: '관리' })
    await expect(care).toBeDisabled()

    await userEvent.click(care, { pointerEventsCheck: 0 })
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}
