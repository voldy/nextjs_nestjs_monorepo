import { isBrowser } from './isBrowser.ts'

describe('isBrowser', () => {
  it('should return false in Node.js environment', () => {
    expect(isBrowser()).toBe(false)
  })

  it('should return true when window and document exist', () => {
    // Mock browser environment
    const mockWindow = {}
    const mockDocument = {}

    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      configurable: true,
    })
    Object.defineProperty(globalThis, 'document', {
      value: mockDocument,
      configurable: true,
    })

    expect(isBrowser()).toBe(true)

    // Clean up
    delete (globalThis as any).window
    delete (globalThis as any).document
  })
})
