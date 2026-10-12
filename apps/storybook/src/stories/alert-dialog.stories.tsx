import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { AlertDialog, Button } from '@junhadex/core'

const meta = {
  title: 'Core/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: '주문을 취소할까요?',
    description: '취소한 주문은 되돌릴 수 없습니다.',
    confirmLabel: '주문 취소',
    cancelLabel: '돌아가기',
    onConfirm: fn(),
    trigger: <Button variant="secondary">주문 취소</Button>,
  },
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj<typeof meta>

/** 열린 채 끝나면 형제 요소의 aria-hidden 이 남아 axe 에 걸리므로 닫고 끝낸다. */
const closed = () =>
  waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '주문 취소' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('alertdialog', { name: '주문을 취소할까요?' })
    await expect(dialog).toHaveAccessibleDescription('취소한 주문은 되돌릴 수 없습니다.')
    // 실수로 확인하지 않도록 포커스는 취소 버튼에서 시작한다.
    await expect(within(dialog).getByRole('button', { name: '돌아가기' })).toHaveFocus()

    // 바깥 클릭으로는 닫히지 않는다.
    await userEvent.click(dialog.previousElementSibling!, { pointerEventsCheck: 0 })
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    // Esc 는 취소다.
    await userEvent.keyboard('{Escape}')
    await closed()
    await expect(args.onConfirm).not.toHaveBeenCalled()
    await expect(trigger).toHaveFocus()
  },
}

/** 확인하면 `onConfirm` 이 호출되고 닫힌다. */
export const Confirm: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 취소' }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: '주문 취소' }))
    await closed()
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}

/** 되돌릴 수 없는 동작은 `tone="danger"` 로 확인 버튼을 위험 색으로 둔다. */
export const Danger: Story = {
  args: { tone: 'danger' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 취소' }))
    const dialog = await screen.findByRole('alertdialog')
    await expect(within(dialog).getByRole('button', { name: '주문 취소' })).toHaveClass('bg-danger')
    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 트리거 없이 `open` 으로 연다. 닫히면 `onOpenChange(false)` 가 온다. */
export const Controlled: Story = {
  args: { trigger: undefined },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>열기</Button>
        <AlertDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '열기' }))
    const dialog = await screen.findByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: '돌아가기' }))
    await closed()
  },
}
