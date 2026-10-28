import { Menu } from 'lucide-react'
import { MainNav } from '@/app/layouts/MainNav'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { siteConfig } from '@/lib/siteConfig'
import { useUiStore } from '@/stores/ui'

// md 미만에서만 보이는 햄버거 메뉴 (열림 상태는 전역 UI 스토어에서 관리)
export function MobileNav() {
  const open = useUiStore((state) => state.mobileNavOpen)
  const setOpen = useUiStore((state) => state.setMobileNavOpen)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="메뉴 열기"
        onClick={() => setOpen(true)}
      >
        <Menu />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader className="p-0">
            <SheetTitle>{siteConfig.name}</SheetTitle>
          </SheetHeader>
          <MainNav orientation="vertical" onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  )
}
