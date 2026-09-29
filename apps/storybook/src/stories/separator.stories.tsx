import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Separator } from '@junhadex/core'

const meta = {
  title: 'Core/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <p>위 문단</p>
      <Separator {...args} className="my-4" />
      <p>아래 문단</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rule = within(canvasElement).getByRole('separator')
    await expect(rule).toHaveAttribute('data-orientation', 'horizontal')
    // horizontal 은 암묵 기본값이라 Radix 가 aria-orientation 을 붙이지 않는다.
    await expect(rule).not.toHaveAttribute('aria-orientation')
  },
}

/** 세로 구분선은 부모 높이를 따른다. 감싼 요소에 높이가 없으면 보이지 않는다. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-8 items-center gap-3">
      <span>목록</span>
      <Separator {...args} />
      <span>상세</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rule = within(canvasElement).getByRole('separator')
    await expect(rule).toHaveAttribute('aria-orientation', 'vertical')
  },
}

/** 순수 장식이면 `decorative` 로 스크린 리더에서 제외한다. */
export const Decorative: Story = {
  args: { decorative: true },
  render: (args) => (
    <div className="w-64">
      <Separator {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByRole('separator')).toBeNull()
    await expect(canvasElement.querySelector('[data-orientation]')).toHaveAttribute('role', 'none')
  },
}

/** className 오버라이드는 레이아웃 속성만 통과한다(`layoutClass`). */
export const LayoutOverride: Story = {
  render: (args) => (
    <div className="w-64">
      <Separator {...args} className="my-8 bg-danger" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rule = within(canvasElement).getByRole('separator')
    await expect(rule).toHaveClass('my-8')
    await expect(rule).not.toHaveClass('bg-danger')
  },
}
