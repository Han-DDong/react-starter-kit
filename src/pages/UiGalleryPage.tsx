import type { ComponentType } from 'react'
import { useParams } from 'react-router'
import { NotFound } from '@/components/common/NotFound'
import { ExampleDetailLayout } from '@/features/examples/components/ExampleDetailLayout'
import { findExample } from '@/features/examples/registry'
import { ButtonsSection } from '@/features/examples/ui/ButtonsSection'
import { DataDisplaySection } from '@/features/examples/ui/DataDisplaySection'
import { FeedbackSection } from '@/features/examples/ui/FeedbackSection'
import { InputsSection } from '@/features/examples/ui/InputsSection'
import { OverlaysSection } from '@/features/examples/ui/OverlaysSection'

// registry 의 items[].id 와 같은 키로 구현을 연결한다
const sections: Record<string, ComponentType | undefined> = {
  buttons: ButtonsSection,
  inputs: InputsSection,
  feedback: FeedbackSection,
  overlays: OverlaysSection,
  'data-display': DataDisplaySection,
}

// /examples/ui/:id — 컴포넌트 묶음 하나만 보여준다
export default function UiGalleryPage() {
  const { id } = useParams()
  const match = findExample('ui', id)
  const Section = id ? sections[id] : undefined
  if (!match || !Section) return <NotFound />

  return (
    <ExampleDetailLayout match={match}>
      <Section />
    </ExampleDetailLayout>
  )
}
