import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/examples',
  '/examples/ui/buttons',
  '/examples/ui/inputs',
  '/examples/ui/feedback',
  '/examples/ui/overlays',
  '/examples/ui/data-display',
  '/examples/forms/signup',
  '/examples/forms/contact',
  '/examples/forms/multistep',
  '/examples/data/table',
  '/examples/data/infinite',
  '/examples/data/todo',
  '/login',
  '/없는-페이지',
]

test.describe('사이트 공통', () => {
  test('첫 화면은 로그인 없이 랜딩 페이지로 열리고 헤더와 푸터가 보인다', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /빠르게 시작하는 React/, level: 1 }),
    ).toBeVisible()
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('모든 라우트에서 콘솔 에러가 없다', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    page.on('pageerror', (error) => errors.push(String(error)))

    for (const route of routes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
    }

    expect(errors).toEqual([])
  })

  test('내용이 짧은 페이지에서도 푸터가 화면 아래에 있다', async ({ page }) => {
    await page.goto('/없는-페이지')

    const viewportHeight = page.viewportSize()?.height ?? 0
    const footerBottom = await page
      .getByRole('contentinfo')
      .evaluate((element) => element.getBoundingClientRect().bottom)

    expect(Math.round(footerBottom)).toBeGreaterThanOrEqual(viewportHeight)
  })

  test('모든 화면 폭에서 가로 스크롤이 생기지 않는다', async ({ page }) => {
    for (const route of routes) {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      )
      expect(overflow, `${route} 가로 넘침`).toBeLessThanOrEqual(0)
    }
  })

  test('모바일에서는 햄버거 메뉴로 페이지를 이동한다', async ({
    page,
  }, info) => {
    test.skip(info.project.name !== 'mobile', '모바일 전용')

    await page.goto('/')
    await page.getByRole('button', { name: '메뉴 열기' }).click()
    await page.getByRole('dialog').getByRole('link', { name: '예제' }).click()

    await expect(page).toHaveURL('/examples')
  })
})

test.describe('다크 모드', () => {
  test('드롭다운에서 다크를 고르면 적용되고 새로고침해도 유지된다', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveClass(/light/)

    await page.getByRole('button', { name: '테마 변경' }).click()
    await page.getByRole('menuitemradio', { name: '다크' }).click()
    await expect(html).toHaveClass(/dark/)

    await page.reload()
    await expect(html).toHaveClass(/dark/)
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
      'dark',
    )
  })

  test('시스템 모드는 OS 설정을 따라가고 변경도 즉시 반영한다', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto('/')
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html).toHaveClass(/light/)
  })

  test('저장된 다크 테마는 첫 화면부터 깜빡임 없이 적용된다', async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem('theme', 'dark'))
    await page.goto('/')

    // React 가 실행되기 전(index.html 스크립트)에 이미 dark 클래스가 있어야 한다
    const bodyBackground = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    )
    expect(bodyBackground).not.toBe('rgb(255, 255, 255)')
    await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark')
  })
})
