import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { FieldErrorSlot } from '@/components/common/FieldErrorSlot'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  CONTACT_MESSAGE_MAX,
  categories,
  contactSchema,
  urgencies,
  type ContactValues,
} from '@/features/examples/forms/schemas'

type Urgency = ContactValues['urgency']

const isUrgency = (value: unknown): value is Urgency =>
  urgencies.some((urgency) => urgency.value === value)

export function ContactForm() {
  const submit = useSubmitForm<ContactValues>('contact')

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      urgency: 'normal',
      message: '',
      subscribe: false,
    },
  })

  // 글자 수 카운터: 입력할 때마다 값을 구독한다
  const message = useWatch({ control, name: 'message' })

  const onSubmit = (values: ContactValues) => {
    submit.mutate(values, {
      onSuccess: () => {
        toast.success('문의가 접수되었습니다')
        reset()
      },
      onError: (error) => toast.error(error.message),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="contact-name">이름</FieldLabel>
            <Input
              id="contact-name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            <FieldErrorSlot error={errors.name} />
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="contact-email">이메일</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <FieldErrorSlot error={errors.email} />
          </Field>
        </div>

        <Field data-invalid={!!errors.category}>
          <FieldLabel htmlFor="contact-category">문의 유형</FieldLabel>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                items={categories}
                value={field.value ?? null}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="contact-category"
                  className="w-full"
                  aria-invalid={!!errors.category}
                >
                  <SelectValue placeholder="유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldErrorSlot error={errors.category} />
        </Field>

        <Field>
          <FieldLabel>긴급도</FieldLabel>
          <Controller
            control={control}
            name="urgency"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  if (isUrgency(value)) field.onChange(value)
                }}
                className="flex flex-wrap gap-4"
              >
                {urgencies.map(({ value, label }) => (
                  <div key={value} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={value}
                      id={`contact-urgency-${value}`}
                    />
                    <Label htmlFor={`contact-urgency-${value}`}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor="contact-message">내용</FieldLabel>
          <Textarea
            id="contact-message"
            rows={5}
            aria-invalid={!!errors.message}
            {...register('message')}
          />
          <div className="flex justify-between gap-2">
            <FieldErrorSlot error={errors.message} />
            <span className="ml-auto text-xs text-muted-foreground">
              {message.length} / {CONTACT_MESSAGE_MAX}
            </span>
          </div>
        </Field>

        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="subscribe"
            render={({ field }) => (
              <Checkbox
                id="contact-subscribe"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="contact-subscribe">소식을 이메일로 받겠습니다</Label>
        </div>

        <Button type="submit" disabled={submit.isPending}>
          {submit.isPending ? '전송 중...' : '문의 보내기'}
        </Button>
      </FieldGroup>
    </form>
  )
}
