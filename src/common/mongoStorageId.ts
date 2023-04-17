import { string } from 'yup';
import { CrudOperation } from '../types/crudOperation';
import { NullableStringType } from '../types/nullableType';

export const MongoDBStorageIDString = string()
  .min(24)
  .max(24)
  .nullable()
  .when('$crudOperation', (crudOperation: CrudOperation, schema) => {
    if (
      crudOperation === CrudOperation.CREATE ||
      crudOperation === CrudOperation.UPDATE ||
      crudOperation === CrudOperation.DELETE
    ) {
      // We intentionally force null since MongoDB will override the ID string
      // with an explicitly generated ObjectId in its place.
      return NullableStringType.default(null);
    } else if (crudOperation === CrudOperation.READ) {
      return schema.required().nullable(false);
    } else {
      throw new Error(
        `Input crudOperation [${crudOperation}] is not yet supported in MongoDBStorageIDString model.`,
      );
    }
  });
