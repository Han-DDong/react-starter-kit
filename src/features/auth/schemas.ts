import { z } from 'zod'

// 스키마 하나로 폼 검증 + 타입 + 응답 검증을 모두 처리한다
export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
})
export type User = z.infer<typeof userSchema>

export const loginResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
})
export type LoginResponse = z.infer<typeof loginResponseSchema>
