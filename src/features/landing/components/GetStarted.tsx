import { Container } from '@/components/common/Container'

const commands = ['pnpm install', 'pnpm dev']

export function GetStarted() {
  return (
    <section>
      <Container className="py-16">
        <div className="mx-auto max-w-2xl rounded-xl border bg-muted p-6 text-center sm:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">
            지금 시작하기
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            저장소를 받은 뒤 아래 명령어를 실행하세요.
          </p>
          {/* 긴 줄이 화면을 넘지 않도록 가로 스크롤을 허용한다 */}
          <pre className="mt-6 overflow-x-auto rounded-lg border bg-background p-4 text-left text-sm">
            <code>{commands.join('\n')}</code>
          </pre>
        </div>
      </Container>
    </section>
  )
}
