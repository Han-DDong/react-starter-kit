import { ExamplesShowcase } from '@/features/landing/components/ExamplesShowcase'
import { Features } from '@/features/landing/components/Features'
import { GetStarted } from '@/features/landing/components/GetStarted'
import { Hero } from '@/features/landing/components/Hero'
import { TechStack } from '@/features/landing/components/TechStack'

// 페이지는 섹션 컴포넌트를 조립만 한다
export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <Features />
      <ExamplesShowcase />
      <GetStarted />
    </>
  )
}
