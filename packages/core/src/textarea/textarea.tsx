import type { ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { input } from '../input/input'
import { layoutClass } from '../utils/layout-class'

/** Input 의 면·테두리·포커스·오류 처리를 그대로 쓰고 높이 관련만 더한다. */
export const textarea = tv({
  extend: input,
  slots: {
    root: 'min-h-20 resize-y',
  },
})

export interface TextareaProps extends ComponentProps<'textarea'>, VariantProps<typeof textarea> {}

export function Textarea({ size, className, ...props }: TextareaProps) {
  const { root } = textarea({ size })
  return <textarea className={root({ class: layoutClass(className) })} {...props} />
}
