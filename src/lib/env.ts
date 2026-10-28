import { z } from 'zod'

// 환경 변수를 앱 시작 시점에 검증한다 (누락/오타를 런타임 중간이 아니라 처음에 발견)
const envSchema = z.object({
  VITE_API_URL: z.string().default('/api'),
  // 백엔드가 없을 때 MSW로 API를 모킹할지 여부
  VITE_ENABLE_MOCK: z.enum(['true', 'false']).default('false'),
})

export const env = envSchema.parse(import.meta.env)
