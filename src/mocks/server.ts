import { setupServer } from 'msw/node'
import { handlers } from '@/mocks/handlers'

// Vitest(Node)용 서버
export const server = setupServer(...handlers)
