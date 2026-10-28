import {
  Database,
  FlaskConical,
  Moon,
  ShieldCheck,
  Smartphone,
  SquareStack,
  type LucideIcon,
} from 'lucide-react'
import { Container } from '@/components/common/Container'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Smartphone,
    title: '반응형 레이아웃',
    description: '모바일 우선으로 작성되어 360px부터 데스크톱까지 대응합니다.',
  },
  {
    icon: Moon,
    title: '다크 모드',
    description: '라이트/다크/시스템 3가지 모드를 지원하고 선택이 저장됩니다.',
  },
  {
    icon: ShieldCheck,
    title: '타입 안전한 폼',
    description:
      'React Hook Form과 Zod로 검증과 타입을 하나의 스키마로 관리합니다.',
  },
  {
    icon: Database,
    title: '데이터 패칭 패턴',
    description:
      '캐싱, 페이지네이션, 무한 스크롤, 낙관적 업데이트 예제를 제공합니다.',
  },
  {
    icon: SquareStack,
    title: 'shadcn/ui 컴포넌트',
    description:
      '접근성이 좋은 컴포넌트를 소스 코드로 가져와 자유롭게 수정합니다.',
  },
  {
    icon: FlaskConical,
    title: '테스트 환경',
    description: 'Vitest와 Playwright가 설정되어 있고 MSW로 API를 모킹합니다.',
  },
]

export function Features() {
  return (
    <section className="border-b">
      <Container className="py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            필요한 것이 모두 준비되어 있습니다
          </h2>
          <p className="mt-2 text-muted-foreground">
            설정에 시간을 쓰지 말고 바로 기능 개발을 시작하세요.
          </p>
        </div>
        {/* 1열 → sm 2열 → lg 3열 */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="mb-2 size-6 text-primary" />
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}
