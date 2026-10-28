import type { ComponentType } from 'react'
import { useParams } from 'react-router'
import { NotFound } from '@/components/common/NotFound'
import { Card, CardContent } from '@/components/ui/card'
import { ExampleDetailLayout } from '@/features/examples/components/ExampleDetailLayout'
import { InfinitePosts } from '@/features/examples/data/InfinitePosts'
import { TodoList } from '@/features/examples/data/TodoList'
import { UsersTable } from '@/features/examples/data/UsersTable'
import { findExample } from '@/features/examples/registry'

interface DataExample {
  description: string
  Content: ComponentType
}

// registry 의 items[].id 와 같은 키로 구현을 연결한다
const dataExamples: Record<string, DataExample | undefined> = {
  table: {
    description:
      '검색(debounce), 상태 필터, 정렬, 페이지네이션이 모두 서버 요청으로 처리됩니다. TanStack Table + TanStack Query 조합입니다.',
    Content: UsersTable,
  },
  infinite: {
    description:
      'useInfiniteQuery 로 커서 기반 페이지를 이어 붙입니다. 목록 끝에 닿으면 자동으로 다음 페이지를 불러옵니다.',
    Content: InfinitePosts,
  },
  todo: {
    description:
      '서버 응답을 기다리지 않고 화면을 먼저 바꾸고, 실패하면 이전 상태로 되돌립니다.',
    Content: TodoList,
  },
}

// /examples/data/:id — 예제 하나만 보여준다
export default function DataPage() {
  const { id } = useParams()
  const match = findExample('data', id)
  const example = id ? dataExamples[id] : undefined
  if (!match || !example) return <NotFound />

  const { Content } = example
  return (
    <ExampleDetailLayout match={match} description={example.description}>
      <Card>
        <CardContent>
          <Content />
        </CardContent>
      </Card>
    </ExampleDetailLayout>
  )
}
