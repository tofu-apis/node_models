import { expect, test } from '@jest/globals';
import { Asserts, number, object } from 'yup';
import { validate } from '../../src/mongo/yup/validate';

const testSchema = object({
  integerField: number().integer(),
});

interface TestObject extends Asserts<typeof testSchema> {}

test('validate() with valid object', () => {
  validate<typeof testSchema, TestObject>(testSchema, { integerField: 1 });
});

test('validate() with invalid object', () => {
  expect(() => {
    validate<typeof testSchema, TestObject>(testSchema, { integerField: 1.2 });
  }).toThrow();
});
