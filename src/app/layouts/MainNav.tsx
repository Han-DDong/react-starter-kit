import { NavLink } from 'react-router'
import { navItems } from '@/app/layouts/navItems'
import { cn } from '@/lib/utils'

interface MainNavProps {
  orientation?: 'horizontal' | 'vertical'
  onNavigate?: () => void // 모바일에서 메뉴 선택 시 Sheet를 닫기 위한 콜백
}

export function MainNav({
  orientation = 'horizontal',
  onNavigate,
}: MainNavProps) {
  return (
    <nav
      aria-label="주 메뉴"
      className={cn('flex gap-1', orientation === 'vertical' && 'flex-col')}
    >
      {navItems.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
