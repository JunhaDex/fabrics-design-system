import type { Meta, StoryObj } from '@storybook/react-vite'

const colors = [
  'surface', 'surface-raised', 'surface-overlay', 'on-surface', 'on-surface-muted',
  'brand', 'brand-hover', 'on-brand', 'border', 'border-strong', 'ring',
  'danger', 'on-danger', 'success', 'warning',
]

const meta = { title: 'Tokens/Semantic' } satisfies Meta

export default meta

export const Colors: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm">
      {colors.map((c) => (
        <div key={c} className="contents">
          <div className="size-8 rounded-control border border-border" style={{ background: `var(--color-${c})` }} />
          <code>--color-{c}</code>
        </div>
      ))}
    </div>
  ),
}
