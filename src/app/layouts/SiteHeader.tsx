import { Blocks, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { MainNav } from '@/app/layouts/MainNav'
import { MobileNav } from '@/app/layouts/MobileNav'
import { Container } from '@/components/common/Container'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/store'
import { siteConfig } from '@/lib/siteConfig'

// 스크롤해도 상단에 고정되는 헤더. 배경을 반투명 + blur 처리해 콘텐츠 위에서도 읽힌다
export function SiteHeader() {
  const user = useAuthStore((state) => state.user)
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center gap-2">
        <MobileNav />

        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Blocks className="size-5" />
          {siteConfig.name}
        </Link>

        <div className="ml-4 hidden md:block">
          <MainNav />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut data-icon="inline-start" />
                로그아웃
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              nativeButton={false}
              render={<Link to="/login" />}
            >
              로그인
            </Button>
          )}
        </div>
      </Container>
    </header>
  )
}
