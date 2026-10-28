import { create } from 'zustand'

interface UiState {
  mobileNavOpen: boolean // 모바일 사이드바(Sheet) 열림 여부
  setMobileNavOpen: (open: boolean) => void
}

// 서버와 무관한 UI 전용 상태만 Zustand에 둔다
export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}))
