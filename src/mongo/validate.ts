import { Asserts, BaseSchema } from 'yup';

export function validate<
  SchemaType extends BaseSchema,
  DataType extends Asserts<SchemaType>,
>(schema: SchemaType, data: unknown): DataType {
  return schema.validateSync(data);
}
