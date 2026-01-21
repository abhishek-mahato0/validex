import { ERRORS } from "../errors/index.js";
import { commonFunctions as CF } from "../common/index.js";
import { Schema, type Errors, type Path, type Rule, type SafeParseResult } from "./baseSchema.js";

export class NumberSchema extends Schema<number> {
    constructor(rules: Rule<number>[] = []) {
        super(rules)
    }
    protected clone(rule: Rule<number>) {
        return new NumberSchema([...this.rules, rule])
    }

    int() {
        return this.clone({
            check: (v) => CF.isInteger(v),
            message: (v) => ERRORS.int(v),
        })
    }

    positive() {
        return this.clone({
            check: (v) => CF.isPositive(v),
            message: (v) => ERRORS.positive(v),
        })
    }

    negative() {
        return this.clone({
            check: (v) => CF.isNegative(v),
            message: (v) => ERRORS.negative(v),
        })
    }

    nonpositive() {
        return this.clone({
            check: (v) => CF.isNonPositive(v),
            message: (v) => ERRORS.nonPositive(v),
        })
    }

    nonnegative() {
        return this.clone({
            check: (v) => CF.isNonNegative(v),
            message: (v) => ERRORS.nonNegative(v),
        })
    }

    multipleOf(multiple: number) {
        return this.clone({
            check: (v) => CF.isMultipleOf(v, multiple),
            message: (v) => ERRORS.multipleOf(v, multiple),
        })
    }

    finite() {
        return this.clone({
            check: (v) => CF.isFinite(v),
            message: (v) => ERRORS.finite(v),
        })
    }

    safe() {
        return this.clone({
            check: (v) => CF.isSafeInteger(v),
            message: (v) => ERRORS.safe(v),
        })
    }

    min(value: number) {
        return this.clone({
            check: (v) => v >= value,
            message: (v) => ERRORS.min(v, value),
        })
    }
    max(value: number) {
        return this.clone({
            check: (v) => v <= value,
            message: (v) => ERRORS.max(v, value),
        })
    }
    parse(value: unknown, path: Path): SafeParseResult<number> {
        if (!CF.isNumber(value)) {
            return {
                success: false,
                value: value as number,
                errors: [{
                    path: path ?? value,
                    message: ERRORS.number(value)
                }]
            }
        }
        const result = this.run(value, path)
        return {
            success: result.length === 0,
            value: value as number,
            errors: result
        }
    }
}