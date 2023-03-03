import { Field } from "../src";

export function getSchema(field: Field): string {
  if (field.fieldType === "Boolean") {
    return "z.boolean()";
  } else if (field.fieldType === "Text") {
    // make sure that there isn't any $, !, @, or, ? in the string
    return "z.string().refine((v) => !/[$!@?]/.test(v), { message: '❌ Cannot contain $, !, @, or ?' })";
  } else if (field.fieldType === "Numeric") {
    let schema = "z.number()";
    if (field.isInteger) {
      schema += ".int()";
    }
    if (field.min !== undefined) {
      schema += `.gte(${field.min})`;
    }
    if (field.max !== undefined) {
      schema += `.lte(${field.max})`;
    }
    return schema;
  } else if (field.fieldType === "Dropdown") {
    return `z.enum([${field.options.map((o) => `"${o}"`).join(", ")}])`;
  } else if (field.fieldType === "Grouping") {
    return `z.array(z.object({
      ${field.fields.map((f) => `${f.name}: ${getSchema(f.field)}`).join(",\n")}
    }))`;
  } else {
    throw new Error(`❌ Unknown field type ${field}`);
  }
}
