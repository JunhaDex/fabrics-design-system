import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button, Tooltip } from '@junhadex/core'

const meta = {
  title: 'Core/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { content: '장바구니에 담기', children: <Button>담기</Button>, delayDuration: 0 },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

/** 열린 채로 play 가 끝나면 Radix 의 aria-hidden 이 남아 a11y 검사에 걸린다. */
const closed = () => waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '담기' })
    await userEvent.hover(trigger)

    const tip = await screen.findByRole('tooltip')
    await expect(tip).toHaveTextContent('장바구니에 담기')
    await expect(canvasElement.contains(tip)).toBe(false)

    await userEvent.unhover(trigger)
    await closed()
  },
}

/** 키보드 포커스로도 열린다. */
export const OpensOnFocus: Story = {
  play: async ({ canvasElement }) => {
    within(canvasElement).getByRole('button', { name: '담기' }).focus()
    await expect(await screen.findByRole('tooltip')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 내용은 트리거의 설명으로 연결된다. 이름을 대신하지는 않는다. */
export const DescribesTrigger: Story = {
  args: { defaultOpen: true },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '담기' })
    await expect(trigger).toHaveAccessibleDescription('장바구니에 담기')
  },
}

export const Sides: Story = {
  render: (args) => (
    <div className="flex gap-4">
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip {...args} key={side} side={side} content={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}
