import type { ReactElement, ReactNode } from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { X } from 'lucide'
import { Icon } from '../icon/icon'
import { layoutClass } from '../utils/layout-class'
import { tv } from '../utils/tv'

export const dialog = tv({
  slots: {
    overlay: [
      'fixed inset-0 z-50 bg-scrim',
      'data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in',
    ],
    // md 미만은 하단 시트, 이상은 가운데. 가운데 정렬에 translate 를 쓰면 enter/exit 의
    // transform 이 덮어써 위치가 튀므로 inset-0 + m-auto 로 맞춘다.
    content: [
      'fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col',
      'rounded-t-surface bg-surface-overlay text-on-surface shadow-overlay outline-none',
      'pb-[env(safe-area-inset-bottom)]',
      'data-[state=closed]:animate-sheet-out data-[state=open]:animate-sheet-in',
      'md:inset-0 md:m-auto md:h-fit md:max-h-[calc(100dvh-4rem)] md:w-full md:max-w-lg',
      'md:rounded-surface md:pb-0',
      'md:data-[state=closed]:animate-exit md:data-[state=open]:animate-enter',
    ],
    header: 'flex items-start gap-4 px-6 pt-6 pb-4',
    heading: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'text-lg font-semibold',
    description: 'text-sm text-on-surface-muted',
    close: [
      '-m-1 shrink-0 rounded-control p-1 text-on-surface-muted',
      'outline-none hover:text-on-surface focus-visible:ring-2 focus-visible:ring-ring',
    ],
    body: 'min-h-0 flex-1 overflow-y-auto px-6',
    // 모바일은 주 버튼(마지막)이 위로 오도록 세로로 뒤집어 쌓는다.
    footer: 'flex flex-col-reverse gap-2 px-6 pt-4 pb-6 md:flex-row md:justify-end',
  },
})

export interface DialogProps {
  /** 대화상자 제목. 접근 가능한 이름이 된다. */
  title: ReactNode
  description?: ReactNode
  /** 본문. 넘치면 본문만 스크롤된다. */
  children?: ReactNode
  /** 버튼 영역. 버튼으로 닫으려면 `open`/`onOpenChange` 로 제어한다. */
  footer?: ReactNode
  /** 여는 요소. 없으면 `open` 으로 연다. */
  trigger?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** 헤더 닫기 버튼의 접근 가능한 이름. */
  closeLabel?: string
  /** 레이아웃 속성만 반영된다. 폭은 `md:max-w-2xl` 처럼 덮어쓴다. */
  className?: string
}

/**
 * 모달 대화상자. 포커스 가두기·Esc·바깥 클릭·스크롤 잠금·포커스 복귀는 Radix 가 처리한다.
 * md 미만에서는 하단 시트로 표시된다(스와이프 닫기는 지원하지 않는다).
 */
export function Dialog({
  title,
  description,
  children,
  footer,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  closeLabel = '닫기',
  className,
}: DialogProps) {
  const s = dialog()
  return (
    <DialogPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={s.overlay()} />
        <DialogPrimitive.Content
          className={s.content({ class: layoutClass(className) })}
          // 설명이 없으면 Radix 의 누락 경고를 끈다.
          {...(description == null && { 'aria-describedby': undefined })}
        >
          <div className={s.header()}>
            <div className={s.heading()}>
              <DialogPrimitive.Title className={s.title()}>{title}</DialogPrimitive.Title>
              {description != null && (
                <DialogPrimitive.Description className={s.description()}>
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close aria-label={closeLabel} className={s.close()}>
              <Icon node={X} size={20} />
            </DialogPrimitive.Close>
          </div>
          {children != null && <div className={s.body()}>{children}</div>}
          {footer != null && <div className={s.footer()}>{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
