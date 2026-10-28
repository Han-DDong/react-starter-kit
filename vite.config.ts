import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // '@/' 를 src 폴더로 매핑 (tsconfig paths와 반드시 일치해야 함)
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'jsdom', // 브라우저 DOM 환경 흉내
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Node의 fetch는 상대 경로를 쓸 수 없으므로 테스트에서는 절대 경로를 사용
    env: { VITE_API_URL: 'http://localhost:3000/api' },
    include: ['src/**/*.test.{ts,tsx}'], // e2e 폴더는 Playwright 전용이라 제외
  },
})
