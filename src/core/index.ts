import { ArraySchema, type TArray } from "./schemas/arraySchema.js";
import { NumberSchema } from "./schemas/numberSchema.js";
import { ObjectSchema, type Shape } from "./schemas/objectSchema.js";
import { StringSchema } from "./schemas/stringSchema.js";
import { UnionSchema, type TUnion } from "./schemas/unionSchema.js";

const validex = {
    string: () => new StringSchema(),
    number: () => new NumberSchema(),
    object: <T extends Shape>(shape: T) => new ObjectSchema(shape),
    array: <T extends TArray>(shape: T) => new ArraySchema(shape),
    union: <T extends TUnion>(schemas: T) => new UnionSchema(schemas),
}

export default validex;