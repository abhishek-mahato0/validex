export const ERRORS = {
    string(value: unknown) {
        return `Expected ${value} to be a string`
    },
    number(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be a number`
    },
    object(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be an object`
    },
    array(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be an array`
    },
    boolean(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be a boolean value`
    },
    symbol(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be a symbol value`
    },
    min(value: unknown, length: number) {
        return `Expected ${value} to be at least ${length} characters long`
    },
    max(value: unknown, length: number) {
        return `Expected ${value} to be at most ${length} characters long`
    },
    length(value: unknown, length: number) {
        return `Expected ${value} to be ${length} characters long`
    },
    regex(value: unknown) {
        return `Expected ${JSON.stringify(value)} to match the regex pattern`
    },
    email(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be a valid email address`
    },
    url(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be a valid URL`
    },
    startsWith(value: unknown, prefix: string) {
        return `Expected ${JSON.stringify(value)} to start with ${prefix}`
    },
    endsWith(value: unknown, suffix: string) {
        return `Expected ${JSON.stringify(value)} to end with ${suffix}`
    },
    nonEmpty(value: unknown) {
        return `Expected ${JSON.stringify(value)} to be non-empty`
    },
    optional(value: unknown) {
        return `${JSON.stringify(value)} is optional`
    },
    int(value: unknown) {
        return `Expected ${value} to be an integer`
    },
    positive(value: unknown) {
        return `Expected ${value} to be positive`
    },
    negative(value: unknown) {
        return `Expected ${value} to be negative`
    },
    nonPositive(value: unknown) {
        return `Expected ${value} to be non-positive`
    },
    nonNegative(value: unknown) {
        return `Expected ${value} to be non-negative`
    },
    multipleOf(value: unknown, divisor: number) {
        return `Expected ${value} to be a multiple of ${divisor}`
    },
    finite(value: unknown) {
        return `Expected ${value} to be finite`
    },
    safe(value: unknown) {
        return `Expected ${value} to be a safe integer`
    }
}

export type ErrorType = keyof typeof ERRORS