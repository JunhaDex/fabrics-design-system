import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Textarea } from '@junhadex/core'

const meta = {
  title: 'Core/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { 'aria-label': '메모', placeholder: '내용을 입력하세요' },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** Input 의 면·테두리·포커스·오류 처리를 그대로 물려받는다. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', { name: '메모' })
    await userEvent.type(textarea, '첫 줄{Enter}둘째 줄')
    await expect(textarea).toHaveValue('첫 줄\n둘째 줄')
  },
}

export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: '잘못된 값' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: '수정할 수 없음' } }
