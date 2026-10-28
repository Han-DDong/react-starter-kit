import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  postsPageSchema,
  todoListSchema,
  todoSchema,
  usersResponseSchema,
  type Todo,
  type UsersParams,
} from '@/features/examples/data/schemas'

// 쿼리 키를 한 곳에서 관리해 캐시 무효화 시 오타를 방지한다
export const dataKeys = {
  users: (params: UsersParams) => ['users', params] as const,
  posts: ['posts'] as const,
  todos: ['todos'] as const,
}

// ── 사용자 테이블: 파라미터가 바뀌면 queryKey 가 달라져 자동으로 다시 요청한다 ──
export function useUsers(params: UsersParams) {
  return useQuery({
    queryKey: dataKeys.users(params),
    queryFn: () =>
      api('/users', {
        params: {
          search: params.search,
          status: params.status,
          sortBy: params.sortBy ?? undefined,
          order: params.order,
          page: params.page,
          pageSize: params.pageSize,
        },
        schema: usersResponseSchema,
      }),
    // 새 데이터가 오기 전까지 이전 페이지를 보여줘 화면이 깜빡이지 않게 한다
    placeholderData: keepPreviousData,
  })
}

// ── 무한 스크롤: 서버가 내려준 nextCursor 로 다음 페이지를 요청한다 ──────────────
export function usePosts() {
  return useInfiniteQuery({
    queryKey: dataKeys.posts,
    queryFn: ({ pageParam }) =>
      api('/posts', {
        params: { cursor: pageParam, limit: 10 },
        schema: postsPageSchema,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor, // null 이면 더 불러오지 않는다
  })
}

// ── 할 일: 낙관적 업데이트 ────────────────────────────────────────────────────
export function useTodos() {
  return useQuery({
    queryKey: dataKeys.todos,
    queryFn: () => api('/todos', { schema: todoListSchema }),
  })
}

// 낙관적 업데이트의 공통 흐름
//  1) onMutate : 진행 중인 조회를 취소하고, 롤백용 스냅샷을 저장한 뒤 캐시를 먼저 바꾼다
//  2) onError  : 서버가 실패하면 스냅샷으로 되돌린다
//  3) onSettled: 성공/실패와 관계없이 서버 상태와 다시 맞춘다
function useOptimisticTodoMutation<TVariables>(options: {
  mutationFn: (variables: TVariables) => Promise<unknown>
  update: (todos: Todo[], variables: TVariables) => Todo[]
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: options.mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: dataKeys.todos })
      const previous = queryClient.getQueryData<Todo[]>(dataKeys.todos)
      queryClient.setQueryData<Todo[]>(dataKeys.todos, (todos = []) =>
        options.update(todos, variables),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(dataKeys.todos, context?.previous)
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: dataKeys.todos }),
  })
}

export function useAddTodo() {
  return useOptimisticTodoMutation<string>({
    mutationFn: (title) =>
      api('/todos', { method: 'POST', body: { title }, schema: todoSchema }),
    // 서버 id 를 모르므로 임시 id 로 먼저 보여준다 (onSettled 의 재조회로 교체된다)
    update: (todos, title) => [
      ...todos,
      { id: `temp-${Date.now()}`, title, done: false },
    ],
  })
}

export function useToggleTodo() {
  return useOptimisticTodoMutation<Todo>({
    mutationFn: (todo) =>
      api(`/todos/${todo.id}`, { method: 'PATCH', body: { done: !todo.done } }),
    update: (todos, target) =>
      todos.map((todo) =>
        todo.id === target.id ? { ...todo, done: !todo.done } : todo,
      ),
  })
}

export function useDeleteTodo() {
  return useOptimisticTodoMutation<string>({
    mutationFn: (id) => api(`/todos/${id}`, { method: 'DELETE' }),
    update: (todos, id) => todos.filter((todo) => todo.id !== id),
  })
}
