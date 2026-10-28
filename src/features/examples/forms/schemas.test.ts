import { describe, expect, it } from 'vitest'
import {
  applicationSchema,
  signupSchema,
  stepOneSchema,
} from '@/features/examples/forms/schemas'

// 이슈 목록을 "경로: 메시지" 형태로 단순화해서 비교하기 쉽게 만든다
const issuesOf = (result: {
  success: boolean
  error?: { issues: { path: PropertyKey[]; message: string }[] }
}) => result.error?.issues.map((i) => `${i.path.join('.')}: ${i.message}`) ?? []

const validSignup = {
  name: '홍길동',
  email: 'hong@example.com',
  password: 'password1',
  confirmPassword: 'password1',
  terms: true,
}

describe('signupSchema', () => {
  it('올바른 값은 통과한다', () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true)
  })

  it('비밀번호 확인이 다르면 confirmPassword 에러가 난다', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: 'different1',
    })
    expect(issuesOf(result)).toContain(
      'confirmPassword: 비밀번호가 일치하지 않습니다',
    )
  })

  it('약관에 동의하지 않으면 terms 에러가 난다', () => {
    const result = signupSchema.safeParse({ ...validSignup, terms: false })
    expect(issuesOf(result)).toContain('terms: 약관에 동의해야 합니다')
  })

  it('비밀번호 불일치와 약관 미동의가 동시에 보고된다', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: 'different1',
      terms: false,
    })
    expect(issuesOf(result)).toEqual(
      expect.arrayContaining([
        'confirmPassword: 비밀번호가 일치하지 않습니다',
        'terms: 약관에 동의해야 합니다',
      ]),
    )
  })

  it('영문자나 숫자가 없는 비밀번호는 거절한다', () => {
    expect(
      signupSchema.safeParse({
        ...validSignup,
        password: '12345678',
        confirmPassword: '12345678',
      }).success,
    ).toBe(false)
  })
})

describe('applicationSchema (다단계 폼)', () => {
  it('1단계 값만 있으면 2단계 필드에 대해서만 에러가 난다', () => {
    const result = applicationSchema.safeParse({
      name: '홍길동',
      email: 'hong@example.com',
      intro: '',
    })
    const paths = result.error?.issues.map((i) => i.path.join('.')) ?? []

    expect(paths).not.toContain('name')
    expect(paths).not.toContain('email')
    expect(paths).toContain('position')
  })

  it('stepOneSchema 단독으로는 1단계 값만 검증한다', () => {
    expect(
      stepOneSchema.safeParse({ name: '홍길동', email: 'hong@example.com' })
        .success,
    ).toBe(true)
  })
})
