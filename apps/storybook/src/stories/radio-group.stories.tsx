import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { RadioGroup } from '@junhadex/core'

const options = [
  { value: 'email', label: '이메일' },
  { value: 'sms', label: '문자' },
  { value: 'push', label: '푸시 알림' },
]

const meta = {
  title: 'Core/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { options, 'aria-label': '수신 방법', onValueChange: fn() },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: '문자' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('sms')
    await expect(canvas.getByRole('radio', { name: '문자' })).toBeChecked()
  },
}

/** 레이블 클릭도 해당 항목을 선택한다. */
export const LabelSelectsOption: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByText('푸시 알림'))
    await expect(args.onValueChange).toHaveBeenCalledWith('push')
  },
}

export const Horizontal: Story = { args: { orientation: 'horizontal' } }

export const WithDefaultValue: Story = {
  args: { defaultValue: 'email' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio', { name: '이메일' })).toBeChecked()
  },
}

export const WithDisabledOption: Story = {
  args: {
    options: [...options.slice(0, 2), { value: 'push', label: '푸시 알림', disabled: true }],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio', { name: '푸시 알림' })).toBeDisabled()
  },
}

/**
 * 방향키는 포커스만 옮기고 선택은 Space 로 한다 (Radix 의 roving tabindex).
 * 실수로 값이 바뀌는 것을 막는 동작이다.
 */
export const KeyboardNavigation: Story = {
  args: { defaultValue: 'email' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: '이메일' }))

    await userEvent.keyboard('{ArrowDown}')
    await expect(canvas.getByRole('radio', { name: '문자' })).toHaveFocus()
    await expect(args.onValueChange).not.toHaveBeenCalled()

    await userEvent.keyboard(' ')
    await expect(args.onValueChange).toHaveBeenCalledWith('sms')
  },
}
