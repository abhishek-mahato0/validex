export const commonFunctions = {
    isString(value: unknown): value is string {
        return typeof value === "string"
    },
    isNumber(value: unknown): value is number {
        return typeof value === "number"
    },
    isArray(value: unknown): value is Array<any> {
        return Array.isArray(value)
    },
    isObject(value: unknown): value is object {
        return typeof value === "object" && value !== null
    },
    isBoolean(value: unknown): value is boolean {
        return typeof value === "boolean"
    },
    isSymbol(value: unknown): value is symbol {
        return typeof value === "symbol"
    },
    startsWith(value: string, prefix: string = "") {
        return value.startsWith(prefix)
    },
    endsWith(value: string, suffix: string = "") {
        return value.endsWith(suffix)
    },
    uppercase(value: string) {
        return value.toUpperCase()
    },
    lowercase(value: string) {
        return value.toLowerCase()
    },
    trim(value: string) {
        return value.trim()
    },
    length(value: string, len: number) {
        return value.length === len
    },
    min(value: string, len: number) {
        return value.length >= len
    },
    max(value: string, len: number) {
        return value.length <= len
    },
    matchRegex(value: string, regex: RegExp) {
        return regex.test(value)
    },
    isEmail(value: string, customRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/) {
        const emailRegex = customRegex || /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return this.matchRegex(value, emailRegex)
    },
    isUrl(value: string, customRegex: RegExp = /^(https?:\/\/)?([\w.-]+)\.[a-z]{2,}(:[0-9]+)?(\/[^\s]*)?$/) {
        const urlRegex = customRegex || /^(https?:\/\/)?([\w.-]+)\.[a-z]{2,}(:[0-9]+)?(\/[^\s]*)?$/
        return this.matchRegex(value, urlRegex)
    },
    nonEmpty(value: string) {
        return value.length > 0
    },
    // Number validations
    isInteger(value: number) {
        return Number.isInteger(value)
    },
    isPositive(value: number) {
        return value > 0
    },
    isNegative(value: number) {
        return value < 0
    },
    isNonPositive(value: number) {
        return value <= 0
    },
    isNonNegative(value: number) {
        return value >= 0
    },
    isMultipleOf(value: number, multiple: number) {
        return value % multiple === 0
    },
    isFinite(value: number) {
        return Number.isFinite(value)
    },
    isSafeInteger(value: number) {
        return Number.isSafeInteger(value)
    },
    // Array validations
    minLen(value: any[], len: number) {
        return value.length >= len
    },
    maxLen(value: any[], len: number) {
        return value.length <= len
    }
}