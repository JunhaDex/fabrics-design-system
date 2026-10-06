import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Moon } from 'lucide'
import { Button, Icon, TopBar } from '@junhadex/core'

const meta = {
  title: 'Core/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  args: {
    brand: <span className="text-lg font-bold">fabrics</span>,
    actions: (
      <Button variant="ghost" aria-label="다크 모드로 전환">
        <Icon node={Moon} size={20} />
      </Button>
    ),
  },
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const bar = canvas.getByRole('banner')
    await expect(canvas.getByText('fabrics')).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: '다크 모드로 전환' })).toBeInTheDocument()

    const style = getComputedStyle(bar)
    await expect(style.position).toBe('sticky')
    await expect(style.top).toBe('0px')
    await expect(style.zIndex).toBe('10')

    // 행 높이는 sem.spacing.bar, safe-area 가 없으면 좌우 여백은 1rem 이다.
    const row = getComputedStyle(bar.firstElementChild!)
    await expect(row.height).toBe('56px')
    await expect(row.paddingLeft).toBe('16px')
    await expect(row.paddingRight).toBe('16px')

    // @theme inline 브리지 변수는 런타임에 없으므로 원본 슬롯을 참조한 요소와 비교한다.
    const ref = document.createElement('div')
    ref.style.backgroundColor = 'var(--sem-color-surface)'
    canvasElement.append(ref)
    await expect(style.backgroundColor).toBe(getComputedStyle(ref).backgroundColor)
    ref.remove()
  },
}

/** `actions` 는 선택이다. */
export const BrandOnly: Story = {
  args: { actions: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('banner')).toHaveTextContent('fabrics')
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}

/** 스크롤 컨테이너 안에서 상단에 고정된다. */
export const Sticky: Story = {
  render: (args) => (
    <div className="h-64 overflow-auto" data-testid="scroller">
      <TopBar {...args} />
      {Array.from({ length: 30 }, (_, i) => (
        <p key={i} className="px-4 py-2">
          본문 {i + 1}
        </p>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const scroller = canvas.getByTestId('scroller')
    const bar = canvas.getByRole('banner')
    scroller.scrollTop = 400
    await expect(scroller.scrollTop).toBeGreaterThan(0)
    await expect(bar.getBoundingClientRect().top).toBe(scroller.getBoundingClientRect().top)
  },
}

/** 레이아웃 클래스만 통과한다. `bg-danger` 는 버려지고 `hidden md:block` 은 남는다. */
export const LayoutOverride: Story = {
  args: { className: 'hidden md:block bg-danger' },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector('header')!
    await expect(bar).toHaveClass('hidden', 'md:block')
    await expect(bar).not.toHaveClass('bg-danger')
    await expect(bar).toHaveClass('bg-surface')
  },
}
