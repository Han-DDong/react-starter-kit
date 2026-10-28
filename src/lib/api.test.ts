import { http, HttpResponse } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { api, configureApi } from '@/lib/api'
import { server } from '@/mocks/server'

describe('api', () => {
  it('토큰이 있으면 Authorization 헤더를 붙인다', async () => {
    configureApi({ getToken: () => 'abc', onUnauthorized: () => {} })
    let received: string | null = null
    server.use(
      http.get('http://localhost:3000/api/ping', ({ request }) => {
        received = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )

    await api('/ping')

    expect(received).toBe('Bearer abc')
  })

  it('401이면 onUnauthorized를 호출하고 ApiError를 던진다', async () => {
    const onUnauthorized = vi.fn()
    configureApi({ getToken: () => null, onUnauthorized })
    server.use(
      http.get('http://localhost:3000/api/secret', () =>
        HttpResponse.json({ message: '만료됨' }, { status: 401 }),
      ),
    )

    await expect(api('/secret')).rejects.toMatchObject({
      status: 401,
      message: '만료됨',
    })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
