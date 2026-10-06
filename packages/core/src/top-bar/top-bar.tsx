import type { ComponentProps, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const topBar = tv({
  slots: {
    // 위쪽 safe-area 는 header 의 패딩으로 두고 높이는 안쪽 행에 준다.
    // 같은 요소에 두면 h-bar 안에 inset 이 포함되어 내용이 눌린다.
    root: 'sticky top-0 z-10 border-b border-border bg-surface pt-[env(safe-area-inset-top)]',
    row: [
      'flex h-bar items-center justify-between gap-4',
      'pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]',
    ],
  },
})

export interface TopBarProps extends Omit<ComponentProps<'header'>, 'children'> {
  /** 왼쪽 영역. 앱 이름·로고. */
  brand: ReactNode
  /** 오른쪽 영역. 모드 토글·메뉴 버튼 등. */
  actions?: ReactNode
}

/**
 * 화면 상단 바. 기본으로 sticky 이며, 끄려면 `className="relative"` 를 넘긴다.
 * safe-area 는 소비 프로젝트가 `viewport-fit=cover` 를 설정했을 때 반영된다.
 * 좌우 여백 1rem 은 고정값이라 테마가 바꿀 수 없다.
 */
export function TopBar({ brand, actions, className, ...props }: TopBarProps) {
  const { root, row } = topBar()
  return (
    <header className={root({ class: layoutClass(className) })} {...props}>
      <div className={row()}>
        {brand}
        {actions}
      </div>
    </header>
  )
}
