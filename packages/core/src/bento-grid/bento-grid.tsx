import type { ComponentProps, ReactNode } from 'react'
import { layoutClass } from '../utils/layout-class'
import { tv } from '../utils/tv'

/**
 * 배치만 담당한다. 타일의 면·모서리는 `content` 가 정한다(Card 는 프로젝트가 정의).
 * Columns 처럼 놓인 영역의 폭(컨테이너 쿼리)으로 2열 → 4열(`@3xl`)로 펼친다.
 * span 클래스는 Tailwind 가 스캔할 수 있도록 리터럴로 적는다.
 */
export const bentoGrid = tv({
  slots: {
    root: '@container',
    grid: 'grid grid-flow-dense auto-rows-[minmax(10rem,auto)] grid-cols-2 gap-stack @3xl:grid-cols-4',
    item: 'min-w-0',
  },
  variants: {
    // 2열일 때는 2칸을 넘지 않는다.
    colSpan: {
      1: { item: 'col-span-1' },
      2: { item: 'col-span-2' },
      3: { item: 'col-span-2 @3xl:col-span-3' },
      4: { item: 'col-span-2 @3xl:col-span-4' },
    },
    rowSpan: {
      1: { item: 'row-span-1' },
      2: { item: 'row-span-2' },
      3: { item: 'row-span-3' },
    },
  },
  defaultVariants: { colSpan: 1, rowSpan: 1 },
})

export interface BentoItem {
  id: string
  content: ReactNode
  /** 4열 기준 가로 칸 수. 2열에서는 최대 2칸. */
  colSpan?: 1 | 2 | 3 | 4
  rowSpan?: 1 | 2 | 3
}

export interface BentoGridProps extends Omit<ComponentProps<'div'>, 'children'> {
  items: BentoItem[]
}

/** 크기가 다른 타일을 격자에 채운다. 빈칸은 뒤 항목으로 메운다(`grid-flow-dense`). */
export function BentoGrid({ items, className, ...props }: BentoGridProps) {
  const s = bentoGrid()
  return (
    <div className={s.root({ class: layoutClass(className) })} {...props}>
      <div className={s.grid()}>
        {items.map(({ id, content, colSpan, rowSpan }) => (
          <div key={id} className={bentoGrid({ colSpan, rowSpan }).item()}>
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}
