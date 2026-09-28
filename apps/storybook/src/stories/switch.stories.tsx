import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Field, Switch } from '@junhadex/core'

const meta = {
  title: 'Core/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: '알림 받기', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole('switch', { name: '알림 받기' })
    await expect(control).not.toBeChecked()
    await userEvent.click(control)
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}

export const Checked: Story = { args: { defaultChecked: true } }

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole('switch')
    await expect(control).toBeDisabled()
    await userEvent.click(control, { pointerEventsCheck: 0 })
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

export const InField: Story = {
  args: { label: undefined },
  render: (args) => (
    <Field label="알림" description="중요 공지만 보냅니다.">
      <Switch {...args} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole('switch', { name: '알림' })
    await expect(control).toHaveAccessibleDescription('중요 공지만 보냅니다.')
  },
}
