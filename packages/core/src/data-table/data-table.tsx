import { useMemo, useState } from 'react'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide'
import { tv } from 'tailwind-variants'
import { Checkbox } from '../checkbox/checkbox'
import { Icon } from '../icon/icon'
import { Table, type TableColumn, type TableProps } from '../table/table'
import { layoutClass } from '../utils/layout-class'

export const dataTable = tv({
  slots: {
    // gap 은 페이지네이션 행이 붙을 자리를 위한 것이다.
    root: 'flex flex-col gap-stack',
    sortButton: [
      'inline-flex items-center gap-1 rounded-control',
      'outline-none focus-visible:ring-2 focus-visible:ring-ring',
    ],
    sortIcon: 'shrink-0 text-on-surface-muted',
    live: 'sr-only',
  },
})

export type SortDirection = 'asc' | 'desc'

export interface SortState {
  key: string
  direction: SortDirection
}

export interface DataTableColumn<Row> extends TableColumn<Row> {
  /**
   * 정렬 비교값. 이 함수가 있는 열만 정렬 가능하다.
   * `cell` 은 `ReactNode` 를 돌려주므로 비교에 쓸 수 없어 따로 받는다.
   */
  sortValue?: (row: Row) => string | number
}

export interface DataTableProps<Row> extends Omit<TableProps<Row>, 'columns' | 'isRowSelected'> {
  columns: DataTableColumn<Row>[]
  /** 제어형. `null` 은 "정렬 없음" 이라는 유효한 값이다. */
  sort?: SortState | null
  defaultSort?: SortState | null
  onSortChange?: (sort: SortState | null) => void
  /** 선택 열을 켠다. 끄면 선택 관련 prop 은 무시된다. */
  selectable?: boolean
  selectedIds?: string[]
  defaultSelectedIds?: string[]
  onSelectedIdsChange?: (ids: string[]) => void
  /** 행 체크박스의 접근 가능한 이름. 기본값은 `getRowId` — id 가 UUID 면 넘겨야 한다. */
  getRowLabel?: (row: Row) => string
}

/** 사용자 열 키와 겹치지 않도록 예약한다. */
const SELECT_KEY = '__select'

const directionIcons = { asc: ChevronUp, desc: ChevronDown }
const directionLabels = { asc: '오름차순', desc: '내림차순' }

/** none → asc → desc → none. 다른 열을 누르면 그 열의 asc 로 간다. */
const nextSort = (current: SortState | null, key: string): SortState | null => {
  if (current?.key !== key) return { key, direction: 'asc' }
  return current.direction === 'asc' ? { key, direction: 'desc' } : null
}

/** 문자열은 로케일 비교를 쓴다 — 한글 순서가 코드 포인트 순서와 다르다. */
const compareValues = (a: string | number, b: string | number) =>
  typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))

/**
 * Table 에 정렬 상태를 붙인 래퍼. 단일 열 3-state 정렬이며 트리거는 `<th>` 안의
 * `<button>` 이다. `aria-sort` 변경만으로는 대부분의 스크린 리더가 즉시 읽지 않으므로
 * `aria-live="polite"` 안내 영역을 함께 둔다.
 *
 * 제어형 판정은 `sort !== undefined` 다. 제어형이 서버 사이드 정렬의 연결점이다.
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowId,
  sort,
  defaultSort = null,
  onSortChange,
  selectable = false,
  selectedIds,
  defaultSelectedIds = [],
  onSelectedIdsChange,
  getRowLabel = getRowId,
  className,
  ...props
}: DataTableProps<Row>) {
  const s = dataTable()
  const [uncontrolledSort, setUncontrolledSort] = useState<SortState | null>(defaultSort)
  const [touched, setTouched] = useState(false)
  const sortControlled = sort !== undefined
  const current = sortControlled ? sort : uncontrolledSort

  const [uncontrolledIds, setUncontrolledIds] = useState<string[]>(defaultSelectedIds)
  const selectionControlled = selectedIds !== undefined
  const ids = selectionControlled ? selectedIds : uncontrolledIds
  const idSet = useMemo(() => new Set(ids), [ids])

  const sortedRows = useMemo(() => {
    if (!current) return rows
    const sortValue = columns.find((column) => column.key === current.key)?.sortValue
    if (!sortValue) return rows
    const sign = current.direction === 'asc' ? 1 : -1
    // sort 는 안정 정렬이므로(ES2019) 동순위 행의 상대 순서가 유지된다.
    return [...rows].sort((a, b) => sign * compareValues(sortValue(a), sortValue(b)))
  }, [columns, rows, current])

  const change = (next: SortState | null) => {
    setTouched(true)
    if (!sortControlled) setUncontrolledSort(next)
    onSortChange?.(next)
  }

  const activeColumn = current && columns.find((column) => column.key === current.key)
  const announcement = !touched
    ? ''
    : current && activeColumn
      ? `${columnLabel(activeColumn)} 기준 ${directionLabels[current.direction]} 정렬`
      : '정렬 해제'

  const changeIds = (next: string[]) => {
    if (!selectionControlled) setUncontrolledIds(next)
    onSelectedIdsChange?.(next)
  }

  const toggleRow = (id: string) =>
    changeIds(idSet.has(id) ? ids.filter((value) => value !== id) : [...ids, id])

  // 전체선택 범위는 보이는 행이다. 페이지네이션이 붙으면 그대로 현재 페이지가 된다.
  const visibleIds = sortedRows.map(getRowId)
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => idSet.has(id))
  const someVisibleSelected = !allVisibleSelected && visibleIds.some((id) => idSet.has(id))

  const toggleAllVisible = () =>
    changeIds(
      allVisibleSelected
        ? ids.filter((id) => !visibleIds.includes(id))
        : [...ids, ...visibleIds.filter((id) => !idSet.has(id))],
    )

  const selectColumn: TableColumn<Row> = {
    key: SELECT_KEY,
    header: (
      <Checkbox
        aria-label="전체 선택"
        checked={allVisibleSelected ? true : someVisibleSelected ? 'indeterminate' : false}
        onCheckedChange={toggleAllVisible}
      />
    ),
    cell: (row) => (
      <Checkbox
        aria-label={`${getRowLabel(row)} 선택`}
        checked={idSet.has(getRowId(row))}
        onCheckedChange={() => toggleRow(getRowId(row))}
      />
    ),
  }

  const tableColumns: TableColumn<Row>[] = columns.map((column) => {
    if (!column.sortValue) return column
    const direction = current?.key === column.key ? current.direction : undefined
    return {
      ...column,
      ariaSort: direction ? (direction === 'asc' ? 'ascending' : 'descending') : 'none',
      header: (
        <button
          type="button"
          className={s.sortButton()}
          onClick={() => change(nextSort(current, column.key))}
        >
          {column.header}
          <Icon
            node={direction ? directionIcons[direction] : ChevronsUpDown}
            size={14}
            className={s.sortIcon()}
          />
        </button>
      ),
    }
  })

  return (
    <div className={s.root({ class: layoutClass(className) })}>
      <Table
        columns={selectable ? [selectColumn, ...tableColumns] : tableColumns}
        rows={sortedRows}
        getRowId={getRowId}
        isRowSelected={selectable ? (row) => idSet.has(getRowId(row)) : undefined}
        {...props}
      />
      <div aria-live="polite" className={s.live()}>
        {announcement}
      </div>
    </div>
  )
}

/** 안내 문구용 열 이름. `header` 는 `ReactNode` 라 문자열 보장이 없다. */
const columnLabel = <Row,>(column: DataTableColumn<Row>) =>
  typeof column.header === 'string' ? column.header : column.key
