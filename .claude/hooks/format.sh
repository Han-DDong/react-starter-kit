#!/bin/bash
# 파일 저장(Edit/Write) 직후 Prettier 로 자동 포맷한다.
# 포맷 실패가 Claude 작업을 막지 않도록 항상 exit 0 으로 끝낸다.

file=$(jq -r '.tool_input.file_path // empty')

# 경로가 없으면 종료
[ -z "$file" ] && exit 0

# Prettier 대상 확장자만 처리
case "$file" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.md) ;;
  *) exit 0 ;;
esac

# 삭제되었거나 존재하지 않는 파일은 건너뜀
[ -f "$file" ] || exit 0

# .prettierignore 는 Prettier 가 자동으로 적용한다
cd "${CLAUDE_PROJECT_DIR:-.}" && pnpm exec prettier --write --log-level warn "$file" >&2

exit 0
