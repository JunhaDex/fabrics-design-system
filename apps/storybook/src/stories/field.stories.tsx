import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Field, Input, Textarea } from '@junhadex/core'

const meta = {
  title: 'Core/Field',
  component: Field,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { label: '이름', children: <Input placeholder="홍길동" /> },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** 레이블과 컨트롤은 주입된 id 로 이어진다. 컨트롤에 id 를 직접 줄 필요가 없다. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('이름')
    await expect(input).toBeInTheDocument()
    await expect(input).not.toHaveAttribute('aria-describedby')
  },
}

export const WithDescription: Story = {
  args: { description: '실명을 입력하세요.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('이름')
    await expect(input).toHaveAccessibleDescription('실명을 입력하세요.')
  },
}

/** 오류가 있으면 `aria-invalid` 가 서고, 오류 문구가 설명으로 연결된다. */
export const WithError: Story = {
  args: { error: '이름은 필수입니다.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('이름')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription('이름은 필수입니다.')
    await expect(canvas.getByRole('alert')).toHaveTextContent('이름은 필수입니다.')
  },
}

/** 설명과 오류가 함께 있으면 둘 다 `aria-describedby` 에 묶인다. */
export const DescriptionAndError: Story = {
  args: { description: '실명을 입력하세요.', error: '이름은 필수입니다.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('이름')
    await expect(input).toHaveAccessibleDescription('실명을 입력하세요. 이름은 필수입니다.')
  },
}

/**
 * `required` 는 시각 표시와 컨트롤의 required 상태를 함께 세운다.
 * 별표는 `aria-hidden` 이므로 접근 가능한 이름에는 들어가지 않는다.
 */
export const Required: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: '이름' })
    await expect(input).toBeRequired()
  },
}

export const WithTextarea: Story = {
  args: {
    label: '메모',
    description: '자유롭게 적어 주세요.',
    children: <Textarea placeholder="내용을 입력하세요" />,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('메모')).toHaveAccessibleDescription(
      '자유롭게 적어 주세요.',
    )
  },
}
