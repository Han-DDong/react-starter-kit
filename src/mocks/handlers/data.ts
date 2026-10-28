import { http, HttpResponse } from 'msw'
import { posts } from '@/mocks/data/posts'
import { users } from '@/mocks/data/users'
import {
  userSortKeys,
  type Todo,
  type UserSortKey,
} from '@/features/examples/data/schemas'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 제목에 이 단어가 들어간 할 일은 서버가 실패를 응답한다 (낙관적 업데이트 롤백 시연용)
export const FAIL_KEYWORD = '실패'

const isSortKey = (value: string | null): value is UserSortKey =>
  userSortKeys.some((key) => key === value)

// 메모리 저장소: 새로고침하면 초기화된다
let todos: Todo[] = [
  { id: '1', title: 'README 읽어보기', done: true },
  { id: '2', title: '예제 코드 살펴보기', done: false },
  { id: '3', title: `${FAIL_KEYWORD} 하는 할 일 (체크해 보세요)`, done: false },
]
let nextTodoId = 4

export const dataHandlers = [
  // 서버 사이드 검색 / 필터 / 정렬 / 페이지네이션
  http.get('/api/users', async ({ request }) => {
    await delay(300)
    const params = new URL(request.url).searchParams
    const search = (params.get('search') ?? '').trim().toLowerCase()
    const status = params.get('status')
    const sortBy = params.get('sortBy')
    const order = params.get('order') === 'desc' ? -1 : 1
    const page = Number(params.get('page') ?? 0)
    const pageSize = Number(params.get('pageSize') ?? 10)

    let result = users.filter(
      (user) =>
        (!search ||
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)) &&
        (!status || status === 'all' || user.status === status),
    )

    if (isSortKey(sortBy)) {
      result = [...result].sort(
        (a, b) => a[sortBy].localeCompare(b[sortBy], 'ko') * order,
      )
    }

    return HttpResponse.json({
      items: result.slice(page * pageSize, (page + 1) * pageSize),
      total: result.length,
    })
  }),

  // 커서 기반 페이지네이션 (무한 스크롤)
  http.get('/api/posts', async ({ request }) => {
    await delay(400)
    const params = new URL(request.url).searchParams
    const cursor = Number(params.get('cursor') ?? 0)
    const limit = Number(params.get('limit') ?? 10)
    const next = cursor + limit

    return HttpResponse.json({
      items: posts.slice(cursor, next),
      nextCursor: next < posts.length ? next : null,
    })
  }),

  http.get('/api/todos', () => HttpResponse.json(todos)),

  http.post('/api/todos', async ({ request }) => {
    await delay(500)
    const { title } = (await request.json()) as { title: string }
    if (title.includes(FAIL_KEYWORD)) {
      return HttpResponse.json(
        { message: '서버에서 추가에 실패했습니다' },
        { status: 500 },
      )
    }
    const created: Todo = { id: String(nextTodoId++), title, done: false }
    todos = [...todos, created]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch('/api/todos/:id', async ({ params, request }) => {
    await delay(500)
    const { done } = (await request.json()) as { done: boolean }
    const target = todos.find((todo) => todo.id === params.id)
    if (!target) {
      return HttpResponse.json({ message: '찾을 수 없습니다' }, { status: 404 })
    }
    if (target.title.includes(FAIL_KEYWORD)) {
      return HttpResponse.json(
        { message: '서버에서 변경에 실패했습니다' },
        { status: 500 },
      )
    }
    const updated = { ...target, done }
    todos = todos.map((todo) => (todo.id === target.id ? updated : todo))
    return HttpResponse.json(updated)
  }),

  http.delete('/api/todos/:id', async ({ params }) => {
    await delay(300)
    todos = todos.filter((todo) => todo.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
