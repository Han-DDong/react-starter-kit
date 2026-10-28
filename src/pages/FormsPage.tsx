import type { ComponentType } from 'react'
import { useParams } from 'react-router'
import { NotFound } from '@/components/common/NotFound'
import { Card, CardContent } from '@/components/ui/card'
import { ExampleDetailLayout } from '@/features/examples/components/ExampleDetailLayout'
import { ContactForm } from '@/features/examples/forms/ContactForm'
import { MultiStepForm } from '@/features/examples/forms/MultiStepForm'
import { SignupForm } from '@/features/examples/forms/SignupForm'
import { findExample } from '@/features/examples/registry'

interface FormExample {
  description: string
  Form: ComponentType
}

// registry 의 items[].id 와 같은 키로 구현을 연결한다. 새 폼 예제는 한 항목만 추가하면 된다
const forms: Record<string, FormExample | undefined> = {
  signup: {
    description:
      'Zod refine 으로 비밀번호 확인을 검증하고, 서버 에러(중복 이메일)를 필드에 표시합니다. taken@example.com 으로 시도해 보세요.',
    Form: SignupForm,
  },
  contact: {
    description:
      'Select, RadioGroup, Textarea, Checkbox 를 Controller 로 연결하고 글자 수를 실시간으로 표시합니다.',
    Form: ContactForm,
  },
  multistep: {
    description:
      '단계마다 trigger 로 해당 필드만 검증한 뒤 다음 단계로 이동하고, 마지막에 입력 내용을 확인합니다.',
    Form: MultiStepForm,
  },
}

// /examples/forms/:id — 예제 하나만 보여준다
export default function FormsPage() {
  const { id } = useParams()
  const match = findExample('forms', id)
  const example = id ? forms[id] : undefined
  if (!match || !example) return <NotFound />

  const { Form } = example
  return (
    <ExampleDetailLayout match={match} description={example.description}>
      <Card className="mx-auto max-w-2xl">
        <CardContent>
          <Form />
        </CardContent>
      </Card>
    </ExampleDetailLayout>
  )
}
