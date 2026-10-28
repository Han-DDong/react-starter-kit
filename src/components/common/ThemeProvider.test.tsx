import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/components/common/ThemeProvider'
import { THEME_STORAGE_KEY, useTheme } from '@/hooks/useTheme'

// jsdom 에는 matchMedia 가 없으므로 OS 다크 모드 여부를 직접 제어할 수 있는 가짜를 만든다
function mockSystemTheme(initialDark: boolean) {
  let isDark = initialDark
  const listeners = new Set<() => void>()

  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return isDark
    },
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  }))

  return {
    setDark(next: boolean) {
      isDark = next
      listeners.forEach((listener) => listener())
    },
  }
}

function Probe() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  return (
    <>
      <p data-testid="theme">{theme}</p>
      <p data-testid="resolved">{resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>다크</button>
      <button onClick={() => setTheme('system')}>시스템</button>
    </>
  )
}

const renderProbe = () =>
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  )

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.colorScheme = ''
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('저장값이 없으면 시스템 설정을 따른다', () => {
    mockSystemTheme(true)
    renderProbe()

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('테마를 선택하면 클래스가 바뀌고 저장된다', async () => {
    mockSystemTheme(false)
    renderProbe()
    expect(document.documentElement).toHaveClass('light')

    await userEvent.click(screen.getByText('다크'))

    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement).not.toHaveClass('light')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('저장된 값을 복원한다', () => {
    mockSystemTheme(false)
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderProbe()

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('시스템 모드에서는 OS 테마 변경을 즉시 반영한다', () => {
    const system = mockSystemTheme(false)
    renderProbe()
    expect(document.documentElement).toHaveClass('light')

    act(() => system.setDark(true))

    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('명시적으로 선택한 테마는 OS 변경에 영향받지 않는다', async () => {
    const system = mockSystemTheme(false)
    renderProbe()
    await userEvent.click(screen.getByText('다크'))

    act(() => system.setDark(false))

    expect(document.documentElement).toHaveClass('dark')
  })

  it('다른 탭에서 바뀐 값을 반영한다', () => {
    mockSystemTheme(false)
    renderProbe()

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: THEME_STORAGE_KEY,
          newValue: 'dark',
        }),
      )
    })

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })
})
