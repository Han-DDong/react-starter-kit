# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 프로젝트 규칙

Vite + React 19 SPA 스타터 킷입니다. 전역 규칙(한국어 주석/문서, 2칸 들여쓰기, `any` 금지, 반응형 필수)을 따릅니다.

## 명령어

패키지 매니저는 pnpm 이다.

- `pnpm dev` — 개발 서버 (http://localhost:5173). `.env.development` 의 `VITE_ENABLE_MOCK=true` 로 MSW 가 켜져 백엔드 없이 동작한다.
- `pnpm build` — `tsc -b` 후 `vite build`
- `pnpm test` — Vitest 전체 실행 (jsdom, `src/**/*.test.{ts,tsx}` 만 대상)
- 단일 테스트: `pnpm exec vitest run src/lib/api.test.ts` 또는 `pnpm exec vitest run -t "테스트 이름"`
- `pnpm test:e2e` — Playwright (desktop + mobile 두 프로젝트). dev 서버를 자동 기동하며, 최초 1회 `pnpm exec playwright install chromium` 필요. 단일 파일은 `pnpm exec playwright test e2e/auth.spec.ts --project=desktop`
- `pnpm format` / `pnpm format:check` — Prettier

## 아키텍처 (여러 파일을 읽어야 보이는 부분)

- **부팅 순서** (`src/main.tsx`): `setupApi()` → (모킹 켜져 있으면 `mocks/browser` 를 동적 import 해 MSW 시작) → React 렌더. MSW 활성 여부는 `import.meta.env.VITE_ENABLE_MOCK` 을 직접 비교해야 한다. `lib/env.ts` 객체를 거치면 빌드 시 정적 치환이 안 되어 운영 번들에 MSW 가 남는다.
- **API 계층 주입**: `lib/api.ts` 는 `features/auth` 를 모른다. `app/setupApi.ts` 가 `configureApi({ getToken, onUnauthorized })` 로 인증 스토어를 연결하는 유일한 지점이다.
- **라우팅** (`app/router.tsx`): 모든 페이지는 `lazyPage` 로 코드 스플리팅되고 `SiteLayout` 아래에 있다. 예제는 `examples/{ui|forms|data}/:id` 한 라우트가 카테고리별 페이지(`UiGalleryPage`/`FormsPage`/`DataPage`)의 id → 컴포넌트 매핑으로 분기한다. 카테고리 단독 주소는 `/examples#<category>` 로 리다이렉트된다. 현재 보호된 라우트는 없다 (`ProtectedRoute` 로 묶으면 된다).
- **예제 레지스트리** (`features/examples/registry.ts`): 예제 인덱스, 랜딩, 푸터가 이 한 곳을 읽는다. 예제 추가 절차는 README 의 "새 기능 추가하기" 를 따른다.
- **테스트 설정**: `vite.config.ts` 의 `test` 블록이 Vitest 설정을 겸한다. 공통 헬퍼는 `src/test/` (`renderWithProviders`, `setup.ts`), Node 테스트용 MSW 는 `mocks/server.ts`.
- **경로 별칭**: `@/` → `src`. `vite.config.ts` 와 `tsconfig` paths 를 항상 함께 수정한다.
- 의존성 버전(TypeScript 6, ESLint 9)이 고정된 이유는 README "알아둘 점" 참고. 임의로 올리지 않는다.

## 구조 규칙

- import 방향은 `pages → features → components / lib` 단방향만 허용한다.
- `lib/`는 `features/`를 import 하지 않는다. 연결은 `app/setupApi.ts`에서 주입한다.
- 페이지는 얇게 유지하고 로직은 `features/<name>/`에 둔다.
- 페이지 파일은 `export default` 로 내보낸다 (`router.tsx`의 `lazyPage` 가 default 를 기대한다).
- `components/ui/`(shadcn 생성물)는 직접 수정하지 말고 `components/common/`에서 감싼다.
- 운영 코드(`features`, `pages` 등)에서 `msw`를 import 하는 파일(`mocks/handlers/*`, `mocks/browser.ts`, `mocks/server.ts`)을 가져오지 않는다.
  운영 번들에 MSW가 포함된다. 공유 상수는 `mocks/demoAccount.ts` 에 둔다.

## 라이브러리

- 직접 만들기 전에 널리 검증된 라이브러리가 있는지 먼저 확인한다. (테이블 → TanStack Table, debounce → use-debounce, 날짜 → date-fns 등)
- 새 라이브러리는 설치 전에 최신 문서와 React 19 호환 여부를 확인하고, 설치 시 peer 의존성 경고가 없어야 한다.
- TanStack Table 은 v9 이다. v8 예제와 API 가 다르다 (`useTable`, `tableFeatures`, `table.FlexRender`).
- shadcn/ui 는 base-ui 기반이다. `asChild` 대신 `render` prop 을 쓰고, 링크 버튼은 `nativeButton={false}` 를 함께 준다.

## 상태 / 데이터

- 서버 데이터는 TanStack Query, 클라이언트 전용 상태는 Zustand. 서로 복사하지 않는다.
- 쿼리 키는 각 `api.ts` 의 `xxxKeys` 객체로 관리한다.
- HTTP 요청은 `lib/api.ts` 의 `api()` 를 사용한다 (Axios 인터셉터가 토큰 주입, 401 처리, 에러 변환을 담당).
- 폼은 React Hook Form + Zod. 스키마에서 `z.infer` 로 타입을 만든다.
- 폼의 에러 메시지는 `FieldErrorSlot` 으로 자리를 확보한다 (blur 시 레이아웃이 밀려 클릭이 무시되는 문제 방지).

## 스타일 / 다크 모드

- 색상은 `bg-background`, `text-muted-foreground` 같은 테마 토큰만 쓴다. `bg-white`, `text-gray-*` 등 하드코딩 색상 금지.
- 새 화면은 라이트와 다크 양쪽에서 확인한다.
- 긴 한글 문장이 어절 중간에서 끊기지 않도록 `word-break: keep-all` 이 전역 적용되어 있다.

## 코드 스타일

- Prettier 설정을 따른다 (세미콜론 없음, 작은따옴표, 2칸). 커밋 시 lint-staged 가 자동 적용한다.
- `tsconfig` 의 `erasableSyntaxOnly` 때문에 생성자 파라미터 프로퍼티(`constructor(public x)`)와 `enum` 은 사용할 수 없다.
- 환경 변수는 `lib/env.ts` 의 Zod 스키마에 먼저 등록한 뒤 사용한다.
- shadcn CLI 가 `from "cn"` 을 만들면 `from "@/lib/utils"` 로 바꾸고 `cn` 패키지는 제거한다.

## 검증

변경 후 `pnpm lint && pnpm typecheck && pnpm test` 를 통과시킨다. 화면/라우트/폼을 바꿨다면 `pnpm test:e2e` 도 실행한다.
