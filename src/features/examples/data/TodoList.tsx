import { Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  isTempTodoId,
  useAddTodo,
  useDeleteTodo,
  useTodos,
  useToggleTodo,
} from '@/features/examples/data/api'

export function TodoList() {
  const [title, setTitle] = useState('')
  const { data: todos, error, isPending, refetch } = useTodos()
  const addTodo = useAddTodo()
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const value = title.trim()
    if (!value) return
    setTitle('') // 낙관적 업데이트라서 서버 응답을 기다리지 않고 입력창을 비운다
    // 실패하면 목록은 자동으로 롤백되고, 여기서는 사용자에게 이유만 알려준다
    addTodo.mutate(value, { onError: (e) => toast.error(e.message) })
  }

  if (isPending) return <PageSkeleton />
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        항목을 추가하거나 체크하면 서버 응답 전에 화면이 먼저 바뀝니다. 제목에
        “실패”가 들어간 항목은 서버가 실패를 응답해서 원래대로 되돌아갑니다.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          aria-label="새 할 일"
          placeholder="할 일을 입력하세요"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button type="submit">추가</Button>
      </form>

      {todos.length === 0 ? (
        <EmptyState title="할 일이 없습니다" />
      ) : (
        <ul className="divide-y rounded-lg border">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-3 p-3">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.done}
                disabled={isTempTodoId(todo.id)}
                onCheckedChange={() =>
                  toggleTodo.mutate(todo, {
                    onError: (e) => toast.error(e.message),
                  })
                }
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={
                  todo.done
                    ? 'flex-1 text-muted-foreground line-through'
                    : 'flex-1'
                }
              >
                {todo.title}
              </label>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`${todo.title} 삭제`}
                disabled={isTempTodoId(todo.id)}
                onClick={() =>
                  deleteTodo.mutate(todo.id, {
                    onError: (e) => toast.error(e.message),
                  })
                }
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
