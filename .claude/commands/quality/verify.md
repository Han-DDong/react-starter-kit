---
description: lint, typecheck, test를 실행하고 필요하면 E2E까지 검증한다
allowed-tools: Bash(pnpm lint:*), Bash(pnpm typecheck:*), Bash(pnpm test:*), Bash(pnpm exec playwright:*), Bash(git status:*), Bash(git diff:*)
---

변경 사항을 CLAUDE.md "검증" 절차에 따라 확인한다.

1. `git status --short` 와 `git diff --stat` 로 변경 범위를 파악한다.
2. 아래를 순서대로 실행한다. 하나라도 실패하면 이후 단계로 넘어가기 전에 원인을 분석한다.
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
3. 변경 파일에 화면/라우트/폼이 포함되어 있으면(`src/pages/`, `src/app/router.tsx`, `src/features/**` 의 컴포넌트·폼, `e2e/`) `pnpm test:e2e` 도 실행한다.
   - 해당 없으면 E2E 는 생략하고 그 이유를 한 줄로 밝힌다.
4. 결과를 한국어로 요약한다.
   - 단계별 통과/실패 표 (생략한 단계는 "생략 + 이유")
   - 실패 시: 에러 원문 핵심, 추정 원인, 수정 제안
   - 사용자가 요청하지 않았다면 코드를 수정하지 말고 보고만 한다.

$ARGUMENTS 가 `fix` 이면 lint/format 으로 자동 수정 가능한 항목(`pnpm exec eslint . --fix`, `pnpm format`)만 고친 뒤 다시 검증한다.
