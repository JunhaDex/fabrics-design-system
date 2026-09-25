import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const skeleton = tv({
  slots: {
    root: 'animate-pulse rounded-control bg-track',
  },
})

export type SkeletonProps = ComponentProps<'div'>

/**
 * 자리표시자. 크기는 레이아웃 className 으로 정한다.
 * 스크린 리더에는 의미가 없으므로 감춘다. 로딩 상태는 감싼 영역이
 * `role="status"` + `aria-busy` 로 알린다. 일반 div 에 `aria-label` 만
 * 붙이면 이름을 가질 수 없는 역할이라 접근성 검사에 걸린다.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  const { root } = skeleton()
  return <div aria-hidden className={root({ class: layoutClass(className) })} {...props} />
}
