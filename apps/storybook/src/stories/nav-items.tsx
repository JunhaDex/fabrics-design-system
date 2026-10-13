import { House, Shirt, Sparkles } from 'lucide'
import { Icon, type NavItem, type NavLinkProps } from '@junhadex/core'

/** SideNav·BottomTabBar 스토리가 함께 쓰는 항목. 옷장이 현재 페이지다. */
export const navItems: NavItem[] = [
  { href: '#home', label: '홈', icon: <Icon node={House} /> },
  { href: '#closet', label: '옷장', icon: <Icon node={Shirt} />, current: true },
  { href: '#styling', label: '스타일링', icon: <Icon node={Sparkles} /> },
]

/** 라우터 링크 대역. 받은 props 를 data 속성으로 드러내 전달 여부를 검증한다. */
export function TestLink({ href, className, children, ...rest }: NavLinkProps) {
  return (
    <a
      href={href}
      className={className}
      aria-current={rest['aria-current']}
      data-router-link={href}
    >
      {children}
    </a>
  )
}

/** 모드를 바꿔 가며 fn 을 실행하고 원래 모드로 되돌린다. */
export async function eachMode(fn: (mode: string) => Promise<void> | void) {
  const root = document.documentElement
  const initial = root.dataset.mode
  for (const mode of ['light', 'dark']) {
    root.dataset.mode = mode
    await fn(mode)
  }
  root.dataset.mode = initial ?? 'light'
}
