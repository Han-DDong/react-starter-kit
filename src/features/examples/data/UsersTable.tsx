import {
  createColumnHelper,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type PaginationState,
  type SortingState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { PageSkeleton } from '@/components/common/PageSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUsers } from '@/features/examples/data/api'
import {
  userSortKeys,
  userStatusSchema,
  type UserRow,
  type UserSortKey,
  type UserStatus,
} from '@/features/examples/data/schemas'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 10

const statusLabel: Record<UserStatus, string> = {
  active: '활성',
  inactive: '비활성',
  pending: '대기',
}

const statusVariant: Record<UserStatus, 'default' | 'secondary' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  pending: 'outline',
}

const statusFilters = [
  { value: 'all', label: '전체 상태' },
  ...Object.entries(statusLabel).map(([value, label]) => ({ value, label })),
]

const isSortKey = (value: string): value is UserSortKey =>
  userSortKeys.some((key) => key === value)

// v9 는 사용할 기능을 명시적으로 등록한다 (정렬, 페이지네이션).
// 서버가 정렬/페이지를 처리하므로 클라이언트용 row model 은 등록하지 않는다.
// features 와 columns 는 렌더링마다 새로 만들지 않도록 모듈 스코프에 둔다.
const features = tableFeatures({ rowSortingFeature, rowPaginationFeature })
const columnHelper = createColumnHelper<typeof features, UserRow>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: '이름' }),
  columnHelper.accessor('email', { header: '이메일' }),
  columnHelper.accessor('role', { header: '역할', enableSorting: false }),
  columnHelper.accessor('status', {
    header: '상태',
    cell: ({ cell }) => (
      <Badge variant={statusVariant[cell.getValue()]}>
        {statusLabel[cell.getValue()]}
      </Badge>
    ),
  }),
  columnHelper.accessor('createdAt', {
    header: '가입일',
    cell: ({ cell }) => format(new Date(cell.getValue()), 'yyyy.MM.dd'),
  }),
])

const emptyRows: UserRow[] = [] // 데이터가 없을 때 매번 새 배열을 만들지 않도록 고정

export function UsersTable() {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300) // 입력이 멈춘 뒤에만 요청한다
  const [status, setStatus] = useState<UserStatus | 'all'>('all')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const sort = sorting[0]
  const { data, error, isPending, isPlaceholderData, refetch } = useUsers({
    search: debouncedSearch,
    status,
    sortBy: sort && isSortKey(sort.id) ? sort.id : null,
    order: sort?.desc ? 'desc' : 'asc',
    page: pagination.pageIndex,
    pageSize: pagination.pageSize,
  })

  const resetPage = () => setPagination((prev) => ({ ...prev, pageIndex: 0 }))

  const table = useTable({
    features,
    columns,
    data: data?.items ?? emptyRows,
    rowCount: data?.total ?? 0,
    manualSorting: true,
    manualPagination: true,
    state: { sorting, pagination },
    onSortingChange: (updater) => {
      setSorting(updater)
      resetPage() // 정렬 기준이 바뀌면 첫 페이지부터 다시 본다
    },
    onPaginationChange: setPagination,
  })

  const rows = table.getRowModel().rows
  const pageCount = table.getPageCount()

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="이름 또는 이메일 검색"
            placeholder="이름 또는 이메일 검색"
            className="pl-8"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              resetPage()
            }}
          />
        </div>
        <Select
          items={statusFilters}
          value={status}
          onValueChange={(value) => {
            const parsed = userStatusSchema.safeParse(value)
            setStatus(parsed.success ? parsed.data : 'all')
            resetPage()
          }}
        >
          <SelectTrigger aria-label="상태 필터" className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusFilters.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorMessage message={error.message} onRetry={refetch} />
      ) : rows.length === 0 ? (
        <EmptyState
          title="검색 결과가 없습니다"
          description="검색어나 필터를 바꿔 보세요."
        />
      ) : (
        // 새 데이터를 불러오는 동안(placeholder)에는 이전 내용을 흐리게 보여준다
        <div
          className={cn(isPlaceholderData && 'opacity-60 transition-opacity')}
        >
          {/* 모바일(md 미만): 카드 목록 */}
          <ul className="space-y-3 md:hidden">
            {rows.map(({ original: user, id }) => (
              <li key={id} className="space-y-1 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant={statusVariant[user.status]}>
                    {statusLabel[user.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role} · {format(new Date(user.createdAt), 'yyyy.MM.dd')}
                </p>
              </li>
            ))}
          </ul>

          {/* 태블릿 이상(md~): 정렬 가능한 테이블 */}
          <div className="hidden overflow-x-auto rounded-lg border md:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sorted = header.column.getIsSorted()
                      return (
                        <TableHead
                          key={header.id}
                          aria-sort={
                            sorted === 'asc'
                              ? 'ascending'
                              : sorted === 'desc'
                                ? 'descending'
                                : undefined
                          }
                        >
                          {header.column.getCanSort() ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="-ml-2.5"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <table.FlexRender header={header} />
                              {sorted === 'asc' ? (
                                <ArrowUp />
                              ) : sorted === 'desc' ? (
                                <ArrowDown />
                              ) : (
                                <ArrowUpDown className="opacity-40" />
                              )}
                            </Button>
                          ) : (
                            <table.FlexRender header={header} />
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          총 {data?.total ?? 0}명 · {pagination.pageIndex + 1} /{' '}
          {Math.max(pageCount, 1)} 페이지
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
