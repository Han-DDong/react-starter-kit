import { configureApi } from '@/lib/api'
import { useAuthStore } from '@/features/auth/store'

// lib/api 와 features/auth 를 연결하는 유일한 지점 (앱 조립 단계에서만 결합한다)
export function setupApi() {
  configureApi({
    getToken: () => useAuthStore.getState().token,
    onUnauthorized: () => useAuthStore.getState().clear(),
  })
}
