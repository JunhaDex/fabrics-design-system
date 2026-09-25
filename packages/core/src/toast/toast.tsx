import { useSyncExternalStore, type ReactNode } from 'react'
import { Toast as ToastPrimitive } from 'radix-ui'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide'
import { tv } from 'tailwind-variants'
import { Icon } from '../icon/icon'
import { toastStore } from './toast-store'

export const toastStyles = tv({
  slots: {
    viewport: [
      'fixed right-0 bottom-0 z-50 m-0 flex w-full max-w-96 list-none flex-col gap-2 p-4',
      'outline-none',
    ],
    root: [
      'flex items-start gap-3 rounded-surface p-control-x shadow-overlay',
      'data-[state=closed]:animate-exit data-[state=open]:animate-enter',
      'data-[swipe=end]:animate-exit',
    ],
    body: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'font-medium',
    description: 'text-sm',
    close: 'shrink-0 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-ring',
  },
  variants: {
    tone: {
      info: { root: 'bg-info-subtle text-on-info-subtle' },
      success: { root: 'bg-success-subtle text-on-success-subtle' },
      warning: { root: 'bg-warning-subtle text-on-warning-subtle' },
      danger: { root: 'bg-danger-subtle text-on-danger-subtle' },
    },
  },
  defaultVariants: { tone: 'info' },
})

const toneIcons = { info: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert }

export interface ToastProviderProps {
  children?: ReactNode
  /** 기본 표시 시간(ms). 각 토스트가 덮어쓸 수 있다. */
  duration?: number
  swipeDirection?: 'up' | 'down' | 'left' | 'right'
  /** 닫기 버튼의 접근 가능한 이름. */
  closeLabel?: string
}

/**
 * 앱 루트에 한 번 둔다. 큐를 구독해 토스트를 그린다.
 * 타이머 정지(hover/focus), F6 로 뷰포트 이동, 스와이프는 Radix 가 처리한다.
 */
export function ToastProvider({
  children,
  duration = 5000,
  swipeDirection = 'right',
  closeLabel = '닫기',
}: ToastProviderProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  )
  const styles = toastStyles()

  return (
    <ToastPrimitive.Provider duration={duration} swipeDirection={swipeDirection}>
      {children}
      {items.map((item) => {
        const s = toastStyles({ tone: item.tone })
        return (
          <ToastPrimitive.Root
            key={item.id}
            duration={item.duration}
            className={s.root()}
            onOpenChange={(open) => {
              if (!open) toastStore.dismiss(item.id)
            }}
          >
            <Icon node={toneIcons[item.tone]} size={20} className="mt-0.5 shrink-0" />
            <div className={s.body()}>
              <ToastPrimitive.Title className={s.title()}>{item.title}</ToastPrimitive.Title>
              {item.description && (
                <ToastPrimitive.Description className={s.description()}>
                  {item.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close aria-label={closeLabel} className={s.close()}>
              <Icon node={X} size={16} />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        )
      })}
      <ToastPrimitive.Viewport className={styles.viewport()} />
    </ToastPrimitive.Provider>
  )
}
