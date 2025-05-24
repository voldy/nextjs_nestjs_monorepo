export const logger = {
  log: (...args: unknown[]) => globalThis.console?.log('[LOG]', ...args),
  warn: (...args: unknown[]) => globalThis.console?.warn('[WARN]', ...args),
  error: (...args: unknown[]) => globalThis.console?.error('[ERROR]', ...args),
}
