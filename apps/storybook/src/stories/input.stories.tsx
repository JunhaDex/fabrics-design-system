import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from '@junhadex/core'

const meta = {
  title: 'Core/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  // 단독 스토리에서도 접근 가능한 이름이 있어야 a11y 검사를 통과한다.
  args: { 'aria-label': '이름', placeholder: '홍길동' },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '이름' })
    await userEvent.type(input, '홍길동')
    await expect(input).toHaveValue('홍길동')
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Input {...args} size="sm" aria-label="작게" />
      <Input {...args} size="md" aria-label="보통" />
      <Input {...args} size="lg" aria-label="크게" />
    </div>
  ),
}

/** 오류 상태는 별도 prop 없이 `aria-invalid` 하나로 스타일과 접근성이 함께 켜진다. */
export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: '잘못된 값' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '이름' })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '수정할 수 없음' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '이름' })
    await expect(input).toBeDisabled()
    await userEvent.type(input, '무시', { pointerEventsCheck: 0 })
    await expect(input).toHaveValue('수정할 수 없음')
  },
}
