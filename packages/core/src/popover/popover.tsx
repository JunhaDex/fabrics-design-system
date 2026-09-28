import type { ReactElement, ReactNode } from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const popover = tv({
  slots: {
    content: [
      'z-50 rounded-surface border border-border p-control-x',
      'bg-surface-overlay text-on-surface shadow-overlay',
      'outline-none',
      'data-[state=closed]:animate-exit data-[state=open]:animate-enter',
    ],
  },
})

export interface PopoverProps {
  /** 패널 내용. 상호작용 요소를 담을 수 있다. */
  content: ReactNode
  /** 패널을 여는 대상. */
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  modal?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  'aria-label'?: string
}

/** 포커스 이동·Esc 닫기·바깥 클릭은 Radix 가 처리한다. */
export function Popover({
  content,
  children,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  modal,
  open,
  defaultOpen,
  onOpenChange,
  className,
  ...aria
}: PopoverProps) {
  const s = popover()

  return (
    <PopoverPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      modal={modal}
    >
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={s.content({ class: layoutClass(className) })}
          {...aria}
        >
          {content}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
