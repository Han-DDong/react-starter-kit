import { Container } from '@/components/common/Container'

const stack = [
  'React 19',
  'TypeScript',
  'Vite',
  'Tailwind CSS',
  'shadcn/ui',
  'React Router',
  'TanStack Query',
  'TanStack Table',
  'Zustand',
  'React Hook Form',
  'Zod',
  'Axios',
]

export function TechStack() {
  return (
    <section className="border-b">
      <Container className="py-10">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          검증된 라이브러리로 구성했습니다
        </p>
        <ul className="flex flex-wrap justify-center gap-2">
          {stack.map((name) => (
            <li
              key={name}
              className="rounded-full bg-muted px-3 py-1 text-sm font-medium"
            >
              {name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
