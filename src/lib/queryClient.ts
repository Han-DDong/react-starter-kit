import { QueryClient } from '@tanstack/react-query'
import { ZodError } from 'zod'
import { ApiError } from '@/lib/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30초 동안은 캐시를 신선한 데이터로 취급
      refetchOnWindowFocus: false,
      // 4xx와 응답 스키마 불일치(ZodError)는 재시도해도 결과가 같으므로
      // 5xx/네트워크 오류만 최대 2회 재시도
      retry: (failureCount, error) => {
        if (error instanceof ZodError) return false
        if (error instanceof ApiError && error.status < 500) return false
        return failureCount < 2
      },
    },
  },
})
