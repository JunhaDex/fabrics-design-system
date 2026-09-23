import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

const colors = [
  'surface',
  'surface-raised',
  'surface-overlay',
  'on-surface',
  'on-surface-muted',
  'brand',
  'brand-hover',
  'on-brand',
  'border',
  'border-strong',
  'ring',
  'danger',
  'on-danger',
  'success',
  'warning',
]

const meta = { title: 'Tokens/Semantic' } satisfies Meta

export default meta

export const Colors: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
      {colors.map((c) => (
        <div key={c} className="contents">
          <div
            className="size-8 rounded-control border border-border"
            style={{ background: `var(--color-${c})` }}
          />
          <code>--color-{c}</code>
        </div>
      ))}
    </div>
  ),
}

const motion = [
  // Tailwind 는 소스에서 완성된 클래스 문자열을 스캔한다. `duration-${d}` 처럼
  // 동적으로 조합하면 유틸리티가 생성되지 않으므로 리터럴로 적는다.
  { testId: 'fast', label: 'duration-fast', className: 'duration-fast transition-all' },
  { testId: 'base', label: 'duration-base', className: 'duration-base transition-all' },
  { testId: 'slow', label: 'duration-slow', className: 'duration-slow transition-all' },
  { testId: 'standard', label: 'ease-standard', className: 'ease-standard transition-all' },
  { testId: 'enter', label: 'ease-enter', className: 'ease-enter transition-all' },
  { testId: 'exit', label: 'ease-exit', className: 'ease-exit transition-all' },
  { testId: 'anim', label: 'animate-enter', className: 'animate-enter' },
]

/**
 * 모션 슬롯. Tailwind v4 에 `--duration-*` 네임스페이스가 없어 `duration-*` 은
 * 브리지 CSS 가 `@utility` 로 직접 정의한다. `ease-*` 와 `animate-*` 는
 * 네임스페이스가 있어 `@theme` 만으로 생성된다.
 */
export const Motion: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-2 text-sm">
      {motion.map((m) => (
        <div key={m.testId} className={m.className} data-testid={m.testId}>
          <code>{m.label}</code>
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const styleOf = (id: string) => getComputedStyle(canvas.getByTestId(id))

    // @utility 로 정의한 duration 유틸리티가 실제로 생성되는지 확인한다.
    await expect(styleOf('fast').transitionDuration).toBe('0.075s')
    await expect(styleOf('base').transitionDuration).toBe('0.15s')
    await expect(styleOf('slow').transitionDuration).toBe('0.25s')

    // ease-* 는 Tailwind 네임스페이스로 생성된다.
    await expect(styleOf('standard').transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)')
    await expect(styleOf('enter').transitionTimingFunction).toBe('cubic-bezier(0, 0, 0.2, 1)')
    await expect(styleOf('exit').transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 1, 1)')

    // keyframes + --animate-* 가 슬롯을 참조하는지 확인한다.
    await expect(styleOf('anim').animationName).toBe('enter')
    await expect(styleOf('anim').animationDuration).toBe('0.075s')
  },
}
