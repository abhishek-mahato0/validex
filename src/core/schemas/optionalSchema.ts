import { Schema, type Path, type SafeParseResult } from "./baseSchema.js";

export class OptionalSchema<T> extends Schema<T | undefined> {
    constructor(private readonly inner: Schema<T>) {
        super()
    }
    parse(value: unknown, path: Path): SafeParseResult<T | undefined> {
        if (value === undefined || value === null) {
            return {
                success: true,
                value: undefined,
                errors: []
            }
        }
        return this.inner.parse(value, path)
    }

}