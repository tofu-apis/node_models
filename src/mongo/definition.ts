import _ from 'lodash';
import { SchemaDefinition, SchemaTypeOptions } from 'mongoose';
import {
  ArraySchema,
  BooleanSchema,
  StringSchema,
  FieldSetSchema,
  FloatSchema,
  IntegerSchema,
  BaseSchema,
  ValueSchema,
  Field,
  OptionalSchema,
  FieldSetFields,
  ArrayValueSchema,
} from '../schema/field';

function translateNestedSchemaToSchemaOptions<SchemaType extends BaseSchema>(
  modelSchema: SchemaType,
): SchemaTypeOptions<unknown> {
  if (modelSchema instanceof OptionalSchema) {
    return {
      type: translateNestedSchemaToSchemaOptions(modelSchema.value),
      required: false,
    };
  } else if (modelSchema instanceof BooleanSchema) {
    return {
      type: Boolean,
      required: true,
    };
  } else if (modelSchema instanceof StringSchema) {
    return {
      type: String,
      required: true,
    };
  } else if (modelSchema instanceof FloatSchema) {
    return {
      type: Number,
      required: true,
    };
  } else if (modelSchema instanceof IntegerSchema) {
    return {
      type: Number,
      required: true,
    };
  } else if (modelSchema instanceof FieldSetSchema) {
    return {
      type: translateFieldSetSchemaToSchemaDefinition(modelSchema),
      required: true,
    };
  } else if (modelSchema instanceof ArraySchema) {
    const arraySchema = modelSchema as ArraySchema<ArrayValueSchema>;

    const innerSchemaType = arraySchema.value;

    return {
      type: [translateNestedSchemaToSchemaOptions(innerSchemaType)],
      required: true,
    };
  } else {
    throw new Error(
      `Field schema type ${typeof modelSchema} is currently not yet supporting in schema json translation.`,
    );
  }
}

export function translateFieldSetSchemaToSchemaDefinition(
  modelSchema: FieldSetSchema<FieldSetFields>,
): SchemaDefinition {
  const schemaJson: SchemaDefinition = {};

  for (const [fieldName, fieldSchema] of Object.entries(modelSchema.fields)) {
    const currentFieldSchema: Field<ValueSchema> =
      fieldSchema as Field<ValueSchema>;
    const valueSchema: ValueSchema = currentFieldSchema.value;
    schemaJson[fieldName] = translateNestedSchemaToSchemaOptions(valueSchema);
  }

  return schemaJson;
}
