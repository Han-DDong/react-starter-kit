#!/bin/bash
# Notification(입력/권한 대기)과 Stop(작업 완료) 이벤트를 macOS 알림으로 표시한다.
# 알림 실패가 Claude 작업을 막지 않도록 항상 exit 0 으로 끝낸다.

input=$(cat)
event=$(echo "$input" | jq -r '.hook_event_name // empty')

title="Claude Code"

case "$event" in
  Notification)
    body=$(echo "$input" | jq -r '.message // "확인이 필요합니다"')
    ;;
  Stop)
    body="작업이 완료되었습니다"
    ;;
  *)
    exit 0
    ;;
esac

# 문자열을 인자로 넘겨 따옴표 인젝션을 방지한다
osascript \
  -e 'on run argv' \
  -e 'display notification (item 1 of argv) with title (item 2 of argv)' \
  -e 'end run' \
  -- "$body" "$title" >/dev/null 2>&1

exit 0
