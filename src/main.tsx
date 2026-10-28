import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Providers } from '@/app/providers'
import { router } from '@/app/router'
import { setupApi } from '@/app/setupApi'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import './index.css'

// 백엔드 없이 개발할 때만 MSW를 켠다 (.env 의 VITE_ENABLE_MOCK=true)
async function enableMocking() {
  // env 객체가 아닌 import.meta.env 를 직접 비교해야 빌드 시 정적으로 치환되어
  // 모킹을 끈 프로덕션 번들에서 MSW 코드가 통째로 제거된다
  if (import.meta.env.VITE_ENABLE_MOCK !== 'true') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

setupApi()

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <Providers>
          <RouterProvider router={router} />
        </Providers>
      </ErrorBoundary>
    </StrictMode>,
  )
})
