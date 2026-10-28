---
description: CLAUDE.md 구조 규칙(import 방향, MSW, 하드코딩 색상, any 등) 위반을 점검한다
allowed-tools: Grep, Glob, Read, Bash(git diff:*)
---

린터가 잡지 못하는 CLAUDE.md 규칙을 점검한다. 범위는 `src/` 이며, $ARGUMENTS 가 있으면 그 경로만 본다.
테스트 파일(`*.test.ts(x)`)과 `src/mocks/`, `src/test/` 는 아래 2번 외에는 제외한다.

## 점검 항목

1. **`lib` → `features` import**: `src/lib/` 에서 `@/features` 또는 `../features` 를 import 하면 위반. (연결은 `app/setupApi.ts` 에서 주입)
2. **운영 코드의 MSW 접근**: `src/features`, `src/pages`, `src/components`, `src/app`, `src/lib`, `src/hooks`, `src/stores` 에서
   - `from 'msw'` 직접 import
   - `mocks/handlers`, `mocks/browser`, `mocks/server` import
   - 예외: `src/main.tsx` 의 `mocks/browser` **동적** import, 공유 상수 `mocks/demoAccount` 는 허용
3. **import 방향 역류**: `components/` 나 `lib/` 가 `pages/` 를 import, `features/` 가 `pages/` 를 import 하면 위반.
4. **하드코딩 색상**: `bg-white`, `bg-black`, `text-white`, `text-black`, `(bg|text|border)-(gray|slate|zinc|neutral|stone)-\d+` 등. 테마 토큰(`bg-background`, `text-muted-foreground`)을 써야 한다.
   - `src/components/ui/` (shadcn 생성물)는 제외.
5. **`any` 타입**: `: any`, `as any`, `<any>`, `any[]`.
6. **`erasableSyntaxOnly` 위반**: `enum` 선언, 생성자 파라미터 프로퍼티(`constructor(public|private|protected|readonly ...)`).
7. **환경 변수**: `import.meta.env.` 직접 사용 중 `lib/env.ts` 를 거치지 않는 곳. 단, `VITE_ENABLE_MOCK` 은 `main.tsx` 에서 직접 비교해야 하므로 허용.
8. **`components/ui/` 직접 수정**: `git diff HEAD --stat -- src/components/ui` 에 변경이 있으면 알린다 (신규 shadcn 추가가 아니라면 `components/common/` 래핑 권장).
9. **페이지 default export**: `src/pages/**` 파일이 `export default` 를 갖는지.

## 출력 형식

한국어로 보고한다.

- 항목별 `✅ 통과` 또는 `❌ 위반 N건`
- 위반은 `파일:줄번호` 와 한 줄 설명, 그리고 권장 수정 방향
- 거짓 양성이 의심되면 "확인 필요" 로 구분해서 표시

수정은 사용자가 요청한 경우에만 한다.
