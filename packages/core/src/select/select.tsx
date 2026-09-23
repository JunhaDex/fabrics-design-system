import type { ReactNode } from 'react'
import { Select as SelectPrimitive } from 'radix-ui'
import { Check, ChevronDown } from 'lucide'
import { tv, type VariantProps } from 'tailwind-variants'
import { Icon } from '../icon/icon'
import { layoutClass } from '../utils/layout-class'

export const select = tv({
  slots: {
    trigger: [
      'inline-flex w-full items-center justify-between gap-2',
      'rounded-control border border-border bg-field text-on-surface',
      'px-control-x py-control-y',
      'data-[placeholder]:text-on-surface-muted',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'aria-invalid:border-danger aria-invalid:focus-visible:ring-danger',
      'transition-colors duration-fast ease-standard',
    ],
    content: [
      'z-50 overflow-hidden rounded-surface border border-border',
      'bg-surface-overlay text-on-surface shadow-overlay',
      'data-[state=closed]:animate-exit data-[state=open]:animate-enter',
    ],
    viewport: 'p-1',
    item: [
      'flex cursor-default items-center justify-between gap-2 select-none',
      'rounded-control px-control-x py-1 outline-none',
      'data-[highlighted]:bg-surface-raised',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    ],
  },
  variants: {
    size: {
      sm: { trigger: 'text-sm', item: 'text-sm' },
      md: { trigger: 'text-base', item: 'text-base' },
      lg: { trigger: 'text-lg', item: 'text-lg' },
    },
  },
  defaultVariants: { size: 'md' },
})

export interface SelectOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface SelectProps extends VariantProps<typeof select> {
  options: SelectOption[]
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  /** 트리거에 붙는다. Field 가 주입한다. */
  id?: string
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

/**
 * Radix Select 를 options 배열 하나로 감싼 단일 컴포넌트.
 * Root 가 받는 값 관련 prop 과 Trigger 가 받는 id/aria 를 나눠 전달한다.
 */
export function Select({
  options,
  placeholder,
  size,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  required,
  name,
  id,
  className,
  ...aria
}: SelectProps) {
  const s = select({ size })

  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
      required={required}
      name={name}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={s.trigger({ class: layoutClass(className) })}
        {...aria}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <Icon node={ChevronDown} size={16} />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className={s.content()} position="popper" sideOffset={4}>
          <SelectPrimitive.Viewport className={s.viewport()}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={s.item()}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Icon node={Check} size={16} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
