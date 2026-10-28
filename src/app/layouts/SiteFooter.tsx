import { Link } from 'react-router'
import { Container } from '@/components/common/Container'
import { categoryLink, examples } from '@/features/examples/registry'
import { siteConfig, techLinks } from '@/lib/siteConfig'

const linkClass =
  'text-muted-foreground hover:text-foreground text-sm transition-colors'

// 모바일 1열 → md 이상 3열로 배치되는 푸터
export function SiteFooter() {
  return (
    <footer className="border-t">
      <Container className="grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">예제</p>
          <ul className="space-y-2">
            {examples.map((entry) => (
              <li key={entry.id}>
                <Link to={categoryLink(entry)} className={linkClass}>
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">사용 기술</p>
          <ul className="space-y-2">
            {techLinks.map(({ label, href }) => (
              <li key={href}>
                {/* 외부 링크는 새 탭에서 열고, 보안을 위해 noopener 를 붙인다 */}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t">
        <Container className="py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  )
}
