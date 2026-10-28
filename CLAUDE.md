# 프로젝트 규칙

Vite + React 19 SPA 스타터 킷입니다. 전역 규칙(한국어 주석/문서, 2칸 들여쓰기, `any` 금지, 반응형 필수)을 따릅니다.

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
