import { Skeleton } from '@/components/ui/skeleton'

// 페이지/목록 로딩 중 보여주는 자리 표시자
export function PageSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="로딩 중">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
