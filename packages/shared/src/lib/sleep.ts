export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    const timeoutFn =
      globalThis.setTimeout ||
      ((fn: () => void, delay: number) => {
        // Fallback for environments without setTimeout
        const start = Date.now()
        while (Date.now() - start < delay) {
          // Busy wait (not ideal, but works as fallback)
        }
        fn()
      })
    timeoutFn(resolve, ms)
  })
}
