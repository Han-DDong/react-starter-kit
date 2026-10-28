import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { loginResponseSchema, type LoginValues } from '@/features/auth/schemas'
import { useAuthStore } from '@/features/auth/store'

// 로그인: 성공하면 토큰과 사용자 정보를 스토어에 저장한다
export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (values: LoginValues) =>
      api('/auth/login', {
        method: 'POST',
        body: values,
        schema: loginResponseSchema,
      }),
    onSuccess: ({ token, user }) => setSession(token, user),
  })
}

// 로그아웃: 세션을 지우고 이전 사용자의 캐시 데이터도 함께 제거한다
export function useLogout() {
  const clear = useAuthStore((state) => state.clear)
  const queryClient = useQueryClient()

  return () => {
    clear()
    queryClient.clear()
  }
}
