import { Link } from 'react-router'
import { Container } from '@/components/common/Container'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/siteConfig'

export function Hero() {
  return (
    <section className="border-b">
      <Container className="flex flex-col items-center gap-6 py-16 text-center sm:py-24">
        <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
          Vite · React 19 · TypeScript
        </span>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          빠르게 시작하는 React 프론트엔드
        </h1>
        <p className="max-w-xl text-base text-balance text-muted-foreground sm:text-lg">
          {siteConfig.description}
        </p>
        {/* 모바일에서는 버튼이 세로로 쌓이고, sm 이상에서 가로로 배치된다 */}
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to="/examples" />}
          >
            예제 보기
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link to="/login" />}
          >
            로그인 체험
          </Button>
        </div>
      </Container>
    </section>
  )
}
