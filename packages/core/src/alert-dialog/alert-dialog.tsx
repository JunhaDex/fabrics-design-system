import type { ReactElement, ReactNode } from 'react'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import { Button } from '../button/button'
import { dialog } from '../dialog/dialog'
import { layoutClass } from '../utils/layout-class'

export interface AlertDialogProps {
  title: ReactNode
  /** 확인 결과를 설명한다. 경고 대화상자의 핵심 정보이므로 필수다. */
  description: ReactNode
  /** 확인 버튼을 누르면 호출되고 대화상자가 닫힌다. */
  onConfirm: () => void
  confirmLabel?: string
  cancelLabel?: string
  /** 확인 버튼 색. 되돌릴 수 없는 동작이면 `danger`. */
  tone?: 'neutral' | 'danger'
  /** 여는 요소. 없으면 `open` 으로 연다. */
  trigger?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** 레이아웃 속성만 반영된다. */
  className?: string
}

/**
 * 확인이 필요한 동작 앞의 경고 대화상자. 바깥 클릭으로 닫히지 않고 Esc 는 취소다.
 * 열리면 포커스가 취소 버튼에 간다. 레이아웃·모션은 Dialog 와 같다.
 */
export function AlertDialog({
  title,
  description,
  onConfirm,
  confirmLabel = '확인',
  cancelLabel = '취소',
  tone = 'neutral',
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: AlertDialogProps) {
  const s = dialog()
  return (
    <AlertDialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>}
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className={s.overlay()} />
        <AlertDialogPrimitive.Content className={s.content({ class: layoutClass(className) })}>
          <div className={s.header()}>
            <div className={s.heading()}>
              <AlertDialogPrimitive.Title className={s.title()}>{title}</AlertDialogPrimitive.Title>
              <AlertDialogPrimitive.Description className={s.description()}>
                {description}
              </AlertDialogPrimitive.Description>
            </div>
          </div>
          <div className={s.footer()}>
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}
