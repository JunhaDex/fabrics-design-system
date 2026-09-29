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
            style={{ background: `var(--sem-color-${c})` }}
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

const tones = ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] as const
const appearances = ['solid', 'subtle', 'outline'] as const
type Tone = (typeof tones)[number]
type Appearance = (typeof appearances)[number]

/** `rgb(r, g, b)` / `rgba(...)` 문자열의 상대 휘도. */
const luminance = (color: string) =>
  (color.match(/[\d.]+/g) ?? [])
    .slice(0, 3)
    .map((v) => Number(v) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + [0.2126, 0.7152, 0.0722][i] * v, 0)

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// Tailwind 는 소스의 완성된 클래스 문자열만 스캔하므로 24키를 리터럴로 적는다.
// Badge 가 소비할 집합과 동일하다.
const toneClasses: Record<Tone, Record<Appearance, string>> = {
  neutral: {
    solid: 'bg-neutral text-on-neutral',
    subtle: 'bg-neutral-subtle text-on-neutral-subtle',
    outline: 'border border-neutral text-on-neutral-subtle',
  },
  brand: {
    solid: 'bg-brand text-on-brand',
    subtle: 'bg-brand-subtle text-on-brand-subtle',
    outline: 'border border-brand text-on-brand-subtle',
  },
  success: {
    solid: 'bg-success text-on-success',
    subtle: 'bg-success-subtle text-on-success-subtle',
    outline: 'border border-success text-on-success-subtle',
  },
  warning: {
    solid: 'bg-warning text-on-warning',
    subtle: 'bg-warning-subtle text-on-warning-subtle',
    outline: 'border border-warning text-on-warning-subtle',
  },
  danger: {
    solid: 'bg-danger text-on-danger',
    subtle: 'bg-danger-subtle text-on-danger-subtle',
    outline: 'border border-danger text-on-danger-subtle',
  },
  info: {
    solid: 'bg-info text-on-info',
    subtle: 'bg-info-subtle text-on-info-subtle',
    outline: 'border border-info text-on-info-subtle',
  },
}

/**
 * 톤 24키 매트릭스(6톤 × solid/subtle/outline). Badge 가 그대로 소비하는 집합이며,
 * 테마를 추가할 때 같은 키의 값만 다시 선언하면 된다.
 */
export const Tones: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[auto_1fr_1fr_1fr] items-center gap-2 text-sm">
      <div />
      {appearances.map((a) => (
        <code key={a}>{a}</code>
      ))}
      {tones.map((tone) => (
        <div key={tone} className="contents">
          <code>{tone}</code>
          {appearances.map((appearance) => (
            <div
              key={appearance}
              data-testid={`${tone}-${appearance}`}
              className={`rounded-control px-control-x py-control-y ${toneClasses[tone][appearance]}`}
            >
              {tone}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = document.documentElement
    const initial = root.dataset.mode
    // 텍스트 4.5:1, outline 테두리는 비텍스트 대비 3:1 (WCAG 2.2 AA).
    const failures: string[] = []

    for (const mode of ['light', 'dark']) {
      root.dataset.mode = mode
      const surface = getComputedStyle(document.body).backgroundColor
      for (const tone of tones) {
        for (const appearance of appearances) {
          const style = getComputedStyle(canvas.getByTestId(`${tone}-${appearance}`))
          // outline 은 면을 칠하지 않으므로 글자는 surface 위에 놓인다.
          const behind = appearance === 'outline' ? surface : style.backgroundColor
          const text = contrast(style.color, behind)
          if (text < 4.5) failures.push(`${mode} ${tone} ${appearance} text ${text.toFixed(2)}`)
          if (appearance === 'outline') {
            const border = contrast(style.borderTopColor, surface)
            if (border < 3) failures.push(`${mode} ${tone} outline border ${border.toFixed(2)}`)
          }
        }
      }
    }

    root.dataset.mode = initial ?? 'light'
    await expect(failures).toEqual([])
  },
}

/**
 * 표 셀 패딩 슬롯. Tailwind v4 의 `--spacing-*` 네임스페이스에 이름 있는 키를
 * 넣으면 `px-cell-x` 같은 유틸리티가 생성되는지 확인한다.
 */
export const Density: StoryObj = {
  render: () => (
    <div className="inline-block bg-surface-raised px-cell-x py-cell-y" data-testid="cell">
      <code>px-cell-x py-cell-y</code>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const style = getComputedStyle(within(canvasElement).getByTestId('cell'))
    await expect(style.paddingLeft).toBe('16px')
    await expect(style.paddingTop).toBe('8px')
  },
}
