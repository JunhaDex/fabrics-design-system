import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ToggleGroup } from '@junhadex/core'

const options = [
  { value: 'left', label: '왼쪽' },
  { value: 'center', label: '가운데' },
  { value: 'right', label: '오른쪽' },
]

const meta = {
  title: 'Core/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { options, type: 'single', 'aria-label': '정렬', onValueChange: fn() },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

/** `type="single"` 은 값 하나를 문자열로 돌려준다. */
export const Single: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('radio', { name: '가운데' }))
    await expect(args.onValueChange).toHaveBeenCalledWith('center')
  },
}

/** `type="multiple"` 은 선택된 값들을 배열로 돌려준다. */
export const Multiple: Story = {
  args: { type: 'multiple' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: '왼쪽' }))
    await userEvent.click(canvas.getByRole('button', { name: '오른쪽' }))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['left', 'right'])
  },
}

export const WithDefaultValue: Story = {
  args: { defaultValue: 'center' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio', { name: '가운데' })).toBeChecked()
  },
}

export const WithDisabledOption: Story = {
  args: { options: [...options.slice(0, 2), { value: 'right', label: '오른쪽', disabled: true }] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio', { name: '오른쪽' })).toBeDisabled()
  },
}
