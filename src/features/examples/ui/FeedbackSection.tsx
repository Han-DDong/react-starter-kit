import { CircleAlert, Info } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { GallerySection } from '@/features/examples/components/GallerySection'

const code = `toast.success('저장되었습니다')
<Alert variant="destructive">...</Alert>
<Progress value={60} />
<Skeleton className="h-4 w-40" />`

export function FeedbackSection() {
  return (
    <GallerySection code={code}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success('저장되었습니다')}
          >
            성공 토스트
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error('문제가 발생했습니다')}
          >
            에러 토스트
          </Button>
          <Button variant="outline" onClick={() => toast.info('안내 메시지')}>
            정보 토스트
          </Button>
        </div>

        <div className="space-y-3">
          <Alert>
            <Info />
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>
              기본 Alert 입니다. 라이트/다크 모두 대비가 유지됩니다.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>
              destructive 변형은 위험하거나 실패한 상태를 나타냅니다.
            </AlertDescription>
          </Alert>
        </div>

        <Progress value={60} aria-label="진행률" />

        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    </GallerySection>
  )
}
