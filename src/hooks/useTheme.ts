import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark' // 'system' 을 실제 값으로 해석한 결과

export interface ThemeContextValue {
  theme: Theme // 사용자가 선택한 값
  resolvedTheme: ResolvedTheme // 화면에 실제 적용 중인 값 (아이콘, 토스트 등에서 사용)
  setTheme: (theme: Theme) => void
}

export const THEME_STORAGE_KEY = 'theme' // index.html 의 초기화 스크립트와 동일해야 한다

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme 은 ThemeProvider 안에서만 사용할 수 있습니다')
  }
  return context
}
