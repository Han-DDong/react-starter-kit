import { fakerKO as faker } from '@faker-js/faker'
import type { Post } from '@/features/examples/data/schemas'

faker.seed(7)

const topics = ['React', 'TypeScript', 'Vite', 'Tailwind', 'TanStack Query']
const summaries = [
  '핵심 개념을 예제와 함께 정리했습니다.',
  '실무에서 자주 겪는 문제와 해결 방법을 소개합니다.',
  '성능과 가독성을 함께 챙기는 방법을 살펴봅니다.',
]

export const posts: Post[] = Array.from({ length: 47 }, (_, index) => ({
  id: String(index + 1),
  title: `${topics[index % topics.length]} 활용 노트 #${index + 1}`,
  summary: summaries[index % summaries.length],
  author: faker.person.fullName(),
  createdAt: faker.date.recent({ days: 60 }).toISOString(),
}))
