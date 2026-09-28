import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Slider } from '@junhadex/core'

const meta = {
  title: 'Core/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { 'aria-label': '수량', defaultValue: [50], onValueChange: fn() },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: '수량' })
    await expect(thumb).toHaveAttribute('aria-valuenow', '50')
    thumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(args.onValueChange).toHaveBeenCalledWith([51])
  },
}

export const WithStep: Story = {
  args: { step: 10 },
  play: async ({ canvasElement, args }) => {
    const thumb = within(canvasElement).getByRole('slider')
    thumb.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(args.onValueChange).toHaveBeenCalledWith([60])
  },
}

/** 손잡이 개수는 value 길이를 따른다. */
export const Range: Story = {
  args: { defaultValue: [20, 80] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('slider')).toHaveLength(2)
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toHaveAttribute('data-disabled')
  },
}
