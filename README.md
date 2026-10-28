# React Starter Kit

Vite + React 19 + TypeScript 기반의 프론트엔드 스타터 킷입니다.
헤더/푸터 레이아웃, 랜딩 페이지, 다크 모드, 폼·데이터 예제가 준비되어 있어 바로 기능 개발을 시작할 수 있습니다.

## 기술 스택

| 영역            | 사용 기술                                                |
| --------------- | -------------------------------------------------------- |
| 빌드            | Vite, React 19, TypeScript (strict)                      |
| 라우팅          | React Router                                             |
| 스타일 / UI     | Tailwind CSS v4, shadcn/ui                               |
| 클라이언트 상태 | Zustand                                                  |
| 서버 상태       | TanStack Query                                           |
| 테이블          | TanStack Table                                           |
| 폼 / 검증       | React Hook Form, Zod                                     |
| HTTP            | Axios                                                    |
| 유틸            | date-fns, use-debounce, react-intersection-observer      |
| API 모킹        | MSW, @faker-js/faker                                     |
| 품질 도구       | ESLint (typescript-eslint), Prettier, Husky, lint-staged |
| 테스트          | Vitest + Testing Library, Playwright                     |

## 시작하기

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

개발 서버(`pnpm dev`)는 MSW 모킹이 켜진 상태로 실행됩니다 (`.env.development`).
따라서 백엔드 없이도 모든 예제가 동작합니다. 로그인 체험용 계정은 로그인 화면에 표시됩니다.

실제 백엔드를 연결하려면 `.env.example`을 `.env`로 복사해 `VITE_API_URL`을 수정하고,
`.env.development`의 `VITE_ENABLE_MOCK`을 `false`로 바꾸세요.

## 스크립트

| 명령어           | 설명                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| `pnpm dev`       | 개발 서버 실행                                                                 |
| `pnpm build`     | 타입 검사 후 프로덕션 빌드                                                     |
| `pnpm preview`   | 빌드 결과 미리보기                                                             |
| `pnpm lint`      | ESLint 검사 (`any` 사용 시 에러)                                               |
| `pnpm typecheck` | TypeScript 타입 검사                                                           |
| `pnpm format`    | Prettier로 전체 포맷                                                           |
| `pnpm test`      | 단위 테스트 (Vitest)                                                           |
| `pnpm test:e2e`  | E2E 테스트 (Playwright, 최초 1회 `pnpm exec playwright install chromium` 필요) |

## 화면 구성

모든 페이지는 로그인 없이 접근할 수 있고, 공통 레이아웃(헤더 + 본문 + 푸터)을 사용합니다.

| 경로                  | 내용                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- |
| `/`                   | 랜딩 페이지 (Hero, 기술 스택, 기능 소개, 예제 바로가기)                               |
| `/examples`           | 예제 모음 인덱스                                                                      |
| `/examples/ui/:id`    | shadcn/ui 갤러리 (buttons, inputs, feedback, overlays, data-display)                  |
| `/examples/forms/:id` | 폼 예제 (signup, contact, multistep): 필드 간 검증, 다양한 입력, 다단계               |
| `/examples/data/:id`  | 데이터 예제 (table, infinite, todo): 서버 사이드 테이블, 무한 스크롤, 낙관적 업데이트 |

예제는 하나씩 독립된 페이지로 열립니다. `/examples/forms` 같은 카테고리 주소는 인덱스의 해당 섹션(`/examples#forms`)으로 이동합니다.
| `/login` | 로그인 체험 (로그인하면 헤더가 사용자 상태로 바뀜) |

## 폴더 구조

```
src/
├─ app/          앱 조립: providers, router, 레이아웃(헤더/푸터), API 연결(setupApi)
├─ pages/        라우트 1개 = 파일 1개. 조립만 하고 로직은 features에 둔다
├─ features/     도메인 단위 모듈
│  ├─ auth/      로그인 체험, 인증 스토어, ProtectedRoute
│  ├─ landing/   랜딩 페이지 섹션
│  └─ examples/  예제 (registry.ts, forms/, data/, ui/)
├─ components/
│  ├─ ui/        shadcn/ui 생성물 (직접 수정 최소화)
│  └─ common/    프로젝트 공통 컴포넌트 (Container, PageHeader, ThemeToggle 등)
├─ hooks/        범용 훅 (useTheme)
├─ lib/          api 클라이언트, queryClient, env 검증, siteConfig, utils
├─ stores/       전역 UI 상태 (Zustand)
├─ mocks/        MSW 핸들러(도메인별)와 목 데이터
└─ test/         테스트 공통 설정과 헬퍼
```

### 의존 방향 규칙

`pages → features → components / lib` 방향으로만 import 합니다.
`lib`은 `features`를 알지 못하며, 인증 토큰 같은 연결은 `app/setupApi.ts`에서 주입합니다.
`mocks`는 개발/테스트 전용이므로 운영 코드에서 `msw`를 import 하는 파일을 가져오면 안 됩니다
(그러면 운영 번들에 MSW가 포함됩니다). 공유가 필요한 상수는 `mocks/demoAccount.ts`처럼 msw와 무관한 파일에 둡니다.

### 상태 관리 원칙

- 서버에서 받아오는 데이터 → **TanStack Query** (`features/*/api.ts`)
- 브라우저에만 있는 상태(로그인 정보, UI 토글) → **Zustand**
- 서버 데이터를 Zustand에 복사하지 않습니다.

## 다크 모드

헤더의 테마 버튼에서 라이트 / 다크 / 시스템을 선택합니다.

- 선택값은 `localStorage('theme')`에 저장되고, 다른 탭에도 반영됩니다.
- `index.html`의 초기화 스크립트가 첫 페인트 전에 `<html>`의 클래스를 지정해 화면이 번쩍이지 않습니다.
- 색상은 shadcn의 CSS 변수(`bg-background`, `text-foreground` 등)를 사용합니다.
  `bg-white`, `text-gray-500` 같은 하드코딩 색상은 다크 모드에서 깨지므로 쓰지 않습니다.
- 코드에서는 `useTheme()`으로 `theme`(선택값), `resolvedTheme`(실제 적용값), `setTheme`을 사용합니다.

## 새 기능 추가하기

### 새 예제 추가

1. `src/features/examples/<name>/` 에 컴포넌트를 만든다
2. `src/pages/<Name>Page.tsx` 에서 조립하고 **default export**
3. `src/app/router.tsx` 의 `examples` 하위에 `lazyPage(() => import(...))` 로 등록
4. `src/features/examples/registry.ts` 에 항목을 추가한다 (인덱스, 랜딩, 푸터에 자동 반영)

기존 카테고리에 예제를 더할 때는 다음 두 곳만 고친다.

1. `registry.ts` 해당 카테고리의 `items` 에 항목 추가 (`id` 가 주소 `/examples/<카테고리>/<id>` 가 된다)
2. 해당 페이지(`FormsPage` / `DataPage` / `UiGalleryPage`)의 id → 컴포넌트 매핑에 같은 `id` 로 구현 연결

라우트는 `:id` 로 자동 처리되고, 등록되지 않은 id 는 404 가 표시된다.

### 새 기능(도메인) 추가

1. `src/features/<name>/schemas.ts` — Zod 스키마와 `z.infer` 타입
2. `src/features/<name>/api.ts` — Query/Mutation 훅 (`features/examples/data/api.ts` 참고)
3. `src/features/<name>/components/` — 화면 컴포넌트
4. `src/pages/` 와 `src/app/router.tsx` 에 페이지 등록
5. 백엔드가 아직 없다면 `src/mocks/handlers/` 에 도메인별 핸들러를 추가하고 `handlers/index.ts` 에 합친다

shadcn/ui 컴포넌트는 `pnpm dlx shadcn@latest add <name>` 으로 추가합니다.
추가 후 `src/components/ui/*.tsx` 에서 `from "cn"` 이 생겼다면 `from "@/lib/utils"` 로 바꾸세요
(shadcn CLI가 제3자 `cn` 패키지로 연결하는 경우가 있습니다).

### 로그인이 필요한 라우트 만들기

현재는 모든 페이지가 공개입니다. 보호가 필요하면 `router.tsx` 에서 해당 라우트들을
`features/auth/components/ProtectedRoute` 를 `element` 로 가진 부모 라우트의 `children` 으로 묶으세요.
인증되지 않은 사용자는 `/login` 으로 이동합니다.

## 반응형 가이드

- 모바일 우선으로 작성하고 `sm`, `md`, `lg` 브레이크포인트로 확장합니다.
- 헤더: `md` 이상은 가로 메뉴, 미만은 햄버거 + Sheet
- 푸터: 모바일 1열 → `md` 3열
- 목록/테이블: `md` 미만은 카드, 이상은 테이블 (`UsersTable`)
- 폼 에러 메시지는 자리를 미리 확보합니다 (`FieldErrorSlot`). 에러가 나타나고 사라질 때 레이아웃이 밀리면
  바로 아래 버튼의 클릭이 무시될 수 있기 때문입니다.

## 알아둘 점

- `VITE_` 접두사 환경 변수는 브라우저 번들에 노출됩니다. 비밀키를 넣지 마세요.
- 로그인 토큰은 현재 localStorage에 저장됩니다. 백엔드가 정해지면 httpOnly 쿠키 방식을 검토하세요.
- SEO나 첫 로딩 성능이 중요해지면 Next.js 전환을 고려하세요. feature 모듈은 프레임워크에 독립적으로 작성되어 있습니다.
- TypeScript는 6.0, ESLint는 9 버전을 사용합니다. typescript-eslint가 아직 TypeScript 7을 지원하지 않고,
  eslint-plugin-jsx-a11y가 ESLint 10을 지원하지 않기 때문입니다. 해당 플러그인이 지원하면 올리세요.
