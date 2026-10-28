import { http, HttpResponse } from 'msw'
import { TAKEN_EMAIL } from '@/mocks/demoAccount'

interface EmailBody {
  email?: string
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const formHandlers = [
  http.post('/api/forms/signup', async ({ request }) => {
    await delay(500) // 제출 중(로딩) 상태가 보이도록 지연
    const { email } = (await request.json()) as EmailBody
    if (email === TAKEN_EMAIL) {
      return HttpResponse.json(
        { message: '이미 가입된 이메일입니다' },
        { status: 409 },
      )
    }
    return HttpResponse.json({ ok: true }, { status: 201 })
  }),

  http.post('/api/forms/contact', async () => {
    await delay(500)
    return HttpResponse.json({ ok: true }, { status: 201 })
  }),

  http.post('/api/forms/application', async () => {
    await delay(500)
    return HttpResponse.json({ ok: true }, { status: 201 })
  }),
]
