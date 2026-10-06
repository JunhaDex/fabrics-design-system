import type { ComponentProps, ElementType } from 'react'
import { tv } from '../utils/tv'
import { layoutClass } from '../utils/layout-class'
import type { NavItem, NavLinkProps } from '../utils/nav'

export const sideNav = tv({
  slots: {
    // TopBar 아래에 붙는 배치가 기본이다. TopBar 없이 쓰면 `top-0 h-dvh` 로 덮어쓴다.
    root: [
      'sticky top-bar flex h-[calc(100dvh-var(--sem-spacing-bar))] w-nav shrink-0 flex-col gap-1',
      'self-start overflow-y-auto border-r border-border p-3',
    ],
    link: [
      'flex min-h-11 items-center gap-3 rounded-control px-3 text-sm',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      '[&_svg]:size-5 [&_svg]:shrink-0',
    ],
  },
  variants: {
    // 활성 항목은 면 색과 굵기 두 가지로 구분한다. 색만으로 상태를 전달하지 않는다.
    current: {
      true: { link: 'bg-brand-subtle font-semibold text-on-brand-subtle' },
      false: { link: 'font-medium text-on-surface-muted hover:bg-surface-raised' },
    },
  },
})

export interface SideNavProps extends Omit<ComponentProps<'nav'>, 'children'> {
  items: NavItem[]
  /** 한 페이지의 여러 내비게이션 랜드마크를 구분하는 이름. */
  'aria-label': string
  /** 링크 요소. 기본 `'a'`. 라우터 링크를 넘기면 `NavLinkProps` 를 받는다. */
  linkComponent?: ElementType<NavLinkProps>
}

/** md 이상 화면의 세로 내비게이션. 표시 여부는 `className`(`hidden md:flex`)으로 정한다. */
export function SideNav({ items, linkComponent: Link = 'a', className, ...props }: SideNavProps) {
  const s = sideNav()
  return (
    <nav className={s.root({ class: layoutClass(className) })} {...props}>
      {items.map(({ href, label, icon, current = false }) => (
        <Link
          key={href}
          href={href}
          aria-current={current ? 'page' : undefined}
          className={s.link({ current })}
        >
          {icon}
          {label}
        </Link>
      ))}
    </nav>
  )
}
