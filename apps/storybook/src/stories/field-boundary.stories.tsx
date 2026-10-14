import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Checkbox, Input, RadioGroup, Select } from '@junhadex/core'
import { contrast } from './contrast'
import { eachMode } from './nav-items'

const meta = { title: 'Accessibility/FieldBoundary' } satisfies Meta

export default meta

/**
 * WCAG 2.2 1.4.11 Non-text Contrast: 빈 입력 필드와 체크박스는 경계가 컨트롤을 알아볼 유일한 단서이므로
 * 경계가 필드 면과 페이지 면 모두에 대해 3:1 이상이어야 한다. 모든 테마·모드에서 확인한다.
 */
export const Contrast: StoryObj = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Input aria-label="입력" />
      <Select aria-label="선택" options={[{ value: 'a', label: 'A' }]} />
      <Checkbox aria-label="체크" />
      <RadioGroup aria-label="라디오" options={[{ value: 'a', label: 'A' }]} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const fields = [
      canvas.getByRole('textbox', { name: '입력' }),
      canvas.getByRole('combobox', { name: '선택' }),
      canvas.getByRole('checkbox', { name: '체크' }),
      canvas.getByRole('radio', { name: 'A' }),
    ]
    const failures: string[] = []
    await eachMode((mode) => {
      const page = getComputedStyle(document.body).backgroundColor
      for (const f of fields) {
        // 필드는 색 전환(transition-colors)이 있어 모드를 바꾼 직후에는 이전 모드 색이 읽힌다.
        for (const a of f.getAnimations()) a.finish()
        const { borderTopColor: border, backgroundColor: face } = getComputedStyle(f)
        for (const [name, bg] of [
          ['field', face],
          ['page', page],
        ]) {
          const ratio = contrast(border, bg)
          if (ratio < 3)
            failures.push(
              `${mode} ${f.getAttribute('role') ?? f.tagName} ${name} ${ratio.toFixed(2)}`,
            )
        }
      }
    })
    await expect(failures).toEqual([])
  },
}
