import { Schema } from 'mongoose';
import { AnyObjectSchema, BaseSchema, StringSchema } from 'yup';
import { checkArgument } from '@tofu-apis/common-types';
import { translateObjectSchemaToSchemaDefinition } from './definition';

const INTERNAL_ID_FIELD_NAME = 'internalId';

export function createMongooseSchema(modelSchema: AnyObjectSchema): Schema {
  validateStorageSchema(modelSchema);

  return new Schema(translateObjectSchemaToSchemaDefinition(modelSchema));
}

function validateStorageSchema(modelSchema: AnyObjectSchema): void {
  const fieldSchemas = modelSchema.fields;

  checkArgument(
    INTERNAL_ID_FIELD_NAME in fieldSchemas,
    `${INTERNAL_ID_FIELD_NAME} field must exist in storage schema to translate to MongoDB schema.`,
  );

  const internalIdSchema: BaseSchema = fieldSchemas[INTERNAL_ID_FIELD_NAME];

  checkArgument(
    internalIdSchema instanceof StringSchema,
    `${INTERNAL_ID_FIELD_NAME} field schema in storage schema must be a string schema for MongoDB schema translation.`,
  );
}
