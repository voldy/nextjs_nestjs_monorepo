import { sleep } from './sleep.ts'

describe('sleep', () => {
  it('should delay execution for the specified time', async () => {
    const start = Date.now()
    await sleep(100)
    const duration = Date.now() - start

    // Allow some tolerance for timing
    expect(duration).toBeGreaterThanOrEqual(90)
    expect(duration).toBeLessThan(200)
  })

  it('should return a promise', () => {
    const promise = sleep(1)
    expect(promise).toBeInstanceOf(Promise)
    return promise // Ensure it resolves
  })
})
