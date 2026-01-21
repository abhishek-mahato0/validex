import { ERRORS } from "../errors/index.js";
import { commonFunctions as CF } from "../common/index.js";
import { Schema, type Path, type Rule, type SafeParseResult } from "./baseSchema.js";

import { RefinementCtx } from "./SuperRefine.js";

export type TArray = Schema<any>;
type Parsed<T extends TArray> = T extends Schema<infer U> ? U : never;

export class ArraySchema<T extends TArray> extends Schema<Parsed<T>[]> {
    constructor(private Shape: T, rules: Rule<Parsed<T>[]>[] = []) {
        super(rules);
    }

    protected clone(rule: Rule<Parsed<T>[]>): ArraySchema<T> {
        return new ArraySchema(this.Shape, [...this.rules, rule]);
    }

    min(length: number) {
        return this.clone({
            check: (v) => CF.minLen(v, length),
            message: (v) => ERRORS.min(v, length),
        })
    }

    max(length: number) {
        return this.clone({
            check: (v) => CF.maxLen(v, length),
            message: (v) => ERRORS.max(v, length),
        })
    }

    nonempty() {
        return this.clone({
            check: (v) => CF.nonEmpty(v as any), // Common nonEmpty works for string, but we added minLen. CF.nonEmpty is string only? 
            // CF.nonEmpty in common uses value.length > 0.
            // Let's check common again. I didn't change nonEmpty type signature.
            // I added minLen.
            // Actually, I can use minLen(1). Or just v.length > 0.
            message: (v) => ERRORS.nonEmpty(v),
        })
    }

    parse(value: unknown, path: Path | undefined): SafeParseResult<Parsed<T>[]> {
        if (!Array.isArray(value)) {
            return {
                success: false,
                value: value as any,
                errors: [{ path: path ?? [value as string], message: ERRORS.array(value) }]
            };
        }

        const result: Parsed<T>[] = [];
        const errors: { path: Path; message: string }[] = [];

        // Run schema-level rules (min, max, etc.)
        errors.push(...this.run(value as Parsed<T>[], path ?? []));

        value.forEach((item, i) => {
            const childResult = this.Shape.parse(item, path);
            if (!childResult.success) {
                const childErrors = childResult.errors.map((error) => ({
                    path: [i, ...error.path],
                    message: error.message
                }))
                errors.push(...childErrors);
            } else {
                result.push(childResult.value);
            }
        });

        if (errors.length > 0) {
            return { success: false, value, errors };
        }

        const refineCtx = new RefinementCtx();
        for (const refinement of this.refinements) {
            refinement(result, refineCtx);
        }
        if (refineCtx.errors.length > 0) {
            return { success: false, value, errors: refineCtx.errors };
        }

        return { success: true, value, errors: [] };
    }
}
