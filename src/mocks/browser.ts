import { setupWorker } from 'msw/browser'
import { handlers } from '@/mocks/handlers'

// 브라우저(개발 서버/E2E)용 워커
export const worker = setupWorker(...handlers)
