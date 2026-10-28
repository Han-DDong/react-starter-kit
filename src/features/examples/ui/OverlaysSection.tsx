import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { GallerySection } from '@/features/examples/components/GallerySection'

const code = `<Dialog>
  <DialogTrigger render={<Button />}>열기</DialogTrigger>
  <DialogContent>...</DialogContent>
</Dialog>`

export function OverlaysSection() {
  return (
    <GallerySection code={code}>
      <div className="flex flex-wrap gap-2">
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            다이얼로그
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>다이얼로그 제목</DialogTitle>
              <DialogDescription>
                화면 중앙에 뜨는 모달입니다. Esc 키나 바깥 클릭으로 닫힙니다.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            시트
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>시트 제목</SheetTitle>
              <SheetDescription>
                화면 가장자리에서 밀려 나오는 패널입니다.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            드롭다운
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>프로필</DropdownMenuItem>
            <DropdownMenuItem>설정</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger render={<Button variant="outline" />}>
            툴팁
          </TooltipTrigger>
          <TooltipContent>마우스를 올리면 보입니다</TooltipContent>
        </Tooltip>
      </div>
    </GallerySection>
  )
}
