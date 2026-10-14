import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Button, Input, Select, Toggle } from '@junhadex/core'

const meta = { title: 'Accessibility/ControlHeight' } satisfies Meta

export default meta

const sizes = ['sm', 'md', 'lg'] as const

/**
 * 한 행에 놓이는 컨트롤은 크기가 같으면 높이도 같아야 한다. 테두리가 없는 변형도 투명 테두리를 둬서
 * 테두리 있는 변형(secondary, Input, Select)과 높이를 맞춘다. 모든 테마에서 확인한다.
 */
export const SameHeight: StoryObj = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {sizes.map((size) => (
        <div key={size} data-size={size} className="flex items-start gap-2">
          <Button size={size}>primary</Button>
          <Button size={size} variant="secondary">
            secondary
          </Button>
          <Button size={size} variant="danger">
            danger
          </Button>
          <Button size={size} variant="ghost">
            ghost
          </Button>
          <Toggle size={size} aria-label="토글">
            T
          </Toggle>
          <Input size={size} aria-label="입력" />
          <Select size={size} aria-label="선택" options={[{ value: 'a', label: 'A' }]} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const row of canvasElement.querySelectorAll<HTMLElement>('[data-size]')) {
      const controls = [
        ...within(row).getAllByRole('button'),
        within(row).getByRole('textbox'),
        within(row).getByRole('combobox'),
      ]
      const heights = controls.map((c) => c.getBoundingClientRect().height)
      await expect(new Set(heights).size, `${row.dataset.size} ${heights.join(',')}`).toBe(1)
    }
  },
}
