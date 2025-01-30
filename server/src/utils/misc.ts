export const wait = (ms: number) =>
    new Promise((s) => {
        setTimeout(s, ms)
    })

export const retryPromise = async <T>(
    fn: () => Promise<T>,
    max: number,
    timeSeconds: number
): Promise<T> => {
    if (max <= 0) {
        throw new Error('Cannot retry 0 times')
    }

    let lastError: Error | undefined
    for (let i = 0; i < max; i += 1) {
        const isLastTry = i === max - 1
        try {
            return await fn()
        } catch (e) {
            lastError = e as Error
        }
        if (!isLastTry) {
            await wait(timeSeconds * 1000)
        }
    }
    throw lastError
}

export const minOfArray = <T>(array: T[], fn: (item: T) => number) => {
    if (array.length === 0) {
        return null
    }

    let minIndex = 0
    let min = fn(array[0]!)
    for (let i = 1; i < array.length; i += 1) {
        const value = fn(array[i]!)
        if (value < min) {
            min = value
            minIndex = i
        }
    }
    return { min, minIndex }
}
