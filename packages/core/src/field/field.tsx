import { cloneElement, useId, type ComponentProps, type ReactElement, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Label } from '../label/label'
import { layoutClass } from '../utils/layout-class'

export const field = tv({
  slots: {
    root: 'flex flex-col gap-field-gap',
    description: 'text-sm text-on-surface-muted',
    error: 'text-sm text-danger',
    marker: 'text-danger',
  },
})

/** Field 가 children 에 주입하는 속성. 컨트롤은 이 중 필요한 것만 받으면 된다. */
interface ControlProps {
  id?: string
  required?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label: ReactNode
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  /** 단일 컨트롤. id 와 aria 속성이 주입된다. */
  children: ReactElement<ControlProps>
}

/**
 * 레이블·컨트롤·설명·오류를 묶고 접근성 연결을 대신 해 준다.
 * 컨트롤에 id 를 주입해 레이블과 잇고, 설명/오류를 `aria-describedby` 로 건다.
 * 오류가 있으면 `aria-invalid` 를 세워 컨트롤의 오류 스타일이 함께 켜진다.
 */
export function Field({
  label,
  description,
  error,
  required,
  children,
  className,
  ...props
}: FieldProps) {
  const id = useId()
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const s = field()

  return (
    <div className={s.root({ class: layoutClass(className) })} {...props}>
      <Label htmlFor={id}>
        {label}
        {/* 필수 표시는 시각용. 스크린 리더는 컨트롤의 required 상태로 안다. */}
        {required && (
          <span aria-hidden className={s.marker()}>
            {' *'}
          </span>
        )}
      </Label>
      {cloneElement(children, {
        id,
        required: required ?? children.props.required,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {description && (
        <p id={descriptionId} className={s.description()}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className={s.error()}>
          {error}
        </p>
      )}
    </div>
  )
}
