import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

// 렌더링 중 발생한 예외로 화면 전체가 하얗게 되는 것을 막는다
// (에러 경계는 아직 클래스 컴포넌트로만 만들 수 있다)
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 운영 환경에서는 여기서 Sentry 같은 모니터링 도구로 전송한다
    console.error(error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-medium">문제가 발생했습니다</p>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      </div>
    )
  }
}
