import type { ComponentProps } from 'react'
import { layoutClass } from '../utils/layout-class'
import { tv } from '../utils/tv'

/**
 * 뷰포트가 아니라 놓인 영역의 폭(컨테이너 쿼리)으로 펼친다. 컨테이너는 자기 자신을
 * 질의할 수 없으므로 바깥 요소가 `@container`, 안쪽이 grid 다.
 * `@3xl`(48rem) 은 뷰포트 `md` 와 같은 폭이다.
 */
export const columns = tv({
  slots: {
    root: '@container',
    grid: 'grid grid-cols-1 gap-stack',
  },
  variants: {
    cols: {
      2: { grid: '@3xl:grid-cols-2' },
      3: { grid: '@3xl:grid-cols-3' },
      4: { grid: '@3xl:grid-cols-4' },
    },
  },
  defaultVariants: { cols: 2 },
})

export interface ColumnsProps extends ComponentProps<'div'> {
  /** 영역 폭이 48rem 이상일 때의 열 수. 좁으면 한 열로 쌓인다. */
  cols?: 2 | 3 | 4
}

/** 같은 폭의 열. 자식 하나가 열 하나다. 간격은 `sem.spacing.stack`. */
export function Columns({ cols, className, children, ...props }: ColumnsProps) {
  const s = columns({ cols })
  return (
    <div className={s.root({ class: layoutClass(className) })} {...props}>
      <div className={s.grid()}>{children}</div>
    </div>
  )
}
