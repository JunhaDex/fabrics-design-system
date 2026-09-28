import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Progress, Skeleton, Spinner } from '@junhadex/core'

const meta = {
  title: 'Core/Feedback',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta

/** 색은 currentColor 를 따르므로 감싼 요소의 text-* 로 정한다. */
export const SpinnerSizes: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4 text-brand">
      <Spinner size="sm" label="작게 불러오는 중" />
      <Spinner size="md" />
      <Spinner size="lg" label="크게 불러오는 중" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status', { name: '불러오는 중' })).toBeInTheDocument()
    await expect(canvas.getAllByRole('status')).toHaveLength(3)
  },
}

/**
 * 자리표시자는 스크린 리더에서 감춘다. 로딩 상태는 감싼 영역이 알린다.
 * 이름을 주려면 role 이 필요하다 — 일반 div 에 `aria-label` 만 붙이면
 * axe 의 aria-prohibited-attr 에 걸린다.
 */
export const Skeletons: StoryObj = {
  render: () => (
    <div
      className="flex w-64 flex-col gap-2"
      role="status"
      aria-busy="true"
      aria-label="불러오는 중"
    >
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const placeholders = canvasElement.querySelectorAll('[aria-hidden="true"]')
    await expect(placeholders).toHaveLength(3)
  },
}

export const ProgressValues: StoryObj = {
  render: () => (
    <div className="flex w-64 flex-col gap-4">
      <Progress value={0} aria-label="0 퍼센트" />
      <Progress value={40} aria-label="진행률" />
      <Progress value={100} aria-label="100 퍼센트" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole('progressbar', { name: '진행률' })
    await expect(bar).toHaveAttribute('aria-valuenow', '40')
    const indicator = bar.firstElementChild as HTMLElement
    await expect(indicator.style.transform).toBe('translateX(-60%)')
  },
}
