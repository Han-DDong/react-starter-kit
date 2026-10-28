import { describe, expect, it } from 'vitest'
import { findExample, getItemLink, examples } from './registry'

describe('findExample', () => {
  it('카테고리와 예제 id 로 예제 하나를 찾고 이전/다음을 알려준다', () => {
    const match = findExample('forms', 'contact')

    expect(match?.item.title).toBe('문의하기')
    expect(match?.prev?.id).toBe('signup')
    expect(match?.next?.id).toBe('multistep')
  })

  it('첫 번째·마지막 예제는 한쪽 이동이 없다', () => {
    expect(findExample('data', 'table')?.prev).toBeUndefined()
    expect(findExample('data', 'todo')?.next).toBeUndefined()
  })

  it('알 수 없는 카테고리나 id 는 undefined 를 돌려준다', () => {
    expect(findExample('forms', 'unknown')).toBeUndefined()
    expect(findExample('nope', 'signup')).toBeUndefined()
    expect(findExample('forms', undefined)).toBeUndefined()
  })

  it('모든 예제는 /examples/<카테고리>/<예제> 주소를 갖는다', () => {
    const links = examples.flatMap((entry) =>
      entry.items.map((item) => getItemLink(entry, item)),
    )

    expect(links).toHaveLength(11)
    expect(new Set(links).size).toBe(11)
    expect(links).toContain('/examples/ui/data-display')
  })
})
