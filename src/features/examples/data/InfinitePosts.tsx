import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { Button } from '@/components/ui/button'
import { usePosts } from '@/features/examples/data/api'

export function InfinitePosts() {
  const {
    data,
    error,
    isPending,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = usePosts()

  // 목록 맨 아래 감시용 요소가 화면에 들어오면 다음 페이지를 자동으로 불러온다
  const { ref, inView } = useInView({ rootMargin: '200px' })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isPending) return <PageSkeleton />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  const posts = data.pages.flatMap((page) => page.items) // 페이지별 배열을 하나로 합친다

  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id} className="rounded-lg border p-4">
            <h3 className="font-medium">{post.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{post.summary}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {post.author} ·{' '}
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ko,
              })}
            </p>
          </li>
        ))}
      </ul>

      {/* 감시용 요소: 자동 로드가 안 되는 환경을 위해 "더 보기" 버튼을 함께 둔다 */}
      <div ref={ref} className="flex justify-center py-2">
        {hasNextPage ? (
          <Button
            variant="outline"
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            모든 글을 불러왔습니다 ({posts.length}개)
          </p>
        )}
      </div>
    </div>
  )
}
