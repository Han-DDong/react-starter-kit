import { Navigate, Outlet, useLocation } from 'react-router'
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store'

// 인증되지 않은 사용자를 로그인 페이지로 보내는 라우트 가드
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    // 로그인 후 원래 가려던 경로로 돌아올 수 있도록 현재 위치를 함께 전달
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
