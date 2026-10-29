import { Navigate } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store'
import { DEMO_ACCOUNT } from '@/mocks/demoAccount'

export default function LoginPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  // 이미 로그인된 사용자가 /login 에 접근하면 홈으로 보낸다
  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>로그인 체험</CardTitle>
          {/* 모킹 환경에서만 데모 계정을 안내한다 (운영 화면에는 노출하지 않음).
              env 객체를 거치면 정적 치환이 안 되어 운영 번들에 남으므로 직접 비교한다 */}
          {import.meta.env.VITE_ENABLE_MOCK === 'true' && (
            <CardDescription>
              데모 계정: {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
