import { Schema as MongooseSchema } from 'mongoose';
import { checkArgument } from '@tofu-apis/common-types';
import { translateFieldSetSchemaToSchemaDefinition } from './definition';
import {
  FieldSetFields,
  FieldSetSchema,
  StringSchema,
  ValueSchema,
} from '../schema';

const INTERNAL_ID_FIELD_NAME = 'internalId';

export function createMongooseSchema(
  modelSchema: FieldSetSchema<FieldSetFields>,
): MongooseSchema {
  validateStorageSchema(modelSchema);

  return new MongooseSchema(
    translateFieldSetSchemaToSchemaDefinition(modelSchema),
  );
}

function validateStorageSchema(
  modelSchema: FieldSetSchema<FieldSetFields>,
): void {
  const fieldSchemas = modelSchema.fields;

  checkArgument(
    INTERNAL_ID_FIELD_NAME in fieldSchemas,
    `${INTERNAL_ID_FIELD_NAME} field must exist in storage schema to translate to MongoDB schema.`,
  );

  const internalIdSchema: ValueSchema =
    fieldSchemas[INTERNAL_ID_FIELD_NAME].value;

  checkArgument(
    internalIdSchema instanceof StringSchema,
    `${INTERNAL_ID_FIELD_NAME} field schema in storage schema must be a string schema for MongoDB schema translation.`,
  );
}
