import type { Errors } from "./baseSchema.js";

export class RefinementCtx {
    private _issues: Errors[] = [];
    addError(issue: Errors) {
        this._issues.push(issue);
    }
    get errors(): Errors[] {
        return this._issues;
    }
}
