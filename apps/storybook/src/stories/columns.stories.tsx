import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Columns } from '@junhadex/core'

const panel = (label: string) => (
  <div key={label} className="rounded-surface bg-surface-raised p-4">
    {label}
  </div>
)

const meta = {
  title: 'Core/Columns',
  component: Columns,
  tags: ['autodocs'],
  args: { cols: 3, children: ['재고', '입고', '출고'].map(panel) },
} satisfies Meta<typeof Columns>

export default meta
type Story = StoryObj<typeof meta>

/** 자식들의 x 좌표 개수 = 실제 열 수. */
const columnCount = (root: HTMLElement) =>
  new Set([...root.firstElementChild!.children].map((c) => Math.round(c.getBoundingClientRect().x)))
    .size

/** 영역이 48rem 이상이면 `cols` 만큼 펼친다. 간격은 stack 슬롯(1rem). */
export const Wide: Story = {
  render: (args) => (
    <div className="w-[800px]">
      <Columns {...args} data-testid="columns" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByTestId('columns')
    await expect(columnCount(root)).toBe(3)
    await expect(getComputedStyle(root.firstElementChild!).columnGap).toBe('16px')
  },
}

/** 영역이 좁으면 뷰포트 폭과 무관하게 한 열로 쌓인다. */
export const Narrow: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <Columns {...args} data-testid="columns" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(columnCount(within(canvasElement).getByTestId('columns'))).toBe(1)
  },
}

export const Four: Story = {
  args: { cols: 4, children: ['봄', '여름', '가을', '겨울'].map(panel) },
  render: Wide.render,
  play: async ({ canvasElement }) => {
    await expect(columnCount(within(canvasElement).getByTestId('columns'))).toBe(4)
  },
}

/** 레이아웃 클래스만 통과한다. `mt-8` 은 남고 `bg-danger` 는 버려진다. */
export const LayoutOverride: Story = {
  args: { className: 'mt-8 bg-danger' },
  render: Wide.render,
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByTestId('columns')
    await expect(root).toHaveClass('mt-8')
    await expect(root).not.toHaveClass('bg-danger')
  },
}
