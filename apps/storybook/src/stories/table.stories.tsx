import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Table, type TableColumn } from '@junhadex/core'

interface Fabric {
  code: string
  name: string
  width: number
  weight: number
}

const rows: Fabric[] = [
  { code: 'FB-1001', name: '코튼 트윌', width: 150, weight: 220 },
  { code: 'FB-1002', name: '리넨 혼방', width: 140, weight: 180 },
  { code: 'FB-1003', name: '폴리 옥스포드', width: 160, weight: 240 },
]

const columns: TableColumn<Fabric>[] = [
  { key: 'code', header: '품번', cell: (row) => row.code },
  { key: 'name', header: '품명', cell: (row) => row.name },
  { key: 'width', header: '폭(cm)', cell: (row) => row.width, align: 'end' },
  { key: 'weight', header: '중량(g/㎡)', cell: (row) => row.weight, align: 'end' },
]

const meta = {
  title: 'Core/Table',
  component: Table<Fabric>,
  tags: ['autodocs'],
  args: { columns, rows, getRowId: (row: Fabric) => row.code },
  // 좁은 컨테이너로 가로 스크롤을 만들어 스크롤 영역 규칙까지 검사에 걸리게 한다.
  render: (args) => (
    <div className="w-72">
      <Table {...args} />
    </div>
  ),
} satisfies Meta<typeof Table<Fabric>>

export default meta
type Story = StoryObj<typeof meta>

/** 이름이 없으면 `role="region"` 을 만들지 않는다. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('table')).toBeInTheDocument()
    await expect(canvas.queryByRole('region')).toBeNull()

    // 실제로 넘쳐야 axe 의 scrollable-region-focusable 규칙이 걸린다.
    const scroll = canvas.getByRole('table').parentElement as HTMLElement
    await expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth)
    await expect(scroll).toHaveAttribute('tabindex', '0')

    const headers = canvas.getAllByRole('columnheader')
    await expect(headers).toHaveLength(4)
    for (const header of headers) await expect(header).toHaveAttribute('scope', 'col')
    await expect(canvas.getAllByRole('row')).toHaveLength(4)
  },
}

/** `caption` 은 테이블의 이름이다. 래퍼 region 은 `aria-labelledby` 로 같은 이름을 쓴다. */
export const WithCaption: Story = {
  args: { caption: '원단 목록' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByRole('region', { name: '원단 목록' })
    await expect(region).toHaveAttribute('tabindex', '0')
    await expect(canvas.getByRole('table', { name: '원단 목록' })).toBeInTheDocument()
  },
}

/** `aria-label` 만 주면 region 과 table 이 같은 이름을 갖는다. */
export const WithAriaLabel: Story = {
  args: { 'aria-label': '원단 재고' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('region', { name: '원단 재고' })).toBeInTheDocument()
    await expect(canvas.getByRole('table', { name: '원단 재고' })).toBeInTheDocument()
  },
}

/** 숫자 열은 오른쪽 정렬한다. 셀 패딩은 `sem.spacing.cell-x`/`cell-y` 슬롯이다. */
export const Alignment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const cells = canvas.getAllByRole('cell')
    const style = getComputedStyle(cells[0])
    await expect(style.paddingLeft).toBe('16px')
    await expect(style.paddingTop).toBe('8px')
    await expect(style.textAlign).toBe('left')
    await expect(getComputedStyle(cells[2]).textAlign).toBe('right')
  },
}
