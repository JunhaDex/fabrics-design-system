/**
 * className 오버라이드는 레이아웃 속성만 허용한다.
 * 색상·radius 등 룩앤필은 토큰과 variant prop 으로만 제어한다.
 */
const LAYOUT = /^(?:[a-z]+:)*-?(?:m[trblxyse]?|w|h|min-w|min-h|max-w|max-h|size|flex|grow|shrink|basis|self|justify-self|col|row|order|gap|gap-x|gap-y|inset|top|right|bottom|left|z|block|inline|hidden|grid|contents|relative|absolute|fixed|sticky)(?:-.+)?$/

export function layoutClass(className?: string): string | undefined {
  if (!className) return undefined
  const kept = className.split(/\s+/).filter((c) => LAYOUT.test(c))
  return kept.length ? kept.join(' ') : undefined
}
