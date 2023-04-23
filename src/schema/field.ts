import { NonEmptyArray, requireArrayNonEmpty } from '@tofu-apis/common-types';
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
  Undefined = 'Undefined',
  Array = 'Array',
  FieldSet = 'FieldSet',
  Union = 'Union',
}

export interface Schema {
  readonly schemaValueType: SchemaValueType;
}

// Primitives
export class BooleanSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Boolean;
}

export class StringSchema implements Schema {
  readonly schemaValueType = SchemaValueType.String;
  readonly restrictions: NonEmptyArray<StringRestriction>;

  constructor(restrictions: NonEmptyArray<StringRestriction>) {
    this.restrictions = restrictions;
  }
}

export class FloatSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Float;
  readonly restrictions: NonEmptyArray<FloatRestriction>;

  constructor(restrictions: NonEmptyArray<FloatRestriction>) {
    this.restrictions = restrictions;
  }
}

export class IntegerSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Integer;
  readonly restrictions: NonEmptyArray<IntegerRestriction>;

  constructor(restrictions: NonEmptyArray<IntegerRestriction>) {
    this.restrictions = restrictions;
  }
}

// Optional
export class UndefinedSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Undefined;
}

// Array
export class ArraySchema extends Documentable implements Schema {
  readonly schemaValueType = SchemaValueType.Array;

  readonly value: ValueSchema;
  readonly restrictions: NonEmptyArray<ArrayRestriction>;

  constructor(
    docString: string,
    value: ValueSchema,
    restrictions: NonEmptyArray<ArrayRestriction>,
  ) {
    super(docString);
    this.value = value;
    this.restrictions = restrictions;
  }
}

// FieldSet
export class FieldSetSchema extends Documentable implements Schema {
  readonly schemaValueType = SchemaValueType.FieldSet;
  readonly fields: Record<string, Field>;

  constructor(docString: string, fields: Record<string, Field>) {
    super(docString);
    this.fields = fields;
  }
}

export class Field extends Documentable {
  readonly value: ValueSchema;

  constructor(docString: string, value: ValueSchema) {
    super(docString);
    this.value = value;
  }
}

// Union
type MemberizableUnionSchema =
  | Exclude<ValueSchema, UnionSchema>
  | UndefinedSchema;

type UnionSchema = NamedUnionSchema | UnnamedUnionSchema;

export class NamedUnionSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Union;

  readonly members: Record<string, MemberizableUnionSchema>;
  readonly isNamed: boolean;

  constructor(members: Record<string, MemberizableUnionSchema>) {
    this.members = members;
    this.isNamed = true;
  }
}

export class UnnamedUnionSchema implements Schema {
  readonly schemaValueType = SchemaValueType.Union;

  readonly members: NonEmptyArray<MemberizableUnionSchema>;
  readonly isNamed: false;

  constructor(members: NonEmptyArray<MemberizableUnionSchema>) {
    this.members = members;
    this.isNamed = false;
  }
}

// Currently limiting the only unnamed union schema use case for optionality
export class OptionalValueSchema extends UnnamedUnionSchema {
  constructor(valueSchema: Exclude<ValueSchema, UnionSchema>) {
    const members = requireArrayNonEmpty([valueSchema, new UndefinedSchema()]);
    super(members);
  }
}

// Value: can be representative of a value in an array, union, or
// a value for a field in a FieldSet.
export type ValueSchema =
  | ArraySchema
  | BooleanSchema
  | FieldSetSchema
  | FloatSchema
  | IntegerSchema
  | StringSchema
  | UnionSchema;
