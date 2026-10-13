import type { ReactNode } from 'react'

/** SideNav·BottomTabBar 의 항목. 활성 판정은 라우터를 아는 소비자가 `current` 로 넘긴다. */
export interface NavItem {
  href: string
  label: string
  icon: ReactNode
  current?: boolean
}

/** `linkComponent` 가 받는 props. Next.js `Link` 를 그대로 넘길 수 있는 형태다. */
export interface NavLinkProps {
  href: string
  className?: string
  'aria-current'?: 'page'
  children: ReactNode
}
