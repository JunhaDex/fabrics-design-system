import type { SVGProps } from 'react'
import type { IconNode } from 'lucide'
import { layoutClass } from '../utils/layout-class'

export type { IconNode }

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** lucide 코어 패키지의 아이콘 데이터. `import { Check } from 'lucide'` */
  node: IconNode
  /** 기본값 `'1em'` — 주변 글자 크기를 따라간다. */
  size?: number | string
}

/**
 * lucide 아이콘 데이터를 그리는 얇은 렌더러.
 *
 * `lucide-react` 대신 프레임워크 무관한 `lucide` 코어를 쓴다. React 종속이
 * 이 파일 한 곳에만 있으므로 다른 프레임워크로 포팅할 때 아이콘 선택과
 * 데이터 레이어를 그대로 재사용할 수 있다.
 *
 * `aria-label` 이 없으면 장식용으로 보고 접근성 트리에서 감춘다. 아이콘만으로
 * 의미를 전달하는 자리에서는 `aria-label` 을 넘겨야 한다.
 */
export function Icon({ node, size = '1em', className, ...props }: IconProps) {
  const labelled = props['aria-label'] != null || props['aria-labelledby'] != null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      className={layoutClass(className)}
      {...props}
    >
      {node.map(([Tag, attrs], i) => (
        <Tag key={i} {...attrs} />
      ))}
    </svg>
  )
}
