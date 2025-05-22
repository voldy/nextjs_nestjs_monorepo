import { assertUnreachable } from './assertUnreachable'

describe('assertUnreachable', () => {
  it('should throw an error with the provided value', () => {
    const value = 'unexpected' as never

    expect(() => assertUnreachable(value)).toThrow('Unreachable case: unexpected')
  })

  it('should be used for exhaustive switch checks', () => {
    type Status = 'success' | 'error'

    const getStatusMessage = (status: Status): string => {
      switch (status) {
        case 'success':
          return 'Operation successful'
        case 'error':
          return 'Operation failed'
        default:
          return assertUnreachable(status)
      }
    }

    expect(getStatusMessage('success')).toBe('Operation successful')
    expect(getStatusMessage('error')).toBe('Operation failed')
  })
})
