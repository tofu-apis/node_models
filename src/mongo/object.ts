import _ from 'lodash';
import { Document } from 'mongoose';
import { BaseSchema } from '../schema/field';
import { TypeOf } from '../types';
import { requireDefined } from '@tofu-apis/common-types';

export type StorageInterface<SchemaType extends BaseSchema> = SchemaType & {
  internalId: string;
};
export type StorageDocument<SchemaType extends BaseSchema> = Document &
  TypeOf<SchemaType>;

export function resolveMongoDocumentToStorageInterface<
  SchemaType extends BaseSchema,
>(mongoDBDocument: StorageDocument<SchemaType>): StorageInterface<SchemaType> {
  const collectionName = mongoDBDocument.collection.collectionName;

  return _.merge({}, mongoDBDocument, {
    internalId: requireDefined(
      mongoDBDocument._id,
      `_id field should always exist for any MongoDB document for collection [${collectionName}]`,
    ).toString(),
  });
}
