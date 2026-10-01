import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Tabs, type TabItem } from '@junhadex/core'

const items: TabItem[] = [
  { value: 'spec', label: '규격', content: '폭 150cm, 중량 220g/㎡' },
  { value: 'care', label: '관리', content: '30도 이하 손세탁' },
  { value: 'stock', label: '재고', content: '3개 창고 보유' },
]

const meta = {
  title: 'Core/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items, defaultValue: 'spec', onValueChange: fn() },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(canvas.getByRole('tab', { name: '규격' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('폭 150cm')

    await userEvent.click(canvas.getByRole('tab', { name: '관리' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('care')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('손세탁')
  },
}

/** 기본값. 방향키로 포커스를 옮기면 그 즉시 선택된다. */
export const AutomaticActivation: Story = {
  render: (args) => (
    <div className="w-80">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('tab', { name: '규격' }).focus()
    await userEvent.keyboard('{ArrowRight}')

    const care = canvas.getByRole('tab', { name: '관리' })
    await expect(care).toHaveFocus()
    await expect(care).toHaveAttribute('aria-selected', 'true')
  },
}

/** 패널 콘텐츠가 무거울 때 쓴다. 방향키는 포커스만 옮기고 Enter/Space 가 선택한다. */
export const ManualActivation: Story = {
  args: { activationMode: 'manual' },
  render: (args) => (
    <div className="w-80">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    canvas.getByRole('tab', { name: '규격' }).focus()
    await userEvent.keyboard('{ArrowRight}')

    const care = canvas.getByRole('tab', { name: '관리' })
    await expect(care).toHaveFocus()
    await expect(care).toHaveAttribute('aria-selected', 'false')
    await expect(canvas.getByRole('tab', { name: '규격' })).toHaveAttribute('aria-selected', 'true')

    await userEvent.keyboard('{Enter}')
    await expect(care).toHaveAttribute('aria-selected', 'true')
  },
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="w-96">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical')

    canvas.getByRole('tab', { name: '규격' }).focus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('tab', { name: '관리' })).toHaveAttribute('aria-selected', 'true')
  },
}

/** 탭이 컨테이너를 넘치면 리스트가 가로 스크롤한다. */
export const Overflow: Story = {
  args: {
    items: ['규격', '관리', '재고', '단가', '거래처', '이력'].map((label, i) => ({
      value: `t${i}`,
      label,
      content: `${label} 내용`,
    })),
    defaultValue: 't0',
  },
  render: (args) => (
    <div className="w-48">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('tablist')
    await expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)
    await expect(getComputedStyle(list).overflowX).toBe('auto')
  },
}

/** 비활성 탭은 클릭도 방향키 이동도 받지 않는다. */
export const Disabled: Story = {
  args: {
    items: [items[0], { ...items[1], disabled: true }, items[2]],
  },
  render: (args) => (
    <div className="w-80">
      <Tabs {...args} />
    </div>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const care = canvas.getByRole('tab', { name: '관리' })
    await expect(care).toBeDisabled()

    await userEvent.click(care, { pointerEventsCheck: 0 })
    await expect(args.onValueChange).not.toHaveBeenCalled()

    // 방향키는 비활성 탭을 건너뛴다.
    canvas.getByRole('tab', { name: '규격' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: '재고' })).toHaveFocus()
  },
}
