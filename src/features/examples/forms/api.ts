import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

// 세 폼이 같은 형태(POST 후 성공 여부만 확인)라서 훅 하나로 공유한다
export function useSubmitForm<TValues>(endpoint: string) {
  return useMutation({
    mutationFn: (values: TValues) =>
      api<{ ok: boolean }>(`/forms/${endpoint}`, {
        method: 'POST',
        body: values,
      }),
  })
}
