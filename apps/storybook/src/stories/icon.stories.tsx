import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Check, Search, TriangleAlert } from 'lucide'
import { Icon } from '@junhadex/core'

const meta = {
  title: 'Core/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { node: Check, size: 24 },
  argTypes: { node: { control: false } },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/** 레이블이 없으면 장식용으로 보고 접근성 트리에서 감춘다. */
export const Decorative: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
    await expect(svg).not.toHaveAttribute('role')
  },
}

/** 아이콘만으로 의미를 전달하는 자리에서는 `aria-label` 을 넘긴다. */
export const Labelled: Story = {
  args: { node: Search, 'aria-label': '검색' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: '검색' })).toBeInTheDocument()
  },
}

/** 기본 크기는 `1em` 이라 주변 글자 크기를 따라간다. */
export const InheritsFontSize: Story = {
  args: { size: undefined },
  render: (args) => (
    <div className="flex items-center gap-4">
      <span className="text-sm">
        sm <Icon {...args} />
      </span>
      <span className="text-base">
        base <Icon {...args} />
      </span>
      <span className="text-lg">
        lg <Icon {...args} />
      </span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [sm, lg] = canvasElement.querySelectorAll('svg')
    await expect(sm.getBoundingClientRect().width).toBeLessThan(lg.getBoundingClientRect().width)
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Icon {...args} node={Check} size={16} />
      <Icon {...args} node={Search} size={24} />
      <Icon {...args} node={TriangleAlert} size={32} />
    </div>
  ),
}
