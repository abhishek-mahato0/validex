# validex

A lightweight, type-safe schema validation library for TypeScript, inspired by Zod.

## Installation

```bash
npm install validex
```

## Usage

### Basic Usage

```typescript
import v from 'validex';

const schema = v.string().min(3).max(10);
const result = schema.safeParse("hello");

if (result.success) {
  console.log("Valid:", result.value);
} else {
  console.error("Errors:", result.errors);
}
```

### Real-World Form Validation

Here's a comprehensive example simulating a user registration form that uses most of the available validation features:

```typescript
import v from 'validex';

const registrationSchema = v.object({
  // String validations
  username: v.string().min(3).max(20).startsWith('user_'),
  email: v.string().email(),
  website: v.string().url(),
  bio: v.string().max(100).nonempty(),

  // Number validations
  age: v.number().int().min(18).max(99),
  experienceYears: v.number().nonnegative().safe(),

  // Union types (e.g., role can be one of specific strings or an ID)
  role: v.union([
    v.string().regex(/^(admin|editor|viewer)$/),
    v.number().int().positive() // or a numeric role ID
  ]),

  // Array validations
  skills: v.array(v.string().min(2)).min(1).max(10),

  // Nested Objects
  contact: v.object({
    phone: v.string().length(10).regex(/^\d+$/),
    address: v.object({
      street: v.string(),
      city: v.string(),
      zipCode: v.string().regex(/^\d{5}(-\d{4})?$/)
    })
  })
});

const formData = {
  username: "user_johndoe",
  email: "john@example.com",
  website: "https://johndoe.dev",
  bio: "Full-stack developer loving TypeScript",
  age: 28,
  experienceYears: 5,
  role: "admin",
  skills: ["TypeScript", "React", "Node.js"],
  contact: {
    phone: "1234567890",
    address: {
      street: "123 Tech Lane",
      city: "Innovation City",
      zipCode: "94043"
    }
  }
};

const result = registrationSchema.safeParse(formData);

if (result.success) {
  console.log("Validation Successful:", result.value);
} else {
  // Returns an array of errors with paths and messages
  console.error("Validation Failed:", result.errors);
  /*
  Example Error Output:
  [
    { path: ['age'], message: 'Number must be greater than or equal to 18' },
    { path: ['contact', 'phone'], message: 'String must be exactly 10 characters' }
  ]
  */
}
```

## API Reference

### Primitives

#### String (`v.string()`)
- `.min(length: number)`: Minimum length
- `.max(length: number)`: Maximum length
- `.length(length: number)`: Exact length
- `.email(regex?: RegExp)`: Validates email format
- `.url(regex?: RegExp)`: Validates URL format
- `.regex(regex: RegExp)`: Matches regular expression
- `.startsWith(prefix: string)`: Starts with substring
- `.endsWith(suffix: string)`: Ends with substring
- `.nonempty()`: Rejects empty strings

#### Number (`v.number()`)
- `.min(value: number)`: Minimum value (inclusive)
- `.max(value: number)`: Maximum value (inclusive)
- `.int()`: Must be an integer
- `.positive()`: Must be > 0
- `.negative()`: Must be < 0
- `.nonpositive()`: Must be <= 0
- `.nonnegative()`: Must be >= 0
- `.multipleOf(n: number)`: Must be a multiple of n
- `.finite()`: Must be finite
- `.safe()`: Must be a safe integer

### Complex Types

#### Array (`v.array(schema)`)
- `.min(length: number)`: Minimum number of items
- `.max(length: number)`: Maximum number of items
- `.nonempty()`: Array must have at least one item

#### Object (`v.object(shape)`)
Creates a schema for an object where each key matches the corresponding schema in `shape`.

#### Union (`v.union([schema1, schema2, ...])`)
Validates if the input matches at least one of the provided schemas.

```typescript
const idSchema = v.union([
  v.string(),
  v.number()
]);
```

## Error Handling

Validation results return a `SafeParseResult` object:

```typescript
type SafeParseResult<T> = 
  | { success: true; value: T; errors: [] }
  | { success: false; value: unknown; errors: { path: (string | number)[]; message: string }[] };
```

If `success` is `false`, the `errors` array contains details about what validation failed and where.
