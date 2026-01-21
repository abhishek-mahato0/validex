import type { RefinementCtx } from "./SuperRefine.js"

export type Path = (string | number)[]

export type Rule<T> = {
    check: (v: T) => boolean
    message: (v: T) => string
}
export type Errors = {
    path: Path
    message: string
}
export type SafeParseResult<T> =
    | { success: boolean; value: T, errors: Errors[] }

export type Refinement<T> = {
    check: (value: T) => boolean
    message: string | ((value: T) => string)
    path?: Path
}

export abstract class Schema<T> {
    constructor(protected rules: Rule<T>[] = []) { }
    protected refinements: ((value: T, ctx: RefinementCtx) => void)[] = []

    protected clone(rule: Rule<T>) {
        return new (this.constructor as any)([...this.rules, rule])
    }

    protected run(value: T, path: Path): Errors[] {
        const errors: Errors[] = []
        for (const { check, message } of this.rules) {
            if (!check(value)) {
                errors.push({
                    path: path,
                    message: message(value)
                })
            }
        }
        return errors;
    }

    abstract parse(value: unknown, path?: Path): SafeParseResult<T>

    optional(): Schema<T | undefined> {
        return new OptionalSchema(this)
    }

    default(value: T): Schema<T> {
        return new DefaultSchema(this, value)
    }

    refine(
        check: (value: T) => boolean,
        options: {
            message: string | ((value: T) => string)
            path?: Path
        }
    ): Schema<T> {
        return new RefinementSchema(this, {
            check,
            message: options.message,
            path: options.path && typeof options.path === "object" ? [...options.path] : [],
        })
    }

    superRefine(refinements: (value: T, ctx: RefinementCtx) => void) {
        this.refinements.push(refinements)
        return this;
    }

    transform(
        transform: (value: T) => T,
    ): Schema<T> {
        return new TransformSchema(this, transform)
    }

    safeParse(value: unknown): SafeParseResult<T> {
        return this.parse(value)
    }
}

class OptionalSchema<T> extends Schema<T | undefined> {
    constructor(private readonly inner: Schema<T>) {
        super()
    }

    parse(
        value: unknown,
        path: Path
    ): SafeParseResult<T | undefined> {
        if (value === undefined || value === null) {
            return {
                success: true,
                value: undefined,
                errors: [],
            }
        }

        return this.inner.parse(value, path)
    }
}

class DefaultSchema<T> extends Schema<T> {
    constructor(private readonly inner: Schema<T>, private readonly defaultValue: T) {
        super()
    }
    parse(
        value: unknown,
        path: Path
    ): SafeParseResult<T> {
        if (value === undefined || value === null) {
            return {
                success: true,
                value: this.defaultValue,
                errors: [],
            }
        }
        return this.inner.parse(value, path)
    }
}

class RefinementSchema<T> extends Schema<T> {
    constructor(
        private readonly inner: Schema<T>,
        private readonly refinement: Refinement<T>
    ) {
        super()
    }

    parse(
        value: unknown,
        path: Path
    ): SafeParseResult<T> {
        const result = this.inner.parse(value, path)

        if (!result.success) return result
        const ok = this.refinement.check(result.value)
        const errors = [...result.errors]
        if (!ok) {
            errors.push({
                path: this.refinement.path && typeof this.refinement.path === "object" ? [...path, ...this.refinement.path] : path,
                message:
                    typeof this.refinement.message === "function"
                        ? this.refinement.message(result.value)
                        : this.refinement.message,
            })
        }

        return {
            success: errors.length === 0,
            value: result.value,
            errors,
        }
    }
}

class TransformSchema<T> extends Schema<T> {
    constructor(
        private inner: Schema<T>,
        private transformer: (value: T) => T
    ) {
        super()
    }

    parse(value: unknown, path: Path): SafeParseResult<T> {
        const result = this.inner.parse(value, path)

        if (!result.success) return result
        const tValue = this.transformer(result.value)
        try {
            return {
                success: true,
                value: tValue,
                errors: [],
            }
        } catch (e) {
            return {
                success: false,
                value: result.value,
                errors: [{
                    path,
                    message: e instanceof Error ? e.message : "Transform failed",
                }],
            }
        }
    }
}
