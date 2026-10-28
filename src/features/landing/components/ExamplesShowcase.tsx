import { Link } from 'react-router'
import { Container } from '@/components/common/Container'
import { ExampleCard } from '@/features/examples/components/ExampleCard'
import { examples } from '@/features/examples/registry'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ExamplesShowcase() {
  return (
    <section className="border-b">
      <Container className="py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            직접 확인해 보세요
          </h2>
          <p className="mt-2 text-muted-foreground">
            실제로 동작하는 예제로 패턴을 바로 익힐 수 있습니다.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {examples.map((example) => (
            <ExampleCard key={example.id} example={example} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/examples"
            className={cn(buttonVariants({ variant: 'link' }))}
          >
            전체 예제 보기 →
          </Link>
        </div>
      </Container>
    </section>
  )
}
