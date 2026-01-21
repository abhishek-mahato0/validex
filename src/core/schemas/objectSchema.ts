import { ERRORS } from "../errors/index.js"
import { commonFunctions as CF } from "../common/index.js"
import { Schema, type Errors, type Path, type SafeParseResult } from "./baseSchema.js"
import { RefinementCtx } from "./SuperRefine.js"

export type Shape = Record<string, Schema<any>>

export class ObjectSchema<T extends Shape> extends Schema<{
    [K in keyof T]: any
}> {
    constructor(private shape: T) {
        super()
    }

    protected clone(): ObjectSchema<T> {
        return new ObjectSchema(this.shape)
    }

    parse(
        value: unknown,
        path: Path
    ): SafeParseResult<any> {
        if (!CF.isObject(value)) {
            return {
                success: false,
                value: value,
                errors: [{ path: path ?? value, message: ERRORS.object(value) }],
            }
        }

        const result: any = {}
        const errors: Errors[] = []

        for (const key in this.shape) {
            const schema = this.shape[key]
            if (!schema) {
                throw new Error(`Schema for key ${key} not found`)
            }
            const child = schema.parse(
                (value as any)[key],
                path && key ? [...path, key] : path || [key]
            )
            if (!child.success) {
                errors.push(...child.errors)
            } else {
                result[key] = child.value
            }
        }

        if (errors.length > 0) {
            return { success: false, value, errors }
        }

        const refinementCtx = new RefinementCtx();
        for (const refinement of this.refinements) {
            refinement(result, refinementCtx)
        }
        if (refinementCtx.errors.length > 0) {
            return { success: false, value, errors: refinementCtx.errors }
        }

        return { success: true, value: result, errors: [] }
    }
}