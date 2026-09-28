import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input, Label } from '@junhadex/core'

const meta = {
  title: 'Core/Label',
  component: Label,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: '이름' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/** `htmlFor` 로 연결하면 레이블 클릭이 컨트롤로 전달된다. */
export const Default: Story = {
  args: { htmlFor: 'label-demo' },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Label {...args} />
      <Input id="label-demo" placeholder="홍길동" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('이름'))
    await expect(canvas.getByPlaceholderText('홍길동')).toHaveFocus()
  },
}
