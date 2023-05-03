import { Int, requireArrayNonEmpty } from '@tofu-apis/common-types';
import {
  RestrictionType,
  ValidationErrorType,
} from '../../src/types/validation';
import {
  BooleanValidator,
  FloatValidator,
  IntegerValidator,
  StringValidator,
} from '../../src/validate/primitive';
import {
  FloatSchema,
  IntegerSchema,
  SchemaValueType,
  StringSchema,
  BooleanSchema,
} from '../../src/schema';
import { Documentable } from '../../src/schema/documentable';

function createDocumentable<T>(value: T): T & Documentable {
  return {
    ...value,
    docString: 'dummy doc string',
  };
}

describe('BooleanValidator', () => {
  const schema: BooleanSchema = new BooleanSchema();

  it('should return a valid outcome if true', () => {
    const outcome = BooleanValidator(true, schema);
    expect(outcome.isValid()).toBe(true);
  });

  it('should return a valid outcome if false', () => {
    const outcome = BooleanValidator(false, schema);
    expect(outcome.isValid()).toBe(true);
  });

  it('should return invalid outcome for non-boolean', () => {
    const outcome = BooleanValidator(3, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });
});

describe('StringValidator', () => {
  const schema: StringSchema = {
    schemaValueType: SchemaValueType.String,
    restrictions: requireArrayNonEmpty([
      createDocumentable({
        type: RestrictionType.Size,
        bounds: [1, 10] as [Int, Int],
      }),
      createDocumentable({
        type: RestrictionType.Set,
        allowedValues: [
          createDocumentable({ value: 'foo' }),
          createDocumentable({ value: 'bar' }),
        ],
      }),
    ]),
  };

  it('should return a valid outcome if input satisfies all restrictions', () => {
    const outcome = StringValidator('foo', schema);
    expect(outcome.isValid()).toBe(true);
  });

  it('should return invalid outcome for non-string', () => {
    const outcome = StringValidator(true, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return an invalid outcome if input violates size restriction', () => {
    const outcome = StringValidator('a'.repeat(11), schema);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(2);
    const firstInvalidResult = outcome.getInvalidResults()[0];
    expect(firstInvalidResult.type).toEqual(
      ValidationErrorType.SizeRestriction,
    );
    const secondInvalidResult = outcome.getInvalidResults()[1];
    expect(secondInvalidResult.type).toEqual(
      ValidationErrorType.SetRestriction,
    );
  });

  it('should return an invalid outcome if input violates set restriction', () => {
    const outcome = StringValidator('baz', schema);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toEqual(ValidationErrorType.SetRestriction);
  });
});

describe('FloatValidator', () => {
  const schema = new FloatSchema(
    requireArrayNonEmpty([
      createDocumentable({
        type: RestrictionType.Range as RestrictionType.Range,
        bounds: [1, 2],
        isMinimumExclusive: true,
        isMaximumExclusive: true,
      }),
    ]),
  );

  it('returns a valid outcome for valid input', () => {
    const outcome = FloatValidator(1.23, schema);
    expect(outcome.isValid()).toBe(true);
  });

  it('should return invalid outcome for non-number', () => {
    const outcome = FloatValidator(true, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('returns an invalid outcome for invalid input', () => {
    const outcome = FloatValidator(2.0, schema);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.RangeRestriction,
    );
  });
});

describe('IntegerValidator', () => {
  const schema = new IntegerSchema(
    requireArrayNonEmpty([
      createDocumentable({
        type: RestrictionType.Range as RestrictionType.Range,
        bounds: [0 as Int, 10 as Int],
        isMinimumExclusive: false,
        isMaximumExclusive: false,
      }),
      createDocumentable({
        type: RestrictionType.Set,
        allowedValues: [
          createDocumentable({ value: 1 as Int }),
          createDocumentable({ value: 2 as Int }),
          createDocumentable({ value: 3 as Int }),
        ],
      }),
    ]),
  );

  it('should return invalid outcome for non-number', () => {
    const outcome = IntegerValidator(true, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return invalid outcome for non-integer number', () => {
    const outcome = IntegerValidator(3.1, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return valid outcome for valid input', () => {
    const outcome = IntegerValidator(3 as Int, schema);

    expect(outcome.isValid()).toBe(true);
  });

  it('should return invalid outcome for out of range input', () => {
    const invalidInput = -5 as Int;

    const outcome = IntegerValidator(invalidInput, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(2);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.RangeRestriction,
    );
    expect(outcome.getInvalidResults()[1].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });

  it('should return invalid outcome for invalid integer set', () => {
    const invalidInput = 4 as Int;

    const outcome = IntegerValidator(invalidInput, schema);

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });
});
