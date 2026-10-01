import type { ComponentProps, ReactNode } from 'react'
import { Tabs as TabsPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const tabs = tv({
  slots: {
    root: 'flex',
    list: 'flex shrink-0',
    trigger: [
      'relative shrink-0 px-control-x py-control-y font-medium whitespace-nowrap',
      'text-on-surface-muted data-[state=active]:text-on-surface',
      'border-transparent data-[state=active]:border-brand',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors duration-fast ease-standard',
    ],
    content: 'min-w-0 grow p-control-x outline-none focus-visible:ring-2 focus-visible:ring-ring',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'flex-row overflow-x-auto border-b border-border',
        trigger: '-mb-px border-b-2',
      },
      vertical: {
        root: 'flex-row',
        list: 'flex-col overflow-y-auto border-r border-border',
        trigger: '-mr-px border-r-2',
      },
    },
  },
  defaultVariants: { orientation: 'horizontal' },
})

export interface TabItem {
  value: string
  label: ReactNode
  content: ReactNode
  disabled?: boolean
}

/** `orientation` 은 Radix prop 이자 variant 키다. `VariantProps` 를 함께 상속하면 충돌한다. */
export type TabsProps = Omit<ComponentProps<typeof TabsPrimitive.Root>, 'children'> & {
  items: TabItem[]
}

/**
 * Radix Tabs 를 items 배열 하나로 감싼 단일 컴포넌트.
 * 활성 표시는 트리거의 아래(세로일 때 오른쪽) 테두리이며 색은 `border-brand` 다.
 * 탭이 넘치면 리스트가 스크롤한다 — 안에 포커스 가능한 트리거가 있으므로
 * 스크롤 영역에 별도 `tabIndex` 는 필요하지 않다.
 *
 * `activationMode` 는 Radix 기본값 `'automatic'`(포커스 이동 즉시 선택)이다.
 * 패널 콘텐츠가 무거우면 `'manual'` 로 바꿔 Enter/Space 에서만 선택한다.
 */
export function Tabs({ items, orientation = 'horizontal', className, ...props }: TabsProps) {
  const s = tabs({ orientation })

  return (
    <TabsPrimitive.Root
      orientation={orientation}
      className={s.root({ class: layoutClass(className) })}
      {...props}
    >
      <TabsPrimitive.List className={s.list()}>
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={s.trigger()}
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className={s.content()}>
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
