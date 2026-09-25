import type { ComponentProps, ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide'
import { tv, type VariantProps } from 'tailwind-variants'
import { Icon } from '../icon/icon'
import { layoutClass } from '../utils/layout-class'

export const alert = tv({
  slots: {
    root: 'flex gap-3 rounded-surface p-control-x',
    body: 'flex min-w-0 flex-col gap-1',
    title: 'font-medium',
    description: 'text-sm',
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

/** 네이티브 `title`(브라우저 툴팁 문자열)과 이름이 겹치므로 제외하고 다시 정의한다. */
export interface AlertProps
  extends Omit<ComponentProps<'div'>, 'title'>, VariantProps<typeof alert> {
  title?: ReactNode
  /** 기본 아이콘을 바꾼다. 의미는 글이 전달하므로 아이콘은 장식이다. */
  icon?: ReactNode
}

export function Alert({
  tone = 'info',
  title,
  icon,
  children,
  className,
  role,
  ...props
}: AlertProps) {
  const s = alert({ tone })

  return (
    <div
      // 오류는 즉시 알리고(alert) 나머지는 정중하게 전달한다(status).
      role={role ?? (tone === 'danger' ? 'alert' : 'status')}
      className={s.root({ class: layoutClass(className) })}
      {...props}
    >
      {icon ?? <Icon node={toneIcons[tone]} size={20} className="mt-0.5 shrink-0" />}
      <div className={s.body()}>
        {title && <p className={s.title()}>{title}</p>}
        {children && <div className={s.description()}>{children}</div>}
      </div>
    </div>
  )
}
