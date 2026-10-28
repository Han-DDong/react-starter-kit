import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import { ExampleSection } from '@/features/examples/components/ExampleSection'
import { examples } from '@/features/examples/registry'

export default function ExamplesPage() {
  const { hash } = useLocation()
  const total = examples.reduce((sum, { items }) => sum + items.length, 0)

  // react-router 는 #해시 스크롤을 처리하지 않는다 (lazy 페이지는 렌더 후에야 대상이 생긴다).
  // 랜딩/푸터/상세 페이지에서 /examples#forms 로 들어오면 해당 섹션으로 직접 이동한다
  useEffect(() => {
    if (!hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  return (
    <Container className="space-y-12 py-10">
      <PageHeader
        title="예제 모음"
        description={`실제로 동작하는 ${total}개의 예제로 각 패턴을 확인하세요.`}
      />
      {examples.map((entry) => (
        <ExampleSection key={entry.id} entry={entry} />
      ))}
    </Container>
  )
}
