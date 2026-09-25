import type { ReactNode } from 'react'

export type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastItem {
  id: string
  tone: ToastTone
  title: ReactNode
  description?: ReactNode
  /** 이 토스트만 다른 표시 시간을 쓸 때. 기본값은 ToastProvider 가 정한다. */
  duration?: number
}

export interface ToastOptions {
  description?: ReactNode
  duration?: number
}

/** 동시에 띄울 최대 개수. 넘치면 오래된 것부터 밀려난다. */
const MAX_VISIBLE = 3

const EMPTY: ToastItem[] = []
const listeners = new Set<() => void>()
let items: ToastItem[] = EMPTY
let counter = 0

const emit = () => {
  for (const listener of listeners) listener()
}

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getSnapshot: () => items,
  /** 서버에는 토스트가 없다. 참조가 매번 바뀌면 무한 루프가 되므로 상수를 쓴다. */
  getServerSnapshot: () => EMPTY,
  add(item: Omit<ToastItem, 'id'>) {
    const id = `toast-${++counter}`
    items = [...items, { ...item, id }].slice(-MAX_VISIBLE)
    emit()
    return id
  },
  dismiss(id?: string) {
    items = id == null ? EMPTY : items.filter((item) => item.id !== id)
    emit()
  },
}

const withTone = (tone: ToastTone) => (title: ReactNode, options?: ToastOptions) =>
  toastStore.add({ tone, title, ...options })

/**
 * 어디서나 호출하는 명령형 API. 토스트는 이벤트에 반응해 뜨는 것이라
 * `open` prop 을 들고 다니는 선언형보다 호출부가 단순하다.
 * 앱 루트에 `<ToastProvider>` 하나가 있어야 화면에 나타난다.
 */
export const toast = Object.assign(withTone('info'), {
  info: withTone('info'),
  success: withTone('success'),
  warning: withTone('warning'),
  /** 톤 이름은 라이브러리 전체와 맞춘다(Button variant, Alert tone 과 동일). */
  danger: withTone('danger'),
  /** id 를 주면 그것만, 없으면 전부 닫는다. */
  dismiss: (id?: string) => toastStore.dismiss(id),
})
