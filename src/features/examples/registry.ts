import {
  Activity,
  AppWindow,
  BellRing,
  FormInput,
  InfinityIcon,
  LayoutGrid,
  ListChecks,
  MailQuestion,
  MousePointerClick,
  Table2,
  TableProperties,
  TextCursorInput,
  UserPlus,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

// 개별 예제 하나(탭 또는 갤러리 섹션). id 는 탭 값 / 섹션 해시와 같은 값을 쓴다
export interface ExampleItem {
  id: string
  title: string
  description: string
  tags: string[] // 이 예제에서 배울 수 있는 기술/패턴 (카드에 배지로 표시)
  icon: LucideIcon
}

export type ExampleCategoryId = 'ui' | 'forms' | 'data'

export interface ExampleEntry {
  id: ExampleCategoryId // 주소(/examples/<id>/...)와 인덱스 섹션 앵커로 쓰인다
  title: string
  description: string
  tags: string[] // 예제에서 사용하는 기술 (카드에 배지로 표시)
  icon: LucideIcon
  items: ExampleItem[]
}

// 예제 목록의 단일 출처: 예제 인덱스, 랜딩, 푸터가 모두 이 배열을 사용한다.
// 새 예제를 추가할 때는 items 에 항목을 더하고, 해당 카테고리 페이지의 id → 컴포넌트 매핑에 구현을 연결한다.
export const examples: ExampleEntry[] = [
  {
    id: 'ui',
    title: 'UI 컴포넌트 갤러리',
    description:
      '버튼, 입력, 오버레이, 피드백 등 shadcn/ui 컴포넌트를 한눈에 확인합니다.',
    tags: ['shadcn/ui', 'Tailwind CSS'],
    icon: LayoutGrid,
    items: [
      {
        id: 'buttons',
        title: '버튼',
        description: '변형(variant), 크기, 아이콘, 비활성 상태',
        tags: ['Button', 'variant'],
        icon: MousePointerClick,
      },
      {
        id: 'inputs',
        title: '입력 컨트롤',
        description: '텍스트, 선택, 체크, 스위치, 라디오',
        tags: ['Input', 'Select', 'Switch'],
        icon: TextCursorInput,
      },
      {
        id: 'feedback',
        title: '피드백',
        description: 'Toast, Alert, Progress, Skeleton',
        tags: ['Sonner', 'Alert'],
        icon: BellRing,
      },
      {
        id: 'overlays',
        title: '오버레이',
        description: 'Dialog, Sheet, Dropdown, Tooltip',
        tags: ['Dialog', 'Sheet'],
        icon: AppWindow,
      },
      {
        id: 'data-display',
        title: '데이터 표시',
        description: 'Card, Badge, Avatar, Table, Tabs, Accordion',
        tags: ['Card', 'Table'],
        icon: TableProperties,
      },
    ],
  },
  {
    id: 'forms',
    title: '폼 예제',
    description:
      '회원가입, 문의하기, 다단계 폼으로 검증과 다양한 입력 컴포넌트 연결 방법을 익힙니다.',
    tags: ['React Hook Form', 'Zod'],
    icon: FormInput,
    items: [
      {
        id: 'signup',
        title: '회원가입',
        description: '비밀번호 확인 검증과 서버 에러(중복 이메일) 표시',
        tags: ['Zod refine', '서버 에러'],
        icon: UserPlus,
      },
      {
        id: 'contact',
        title: '문의하기',
        description: 'Select, Radio, Textarea, Checkbox 를 폼에 연결',
        tags: ['Controller', '글자 수'],
        icon: MailQuestion,
      },
      {
        id: 'multistep',
        title: '다단계 폼',
        description: '단계별 부분 검증과 마지막 확인 화면',
        tags: ['trigger', '단계 검증'],
        icon: Workflow,
      },
    ],
  },
  {
    id: 'data',
    title: '데이터 예제',
    description:
      '서버 사이드 테이블, 무한 스크롤, 낙관적 업데이트 등 실전 데이터 패칭 패턴을 다룹니다.',
    tags: ['TanStack Query', 'TanStack Table'],
    icon: Table2,
    items: [
      {
        id: 'table',
        title: '사용자 테이블',
        description: '검색(debounce), 필터, 정렬, 페이지네이션을 서버에서 처리',
        tags: ['TanStack Table', 'keepPreviousData'],
        icon: Activity,
      },
      {
        id: 'infinite',
        title: '무한 스크롤',
        description: '커서 기반 페이지를 이어 붙이고 끝에 닿으면 자동 로드',
        tags: ['useInfiniteQuery', 'IntersectionObserver'],
        icon: InfinityIcon,
      },
      {
        id: 'todo',
        title: '할 일 목록',
        description: '화면을 먼저 바꾸고 실패하면 되돌리는 낙관적 업데이트',
        tags: ['useMutation', '롤백'],
        icon: ListChecks,
      },
    ],
  },
]

// 카테고리 위치(인덱스 페이지의 해당 섹션)로 이동하는 주소
export function categoryLink(entry: ExampleEntry) {
  return `/examples#${entry.id}`
}

// 개별 예제 페이지 주소: /examples/<카테고리>/<예제>
export function getItemLink(entry: ExampleEntry, item: ExampleItem) {
  return `/examples/${entry.id}/${item.id}`
}

export interface ExampleMatch {
  entry: ExampleEntry
  item: ExampleItem
  prev?: ExampleItem // 같은 카테고리의 이전/다음 예제 (양 끝에서는 없다)
  next?: ExampleItem
}

// 주소의 id 로 예제를 찾는다. 없으면 undefined (호출한 페이지가 404 를 보여준다)
export function findExample(
  categoryId: string,
  itemId: string | undefined,
): ExampleMatch | undefined {
  const entry = examples.find(({ id }) => id === categoryId)
  const index = entry?.items.findIndex(({ id }) => id === itemId) ?? -1
  if (!entry || index < 0) return undefined

  return {
    entry,
    item: entry.items[index],
    prev: entry.items[index - 1],
    next: entry.items[index + 1],
  }
}
