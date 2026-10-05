import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'
import { expect, within } from 'storybook/test'
import { Badge, type BadgeProps } from '@junhadex/core'

const meta = {
  title: 'Core/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: '배지' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

type Tone = NonNullable<BadgeProps['tone']>
type Appearance = NonNullable<BadgeProps['appearance']>

const tones: Tone[] = ['neutral', 'brand', 'success', 'warning', 'danger', 'info']
const appearances: Appearance[] = ['solid', 'subtle', 'outline']

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText('배지')
    await expect(badge).toHaveClass('bg-neutral-subtle', 'text-on-neutral-subtle')
  },
}

/**
 * 기대값 참조 요소. 브리지가 만드는 `--color-*` 는 `@theme inline` 이라 런타임에
 * 출력되지 않으므로, 원본 슬롯 `--sem-color-*` 를 인라인으로 참조한다.
 */
const refStyle = (tone: Tone, appearance: Appearance): CSSProperties =>
  appearance === 'solid'
    ? { backgroundColor: `var(--sem-color-${tone})`, color: `var(--sem-color-on-${tone})` }
    : appearance === 'subtle'
      ? {
          backgroundColor: `var(--sem-color-${tone}-subtle)`,
          color: `var(--sem-color-on-${tone}-subtle)`,
        }
      : {
          border: `1px solid var(--sem-color-${tone})`,
          color: `var(--sem-color-on-${tone}-subtle)`,
        }

/**
 * 24키 매트릭스를 전부 소비한다. play 는 각 배지의 계산색이 의도한 슬롯과
 * 일치하는지 참조 요소와 비교해, 클래스 이름 오타가 "스타일 없음"으로 조용히
 * 지나가지 않게 한다.
 */
export const Matrix: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[auto_repeat(3,auto)] items-center gap-x-4 gap-y-2 text-sm">
      <div />
      {appearances.map((a) => (
        <code key={a}>{a}</code>
      ))}
      {tones.map((tone) => (
        <div key={tone} className="contents">
          <code>{tone}</code>
          {appearances.map((appearance) => (
            <div key={appearance}>
              <Badge tone={tone} appearance={appearance} data-testid={`${tone}-${appearance}`}>
                {tone}
              </Badge>
              <span
                hidden
                data-testid={`ref-${tone}-${appearance}`}
                style={refStyle(tone, appearance)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const mismatches: string[] = []

    for (const tone of tones) {
      for (const appearance of appearances) {
        const got = getComputedStyle(canvas.getByTestId(`${tone}-${appearance}`))
        const want = getComputedStyle(canvas.getByTestId(`ref-${tone}-${appearance}`))
        const keys =
          appearance === 'outline'
            ? (['borderTopColor', 'color'] as const)
            : (['backgroundColor', 'color'] as const)
        for (const key of keys) {
          if (got[key] !== want[key]) {
            mismatches.push(`${tone} ${appearance} ${key}: ${got[key]} ≠ ${want[key]}`)
          }
        }
      }
    }

    await expect(mismatches).toEqual([])
  },
}

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {tones.map((tone) => (
        <Badge {...args} key={tone} tone={tone} appearance="solid">
          {tone}
        </Badge>
      ))}
    </div>
  ),
}

export const Appearances: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      {appearances.map((appearance) => (
        <Badge {...args} key={appearance} tone="brand" appearance={appearance}>
          {appearance}
        </Badge>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Badge {...args} size="sm">
        sm
      </Badge>
      <Badge {...args} size="md">
        md
      </Badge>
    </div>
  ),
}
