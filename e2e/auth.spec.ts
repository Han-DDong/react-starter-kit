import { expect, test } from '@playwright/test'

test.describe('로그인 체험', () => {
  test('로그인하면 헤더가 바뀌고, 로그아웃하면 원래대로 돌아온다', async ({
    page,
  }) => {
    await page.goto('/login')
    await page.getByLabel('이메일').fill('demo@example.com')
    await page.getByLabel('비밀번호').fill('password123')
    await page.getByRole('main').getByRole('button', { name: '로그인' }).click()

    // 로그인 후 홈으로 이동하고, 헤더에 로그아웃 버튼이 나타난다
    await expect(page).toHaveURL('/')
    const header = page.getByRole('banner')
    await expect(header.getByRole('button', { name: '로그아웃' })).toBeVisible()

    await header.getByRole('button', { name: '로그아웃' }).click()
    await expect(header.getByText('로그인')).toBeVisible()
  })

  test('잘못된 비밀번호면 에러 토스트가 보인다', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('이메일').fill('demo@example.com')
    await page.getByLabel('비밀번호').fill('wrong-password')
    await page.getByRole('main').getByRole('button', { name: '로그인' }).click()

    await expect(
      page.getByText('이메일 또는 비밀번호가 올바르지 않습니다'),
    ).toBeVisible()
  })

  test('로그인 없이도 모든 페이지에 접근할 수 있다', async ({ page }) => {
    await page.goto('/examples/data/table')
    await expect(page).toHaveURL('/examples/data/table')
    await expect(
      page.getByRole('heading', { name: '사용자 테이블', level: 1 }),
    ).toBeVisible()
  })
})
