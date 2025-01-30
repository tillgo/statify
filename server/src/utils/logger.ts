import { getEnv } from './env'

export const LogLevelToNumber = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
} as const

export const getLogLevel = () => getEnv('LOG_LEVEL', 'info')

export const logger = {
    debug: (...args: any) =>
        LogLevelToNumber[getLogLevel()] <= LogLevelToNumber['debug'] &&
        console.log('[debug] ', ...args),
    info: (...args: any) =>
        LogLevelToNumber[getLogLevel()] <= LogLevelToNumber['info'] &&
        console.log('[info] ', ...args),
    warn: (...args: any) =>
        LogLevelToNumber[getLogLevel()] <= LogLevelToNumber['warn'] &&
        console.warn('[warn] ', ...args),
    error: (...args: any) =>
        LogLevelToNumber[getLogLevel()] <= LogLevelToNumber['error'] &&
        console.error('[error] ', ...args),
}
