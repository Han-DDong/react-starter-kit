import { authHandlers } from '@/mocks/handlers/auth'
import { dataHandlers } from '@/mocks/handlers/data'
import { formHandlers } from '@/mocks/handlers/forms'

// 도메인별 핸들러를 한 배열로 합친다. 새 도메인을 추가하면 여기에 펼쳐 넣는다.
export const handlers = [...authHandlers, ...formHandlers, ...dataHandlers]
