import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { SiteLayout } from '@/app/layouts/SiteLayout'
import { PageSkeleton } from '@/components/common/PageSkeleton'

// 페이지를 라우트 이동 시점에 불러와 초기 번들 크기를 줄인다 (코드 스플리팅)
const lazyPage = (
  load: () => Promise<{ default: ComponentType }>,
): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => ({ Component: (await load()).default }),
})

// 카테고리별 상세 페이지 (import 경로를 한 곳에 모아 동적 import 가 정적으로 분석되게 한다)
const PAGES = {
  ui: () => import('@/pages/UiGalleryPage'),
  forms: () => import('@/pages/FormsPage'),
  data: () => import('@/pages/DataPage'),
}

// 모든 페이지가 공개다. 로그인이 필요한 라우트가 생기면
// features/auth/components/ProtectedRoute 를 감싸는 라우트로 해당 경로들을 묶는다.
export const router = createBrowserRouter([
  {
    HydrateFallback: PageSkeleton, // 첫 로딩(lazy 라우트 준비 중)에 보여줄 화면
    children: [
      {
        element: <SiteLayout />,
        children: [
          { index: true, ...lazyPage(() => import('@/pages/HomePage')) },
          { path: 'login', ...lazyPage(() => import('@/pages/LoginPage')) },
          {
            path: 'examples',
            children: [
              {
                index: true,
                ...lazyPage(() => import('@/pages/ExamplesPage')),
              },
              // 예제는 카테고리/예제 id 로 하나씩 보여준다 (/examples/forms/signup)
              ...(['ui', 'forms', 'data'] as const).flatMap((category) => [
                {
                  path: `${category}/:id`,
                  ...lazyPage(() => PAGES[category]()),
                },
                // 예전 카테고리 주소는 인덱스의 해당 섹션으로 보낸다
                {
                  path: category,
                  element: <Navigate to={`/examples#${category}`} replace />,
                },
              ]),
            ],
          },
          { path: '*', ...lazyPage(() => import('@/pages/NotFoundPage')) },
        ],
      },
    ],
  },
])
