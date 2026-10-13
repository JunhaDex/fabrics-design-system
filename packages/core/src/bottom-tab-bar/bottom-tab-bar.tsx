import type { ComponentProps, ElementType } from 'react'
import { tv } from '../utils/tv'
import { layoutClass } from '../utils/layout-class'
import type { NavItem, NavLinkProps } from '../utils/nav'

export const bottomTabBar = tv({
  slots: {
    root: [
      'sticky bottom-0 z-10 flex border-t border-border bg-surface',
      'pb-[env(safe-area-inset-bottom)]',
    ],
    link: [
      'flex min-h-bar flex-1 flex-col items-center justify-center gap-1 text-xs',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    ],
    // 아이콘 뒤 표시자. 활성일 때만 칠해 색 외에 모양으로도 상태를 구분한다.
    indicator: 'flex h-8 w-14 items-center justify-center rounded-control [&_svg]:size-6',
  },
  variants: {
    current: {
      true: {
        link: 'font-semibold text-on-surface',
        indicator: 'bg-brand text-on-brand',
      },
      false: { link: 'font-medium text-on-surface-muted' },
    },
  },
})

export interface BottomTabBarProps extends Omit<ComponentProps<'nav'>, 'children'> {
  items: NavItem[]
  /** 한 페이지의 여러 내비게이션 랜드마크를 구분하는 이름. */
  'aria-label': string
  /** 링크 요소. 기본 `'a'`. 라우터 링크를 넘기면 `NavLinkProps` 를 받는다. */
  linkComponent?: ElementType<NavLinkProps>
}

/**
 * 모바일 하단 탭. 항목은 3~5개를 권장한다. 표시 여부는 `className`(`md:hidden`)으로 정한다.
 * 하단 safe-area 는 소비 프로젝트가 `viewport-fit=cover` 를 설정했을 때 반영된다.
 */
export function BottomTabBar({
  items,
  linkComponent: Link = 'a',
  className,
  ...props
}: BottomTabBarProps) {
  const s = bottomTabBar()
  return (
    <nav className={s.root({ class: layoutClass(className) })} {...props}>
      {items.map(({ href, label, icon, current = false }) => (
        <Link
          key={href}
          href={href}
          aria-current={current ? 'page' : undefined}
          className={s.link({ current })}
        >
          <span className={s.indicator({ current })}>{icon}</span>
          {label}
        </Link>
      ))}
    </nav>
  )
}
