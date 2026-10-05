import { useId, type ComponentProps, type ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { layoutClass } from '../utils/layout-class'

export const table = tv({
  slots: {
    scroll: 'w-full overflow-x-auto',
    root: 'w-full border-collapse text-sm',
    caption: 'px-cell-x py-cell-y text-left font-medium text-on-surface',
    headerRow: 'border-b border-border',
    header: 'bg-surface-raised px-cell-x py-cell-y font-medium whitespace-nowrap text-on-surface',
    row: [
      'border-b border-border last:border-0 hover:bg-surface-raised',
      // 선택 색은 호버보다 뒤에 와서 이긴다. 표 전용 색 슬롯 없이 brand-subtle 을 쓴다.
      'data-[selected]:bg-brand-subtle data-[selected]:text-on-brand-subtle',
    ],
    cell: 'px-cell-x py-cell-y whitespace-nowrap text-on-surface',
  },
  variants: {
    // 열마다 다르므로 슬롯 함수 호출 시점에 넘긴다.
    align: {
      start: { header: 'text-left', cell: 'text-left' },
      end: { header: 'text-right', cell: 'text-right' },
    },
  },
  defaultVariants: { align: 'start' },
})

export interface TableColumn<Row> {
  key: string
  header: ReactNode
  cell: (row: Row) => ReactNode
  /** 숫자 열은 `'end'`. 기본 `'start'`. */
  align?: 'start' | 'end'
  /** `<th>` 의 `aria-sort`. 정렬 상태는 DataTable 이 채운다. */
  ariaSort?: 'none' | 'ascending' | 'descending'
}

export interface TableProps<Row> extends Omit<ComponentProps<'table'>, 'children'> {
  columns: TableColumn<Row>[]
  rows: Row[]
  getRowId: (row: Row) => string
  caption?: ReactNode
  /**
   * 선택된 행을 시각적으로 표시한다. `<tr aria-selected>` 는 쓸 수 없다 —
   * `role="grid"` 안의 row 에만 허용되는 속성이라 일반 표에서는 ARIA 위반이다.
   * 선택 상태 전달은 행 체크박스의 checked 가 담당한다.
   */
  isRowSelected?: (row: Row) => boolean
}

/**
 * 정적 표. 상태는 갖지 않으며 DataTable 이 이 컴포넌트를 감싸 정렬·선택·페이지네이션을
 * 붙인다. 줄무늬·테두리는 prop 으로 열지 않고 테마가 결정한다.
 *
 * 셀은 줄바꿈하지 않는다(`whitespace-nowrap`). 넓은 표는 래퍼가 가로 스크롤한다 —
 * 줄바꿈을 허용하면 표가 컨테이너에 맞춰 줄어들어 스크롤 래퍼가 무의미해진다.
 *
 * 접근 가능한 이름은 `caption` 이나 `aria-label` 로 준다. 이름이 있을 때만 가로 스크롤
 * 래퍼에 `role="region"` 을 붙인다 — 이름 없는 region 자체가 접근성 위반이다.
 * `<caption>` 은 테이블의 이름이지 래퍼의 이름이 아니므로 `aria-labelledby` 로 잇는다.
 */
export function Table<Row>({
  columns,
  rows,
  getRowId,
  caption,
  isRowSelected,
  className,
  ...props
}: TableProps<Row>) {
  const s = table()
  const captionId = useId()
  const label = props['aria-label']
  const named = caption != null || label != null

  return (
    <div
      className={s.scroll({ class: layoutClass(className) })}
      // 포커스 가능해야 키보드로 넘치는 표를 스크롤할 수 있다.
      tabIndex={0}
      {...(named
        ? {
            role: 'region',
            ...(caption != null ? { 'aria-labelledby': captionId } : { 'aria-label': label }),
          }
        : {})}
    >
      <table className={s.root()} {...props}>
        {caption != null && (
          <caption id={captionId} className={s.caption()}>
            {caption}
          </caption>
        )}
        <thead>
          <tr className={s.headerRow()}>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={column.ariaSort}
                className={s.header({ align: column.align })}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowId(row)}
              data-selected={isRowSelected?.(row) || undefined}
              className={s.row()}
            >
              {columns.map((column) => (
                <td key={column.key} className={s.cell({ align: column.align })}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
