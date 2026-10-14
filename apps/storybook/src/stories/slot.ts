/**
 * 의미 슬롯(`--sem-*`) 길이를 px 로 읽는다. 테마마다 밀도가 다르므로 크기 단언은 고정값 대신 이 값을 쓴다.
 * 슬롯은 `<html data-theme>` 아래에만 있으므로 body 에 임시 요소를 붙여 계산한다.
 */
export const slotPx = (name: string) => {
  const el = document.createElement('div')
  el.style.width = `var(--sem-${name})`
  document.body.append(el)
  const px = el.getBoundingClientRect().width
  el.remove()
  return px
}
