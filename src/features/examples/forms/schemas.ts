import { z } from 'zod'

// ── 회원가입: 필드 간 검증(비밀번호 확인)과 약관 동의 ─────────────────────────
export const signupSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    email: z.string().email('올바른 이메일을 입력하세요'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(/[A-Za-z]/, '영문자를 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 포함해야 합니다'),
    confirmPassword: z.string(),
    terms: z.boolean().refine((value) => value, '약관에 동의해야 합니다'),
  })
  // 두 필드를 비교하는 규칙은 객체 전체에 refine 을 걸고, 에러를 표시할 필드를 path 로 지정한다
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다',
  })
export type SignupValues = z.infer<typeof signupSchema>

// ── 문의하기: 다양한 입력 컴포넌트 ──────────────────────────────────────────
export const CONTACT_MESSAGE_MAX = 300

export const categories = [
  { value: 'general', label: '일반 문의' },
  { value: 'bug', label: '버그 신고' },
  { value: 'feature', label: '기능 제안' },
]

export const urgencies = [
  { value: 'low', label: '낮음' },
  { value: 'normal', label: '보통' },
  { value: 'high', label: '높음' },
]

export const contactSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력하세요'),
  category: z.enum(['general', 'bug', 'feature'], {
    error: '문의 유형을 선택하세요',
  }),
  urgency: z.enum(['low', 'normal', 'high']),
  message: z
    .string()
    .min(10, '내용은 10자 이상 입력하세요')
    .max(CONTACT_MESSAGE_MAX, `${CONTACT_MESSAGE_MAX}자 이내로 입력하세요`),
  subscribe: z.boolean(),
})
export type ContactValues = z.infer<typeof contactSchema>

// ── 다단계 폼: 단계별 스키마를 합쳐 전체 스키마를 만든다 ──────────────────────
export const positions = [
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'design', label: '디자인' },
]

export const stepOneSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  email: z.string().email('올바른 이메일을 입력하세요'),
})

export const stepTwoSchema = z.object({
  position: z.enum(['frontend', 'backend', 'design'], {
    error: '지원 분야를 선택하세요',
  }),
  intro: z.string().min(10, '자기소개는 10자 이상 입력하세요'),
})

export const applicationSchema = stepOneSchema.and(stepTwoSchema)
export type ApplicationValues = z.infer<typeof applicationSchema>
