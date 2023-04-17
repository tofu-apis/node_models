import _ from 'lodash';
import { SchemaDefinition, SchemaTypeOptions } from 'mongoose';
import {
  AnyObjectSchema,
  ArraySchema,
  BaseSchema,
  BooleanSchema,
  NumberSchema,
  ObjectSchema,
  StringSchema,
} from 'yup';
import { requireDefined } from '@tofu-apis/common-types';

function isSchemaFieldRequired<SchemaType extends BaseSchema>(
  schemaType: SchemaType,
): boolean {
  const {
    spec: { presence, nullable },
  }: {
    spec: { presence: 'defined' | 'optional' | 'required'; nullable: boolean };
  } = schemaType;

  if (presence === 'optional') {
    throw new Error(
      `Optional is currently not allowed/supported in schema definition translation.`,
    );
  }

  return !nullable;
}

function translateNestedSchemaToSchemaOptions<SchemaType extends BaseSchema>(
  modelSchema: SchemaType,
): SchemaTypeOptions<unknown> {
  if (modelSchema instanceof BooleanSchema) {
    const booleanSchema = modelSchema as BooleanSchema;

    return {
      type: Boolean,
      required: isSchemaFieldRequired(booleanSchema),
    };
  } else if (modelSchema instanceof StringSchema) {
    const stringSchema = modelSchema as StringSchema;

    return {
      type: String,
      required: isSchemaFieldRequired(stringSchema),
    };
  } else if (modelSchema instanceof NumberSchema) {
    const numberSchema = modelSchema as NumberSchema;

    return {
      type: Number,
      required: isSchemaFieldRequired(numberSchema),
    };
  } else if (modelSchema instanceof ObjectSchema) {
    const objectSchema = modelSchema as AnyObjectSchema;

    return {
      type: translateObjectSchemaToSchemaDefinition(objectSchema),
      required: isSchemaFieldRequired(objectSchema),
    };
  } else if (modelSchema instanceof ArraySchema) {
    const arraySchema = modelSchema as ArraySchema<BaseSchema>;

    requireDefined(arraySchema.innerType);

    const innerSchemaType = arraySchema.innerType as BaseSchema;

    return {
      type: [translateNestedSchemaToSchemaOptions(innerSchemaType)],
      required: isSchemaFieldRequired(arraySchema),
    };
  } else {
    throw new Error(
      `Field schema type ${typeof modelSchema} is currently not yet supporting in schema json translation.`,
    );
  }
}

export function translateObjectSchemaToSchemaDefinition(
  modelSchema: AnyObjectSchema,
): SchemaDefinition {
  const schemaJson: SchemaDefinition = {};

  _.toPairs(modelSchema.fields).forEach((fieldSchemaPair) => {
    const [fieldName, fieldSchema] = fieldSchemaPair;

    const modelSchema = fieldSchema as BaseSchema;

    schemaJson[fieldName] = translateNestedSchemaToSchemaOptions(modelSchema);
  });

  return schemaJson;
}
