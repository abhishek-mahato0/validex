import { Schema, type SafeParseResult, type Errors, type Path } from "./baseSchema.js";

export type TUnion = Schema<any>[]
export class UnionSchema<T extends TUnion> extends Schema<any> {
    constructor(private schemas: T) {
        super();
    }

    protected clone(): UnionSchema<T> {
        return new UnionSchema(this.schemas);
    }

    parse(value: unknown, path: Path | undefined): SafeParseResult<any> {
        const errors: Errors[] = [];

        for (const schema of this.schemas) {
            const res = schema.parse(value, path);
            if (res.success) return res;
            errors.push(...res.errors);
        }

        return { success: false, value, errors };
    }
}
