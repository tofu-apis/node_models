import { describe, test, expect } from '@jest/globals';
import type { TypeOf } from '../../src/types/of';
import {
  BooleanSchema,
  StringSchema,
  FloatSchema,
  ArraySchema,
  FieldSetSchema,
  Field,
  NamedUnionSchema,
  OptionalValueSchema,
} from '../../src/schema/field';
import { RestrictionType } from '../../src/types/validation';
import { Int } from '@tofu-apis/common-types';

describe('TypeOf', () => {
  test('BooleanSchema', () => {
    const schema = new BooleanSchema();
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = true;
    value = false;
    expect(value).toBeDefined();
  });

  test('StringSchema', () => {
    const schema = new StringSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = 'hello';
    expect(value).toBeDefined();
  });

  test('FloatSchema', () => {
    const schema = new FloatSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1.0, 5.0],
        isMinimumExclusive: true,
        isMaximumExclusive: true,
        type: RestrictionType.Range,
      },
    ]);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = 3.14;
    expect(value).toBeDefined();
  });

  test('ArraySchema', () => {
    const boolSchema = new BooleanSchema();
    const schema = new ArraySchema('', boolSchema, [
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    type TestType = TypeOf<typeof schema>;
    let value: TestType = [true, false];
    expect(value).toBeDefined();
  });

  test('FieldSetSchema', () => {
    const stringSchema = new StringSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    const floatSchema = new FloatSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1.0, 5.0],
        isMinimumExclusive: true,
        isMaximumExclusive: true,
        type: RestrictionType.Range,
      },
    ]);
    const fields = {
      fieldA: new Field('', stringSchema),
      fieldB: new Field('', floatSchema),
    };
    const schema = new FieldSetSchema('', fields);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = { fieldA: 'hello', fieldB: 3.14 };
    expect(value).toBeDefined();
  });

  test('NamedUnionSchema', () => {
    const stringSchema = new StringSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    const floatSchema = new FloatSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1.0, 5.0],
        isMinimumExclusive: true,
        isMaximumExclusive: true,
        type: RestrictionType.Range,
      },
    ]);
    const members = {
      memberA: stringSchema,
      memberB: floatSchema,
    };
    const schema = new NamedUnionSchema(members);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = 'hello';
    value = 3.14;
    expect(value).toBeDefined();
  });

  test('OptionalValueSchema', () => {
    const stringSchema = new StringSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    const schema = new OptionalValueSchema(stringSchema);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = 'hello';
    value = undefined;
    expect(value).toBeDefined();
  });
});
