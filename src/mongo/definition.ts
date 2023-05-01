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
  OptionalValueSchema,
  NamedUnionSchema,
  MemberizableUnionSchema,
} from '../schema/field';

function translateNestedSchemaToSchemaOptions<SchemaType extends BaseSchema>(
  modelSchema: SchemaType,
): SchemaTypeOptions<unknown> {
  if (modelSchema instanceof OptionalValueSchema) {
    return {
      type: translateNestedSchemaToSchemaOptions(modelSchema.getValue()),
      required: false,
    };
  } else if (modelSchema instanceof NamedUnionSchema) {
    return {
      type: translateNamedUnionSchemaToSchemaDefinition(modelSchema),
      required: true,
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
    const arraySchema = modelSchema as ArraySchema;

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
  modelSchema: FieldSetSchema,
): SchemaDefinition {
  const schemaJson: SchemaDefinition = {};

  _.toPairs(modelSchema.fields).forEach((fieldSchemaPair) => {
    const [fieldName, fieldSchema]: [string, Field] = fieldSchemaPair;

    const valueSchema: ValueSchema = fieldSchema.value;

    schemaJson[fieldName] = translateNestedSchemaToSchemaOptions(valueSchema);
  });

  return schemaJson;
}

export function translateNamedUnionSchemaToSchemaDefinition(
  modelSchema: NamedUnionSchema,
): SchemaDefinition {
  const schemaJson: SchemaDefinition = {};

  _.toPairs(modelSchema.members).forEach((memberSchemaPair) => {
    const [memberName, memberUnionSchema]: [string, MemberizableUnionSchema] =
      memberSchemaPair;

    schemaJson[memberName] = {
      type: translateNestedSchemaToSchemaOptions(memberUnionSchema),
      required: false,
    };
  });

  return schemaJson;
}
