import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { BottomTabBar } from '@junhadex/core'
import { contrast } from './contrast'
import { eachMode, navItems, TestLink } from './nav-items'
import { slotPx } from './slot'

const meta = {
  title: 'Core/BottomTabBar',
  component: BottomTabBar,
  tags: ['autodocs'],
  args: { items: navItems, 'aria-label': '주요 메뉴' },
  render: (args) => (
    <div className="w-96">
      <BottomTabBar {...args} />
    </div>
  ),
} satisfies Meta<typeof BottomTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: '주요 메뉴' })
    const links = within(nav).getAllByRole('link')
    await expect(links.map((l) => l.getAttribute('aria-current'))).toEqual([null, 'page', null])

    const style = getComputedStyle(nav)
    await expect(style.position).toBe('sticky')
    await expect(style.bottom).toBe('0px')
    await expect(style.zIndex).toBe('10')
    await expect(links[0].getBoundingClientRect().height).toBeGreaterThanOrEqual(
      slotPx('spacing-bar'),
    )
    await expect(links[0].querySelector('svg')!.getBoundingClientRect().width).toBe(24)

    const [home, closet] = links.map((l) => getComputedStyle(l))
    await expect(closet.fontWeight).toBe('600')
    await expect(home.fontWeight).toBe('500')

    // 라벨은 4.5:1, 활성 표시자는 비텍스트 대비 3:1 (WCAG 2.2 AA 1.4.3·1.4.11).
    const failures: string[] = []
    await eachMode((mode) => {
      const bar = getComputedStyle(nav).backgroundColor
      for (const link of links) {
        const c = contrast(getComputedStyle(link).color, bar)
        if (c < 4.5) failures.push(`${mode} ${link.textContent} label ${c.toFixed(2)}`)
      }
      const indicator = getComputedStyle(links[1].firstElementChild!)
      const i = contrast(indicator.backgroundColor, bar)
      if (i < 3) failures.push(`${mode} indicator ${i.toFixed(2)}`)
      const icon = contrast(indicator.color, indicator.backgroundColor)
      if (icon < 3) failures.push(`${mode} active icon ${icon.toFixed(2)}`)
    })
    await expect(failures).toEqual([])
  },
}

/** 라우터 링크를 `linkComponent` 로 넘기면 href·className·aria-current 를 받는다. */
export const CustomLink: Story = {
  args: { linkComponent: TestLink },
  play: async ({ canvasElement }) => {
    const links = within(canvasElement).getAllByRole('link')
    await expect(links.map((l) => l.dataset.routerLink)).toEqual(['#home', '#closet', '#styling'])
    await expect(links[1]).toHaveAttribute('aria-current', 'page')
    await expect(links[1]).toHaveClass('font-semibold')
  },
}

/** 레이아웃 클래스만 통과한다. `md:hidden` 은 남고 `bg-danger` 는 버려진다. */
export const LayoutOverride: Story = {
  args: { className: 'md:hidden bg-danger' },
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav')!
    await expect(nav).toHaveClass('md:hidden', 'bg-surface')
    await expect(nav).not.toHaveClass('bg-danger')
  },
}
