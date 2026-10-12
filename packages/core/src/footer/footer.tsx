import type { ComponentProps, ElementType } from 'react'
import { layoutClass } from '../utils/layout-class'
import type { NavItem, NavLinkProps } from '../utils/nav'
import { tv } from '../utils/tv'

export const footer = tv({
  slots: {
    root: [
      'flex flex-col gap-4 border-t border-border bg-surface text-sm text-on-surface-muted',
      'pt-6 pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))]',
      'pl-[max(1rem,env(safe-area-inset-left))] md:flex-row md:items-center md:justify-between',
    ],
    list: 'flex flex-wrap gap-x-4 gap-y-2',
    link: [
      'rounded-control underline-offset-4 outline-none hover:text-on-surface hover:underline',
      'focus-visible:ring-2 focus-visible:ring-ring',
    ],
  },
})

export interface FooterProps extends ComponentProps<'footer'> {
  /** 오른쪽 링크(약관·개인정보 처리방침 등). */
  links?: Pick<NavItem, 'href' | 'label'>[]
  /** 링크 목록 내비게이션의 이름. 주요 메뉴와 구분한다. */
  linksLabel?: string
  /** 링크 요소. 기본 `'a'`. */
  linkComponent?: ElementType<NavLinkProps>
}

/** 페이지 하단 정보 영역. `children` 은 왼쪽(저작권·브랜드), `links` 는 오른쪽에 놓인다. */
export function Footer({
  links,
  linksLabel = '하단 링크',
  linkComponent: Link = 'a',
  children,
  className,
  ...props
}: FooterProps) {
  const s = footer()
  return (
    <footer className={s.root({ class: layoutClass(className) })} {...props}>
      {children}
      {links && links.length > 0 && (
        <nav aria-label={linksLabel}>
          <ul className={s.list()}>
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={s.link()}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </footer>
  )
}
