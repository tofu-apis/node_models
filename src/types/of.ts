import { Int } from '@tofu-apis/common-types';
import {
  ArrayValueSchema,
  BaseSchema,
  Field,
  FieldSetFields,
  RequiredSchema,
  SchemaValueType,
} from '../schema';

type SchemaTypeMap = {
  [SchemaValueType.Boolean]: boolean;
  [SchemaValueType.String]: string;
  [SchemaValueType.Float]: number;
  [SchemaValueType.Integer]: Int;
  [SchemaValueType.Array]: never;
  [SchemaValueType.FieldSet]: never;
  [SchemaValueType.Optional]: never;
};

export type TypeOf<T extends BaseSchema> = T extends {
  schemaValueType: infer U;
}
  ? U extends keyof SchemaTypeMap
    ? // Handle array types
      U extends SchemaValueType.Array
      ? T extends { value: ArrayValueSchema }
        ? Array<TypeOf<T['value']>>
        : never
      : // Handle field set types
      U extends SchemaValueType.FieldSet
      ? T extends { fields: infer F }
        ? F extends FieldSetFields
          ? {
              [K in keyof F]: F[K] extends Field<infer _unused>
                ? TypeOf<F[K]['value']>
                : never;
            }
          : never
        : never
      : // Handle union types
      U extends SchemaValueType.Optional
      ? T extends { value: RequiredSchema }
        ? TypeOf<T['value']> | undefined
        : never
      : SchemaTypeMap[U]
    : never
  : never;
