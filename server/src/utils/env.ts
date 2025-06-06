import { z } from 'zod'
import { toNumber } from './zod'

const validators = {
    NODE_ENV: z.enum(['production', 'development']),
    CLIENT_ENDPOINT: z.string(),
    API_ENDPOINT: z.string(),
    MONGO_URI: z.string(),
    SPOTIFY_PUBLIC: z.string(),
    SPOTIFY_SECRET: z.string(),
    JWT_SECRET: z.string(),

    PORT: z.preprocess(toNumber, z.number().optional()),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
    MAX_IMPORT_CACHE_SIZE: z.preprocess(toNumber, z.number().optional()),
} as const

const validatedEnv: Record<string, any> = {}

type EnvVariable = keyof typeof validators

export function getEnv<E extends EnvVariable>(
    variable: E,
    defaultValue?: NonNullable<z.infer<(typeof validators)[E]>>
): NonNullable<z.infer<(typeof validators)[E]>> {
    return validatedEnv[variable] ?? defaultValue
}

export const parseEnv = () => {
    let hasErrors = false
    Object.entries(validators).forEach(([key, value]) => {
        const v = process.env[key]
        try {
            validatedEnv[key] = value.parse(v)
        } catch (e) {
            console.error(`[error] ${key} env variable is faulty`)
            if (e instanceof z.ZodError) {
                e.issues.forEach((issue) => {
                    console.error(`[error] -> ${issue.message}`)
                })
            }
            hasErrors = true
        }
    })

    if (hasErrors) {
        process.exit(1)
    }
}
