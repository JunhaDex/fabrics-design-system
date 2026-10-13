/** WCAG 2.x 대비 계산. 계산색(`getComputedStyle`) 문자열을 받는다. */

/** `rgb(r, g, b)` / `rgba(...)` 문자열의 상대 휘도. */
const luminance = (color: string) =>
  (color.match(/[\d.]+/g) ?? [])
    .slice(0, 3)
    .map((v) => Number(v) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + [0.2126, 0.7152, 0.0722][i] * v, 0)

export const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
