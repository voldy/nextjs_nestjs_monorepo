export function isBrowser(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as any).window !== 'undefined' &&
    typeof (globalThis as any).document !== 'undefined'
  )
}
