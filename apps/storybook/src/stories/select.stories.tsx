import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Field, Select } from '@junhadex/core'

const options = [
  { value: 'cotton', label: '면' },
  { value: 'linen', label: '린넨' },
  { value: 'wool', label: '울' },
]

const meta = {
  title: 'Core/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { options, placeholder: '소재 선택', 'aria-label': '소재', onValueChange: fn() },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 목록이 닫히고 exit 애니메이션까지 끝나 포털이 사라질 때까지 기다린다.
 * 열린 채로 play 가 끝나면 Radix 가 형제 요소에 걸어 둔 aria-hidden 이 남아
 * axe 의 aria-hidden-focus 규칙에 걸린다.
 */
const closed = () => waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument())

/** 목록은 Portal 로 body 직속에 렌더되므로 canvas 밖에서 찾아야 한다. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: '소재' })
    await userEvent.click(trigger)

    const option = await screen.findByRole('option', { name: '린넨' })
    await expect(canvasElement.contains(option)).toBe(false)

    await userEvent.click(option)
    await expect(args.onValueChange).toHaveBeenCalledWith('linen')
    await expect(trigger).toHaveTextContent('린넨')
    await closed()
  },
}

export const WithDefaultValue: Story = {
  args: { defaultValue: 'wool' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox')).toHaveTextContent('울')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox')).toBeDisabled()
  },
}

export const WithDisabledOption: Story = {
  args: { options: [...options.slice(0, 2), { value: 'wool', label: '울', disabled: true }] },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'))
    const option = await screen.findByRole('option', { name: '울' })
    await expect(option).toHaveAttribute('data-disabled')
    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Select {...args} size="sm" aria-label="작게" />
      <Select {...args} size="md" aria-label="보통" />
      <Select {...args} size="lg" aria-label="크게" />
    </div>
  ),
}

export const InField: Story = {
  args: { 'aria-label': undefined },
  render: (args) => (
    <Field label="소재" description="원단의 주 소재를 고르세요." required>
      <Select {...args} />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: '소재' })
    await expect(trigger).toHaveAccessibleDescription('원단의 주 소재를 고르세요.')
  },
}
