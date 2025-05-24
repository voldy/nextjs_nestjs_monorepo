import { deepMerge } from './deepMerge.ts'

describe('deepMerge', () => {
  it('should merge simple objects', () => {
    const target = { a: 1, b: 2 }
    const source = { c: 3, d: 4 }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 })
  })

  it('should override properties from source', () => {
    const target = { a: 1, b: 2 }
    const source = { b: 3, c: 4 }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should deeply merge nested objects', () => {
    const target = { a: { x: 1, y: 2 }, b: 3 }
    const source = { a: { y: 4, z: 5 }, c: 6 }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: { x: 1, y: 4, z: 5 }, b: 3, c: 6 })
  })

  it('should handle arrays as values (not merge them)', () => {
    const target = { arr: [1, 2] }
    const source = { arr: [3, 4] }
    const result = deepMerge(target, source)

    expect(result).toEqual({ arr: [3, 4] })
  })

  it('should handle null values', () => {
    const target = { a: { x: 1 } }
    const source = { a: null }
    const result = deepMerge(target, source)

    expect(result).toEqual({ a: null })
  })
})
