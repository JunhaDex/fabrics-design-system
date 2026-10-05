import { useMemo, useState } from 'react'
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide'
import { tv } from 'tailwind-variants'
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

export interface DataTableProps<Row> extends Omit<TableProps<Row>, 'columns'> {
  columns: DataTableColumn<Row>[]
  /** 제어형. `null` 은 "정렬 없음" 이라는 유효한 값이다. */
  sort?: SortState | null
  defaultSort?: SortState | null
  onSortChange?: (sort: SortState | null) => void
}

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
  sort,
  defaultSort = null,
  onSortChange,
  className,
  ...props
}: DataTableProps<Row>) {
  const s = dataTable()
  const [uncontrolledSort, setUncontrolledSort] = useState<SortState | null>(defaultSort)
  const [touched, setTouched] = useState(false)
  const controlled = sort !== undefined
  const current = controlled ? sort : uncontrolledSort

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
    if (!controlled) setUncontrolledSort(next)
    onSortChange?.(next)
  }

  const activeColumn = current && columns.find((column) => column.key === current.key)
  const announcement = !touched
    ? ''
    : current && activeColumn
      ? `${columnLabel(activeColumn)} 기준 ${directionLabels[current.direction]} 정렬`
      : '정렬 해제'

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
      <Table columns={tableColumns} rows={sortedRows} {...props} />
      <div aria-live="polite" className={s.live()}>
        {announcement}
      </div>
    </div>
  )
}

/** 안내 문구용 열 이름. `header` 는 `ReactNode` 라 문자열 보장이 없다. */
const columnLabel = <Row,>(column: DataTableColumn<Row>) =>
  typeof column.header === 'string' ? column.header : column.key
