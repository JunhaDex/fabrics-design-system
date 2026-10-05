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

/** 행 순서를 품명 열 기준으로 읽는다. 헤더 행은 제외한다. */
const names = (canvasElement: HTMLElement) =>
  within(canvasElement)
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1].textContent)

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

    const trigger = within(name).getByRole('button')
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
    const [, name, width] = canvas.getAllByRole('columnheader')

    await expect(width).toHaveAttribute('aria-sort', 'descending')
    await expect(names(canvasElement)).toEqual(byWidthDesc)

    await userEvent.click(within(name).getByRole('button'))
    await expect(args.onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'asc' })

    // 부모가 sort 를 바꾸지 않았으므로 순서와 aria-sort 가 유지된다.
    await expect(names(canvasElement)).toEqual(byWidthDesc)
    await expect(width).toHaveAttribute('aria-sort', 'descending')
  },
}
