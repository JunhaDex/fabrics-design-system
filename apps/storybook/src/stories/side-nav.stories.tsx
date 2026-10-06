import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { BottomTabBar, SideNav, TopBar } from '@junhadex/core'
import { contrast } from './contrast'
import { eachMode, navItems, TestLink } from './nav-items'

const meta = {
  title: 'Core/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  args: { items: navItems, 'aria-label': '주요 메뉴' },
} satisfies Meta<typeof SideNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const nav = canvas.getByRole('navigation', { name: '주요 메뉴' })
    const links = within(nav).getAllByRole('link')
    await expect(links.map((l) => l.getAttribute('aria-current'))).toEqual([null, 'page', null])

    const style = getComputedStyle(nav)
    await expect(style.width).toBe('224px')
    await expect(style.position).toBe('sticky')
    // TopBar 아래에 붙는다(sem.spacing.bar).
    await expect(style.top).toBe('56px')
    await expect(links[0].querySelector('svg')!.getBoundingClientRect().width).toBe(20)

    // 활성 항목은 면 색 외에 굵기로도 구분된다.
    const [home, closet] = links.map((l) => getComputedStyle(l))
    await expect(closet.fontWeight).toBe('600')
    await expect(home.fontWeight).toBe('500')

    const failures: string[] = []
    await eachMode((mode) => {
      const page = getComputedStyle(document.body).backgroundColor
      const active = getComputedStyle(links[1])
      const inactive = getComputedStyle(links[0])
      const a = contrast(active.color, active.backgroundColor)
      const i = contrast(inactive.color, page)
      if (a < 4.5) failures.push(`${mode} active ${a.toFixed(2)}`)
      if (i < 4.5) failures.push(`${mode} inactive ${i.toFixed(2)}`)
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

/** TopBar 없이 쓰면 `top-0 h-dvh` 로 덮어쓴다. 룩앤필 클래스(`bg-danger`)는 버려진다. */
export const WithoutTopBar: Story = {
  args: { className: 'top-0 h-dvh bg-danger' },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation')
    await expect(nav).not.toHaveClass('bg-danger')
    const style = getComputedStyle(nav)
    await expect(style.top).toBe('0px')
    await expect(style.height).toBe(`${window.innerHeight}px`)
  },
}

/**
 * TopBar·SideNav·BottomTabBar 조합. md 이상은 SideNav, 미만은 BottomTabBar 가 보인다.
 * 전환은 소비자가 `className` 으로 정하며, 이 조합(AppShell)은 프로젝트가 소유한다.
 */
export const AppShell: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="flex min-h-dvh flex-col">
      <TopBar brand={<span className="text-lg font-bold">fabrics</span>} />
      <div className="flex flex-1">
        <SideNav {...args} className="hidden md:flex" />
        <main className="min-w-0 flex-1 p-4">
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>본문 {i + 1}</p>
          ))}
        </main>
      </div>
      <BottomTabBar items={args.items} aria-label="주요 메뉴" className="md:hidden" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('banner')).toBeInTheDocument()
    // 둘 중 하나만 접근성 트리에 남는다.
    await expect(canvas.getAllByRole('navigation', { name: '주요 메뉴' })).toHaveLength(1)
  },
}
