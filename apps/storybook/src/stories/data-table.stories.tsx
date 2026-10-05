import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { DataTable, type DataTableColumn } from '@junhadex/core'

interface Fabric {
  code: string
  name: string
  width: number
}

/**
 * 대소문자 섞인 영문 이름을 함께 둔다. 코드 포인트 순서는 `Cotton` 을 `aramid` 앞에
 * 놓지만 로케일 비교는 `aramid` 를 앞에 놓으므로, 이 두 행이 `localeCompare` 를
 * 실제로 검증한다.
 */
const rows: Fabric[] = [
  { code: 'FB-1001', name: '코튼 트윌', width: 150 },
  { code: 'FB-1002', name: '리넨 혼방', width: 140 },
  { code: 'FB-1003', name: '폴리 옥스포드', width: 160 },
  { code: 'FB-1004', name: 'Cotton twill', width: 145 },
  { code: 'FB-1005', name: 'aramid 혼방', width: 135 },
]

const original = ['코튼 트윌', '리넨 혼방', '폴리 옥스포드', 'Cotton twill', 'aramid 혼방']
const byNameAsc = ['aramid 혼방', 'Cotton twill', '리넨 혼방', '코튼 트윌', '폴리 옥스포드']
const byWidthDesc = ['폴리 옥스포드', '코튼 트윌', 'Cotton twill', '리넨 혼방', 'aramid 혼방']

const columns: DataTableColumn<Fabric>[] = [
  { key: 'code', header: '품번', cell: (row) => row.code },
  { key: 'name', header: '품명', cell: (row) => row.name, sortValue: (row) => row.name },
  {
    key: 'width',
    header: '폭(cm)',
    cell: (row) => row.width,
    align: 'end',
    sortValue: (row) => row.width,
  },
]

const meta = {
  title: 'Core/DataTable',
  component: DataTable<Fabric>,
  tags: ['autodocs'],
  args: { columns, rows, getRowId: (row: Fabric) => row.code, 'aria-label': '원단 목록' },
} satisfies Meta<typeof DataTable<Fabric>>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 행 순서를 품명 열 기준으로 읽는다. 헤더 행은 제외한다.
 * 열 위치는 헤더에서 찾는다 — 선택 열이 켜지면 앞으로 한 칸 밀린다.
 */
const names = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement)
  const index = canvas
    .getAllByRole('columnheader')
    .findIndex((header) => header.textContent?.includes('품명'))
  return canvas
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[index].textContent)
}

/** 품명 열의 정렬 트리거. */
const sortByName = (canvasElement: HTMLElement) => {
  const header = within(canvasElement)
    .getAllByRole('columnheader')
    .find((cell) => cell.textContent?.includes('품명')) as HTMLElement
  return within(header).getByRole('button')
}

/** 비제어. 헤더를 누를 때마다 none → asc → desc → none 으로 순환한다. */
export const Sorting: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [code, name] = canvas.getAllByRole('columnheader')

    // sortValue 가 없는 열은 트리거도 aria-sort 도 없다.
    await expect(within(code).queryByRole('button')).toBeNull()
    await expect(code).not.toHaveAttribute('aria-sort')
    await expect(name).toHaveAttribute('aria-sort', 'none')
    await expect(names(canvasElement)).toEqual(original)

    const trigger = sortByName(canvasElement)
    const live = canvasElement.querySelector('[aria-live="polite"]') as HTMLElement

    await userEvent.click(trigger)
    await expect(name).toHaveAttribute('aria-sort', 'ascending')
    await expect(names(canvasElement)).toEqual(byNameAsc)
    await expect(live).toHaveTextContent('품명 기준 오름차순 정렬')

    await userEvent.click(trigger)
    await expect(name).toHaveAttribute('aria-sort', 'descending')
    await expect(names(canvasElement)).toEqual([...byNameAsc].reverse())
    await expect(live).toHaveTextContent('품명 기준 내림차순 정렬')

    await userEvent.click(trigger)
    await expect(name).toHaveAttribute('aria-sort', 'none')
    await expect(names(canvasElement)).toEqual(original)
    await expect(live).toHaveTextContent('정렬 해제')
  },
}

/**
 * 제어. `sort` 를 넘기면 표는 그 값만 따른다 — 클릭은 콜백만 부르고 DOM 은 그대로다.
 * 서버 사이드 정렬의 연결점이다.
 */
export const ControlledSorting: Story = {
  args: { sort: { key: 'width', direction: 'desc' }, onSortChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const width = canvas
      .getAllByRole('columnheader')
      .find((cell) => cell.textContent?.includes('폭')) as HTMLElement

    await expect(width).toHaveAttribute('aria-sort', 'descending')
    await expect(names(canvasElement)).toEqual(byWidthDesc)

    await userEvent.click(sortByName(canvasElement))
    await expect(args.onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })

    // 부모가 sort 를 바꾸지 않았으므로 순서와 aria-sort 가 유지된다.
    await expect(names(canvasElement)).toEqual(byWidthDesc)
    await expect(width).toHaveAttribute('aria-sort', 'descending')
  },
}

/** 다중 선택. 헤더 체크박스는 보이는 행 전체를 토글하고 일부 선택이면 중간 상태다. */
export const Selection: Story = {
  args: { selectable: true, onSelectedIdsChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const header = canvas.getByRole('checkbox', { name: '전체 선택' })
    await expect(header).not.toBeChecked()

    const linen = canvas.getByRole('checkbox', { name: 'FB-1002 선택' })
    await userEvent.click(linen)
    await expect(args.onSelectedIdsChange).toHaveBeenCalledWith(['FB-1002'])
    await expect(linen).toBeChecked()
    await expect(linen.closest('tr')).toHaveAttribute('data-selected', 'true')

    // 일부만 선택된 상태의 헤더는 mixed 다.
    await expect(header).toHaveAttribute('aria-checked', 'mixed')
    await expect(header).toHaveAttribute('data-state', 'indeterminate')

    await userEvent.click(header)
    await expect(header).toBeChecked()
    await expect(canvas.getAllByRole('checkbox', { checked: true })).toHaveLength(rows.length + 1)

    await userEvent.click(header)
    await expect(args.onSelectedIdsChange).toHaveBeenLastCalledWith([])
    await expect(canvas.queryAllByRole('checkbox', { checked: true })).toHaveLength(0)
  },
}

/**
 * 선택은 `getRowId` 기준이므로 정렬로 행 위치가 바뀌어도 같은 행이 선택된 채 남는다.
 * index 기준이면 여기서 다른 행이 선택된 것처럼 보인다.
 */
export const SelectionSurvivesSorting: Story = {
  args: { selectable: true, defaultSelectedIds: ['FB-1002'], onSelectedIdsChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(names(canvasElement)).toEqual(original)
    await expect(names(canvasElement).indexOf('리넨 혼방')).toBe(1)
    await expect(canvas.getByRole('checkbox', { name: 'FB-1002 선택' })).toBeChecked()

    await userEvent.click(sortByName(canvasElement))

    await expect(names(canvasElement)).toEqual(byNameAsc)
    await expect(names(canvasElement).indexOf('리넨 혼방')).toBe(2)
    await expect(canvas.getByRole('checkbox', { name: 'FB-1002 선택' })).toBeChecked()
    await expect(canvas.getAllByRole('checkbox', { checked: true })).toHaveLength(1)

    // 정렬이 선택을 건드리지 않는다.
    await expect(args.onSelectedIdsChange).not.toHaveBeenCalled()
  },
}

/** 제어. 클릭은 콜백만 부르고 DOM 은 부모가 넘긴 `selectedIds` 를 따른다. */
export const ControlledSelection: Story = {
  args: { selectable: true, selectedIds: ['FB-1001'], onSelectedIdsChange: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const cotton = canvas.getByRole('checkbox', { name: 'FB-1001 선택' })
    const linen = canvas.getByRole('checkbox', { name: 'FB-1002 선택' })
    await expect(cotton).toBeChecked()

    await userEvent.click(linen)
    await expect(args.onSelectedIdsChange).toHaveBeenCalledWith(['FB-1001', 'FB-1002'])

    await expect(linen).not.toBeChecked()
    await expect(cotton).toBeChecked()
  },
}
