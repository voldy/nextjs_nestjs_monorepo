import { logger } from './logger'

describe('logger', () => {
  let consoleSpy: {
    log: jest.SpyInstance
    warn: jest.SpyInstance
    error: jest.SpyInstance
  }

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      log: jest.spyOn(globalThis.console, 'log').mockImplementation(() => {}),
      warn: jest.spyOn(globalThis.console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(globalThis.console, 'error').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    // Restore console methods
    consoleSpy.log.mockRestore()
    consoleSpy.warn.mockRestore()
    consoleSpy.error.mockRestore()
  })

  it('should log messages with LOG prefix', () => {
    logger.log('test message', 123)
    expect(consoleSpy.log).toHaveBeenCalledWith('[LOG]', 'test message', 123)
  })

  it('should warn messages with WARN prefix', () => {
    logger.warn('warning message', { data: true })
    expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN]', 'warning message', { data: true })
  })

  it('should error messages with ERROR prefix', () => {
    logger.error('error message', new Error('test'))
    expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR]', 'error message', new Error('test'))
  })
})
