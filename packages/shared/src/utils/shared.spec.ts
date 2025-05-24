import { shared } from './shared.ts'

describe('shared', () => {
  it('should work', () => {
    expect(shared()).toEqual('shared')
  })
})
