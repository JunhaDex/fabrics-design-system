import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Toggle } from '@junhadex/core'

const meta = {
  title: 'Core/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: '굵게', onPressedChange: fn() },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole('button', { name: '굵게' })
    await expect(control).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(control)
    await expect(args.onPressedChange).toHaveBeenCalledWith(true)
  },
}

export const Pressed: Story = {
  args: { defaultPressed: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole('button')
    await expect(control).toBeDisabled()
    await userEvent.click(control, { pointerEventsCheck: 0 })
    await expect(args.onPressedChange).not.toHaveBeenCalled()
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Toggle {...args} size="sm" />
      <Toggle {...args} size="md" />
      <Toggle {...args} size="lg" />
    </div>
  ),
}
