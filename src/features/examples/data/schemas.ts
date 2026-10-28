import { z } from 'zod'

// ── 사용자 테이블 ─────────────────────────────────────────────────────────────
export const userStatusSchema = z.enum(['active', 'inactive', 'pending'])
export type UserStatus = z.infer<typeof userStatusSchema>

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  status: userStatusSchema,
  createdAt: z.string(),
})
export type UserRow = z.infer<typeof userSchema>

export const usersResponseSchema = z.object({
  items: z.array(userSchema),
  total: z.number(), // 필터가 적용된 전체 건수 (페이지 수 계산에 사용)
})

export const userSortKeys = ['name', 'email', 'status', 'createdAt'] as const
export type UserSortKey = (typeof userSortKeys)[number]

export interface UsersParams {
  search: string
  status: UserStatus | 'all'
  sortBy: UserSortKey | null
  order: 'asc' | 'desc'
  page: number // 0부터 시작
  pageSize: number
}

// ── 무한 스크롤 ───────────────────────────────────────────────────────────────
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  author: z.string(),
  createdAt: z.string(),
})
export type Post = z.infer<typeof postSchema>

export const postsPageSchema = z.object({
  items: z.array(postSchema),
  nextCursor: z.number().nullable(), // null 이면 마지막 페이지
})

// ── 할 일 ─────────────────────────────────────────────────────────────────────
export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  done: z.boolean(),
})
export type Todo = z.infer<typeof todoSchema>
export const todoListSchema = z.array(todoSchema)
