import type { ComponentProps, ReactNode } from 'react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import { ChevronDown } from 'lucide'
import { tv } from 'tailwind-variants'
import { Icon } from '../icon/icon'
import type { DistributiveOmit } from '../utils/distributive-omit'
import { layoutClass } from '../utils/layout-class'

export const accordion = tv({
  slots: {
    root: 'divide-y divide-border overflow-hidden rounded-surface border border-border',
    header: 'flex',
    trigger: [
      'group flex flex-1 items-center justify-between gap-2 p-control-x text-left font-medium',
      'text-on-surface hover:bg-surface-raised',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors duration-fast ease-standard',
    ],
    icon: 'shrink-0 transition-transform duration-base ease-standard group-data-[state=open]:rotate-180',
    // 애니메이션은 Content 자신에 걸어야 한다 — Radix 가
    // --radix-accordion-content-height 를 이 요소에만 심는다.
    content:
      'overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    // 패딩을 Content 에 두면 height 전환이 패딩만큼 튄다.
    body: 'p-control-x pt-0 text-on-surface-muted',
  },
})

export interface AccordionItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

/**
 * `type` 으로 갈리는 판별 유니온이므로 `DistributiveOmit` 을 쓴다.
 * `type` 에 기본값을 주지 않는다 — 기본값을 주면 유니온이 무너져
 * `onValueChange` 의 인자가 `string | string[]` 로 뭉개진다.
 */
export type AccordionProps = DistributiveOmit<
  ComponentProps<typeof AccordionPrimitive.Root>,
  'children'
> & {
  items: AccordionItem[]
  /** 제목 레벨. 기본 3 — Radix Header 기본값과 같다. */
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

/**
 * Radix Accordion 을 items 배열 하나로 감싼 단일 컴포넌트.
 * 높이 전환은 `--sem-duration-base` 를 참조하므로 테마가 모션을 교체할 수 있고
 * `prefers-reduced-motion` 도 슬롯 한 곳에서 걸린다.
 */
export function Accordion({ items, headingLevel = 3, className, ...props }: AccordionProps) {
  const s = accordion()
  const Heading = `h${headingLevel}` as const

  return (
    <AccordionPrimitive.Root className={s.root({ class: layoutClass(className) })} {...props}>
      {items.map((item) => (
        <AccordionPrimitive.Item key={item.value} value={item.value} disabled={item.disabled}>
          {/* Header 는 Primitive.h3 고정이라 asChild 로 요소를 갈아끼운다. */}
          <AccordionPrimitive.Header asChild>
            <Heading className={s.header()}>
              <AccordionPrimitive.Trigger className={s.trigger()}>
                {item.label}
                <Icon node={ChevronDown} size={16} className={s.icon()} />
              </AccordionPrimitive.Trigger>
            </Heading>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className={s.content()}>
            <div className={s.body()}>{item.content}</div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  )
}
