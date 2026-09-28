import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Checkbox, Field } from '@junhadex/core'

const meta = {
  title: 'Core/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: '약관에 동의합니다', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: '약관에 동의합니다' })
    await expect(checkbox).not.toBeChecked()
    await userEvent.click(checkbox)
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}

/** 레이블 클릭도 컨트롤로 전달된다. */
export const LabelTogglesControl: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByText('약관에 동의합니다'))
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}

export const Checked: Story = { args: { defaultChecked: true } }

/** 중간 상태는 제어 컴포넌트에서만 쓴다. */
export const Indeterminate: Story = {
  args: { checked: 'indeterminate' },
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, args }) => {
    const checkbox = within(canvasElement).getByRole('checkbox')
    await expect(checkbox).toBeDisabled()
    await userEvent.click(checkbox, { pointerEventsCheck: 0 })
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

/** Field 안에서는 자체 레이블을 생략하고 Field 의 레이블을 쓴다. */
export const InField: Story = {
  args: { label: undefined },
  render: (args) => (
    <Field label="약관 동의" description="필수 항목입니다." required>
      <Checkbox {...args} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: '약관 동의' })
    await expect(checkbox).toHaveAccessibleDescription('필수 항목입니다.')
    await expect(checkbox).toBeRequired()
  },
}
