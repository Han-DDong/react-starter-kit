import type { ReactNode } from 'react'

interface GallerySectionProps {
  code: string // 미리보기에 해당하는 사용 예시 코드
  children: ReactNode
}

// 갤러리 예제를 같은 틀로 보여준다: 미리보기 + 접이식 코드 (제목은 상세 페이지 헤더가 담당)
// 코드 토글은 네이티브 <details> 를 써서 별도 상태/라이브러리 없이 접근성을 확보한다
export function GallerySection({ code, children }: GallerySectionProps) {
  return (
    <section className="space-y-4">
      <div className="rounded-xl border p-4 sm:p-6">{children}</div>
      <details className="group rounded-lg border">
        <summary className="cursor-pointer px-4 py-2 text-sm text-muted-foreground select-none hover:text-foreground">
          코드 보기
        </summary>
        <pre className="overflow-x-auto border-t bg-muted p-4 text-xs">
          <code>{code}</code>
        </pre>
      </details>
    </section>
  )
}
