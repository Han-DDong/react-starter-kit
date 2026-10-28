import { Outlet } from 'react-router'
import { SiteFooter } from '@/app/layouts/SiteFooter'
import { SiteHeader } from '@/app/layouts/SiteHeader'

// 모든 페이지 공통 레이아웃: 헤더 + 본문 + 푸터
// main 에 flex-1 을 주면 콘텐츠가 짧아도 푸터가 항상 화면 바닥에 위치한다
export function SiteLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
