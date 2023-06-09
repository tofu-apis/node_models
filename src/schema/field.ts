import { NonEmptyArray } from '@tofu-apis/common-types';
import { Documentable } from './documentable';
import {
  ArrayRestriction,
  FloatRestriction,
  IntegerRestriction,
  StringRestriction,
} from './restriction';

export enum SchemaValueType {
  Boolean = 'Boolean',
  String = 'String',
  Float = 'Float',
  Integer = 'Integer',
  Array = 'Array',
  FieldSet = 'FieldSet',
  Optional = 'Optional',
}

export interface BaseSchema {
  readonly schemaValueType: SchemaValueType;
}

// Primitives
export class BooleanSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Boolean;
}

export class StringSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.String;
  readonly restrictions: NonEmptyArray<StringRestriction>;

  constructor(restrictions: NonEmptyArray<StringRestriction>) {
    this.restrictions = restrictions;
  }
}

export class FloatSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Float;
  readonly restrictions: NonEmptyArray<FloatRestriction>;

  constructor(restrictions: NonEmptyArray<FloatRestriction>) {
    this.restrictions = restrictions;
  }
}

export class IntegerSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Integer;
  readonly restrictions: NonEmptyArray<IntegerRestriction>;

  constructor(restrictions: NonEmptyArray<IntegerRestriction>) {
    this.restrictions = restrictions;
  }
}

// Array
export type ArrayValueSchema = Exclude<BaseSchema, OptionalSchema>;

export class ArraySchema<T extends ArrayValueSchema>
  extends Documentable
  implements BaseSchema
{
  readonly schemaValueType = SchemaValueType.Array;

  readonly value: T;
  readonly restrictions: NonEmptyArray<ArrayRestriction>;

  constructor(
    docString: string,
    value: T,
    restrictions: NonEmptyArray<ArrayRestriction>,
  ) {
    super(docString);
    this.value = value;
    this.restrictions = restrictions;
  }
}

// FieldSet
export type FieldSetFields = {
  [key: string]: Field<BaseSchema>;
};

export class FieldSetSchema<F extends FieldSetFields>
  extends Documentable
  implements BaseSchema
{
  readonly schemaValueType = SchemaValueType.FieldSet;
  readonly fields: F;

  constructor(docString: string, fields: F) {
    super(docString);
    this.fields = fields;
  }
}

export class Field<T extends BaseSchema> extends Documentable {
  readonly value: T;

  constructor(docString: string, value: T) {
    super(docString);
    this.value = value;
  }
}

// Optional
export type RequiredSchema = Exclude<BaseSchema, OptionalSchema>;

export class OptionalSchema extends Documentable implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Optional;
  readonly value: RequiredSchema;

  constructor(docString: string, value: RequiredSchema) {
    super(docString);
    this.value = value;
  }
}
