import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Button, Input, Select, Toggle } from '@junhadex/core'

const meta = { title: 'Accessibility/TargetSize' } satisfies Meta

export default meta

/**
 * WCAG 2.2 2.5.8 Target Size (Minimum): 포인터 대상은 24×24px 이상. 밀도가 가장 높은 테마(compact)에서도
 * 가장 작은 크기가 기준을 넘는지 모든 테마에서 확인한다. Checkbox·Radio·Switch 는 대상 자체가 24px 미만이고
 * 2.5.8 의 간격 예외(24px 원이 다른 대상과 겹치지 않음)로 충족하므로 여기서 다루지 않는다.
 */
export const Minimum: StoryObj = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button size="sm">버튼</Button>
      <Toggle size="sm" aria-label="토글">
        T
      </Toggle>
      <Input size="sm" aria-label="입력" />
      <Select size="sm" aria-label="선택" options={[{ value: 'a', label: 'A' }]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const targets = [
      canvas.getByRole('button', { name: '버튼' }),
      canvas.getByRole('button', { name: '토글' }),
      canvas.getByRole('textbox', { name: '입력' }),
      canvas.getByRole('combobox', { name: '선택' }),
    ]
    for (const t of targets) {
      const { width, height } = t.getBoundingClientRect()
      await expect(Math.min(width, height)).toBeGreaterThanOrEqual(24)
    }
  },
}
