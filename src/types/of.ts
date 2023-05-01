import { Int } from '@tofu-apis/common-types';
import {
  ArrayValueSchema,
  BaseSchema,
  Field,
  MemberizableUnionSchema,
  OptionalValueSchema,
  SchemaValueType,
} from '../schema';

type SchemaTypeMap = {
  [SchemaValueType.Boolean]: boolean;
  [SchemaValueType.String]: string;
  [SchemaValueType.Float]: number;
  [SchemaValueType.Integer]: Int;
};

export type TypeOf<T extends BaseSchema> = T extends {
  schemaValueType: infer U;
}
  ? U extends keyof SchemaTypeMap
    ? // Handle array types
      U extends SchemaValueType.Array
      ? T extends { value: infer V }
        ? V extends ArrayValueSchema
          ? Array<TypeOf<V>>
          : never
        : never
      : // Handle field set types
      U extends SchemaValueType.FieldSet
      ? T extends { fields: infer F }
        ? F extends Record<string, Field>
          ? {
              [K in keyof F]: F[K] extends Field
                ? TypeOf<F[K]['value']>
                : never;
            }
          : never
        : never
      : // Handle union types
      U extends SchemaValueType.Union
      ? T extends { members: infer M }
        ? // Handle named union types
          M extends Record<string, MemberizableUnionSchema>
          ? {
              [K in keyof M]: TypeOf<M[K]>;
            }[keyof M]
          : // Check if isNamed is false
          T extends { isNamed: false }
          ? // Handle optional types
            T extends OptionalValueSchema
            ? TypeOf<T['value']> | undefined
            : never
          : never
        : never
      : SchemaTypeMap[U]
    : never
  : never;
