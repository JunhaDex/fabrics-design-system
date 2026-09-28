import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Alert } from '@junhadex/core'

const meta = {
  title: 'Core/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { title: '재고가 부족합니다', children: '남은 수량은 3롤입니다.' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

/** 정보성 알림은 정중하게 전달한다(role=status). */
export const Info: Story = {
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole('status')
    await expect(alert).toHaveTextContent('재고가 부족합니다')
  },
}

export const Success: Story = { args: { tone: 'success', title: '저장되었습니다' } }
export const Warning: Story = { args: { tone: 'warning', title: '납기가 임박했습니다' } }

/** 오류는 즉시 알린다(role=alert). */
export const Danger: Story = {
  args: { tone: 'danger', title: '주문을 처리하지 못했습니다' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('alert')).toBeInTheDocument()
  },
}

/** 제목만 쓸 수도 있다. */
export const TitleOnly: Story = { args: { children: undefined } }

/** 아이콘은 장식이라 접근 가능한 이름에 섞이지 않는다. */
export const IconIsDecorative: Story = {
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg')
    await expect(svg).toHaveAttribute('aria-hidden', 'true')
  },
}

export const AllTones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Alert {...args} tone="info" title="정보" />
      <Alert {...args} tone="success" title="성공" />
      <Alert {...args} tone="warning" title="경고" />
      <Alert {...args} tone="danger" title="오류" />
    </div>
  ),
}
