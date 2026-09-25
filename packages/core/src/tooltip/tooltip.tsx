import type { ReactElement, ReactNode } from 'react'
import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const tooltip = tv({
  slots: {
    content: [
      'z-50 max-w-64 rounded-control px-2 py-1 text-sm',
      'bg-surface-inverse text-on-surface-inverse shadow-overlay',
      'data-[state=closed]:animate-exit data-[state=delayed-open]:animate-enter',
    ],
  },
})

export interface TooltipProps {
  /** 툴팁 내용. 상호작용 요소를 담아야 하면 Popover 를 쓴다. */
  content: ReactNode
  /** 툴팁을 띄울 대상. */
  children: ReactElement
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  delayDuration?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * Provider 를 안에 두어 앱 쪽 설정 없이 단독으로 쓸 수 있게 했다.
 * 내용은 트리거의 `aria-describedby` 로 연결되므로 이름을 대신하지는 못한다.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 6,
  delayDuration = 300,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: TooltipProps) {
  const s = tooltip()

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            className={s.content({ class: layoutClass(className) })}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
