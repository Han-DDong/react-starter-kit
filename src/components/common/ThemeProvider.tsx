import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ResolvedTheme,
  type Theme,
} from '@/hooks/useTheme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isTheme = (value: string | null): value is Theme =>
  value === 'light' || value === 'dark' || value === 'system'

// 저장소 접근은 사생활 보호 모드 등에서 실패할 수 있으므로 항상 try/catch 한다
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (isTheme(stored)) return stored
  } catch {
    // 저장소를 쓸 수 없으면 기본값 사용
  }
  return 'system'
}

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'

// shadcn 공식 Vite 가이드와 동일하게 <html> 의 클래스를 교체한다 (Tailwind 의 dark: 변형이 이 클래스를 본다)
// color-scheme 까지 지정해야 스크롤바, 기본 폼 컨트롤도 테마를 따라간다
function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  // 'system' 일 때는 OS 설정을 실제 테마로 사용한다
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  // OS 테마가 바뀌면 즉시 반영한다 ('system' 선택 여부와 관계없이 항상 구독해 값을 최신으로 유지)
  useEffect(() => {
    const mediaQueryList = window.matchMedia(DARK_QUERY)
    const handleChange = () => setSystemTheme(getSystemTheme())

    mediaQueryList.addEventListener('change', handleChange)
    return () => mediaQueryList.removeEventListener('change', handleChange)
  }, [])

  // 다른 탭에서 테마를 바꾸면 이 탭에도 반영한다
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemeState(isTheme(event.newValue) ? event.newValue : 'system')
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // 저장 실패는 무시 (현재 세션에서는 정상 동작)
    }
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
