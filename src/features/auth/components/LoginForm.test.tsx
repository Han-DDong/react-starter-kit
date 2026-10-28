import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useAuthStore } from '@/features/auth/store'
import { DEMO_ACCOUNT } from '@/mocks/demoAccount'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('LoginForm', () => {
  beforeEach(() => {
    useAuthStore.getState().clear() // 테스트 간 로그인 상태 초기화
  })

  it('잘못된 입력이면 검증 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('이메일'), 'not-an-email')
    await user.type(screen.getByLabelText('비밀번호'), 'short')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(
      await screen.findByText('올바른 이메일을 입력하세요'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('비밀번호는 8자 이상이어야 합니다'),
    ).toBeInTheDocument()
  })

  it('올바른 계정이면 세션이 저장된다', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText('이메일'), DEMO_ACCOUNT.email)
    await user.type(screen.getByLabelText('비밀번호'), DEMO_ACCOUNT.password)
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('mock-token')
    })
  })
})
