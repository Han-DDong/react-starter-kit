import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/features/auth/schemas'

interface AuthState {
  token: string | null
  user: User | null
  setSession: (token: string, user: User) => void
  clear: () => void
}

// 로그인 정보는 클라이언트 전용 상태이므로 Zustand + persist(localStorage)로 유지한다
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      clear: () => set({ token: null, user: null }),
    }),
    { name: 'auth' }, // localStorage 키
  ),
)

// 토큰 유무로 인증 여부를 판단하는 셀렉터 (불필요한 리렌더링 방지)
export const selectIsAuthenticated = (state: AuthState) => state.token !== null
