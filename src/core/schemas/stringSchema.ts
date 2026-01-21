import { ERRORS } from "../errors/index.js"
import { commonFunctions as CF } from "../common/index.js"
import { Schema, type Errors, type Path, type Rule, type SafeParseResult } from "./baseSchema.js"

export class StringSchema extends Schema<string> {
    constructor(rules: Rule<string>[] = []) {
        super(rules)
    }

    protected clone(rule: Rule<string>) {
        return new StringSchema([...this.rules, rule])
    }

    length(length: number) {
        return this.clone({
            check: (v) => CF.length(v, length),
            message: (v) => ERRORS.length(v, length),
        })
    }

    min(length: number) {
        return this.clone({
            check: (v) => CF.min(v, length),
            message: (v) => ERRORS.min(v, length),
        })
    }

    max(length: number) {
        return this.clone({
            check: (v) => CF.max(v, length),
            message: (v) => ERRORS.max(v, length),
        })
    }

    email(regex?: RegExp) {
        return this.clone({
            check: (v) => CF.isEmail(v, regex),
            message: (v) => ERRORS.email(v),
        })
    }

    url(regex?: RegExp) {
        return this.clone({
            check: (v) => CF.isUrl(v, regex),
            message: (v) => ERRORS.url(v),
        })
    }

    regex(regex: RegExp) {
        return this.clone({
            check: (v) => CF.matchRegex(v, regex),
            message: (v) => ERRORS.regex(v),
        })
    }

    startsWith(prefix: string) {
        return this.clone({
            check: (v) => CF.startsWith(v, prefix),
            message: (v) => ERRORS.startsWith(v, prefix),
        })
    }

    endsWith(suffix: string) {
        return this.clone({
            check: (v) => CF.endsWith(v, suffix),
            message: (v) => ERRORS.endsWith(v, suffix),
        })
    }

    nonempty() {
        return this.clone({
            check: (v) => CF.nonEmpty(v),
            message: (v) => ERRORS.nonEmpty(v),
        })
    }

    parse(value: unknown, path: Path): SafeParseResult<string> {
        if (!CF.isString(value)) {
            return {
                success: false,
                value: value as string,
                errors: [{
                    path: path || value as string,
                    message: ERRORS.string(value)
                }]
            }
        }
        const errors = this.run(value, path)
        return {
            success: errors.length === 0,
            value: value as string,
            errors
        }
    }
}
