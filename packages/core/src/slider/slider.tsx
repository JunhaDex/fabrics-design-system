import type { ComponentProps } from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const slider = tv({
  slots: {
    root: 'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
    track: 'relative h-1.5 w-full grow overflow-hidden rounded-full bg-track',
    range: 'absolute h-full bg-brand',
    thumb: [
      'block size-4 rounded-full border-2 border-brand bg-field',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'transition-colors duration-fast ease-standard',
    ],
  },
})

export type SliderProps = Omit<ComponentProps<typeof SliderPrimitive.Root>, 'children'>

/** 손잡이 개수는 value(또는 defaultValue) 길이를 따른다. */
export function Slider({ className, ...props }: SliderProps) {
  const s = slider()
  const thumbs = props.value ?? props.defaultValue ?? [props.min ?? 0]

  return (
    <SliderPrimitive.Root className={s.root({ class: layoutClass(className) })} {...props}>
      <SliderPrimitive.Track className={s.track()}>
        <SliderPrimitive.Range className={s.range()} />
      </SliderPrimitive.Track>
      {thumbs.map((_, index) => (
        <SliderPrimitive.Thumb key={index} className={s.thumb()} aria-label={props['aria-label']} />
      ))}
    </SliderPrimitive.Root>
  )
}
