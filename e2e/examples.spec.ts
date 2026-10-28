import { expect, test } from '@playwright/test'

test.describe('예제 모음', () => {
  test('인덱스에는 11개의 예제 카드가 모두 보인다', async ({ page }) => {
    await page.goto('/examples')

    await expect(
      page.getByRole('main').locator('a[href^="/examples/"]'),
    ).toHaveCount(11)
  })

  test('인덱스 카드를 누르면 그 예제 하나만 보인다', async ({ page }) => {
    await page.goto('/examples')
    await page.getByRole('link', { name: /다단계 폼/ }).click()

    await expect(page).toHaveURL('/examples/forms/multistep')
    await expect(
      page.getByRole('heading', { name: '다단계 폼', level: 1 }),
    ).toBeVisible()
    await expect(page.getByText('1 / 3 단계')).toBeVisible()
    // 같은 카테고리의 다른 예제와 탭은 화면에 없다
    await expect(page.getByLabel('비밀번호 확인')).toHaveCount(0)
    await expect(page.getByRole('tab')).toHaveCount(0)
  })

  test('데이터·UI 예제도 하나만 보인다', async ({ page }) => {
    await page.goto('/examples')
    await page.getByRole('link', { name: /무한 스크롤/ }).click()
    await expect(page).toHaveURL('/examples/data/infinite')
    await expect(page.getByLabel('이름 또는 이메일 검색')).toHaveCount(0)

    await page.goto('/examples')
    await page.getByRole('link', { name: /오버레이/ }).click()
    await expect(page).toHaveURL('/examples/ui/overlays')
    await expect(page.getByRole('button', { name: '다이얼로그' })).toBeVisible()
    await expect(page.getByRole('button', { name: '성공 토스트' })).toHaveCount(
      0,
    )
  })

  test('이전/다음 링크로 같은 카테고리의 다른 예제로 이동한다', async ({
    page,
  }) => {
    await page.goto('/examples/forms/contact')

    await page.getByRole('link', { name: /다음: 다단계 폼/ }).click()
    await expect(page).toHaveURL('/examples/forms/multistep')

    await page.getByRole('link', { name: /이전: 문의하기/ }).click()
    await expect(page).toHaveURL('/examples/forms/contact')
  })

  test('목록 링크는 인덱스의 해당 섹션으로 돌아간다', async ({ page }) => {
    await page.goto('/examples/forms/signup')
    await page.getByRole('link', { name: /← 폼 예제/ }).click()

    await expect(page).toHaveURL('/examples#forms')
    await expect(page.locator('#forms')).toBeInViewport()
  })

  test('잘못된 예제 id 는 404 를 보여주고, 옛 카테고리 주소는 인덱스로 보낸다', async ({
    page,
  }) => {
    await page.goto('/examples/forms/unknown')
    await expect(page.getByText('404')).toBeVisible()

    await page.goto('/examples/data')
    await expect(page).toHaveURL('/examples#data')
  })

  test('UI 갤러리: 토스트와 다이얼로그가 동작한다', async ({ page }) => {
    await page.goto('/examples/ui/feedback')

    await page.getByRole('button', { name: '성공 토스트' }).click()
    await expect(
      page.getByText('저장되었습니다', { exact: true }),
    ).toBeVisible()

    await page.goto('/examples/ui/overlays')
    await page.getByRole('button', { name: '다이얼로그' }).click()
    await expect(page.getByText('다이얼로그 제목')).toBeVisible()
  })
})

test.describe('폼 예제', () => {
  test('회원가입: 비밀번호가 다르면 필드 에러가 표시된다', async ({ page }) => {
    await page.goto('/examples/forms/signup')

    await page.getByLabel('이름').fill('홍길동')
    await page.getByLabel('이메일').fill('hong@example.com')
    await page.getByLabel('비밀번호', { exact: true }).fill('password1')
    await page.getByLabel('비밀번호 확인').fill('different1')
    await page.getByRole('button', { name: '가입하기' }).click()

    await expect(page.getByText('비밀번호가 일치하지 않습니다')).toBeVisible()
    await expect(page.getByText('약관에 동의해야 합니다')).toBeVisible()
  })

  test('회원가입: 서버가 거절한 이메일 에러가 필드에 표시된다', async ({
    page,
  }) => {
    await page.goto('/examples/forms/signup')

    await page.getByLabel('이름').fill('홍길동')
    await page.getByLabel('이메일').fill('taken@example.com')
    await page.getByLabel('비밀번호', { exact: true }).fill('password1')
    await page.getByLabel('비밀번호 확인').fill('password1')
    await page.getByRole('checkbox', { name: /이용약관/ }).click()
    await page.getByRole('button', { name: '가입하기' }).click()

    await expect(page.getByText('이미 가입된 이메일입니다')).toBeVisible()
  })

  test('회원가입: 올바르게 입력하면 성공 토스트가 뜬다', async ({ page }) => {
    await page.goto('/examples/forms/signup')

    await page.getByLabel('이름').fill('홍길동')
    await page.getByLabel('이메일').fill('hong@example.com')
    await page.getByLabel('비밀번호', { exact: true }).fill('password1')
    await page.getByLabel('비밀번호 확인').fill('password1')
    await page.getByRole('checkbox', { name: /이용약관/ }).click()
    await page.getByRole('button', { name: '가입하기' }).click()

    await expect(page.getByText('가입이 완료되었습니다')).toBeVisible()
  })

  test('다단계 폼: 현재 단계가 유효해야 다음으로 넘어간다', async ({
    page,
  }) => {
    await page.goto('/examples/forms/multistep')

    await page.getByRole('button', { name: '다음' }).click()
    await expect(page.getByText('이름은 2자 이상이어야 합니다')).toBeVisible()
    await expect(page.getByText('1 / 3 단계')).toBeVisible() // 넘어가지 못함

    await page.getByLabel('이름').fill('홍길동')
    await page.getByLabel('이메일').fill('hong@example.com')
    await page.getByRole('button', { name: '다음' }).click()
    await expect(page.getByText('2 / 3 단계')).toBeVisible()
  })
})

test.describe('데이터 예제', () => {
  test('사용자 테이블: 검색과 페이지 이동이 서버 요청으로 처리된다', async ({
    page,
  }) => {
    await page.goto('/examples/data/table')
    await expect(page.getByText(/총 53명/)).toBeVisible()
    await expect(page.getByText(/1 \/ 6 페이지/)).toBeVisible()

    await page.getByRole('button', { name: '다음' }).click()
    await expect(page.getByText(/2 \/ 6 페이지/)).toBeVisible()

    // user5, user50 ~ user53 → 5명
    await page.getByLabel('이름 또는 이메일 검색').fill('user5')
    await expect(page.getByText(/총 5명/)).toBeVisible()
    await expect(page.getByText(/1 \/ 1 페이지/)).toBeVisible() // 검색하면 첫 페이지로 돌아간다
  })

  test('사용자 테이블: 헤더를 눌러 정렬한다', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop', '테이블은 md 이상에서만 보인다')

    await page.goto('/examples/data/table')
    await expect(page.getByText(/총 53명/)).toBeVisible()

    await page.getByRole('button', { name: '이름' }).click()
    await expect(
      page.getByRole('columnheader', { name: '이름' }),
    ).toHaveAttribute('aria-sort', 'ascending')

    await page.getByRole('button', { name: '이름' }).click()
    await expect(
      page.getByRole('columnheader', { name: '이름' }),
    ).toHaveAttribute('aria-sort', 'descending')
  })

  test('무한 스크롤: 끝까지 내리면 모든 글을 불러온다', async ({ page }) => {
    await page.goto('/examples/data/infinite')

    const posts = page.getByRole('heading', { name: /활용 노트/ })
    await expect(posts.first()).toBeVisible()

    await expect(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await expect(
        page.getByText(/모든 글을 불러왔습니다 \(47개\)/),
      ).toBeVisible({ timeout: 1000 })
    }).toPass({ timeout: 15_000 })
    await expect(posts).toHaveCount(47)
  })

  test('낙관적 업데이트: 성공한 변경은 유지되고 실패한 변경은 되돌아간다', async ({
    page,
  }) => {
    await page.goto('/examples/data/todo')

    // 성공: 새 항목이 추가된다
    await page.getByLabel('새 할 일').fill('E2E 항목')
    await page.getByRole('button', { name: '추가' }).click()
    await expect(page.getByText('E2E 항목')).toBeVisible()

    // 실패: 체크하면 서버가 500 을 응답하고, 체크가 다시 풀린다
    const failing = page.getByRole('checkbox', { name: /실패 하는 할 일/ })
    await failing.click()
    await expect(page.getByText('서버에서 변경에 실패했습니다')).toBeVisible()
    await expect(failing).not.toBeChecked()
  })
})
