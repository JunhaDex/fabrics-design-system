import { useId, type ComponentProps, type ReactNode } from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { tv } from 'tailwind-variants'
import { Label } from '../label/label'
import { layoutClass } from '../utils/layout-class'

export const switchStyles = tv({
  slots: {
    root: 'inline-flex items-center gap-2',
    control: [
      'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5',
      // 꺼진 상태의 트랙은 페이지 배경과 3:1 이상 구분돼야 한다(WCAG 2.2 1.4.11).
      // on-surface-muted 가 본문 대비를 보장하는 유일한 중간 회색이라 이 값을 쓴다.
      'bg-on-surface-muted data-[state=checked]:bg-brand',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:pointer-events-none disabled:opacity-50',
      'transition-colors duration-fast ease-standard',
    ],
    thumb: [
      'block size-4 rounded-full bg-field',
      'data-[state=checked]:translate-x-4',
      'transition-transform duration-fast ease-standard',
    ],
  },
})

export interface SwitchProps extends Omit<ComponentProps<typeof SwitchPrimitive.Root>, 'children'> {
  /** 스위치 오른쪽에 붙는 레이블. Field 안에서 쓸 때는 생략한다. */
  label?: ReactNode
}

export function Switch({ label, className, id, ...props }: SwitchProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const s = switchStyles()

  return (
    <div className={s.root({ class: layoutClass(className) })}>
      <SwitchPrimitive.Root id={controlId} className={s.control()} {...props}>
        <SwitchPrimitive.Thumb className={s.thumb()} />
      </SwitchPrimitive.Root>
      {label && <Label htmlFor={controlId}>{label}</Label>}
    </div>
  )
}
