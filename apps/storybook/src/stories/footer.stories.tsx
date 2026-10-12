import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Footer } from '@junhadex/core'
import { contrast } from './contrast'
import { eachMode, TestLink } from './nav-items'

const meta = {
  title: 'Core/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  args: {
    children: <p>© 2026 fabrics</p>,
    links: [
      { href: '#terms', label: '이용약관' },
      { href: '#privacy', label: '개인정보 처리방침' },
    ],
  },
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const footer = canvas.getByRole('contentinfo')
    await expect(footer).toHaveTextContent('© 2026 fabrics')

    const nav = within(footer).getByRole('navigation', { name: '하단 링크' })
    const links = within(nav).getAllByRole('link')
    await expect(links.map((l) => l.getAttribute('href'))).toEqual(['#terms', '#privacy'])

    // safe-area 가 없으면 좌우 1rem, 하단 1.5rem.
    const style = getComputedStyle(footer)
    await expect(style.paddingLeft).toBe('16px')
    await expect(style.paddingBottom).toBe('24px')

    const failures: string[] = []
    await eachMode((mode) => {
      const c = contrast(getComputedStyle(links[0]).color, getComputedStyle(footer).backgroundColor)
      if (c < 4.5) failures.push(`${mode} link ${c.toFixed(2)}`)
    })
    await expect(failures).toEqual([])
  },
}

/** 링크가 없으면 내비게이션을 렌더하지 않는다. */
export const WithoutLinks: Story = {
  args: { links: undefined },
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    await expect(within(footer).queryByRole('navigation')).toBeNull()
  },
}

/** 라우터 링크와 내비게이션 이름을 바꿔 끼운다. */
export const CustomLink: Story = {
  args: { linkComponent: TestLink, linksLabel: '정책 링크' },
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: '정책 링크' })
    const links = within(nav).getAllByRole('link')
    await expect(links.map((l) => l.dataset.routerLink)).toEqual(['#terms', '#privacy'])
  },
}

/** 레이아웃 클래스만 통과한다. `mt-8` 은 남고 `bg-danger` 는 버려진다. */
export const LayoutOverride: Story = {
  args: { className: 'mt-8 bg-danger' },
  play: async ({ canvasElement }) => {
    const footer = within(canvasElement).getByRole('contentinfo')
    await expect(footer).toHaveClass('mt-8', 'bg-surface')
    await expect(footer).not.toHaveClass('bg-danger')
  },
}
