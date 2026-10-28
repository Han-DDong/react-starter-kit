import { FieldError } from '@/components/ui/field'

interface FieldErrorSlotProps {
  error?: { message?: string }
}

// 에러 메시지가 들어갈 한 줄 높이를 항상 확보한다.
// 필드를 벗어나는 순간(blur) 에러가 나타나거나 사라질 때 레이아웃이 밀리면,
// 마우스를 누른 위치와 뗀 위치의 요소가 달라져 바로 아래 버튼의 클릭이 무시될 수 있다.
export function FieldErrorSlot({ error }: FieldErrorSlotProps) {
  return (
    <div className="min-h-5">
      <FieldError errors={[error]} />
    </div>
  )
}
