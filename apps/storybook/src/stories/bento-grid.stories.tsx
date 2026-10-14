import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { BentoGrid, type BentoItem } from '@junhadex/core'
import { slotPx } from './slot'

const tile = (label: string) => (
  <div className="h-full rounded-surface bg-surface-raised p-4" data-testid={label}>
    {label}
  </div>
)

const items: BentoItem[] = [
  { id: 'today', content: tile('오늘의 코디'), colSpan: 2, rowSpan: 2 },
  { id: 'weather', content: tile('날씨') },
  { id: 'recent', content: tile('최근 등록'), rowSpan: 2 },
  { id: 'category', content: tile('카테고리') },
  { id: 'stats', content: tile('통계'), colSpan: 4 },
]

const meta = {
  title: 'Core/BentoGrid',
  component: BentoGrid,
  tags: ['autodocs'],
  args: { items },
} satisfies Meta<typeof BentoGrid>

export default meta
type Story = StoryObj<typeof meta>

/** 행 최소 높이 10rem. 간격은 stack 슬롯이라 테마마다 다르다. */
const ROW = 160

const box = (canvas: HTMLElement, label: string) =>
  within(canvas).getByTestId(label).parentElement!.getBoundingClientRect()

/** 영역이 48rem 이상이면 4열. span 이 칸 수 + 사이 간격만큼의 크기가 된다. */
export const Wide: Story = {
  render: (args) => (
    <div className="w-[848px]">
      <BentoGrid {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const GAP = slotPx('spacing-stack')
    // 4열: (848 - 3 × 간격) / 4
    const cell = (848 - 3 * GAP) / 4
    const today = box(canvasElement, '오늘의 코디')
    await expect(today.width).toBe(cell * 2 + GAP)
    await expect(today.height).toBe(ROW * 2 + GAP)
    await expect(box(canvasElement, '날씨').width).toBe(cell)
    await expect(box(canvasElement, '최근 등록').height).toBe(ROW * 2 + GAP)
    await expect(box(canvasElement, '통계').width).toBe(848)
  },
}

/** 좁으면 2열. 2칸을 넘는 span 은 전체 폭으로 줄어든다. */
export const Narrow: Story = {
  render: (args) => (
    <div className="w-[400px]">
      <BentoGrid {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const GAP = slotPx('spacing-stack')
    await expect(box(canvasElement, '오늘의 코디').width).toBe(400)
    await expect(box(canvasElement, '통계').width).toBe(400)
    await expect(box(canvasElement, '날씨').width).toBe((400 - GAP) / 2)
  },
}

/** 레이아웃 클래스만 통과한다. `mt-8` 은 남고 `bg-danger` 는 버려진다. */
export const LayoutOverride: Story = {
  args: { className: 'mt-8 bg-danger' },
  render: (args) => <BentoGrid {...args} data-testid="bento" />,
  play: async ({ canvasElement }) => {
    const root = within(canvasElement).getByTestId('bento')
    await expect(root).toHaveClass('mt-8')
    await expect(root).not.toHaveClass('bg-danger')
  },
}
