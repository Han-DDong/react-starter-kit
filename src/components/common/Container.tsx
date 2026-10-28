import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

// 헤더, 본문, 푸터가 같은 최대 너비와 좌우 여백을 쓰도록 맞추는 래퍼
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}
      {...props}
    />
  )
}
