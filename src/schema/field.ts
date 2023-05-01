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

// Optional
class UndefinedSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Undefined;
}

// Array
export type ArrayValueSchema = Exclude<ValueSchema, OptionalValueSchema>;

export class ArraySchema extends Documentable implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Array;

  readonly value: ArrayValueSchema;
  readonly restrictions: NonEmptyArray<ArrayRestriction>;

  constructor(
    docString: string,
    value: ArrayValueSchema,
    restrictions: NonEmptyArray<ArrayRestriction>,
  ) {
    super(docString);
    this.value = value;
    this.restrictions = restrictions;
  }
}

// FieldSet
export class FieldSetSchema extends Documentable implements BaseSchema {
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
export type MemberizableUnionSchema =
  | Exclude<ValueSchema, UnionSchema>
  | UndefinedSchema;

type UnionSchema = NamedUnionSchema | UnnamedUnionSchema;

export class NamedUnionSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Union;

  readonly members: Record<string, MemberizableUnionSchema>;
  readonly isNamed: boolean;

  constructor(members: Record<string, MemberizableUnionSchema>) {
    this.members = members;
    this.isNamed = true;
  }
}

// Removing export for the time being since we don't have a valid use case for this currently
// Generally, all unions should be optional or named union schemas.
export class UnnamedUnionSchema implements BaseSchema {
  readonly schemaValueType = SchemaValueType.Union;

  readonly members: NonEmptyArray<MemberizableUnionSchema>;
  readonly isNamed: false;

  constructor(members: NonEmptyArray<MemberizableUnionSchema>) {
    this.members = members;
    this.isNamed = false;
  }
}

export type OptionalNestableValueSchema = Exclude<
  MemberizableUnionSchema,
  OptionalValueSchema
>;

// Currently limiting the only unnamed union schema use case for optionality
export class OptionalValueSchema extends UnnamedUnionSchema {
  readonly value: OptionalNestableValueSchema;

  constructor(valueSchema: OptionalNestableValueSchema) {
    const members = requireArrayNonEmpty([valueSchema, new UndefinedSchema()]);
    super(members);
    this.value = valueSchema;
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
