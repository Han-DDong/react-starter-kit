import { http, HttpResponse } from 'msw'
import { DEMO_ACCOUNT } from '@/mocks/demoAccount'

const demoUser = { id: 'u-1', name: '데모 사용자', email: DEMO_ACCOUNT.email }

interface LoginBody {
  email: string
  password: string
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginBody
    if (email !== DEMO_ACCOUNT.email || password !== DEMO_ACCOUNT.password) {
      return HttpResponse.json(
        { message: '이메일 또는 비밀번호가 올바르지 않습니다' },
        { status: 401 },
      )
    }
    return HttpResponse.json({ token: 'mock-token', user: demoUser })
  }),
]
