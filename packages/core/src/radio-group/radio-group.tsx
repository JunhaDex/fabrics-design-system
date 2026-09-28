import { useId, type ComponentProps, type ReactNode } from 'react'
import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { Label } from '../label/label'
import { layoutClass } from '../utils/layout-class'

export const radioGroup = tv({
  slots: {
    root: 'flex gap-field-gap',
    option: 'inline-flex items-center gap-2',
    item: [
      'inline-flex size-4 shrink-0 items-center justify-center',
      'rounded-full border border-border-strong bg-field',
      'data-[state=checked]:border-brand',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'aria-invalid:border-danger',
      'transition-colors duration-fast ease-standard',
    ],
    indicator: 'block size-2 rounded-full bg-brand',
  },
  variants: {
    orientation: {
      vertical: { root: 'flex-col' },
      horizontal: { root: 'flex-row items-center gap-4' },
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

export interface RadioOption {
  value: string
  label: ReactNode
  disabled?: boolean
}

export interface RadioGroupProps extends Omit<
  ComponentProps<typeof RadioGroupPrimitive.Root>,
  'children'
> {
  options: RadioOption[]
}

export function RadioGroup({ options, orientation, className, ...props }: RadioGroupProps) {
  const id = useId()
  const s = radioGroup({ orientation })

  return (
    <RadioGroupPrimitive.Root
      className={s.root({ class: layoutClass(className) })}
      orientation={orientation}
      {...props}
    >
      {options.map((option) => {
        const optionId = `${id}-${option.value}`
        return (
          <div key={option.value} className={s.option()}>
            <RadioGroupPrimitive.Item
              id={optionId}
              value={option.value}
              disabled={option.disabled}
              className={s.item()}
            >
              <RadioGroupPrimitive.Indicator className={s.indicator()} />
            </RadioGroupPrimitive.Item>
            <Label htmlFor={optionId}>{option.label}</Label>
          </div>
        )
      })}
    </RadioGroupPrimitive.Root>
  )
}
