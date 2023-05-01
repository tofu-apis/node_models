import { describe, test, expect } from '@jest/globals';
import type { TypeOf } from '../../src/types/of';
import {
  BooleanSchema,
  StringSchema,
  FloatSchema,
  ArraySchema,
  FieldSetSchema,
  Field,
  OptionalSchema,
} from '../../src/schema/field';
import { RestrictionType } from '../../src/types/validation';
import { Int } from '@tofu-apis/common-types';

describe('TypeOf', () => {
  test(`${BooleanSchema.name}`, () => {
    const schema = new BooleanSchema();
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = true;
    value = false;
    expect(value).toBeDefined();
  });

  test(`${StringSchema.name}`, () => {
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

  test(`${FloatSchema.name}`, () => {
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

  describe(`${ArraySchema.name}`, () => {
    test('boolean', () => {
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

    test('string', () => {
      const stringSchema = new StringSchema([
        {
          docString: 'dummy-docstring',
          bounds: [1 as Int, 10 as Int],
          type: RestrictionType.Size,
        },
      ]);
      const schema = new ArraySchema('', stringSchema, [
        {
          docString: 'dummy-docstring',
          bounds: [1 as Int, 10 as Int],
          type: RestrictionType.Size,
        },
      ]);
      type TestType = TypeOf<typeof schema>;
      let value: TestType = ['one', 'two'];
      expect(value).toBeDefined();
    });

    test('doubly nested', () => {
      const boolSchema = new BooleanSchema();
      const nestedSchema = new ArraySchema('', boolSchema, [
        {
          docString: 'dummy-docstring',
          bounds: [1 as Int, 10 as Int],
          type: RestrictionType.Size,
        },
      ]);
      const schema = new ArraySchema('', nestedSchema, [
        {
          docString: 'dummy-docstring',
          bounds: [1 as Int, 10 as Int],
          type: RestrictionType.Size,
        },
      ]);
      type TestType = TypeOf<typeof schema>;
      let value: TestType = [[true, false]];
      expect(value).toBeDefined();
    });
  });

  describe(`${FieldSetSchema.name}`, () => {
    test('single nested', () => {
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

    test('doubly nested', () => {
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
      const nestedFieldSetSchema = new FieldSetSchema('', {
        fieldC: new Field('', floatSchema),
      });
      const fields = {
        fieldA: new Field('', stringSchema),
        fieldB: new Field('', nestedFieldSetSchema),
      };
      const schema = new FieldSetSchema('', fields);
      type TestType = TypeOf<typeof schema>;
      let value: TestType;
      value = {
        fieldA: 'hello',
        fieldB: {
          fieldC: 3.14,
        },
      };

      expect(value).toBeDefined();
    });
  });

  test(`${OptionalSchema.name}`, () => {
    const stringSchema = new StringSchema([
      {
        docString: 'dummy-docstring',
        bounds: [1 as Int, 10 as Int],
        type: RestrictionType.Size,
      },
    ]);
    const schema = new OptionalSchema('dummy-docstring', stringSchema);
    type TestType = TypeOf<typeof schema>;
    let value: TestType;
    value = 'hello';
    expect(value).toBeDefined();
    value = undefined;
    expect(value).toBeUndefined();
  });
});
