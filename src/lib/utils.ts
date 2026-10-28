import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 조건부 클래스를 합치고, 충돌하는 Tailwind 클래스는 뒤에 오는 값으로 덮어쓴다
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
