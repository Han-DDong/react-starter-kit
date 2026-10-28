import { fakerKO as faker } from '@faker-js/faker'
import type { UserRow } from '@/features/examples/data/schemas'

// 시드를 고정해 실행할 때마다 같은 데이터가 만들어지게 한다 (테스트/스크린샷 재현성)
faker.seed(2026)

const roles = ['관리자', '편집자', '뷰어']
const statuses: UserRow['status'][] = ['active', 'inactive', 'pending']

export const users: UserRow[] = Array.from({ length: 53 }, (_, index) => ({
  id: String(index + 1),
  name: faker.person.fullName(),
  email: `user${index + 1}@example.com`, // 한글 이메일을 피하려고 직접 만든다
  role: faker.helpers.arrayElement(roles),
  status: faker.helpers.arrayElement(statuses),
  createdAt: faker.date.past({ years: 2 }).toISOString(),
}))
