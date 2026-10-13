import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { Button, Dialog, Field, Select, ToastProvider, toast } from '@junhadex/core'

const meta = {
  title: 'Core/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: {
    title: '주문 상세',
    description: '주문 번호 F-2026-1012',
    children: <p>린넨 원단 30마, 출고 대기 중입니다.</p>,
    trigger: <Button>주문 보기</Button>,
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 열린 채로 play 가 끝나면 Radix 가 형제 요소에 걸어 둔 aria-hidden 이 남아
 * axe 검사에 걸리므로 스토리마다 닫고 끝낸다.
 */
const closed = () => waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

/** 원본 슬롯을 참조한 요소의 계산색. `@theme inline` 브리지 변수는 런타임에 없다. */
const slotColor = (slot: string) => {
  const ref = document.createElement('div')
  ref.style.backgroundColor = `var(--sem-color-${slot})`
  document.body.append(ref)
  const color = getComputedStyle(ref).backgroundColor
  ref.remove()
  return color
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: '주문 보기' })
    await userEvent.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: '주문 상세' })
    // Radix 는 aria-modal 대신 바깥 요소 전체에 aria-hidden 을 건다.
    await expect(canvasElement.closest('[aria-hidden="true"]')).not.toBeNull()
    await expect(dialog).toHaveAccessibleDescription('주문 번호 F-2026-1012')
    await expect(dialog.contains(document.activeElement)).toBe(true)

    // 포커스가 대화상자 안을 순환한다(유일한 포커스 대상은 닫기 버튼).
    await userEvent.tab()
    await expect(dialog.contains(document.activeElement)).toBe(true)

    // 테스트 viewport 는 md 미만이라 하단 시트로 붙는다.
    await waitFor(() =>
      expect(Math.round(dialog.getBoundingClientRect().bottom)).toBe(window.innerHeight),
    )
    const overlay = dialog.previousElementSibling!
    await expect(getComputedStyle(overlay).backgroundColor).toBe(slotColor('scrim'))

    await userEvent.keyboard('{Escape}')
    await closed()
    await expect(trigger).toHaveFocus()
  },
}

/** scrim 을 누르거나 헤더의 닫기 버튼으로 닫는다. */
export const DismissByOverlay: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(dialog.previousElementSibling!)
    await closed()

    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    await userEvent.click(await screen.findByRole('button', { name: '닫기' }))
    await closed()
  },
}

const onSave = fn()

/** footer 버튼으로 닫으려면 `open`/`onOpenChange` 로 제어한다. */
export const Controlled: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <Dialog
        {...args}
        open={open}
        onOpenChange={setOpen}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                onSave()
                setOpen(false)
              }}
            >
              저장
            </Button>
          </>
        }
      />
    )
  },
  play: async ({ canvasElement }) => {
    onSave.mockClear()
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog')

    // 모바일은 주 버튼이 위에 오도록 세로로 뒤집어 쌓는다.
    const save = within(dialog).getByRole('button', { name: '저장' })
    const cancel = within(dialog).getByRole('button', { name: '취소' })
    await expect(save.getBoundingClientRect().top).toBeLessThan(cancel.getBoundingClientRect().top)

    await userEvent.click(save)
    await closed()
    await expect(onSave).toHaveBeenCalledOnce()
  },
}

/** 설명이 없으면 `aria-describedby` 를 두지 않는다. */
export const WithoutDescription: Story = {
  args: { description: undefined },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog', { name: '주문 상세' })
    await expect(dialog).not.toHaveAttribute('aria-describedby')
    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 본문이 길면 헤더와 footer 는 고정되고 본문만 스크롤된다. */
export const LongContent: Story = {
  args: {
    children: Array.from({ length: 40 }, (_, i) => <p key={i}>출고 이력 {i + 1}</p>),
    footer: <Button>확인</Button>,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog')
    const body = within(dialog).getByText('출고 이력 1').parentElement!
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight)
    const confirm = within(dialog).getByRole('button', { name: '확인' })
    await waitFor(() =>
      expect(confirm.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight),
    )
    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 대화상자 안에서 연 Select 목록은 나중에 포털로 붙어 scrim·대화상자 위에 뜬다. */
export const WithSelect: Story = {
  args: {
    children: (
      <Field label="소재">
        <Select
          options={[
            { value: 'linen', label: '린넨' },
            { value: 'wool', label: '울' },
          ]}
        />
      </Field>
    ),
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog')
    const combobox = within(dialog).getByRole('combobox', { name: '소재' })
    await userEvent.click(combobox)

    const option = await screen.findByRole('option', { name: '울' })
    // 목록은 열린 직후 선택 항목 기준으로 위치를 다시 잡으므로 안정될 때까지 기다린다.
    await waitFor(() => {
      const r = option.getBoundingClientRect()
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
      expect(option.contains(hit)).toBe(true)
    })
    await userEvent.click(option)
    await expect(combobox).toHaveTextContent('울')
    // 목록이 열려 있는 동안은 Select 가 대화상자에 aria-hidden 을 건다. 닫힌 뒤 확인한다.
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    await expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await closed()
  },
}

/** 모달이 열려 있어도 토스트는 위에 뜨고 닫기 버튼을 누를 수 있다. 대화상자는 닫히지 않는다. */
export const WithToast: Story = {
  args: {
    children: <Button onClick={() => toast.success('저장되었습니다')}>알림 띄우기</Button>,
  },
  render: (args) => (
    <ToastProvider closeLabel="알림 닫기">
      <Dialog {...args} />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: '주문 보기' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: '알림 띄우기' }))

    await screen.findByText('저장되었습니다')
    const close = document.querySelector<HTMLElement>('[aria-label="알림 닫기"]')!
    const r = close.getBoundingClientRect()
    await expect(
      close.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)),
    ).toBe(true)

    await userEvent.click(close)
    await waitFor(() => expect(screen.queryByText('저장되었습니다')).not.toBeInTheDocument())
    await expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    await closed()
  },
}
