import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button, Field, Input, Popover } from '@junhadex/core'

const meta = {
  title: 'Core/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    'aria-label': '필터',
    content: <p>표시할 원단 종류를 고르세요.</p>,
    children: <Button>필터</Button>,
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

const closed = () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '필터' })
    await userEvent.click(trigger)

    const panel = await screen.findByRole('dialog', { name: '필터' })
    await expect(panel).toHaveTextContent('표시할 원단 종류를 고르세요.')
    await expect(canvasElement.contains(panel)).toBe(false)

    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 툴팁과 달리 상호작용 요소를 담을 수 있고 포커스가 안으로 들어간다. */
export const WithForm: Story = {
  args: {
    content: (
      <Field label="최소 수량">
        <Input type="number" defaultValue={1} />
      </Field>
    ),
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터' }))

    const panel = await screen.findByRole('dialog')
    const input = within(panel).getByLabelText('최소 수량')
    await userEvent.clear(input)
    await userEvent.type(input, '5')
    await expect(input).toHaveValue(5)

    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 바깥을 클릭하면 닫힌다. */
export const ClosesOnOutsideClick: Story = {
  args: { onOpenChange: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '필터' }))
    await screen.findByRole('dialog')

    await userEvent.click(document.body)
    await closed()
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false)
  },
}
