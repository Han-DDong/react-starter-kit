import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FieldErrorSlot } from '@/components/common/FieldErrorSlot'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitForm } from '@/features/examples/forms/api'
import {
  applicationSchema,
  positions,
  type ApplicationValues,
} from '@/features/examples/forms/schemas'

type FieldName = keyof ApplicationValues

// 단계마다 "다음" 을 누를 때 검증할 필드 목록
const steps: { title: string; fields: FieldName[] }[] = [
  { title: '기본 정보', fields: ['name', 'email'] },
  { title: '지원 정보', fields: ['position', 'intro'] },
  { title: '확인', fields: [] },
]

export function MultiStepForm() {
  const [step, setStep] = useState(0)
  const submit = useSubmitForm<ApplicationValues>('application')

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', intro: '' },
  })

  const isLast = step === steps.length - 1

  // 현재 단계의 필드만 검증하고, 통과해야 다음 단계로 넘어간다
  const handleNext = async () => {
    const valid = await trigger(steps[step].fields)
    if (valid) setStep((current) => current + 1)
  }

  const onSubmit = (values: ApplicationValues) => {
    submit.mutate(values, {
      onSuccess: () => {
        toast.success('지원서가 제출되었습니다')
        reset()
        setStep(0)
      },
      onError: (error) => toast.error(error.message),
    })
  }

  const positionLabel = positions.find(
    ({ value }) => value === getValues('position'),
  )?.label

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {step + 1} / {steps.length} 단계 · {steps[step].title}
        </p>
        <Progress
          value={((step + 1) / steps.length) * 100}
          aria-label="진행률"
        />
      </div>

      {/* 단계별 필드는 숨기는 대신 조건부 렌더링하므로, 값은 RHF 가 유지한다 */}
      {step === 0 && (
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="apply-name">이름</FieldLabel>
            <Input
              id="apply-name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldErrorSlot error={errors.name} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="apply-email">이메일</FieldLabel>
            <Input
              id="apply-email"
              type="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldErrorSlot error={errors.email} />
          </Field>
        </FieldGroup>
      )}

      {step === 1 && (
        <FieldGroup>
          <Field data-invalid={!!errors.position}>
            <FieldLabel htmlFor="apply-position">지원 분야</FieldLabel>
            <Controller
              control={control}
              name="position"
              render={({ field }) => (
                <Select
                  items={positions}
                  value={field.value ?? null}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="apply-position"
                    className="w-full"
                    aria-invalid={!!errors.position}
                  >
                    <SelectValue placeholder="분야를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldErrorSlot error={errors.position} />
          </Field>
          <Field data-invalid={!!errors.intro}>
            <FieldLabel htmlFor="apply-intro">자기소개</FieldLabel>
            <Textarea
              id="apply-intro"
              rows={4}
              aria-invalid={!!errors.intro}
              {...register('intro')}
            />
            <FieldErrorSlot error={errors.intro} />
          </Field>
        </FieldGroup>
      )}

      {isLast && (
        <dl className="space-y-3 rounded-lg bg-muted p-4 text-sm">
          <div>
            <dt className="text-muted-foreground">이름</dt>
            <dd>{getValues('name')}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">이메일</dt>
            <dd>{getValues('email')}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">지원 분야</dt>
            <dd>{positionLabel}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">자기소개</dt>
            <dd className="whitespace-pre-wrap">{getValues('intro')}</dd>
          </div>
        </dl>
      )}

      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((current) => current - 1)}
        >
          이전
        </Button>
        {isLast ? (
          <Button type="submit" disabled={submit.isPending}>
            {submit.isPending ? '제출 중...' : '제출하기'}
          </Button>
        ) : (
          <Button type="button" onClick={handleNext}>
            다음
          </Button>
        )}
      </div>
    </form>
  )
}
