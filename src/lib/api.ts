import axios, { isAxiosError, type AxiosRequestConfig } from 'axios'
import type { z } from 'zod'
import { env } from '@/lib/env'

export class ApiError extends Error {
  // erasableSyntaxOnly 설정 때문에 생성자 파라미터 프로퍼티 대신 필드를 직접 선언한다
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// lib은 features를 import하지 않는다 (의존 방향: features → lib).
// 토큰 조회와 401 처리는 앱 시작 시 configureApi()로 주입받는다.
interface ApiConfig {
  getToken: () => string | null
  onUnauthorized: () => void
}

let config: ApiConfig = {
  getToken: () => null,
  onUnauthorized: () => {},
}

export function configureApi(next: ApiConfig) {
  config = next
}

const client = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: 토큰이 있을 때만 Authorization 헤더를 붙인다
client.interceptors.request.use((request) => {
  const token = config.getToken()
  if (token) request.headers.set('Authorization', `Bearer ${token}`)
  return request
})

// 서버가 { message } 형태의 JSON을 주면 그 메시지를, 아니면 기본 문구를 에러 메시지로 쓴다
function readErrorMessage(data: unknown, fallback: string) {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    return String(data.message)
  }
  return fallback
}

// 응답 인터셉터: Axios 에러를 앱 공통 ApiError 로 변환하고, 401이면 로그아웃 처리를 호출한다
client.interceptors.response.use(undefined, (error: unknown) => {
  if (!isAxiosError(error)) return Promise.reject(error)

  const status = error.response?.status ?? 0 // 0: 네트워크 오류 등 응답 자체가 없는 경우
  if (status === 401) config.onUnauthorized() // 만료/무효 토큰 → 자동 로그아웃

  const fallback = error.response?.statusText || '요청에 실패했습니다'
  return Promise.reject(
    new ApiError(status, readErrorMessage(error.response?.data, fallback)),
  )
})

interface ApiOptions<T> extends Omit<AxiosRequestConfig, 'url' | 'data'> {
  body?: unknown // 객체를 그대로 넘기면 Axios 가 JSON 으로 직렬화한다
  schema?: z.ZodType<T> // 지정하면 응답을 Zod로 검증한다
}

export async function api<T>(
  path: string,
  { body, schema, ...options }: ApiOptions<T> = {},
): Promise<T> {
  const { data } = await client.request<unknown>({
    url: path,
    data: body,
    ...options,
  })

  // 본문이 없는 응답(204 등)은 Axios 가 빈 문자열을 돌려준다
  if (data === '' || data === undefined) return undefined as T
  return schema ? schema.parse(data) : (data as T)
}
