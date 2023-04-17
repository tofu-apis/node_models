import _ from 'lodash';
import { Document, LeanDocument } from 'mongoose';
import { BaseSchema, TypeOf } from 'yup';

export function resolveMongoDocumentToStorageObject<
  StorageSchema extends BaseSchema,
  MongoDBInterface extends Document & TypeOf<StorageSchema>,
>(
  mongoDBDocument: LeanDocument<MongoDBInterface>,
): LeanDocument<MongoDBInterface> & { internalId: string } {
  return _.merge({}, mongoDBDocument, {
    internalId: mongoDBDocument._id.toString(),
  });
}
