import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Progress, Slider } from '@junhadex/core'
import { contrast } from './contrast'
import { eachMode } from './nav-items'

const meta = { title: 'Accessibility/ValueContrast' } satisfies Meta

export default meta

/**
 * WCAG 2.2 1.4.11 Non-text Contrast: Progress·Slider 는 값을 채워진 구간과 손잡이로 전달한다. 채워지지 않은
 * 트랙은 배경 장식으로 보고 대비를 요구하지 않는 대신, 채워진 구간은 트랙과 페이지 면 모두에 대해, 손잡이 테두리는
 * 트랙과 페이지 면에 대해 3:1 이상이어야 한다. 모든 테마·모드에서 확인한다.
 */
export const Contrast: StoryObj = {
  render: () => (
    <div className="flex w-64 flex-col gap-6">
      <Progress value={50} aria-label="진행" />
      <Slider defaultValue={[50]} aria-label="값" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const progress = canvasElement.querySelector<HTMLElement>('[role="progressbar"]')!
    const slider = canvasElement.querySelector<HTMLElement>('[data-orientation]')!
    const range = slider.querySelector<HTMLElement>('[data-orientation] > span > span')!
    const thumb = canvasElement.querySelector<HTMLElement>('[role="slider"]')!
    const color = (el: Element, prop: 'backgroundColor' | 'borderTopColor') =>
      getComputedStyle(el)[prop]
    const failures: string[] = []
    await eachMode((mode) => {
      for (const a of thumb.getAnimations()) a.finish()
      const page = color(document.body, 'backgroundColor')
      const pairs: [string, string, string][] = [
        [
          'progress/track',
          color(progress.firstElementChild!, 'backgroundColor'),
          color(progress, 'backgroundColor'),
        ],
        ['progress/page', color(progress.firstElementChild!, 'backgroundColor'), page],
        [
          'range/track',
          color(range, 'backgroundColor'),
          color(range.parentElement!, 'backgroundColor'),
        ],
        ['range/page', color(range, 'backgroundColor'), page],
        [
          'thumb/track',
          color(thumb, 'borderTopColor'),
          color(range.parentElement!, 'backgroundColor'),
        ],
        ['thumb/page', color(thumb, 'borderTopColor'), page],
      ]
      for (const [name, a, b] of pairs) {
        const ratio = contrast(a, b)
        if (ratio < 3) failures.push(`${mode} ${name} ${ratio.toFixed(2)}`)
      }
    })
    await expect(failures).toEqual([])
  },
}
