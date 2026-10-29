import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FieldErrorSlot } from '@/components/common/FieldErrorSlot'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSubmitForm } from '@/features/examples/forms/api'
import {
  signupSchema,
  type SignupValues,
} from '@/features/examples/forms/schemas'
import { ApiError } from '@/lib/api'
import { TAKEN_EMAIL } from '@/mocks/demoAccount'

export function SignupForm() {
  const submit = useSubmitForm<SignupValues>('signup')

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onTouched', // 필드를 벗어나는 순간부터 실시간으로 검증한다
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  const onSubmit = (values: SignupValues) => {
    submit.mutate(values, {
      onSuccess: () => {
        toast.success('가입이 완료되었습니다')
        reset()
      },
      onError: (error) => {
        // 중복 이메일(409)만 해당 필드에 표시하고, 네트워크/서버 오류는 토스트로 알린다
        if (error instanceof ApiError && error.status === 409) {
          setError('email', { message: error.message })
        } else {
          toast.error(error.message)
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="signup-name">이름</FieldLabel>
          <Input
            id="signup-name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          <FieldErrorSlot error={errors.name} />
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="signup-email">이메일</FieldLabel>
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder={TAKEN_EMAIL}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldErrorSlot error={errors.email} />
        </Field>

        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="signup-password">비밀번호</FieldLabel>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldErrorSlot error={errors.password} />
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="signup-confirm">비밀번호 확인</FieldLabel>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <FieldErrorSlot error={errors.confirmPassword} />
        </Field>

        {/* 체크박스처럼 register 로 바로 연결하기 어려운 컴포넌트는 Controller 를 쓴다 */}
        <Field data-invalid={!!errors.terms}>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="terms"
              render={({ field }) => (
                <Checkbox
                  id="signup-terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={!!errors.terms}
                />
              )}
            />
            <Label htmlFor="signup-terms">이용약관에 동의합니다</Label>
          </div>
          <FieldErrorSlot error={errors.terms} />
        </Field>

        <Button type="submit" disabled={submit.isPending}>
          {submit.isPending ? '가입 중...' : '가입하기'}
        </Button>
      </FieldGroup>
    </form>
  )
}
