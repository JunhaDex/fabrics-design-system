import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button, ToastProvider, toast } from '@junhadex/core'

const meta = {
  title: 'Core/Toast',
  component: ToastProvider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 토스트는 뷰포트 영역 안에서 찾는다.
 * `role="status"` 로 찾지 않는 이유는 Radix 가 스크린 리더용으로 늘 띄워 두는
 * 빈 알림 span 이 먼저 잡히기 때문이다.
 */
const viewport = () => screen.findByRole('region')

/** 모듈 전역 큐라 스토리 사이에 남지 않도록 정리한다. */
const reset = async () => {
  toast.dismiss()
  await waitFor(async () => expect((await viewport()).textContent).toBe(''))
}

const Demo = () => (
  <ToastProvider>
    <div className="flex gap-2">
      <Button onClick={() => toast.success('저장되었습니다')}>성공</Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.danger('저장하지 못했습니다', { description: '잠시 후 다시 시도하세요.' })
        }
      >
        오류
      </Button>
    </div>
  </ToastProvider>
)

/** 어디서나 `toast()` 한 줄로 띄운다. */
export const Default: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '성공' }))

    const region = await viewport()
    await within(region).findByText('저장되었습니다')

    // Select/Tooltip 과 달리 Toast 는 Portal 을 쓰지 않는다. 대신 뷰포트가
    // fixed 라 DOM 위치와 무관하게 화면 모서리에 겹쳐 뜬다.
    // (role=region 은 Radix 의 래퍼이고, 스타일이 걸리는 것은 그 안의 ol 이다.)
    const list = region.querySelector('ol')!
    await expect(getComputedStyle(list).position).toBe('fixed')

    await reset()
  },
}

export const WithDescription: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '오류' }))

    const region = await viewport()
    await within(region).findByText('저장하지 못했습니다')
    await expect(within(region).getByText('잠시 후 다시 시도하세요.')).toBeInTheDocument()

    await reset()
  },
}

/** 닫기 버튼으로 즉시 닫는다. */
export const Dismiss: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '성공' }))

    const region = await viewport()
    await within(region).findByText('저장되었습니다')

    await userEvent.click(within(region).getByRole('button', { name: '닫기' }))
    await waitFor(() => expect(region.textContent).toBe(''))
  },
}

/** 동시에 최대 3개까지만 보인다. 넘치면 오래된 것부터 밀려난다. */
export const MaxVisible: Story = {
  render: () => (
    <ToastProvider>
      <Button
        onClick={() => {
          for (let i = 1; i <= 5; i += 1) toast.info(`알림 ${i}`)
        }}
      >
        5개 띄우기
      </Button>
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '5개 띄우기' }))

    const region = await viewport()
    const items = await within(region).findAllByText(/알림 \d/)
    await expect(items).toHaveLength(3)
    await expect(items[0]).toHaveTextContent('알림 3')
    await expect(items[2]).toHaveTextContent('알림 5')

    await reset()
  },
}
