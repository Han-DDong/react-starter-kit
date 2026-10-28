import { Link } from 'react-router'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'

// 404 화면. 알 수 없는 주소(NotFoundPage)와 잘못된 예제 id 에서 함께 쓴다
export function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-5xl font-semibold">404</p>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다.</p>
      <Button nativeButton={false} render={<Link to="/" />}>
        홈으로
      </Button>
    </Container>
  )
}
