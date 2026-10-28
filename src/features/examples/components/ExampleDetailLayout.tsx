import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Container } from '@/components/common/Container'
import { PageHeader } from '@/components/common/PageHeader'
import {
  categoryLink,
  getItemLink,
  type ExampleMatch,
} from '@/features/examples/registry'

interface ExampleDetailLayoutProps {
  match: ExampleMatch
  description?: string // 지정하지 않으면 registry 의 짧은 설명을 쓴다
  children: ReactNode
}

const linkClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'

// 예제 하나를 단독으로 보여주는 공용 틀: 목록으로 돌아가기 + 제목 + 본문 + 이전/다음
export function ExampleDetailLayout({
  match,
  description,
  children,
}: ExampleDetailLayoutProps) {
  const { entry, item, prev, next } = match

  return (
    <Container className="space-y-6 py-10">
      <div>
        <Link to={categoryLink(entry)} className={linkClass}>
          ← {entry.title}
        </Link>
        <div className="mt-3">
          <PageHeader
            title={item.title}
            description={description ?? item.description}
          />
        </div>
      </div>

      {children}

      {/* 같은 카테고리의 이전/다음 예제. 다른 예제를 한 화면에 쌓지 않고 이동만 돕는다 */}
      <nav
        aria-label="예제 이동"
        className="flex justify-between gap-4 border-t pt-6"
      >
        {prev ? (
          <Link to={getItemLink(entry, prev)} className={linkClass}>
            ← 이전: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={getItemLink(entry, next)} className={linkClass}>
            다음: {next.title} →
          </Link>
        )}
      </nav>
    </Container>
  )
}
