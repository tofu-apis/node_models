import { expect } from '@jest/globals';
import { ValidationOutcome } from '../../src/validate/outcome';
import {
  FloatRangeRestriction,
  IntegerRangeRestriction,
  IntegerSetRestriction,
  StringSetRestriction,
} from '../../src/schema/restriction';
import {
  ArraySizeRestrictionValidator,
  IntegerSetRestrictionValidator,
  StringSizeRestrictionValidator,
  StringSetRestrictionValidator,
  IntegerRangeRestrictionValidator,
  FloatRangeRestrictionValidator,
} from '../../src/validate/restriction';
import {
  RestrictionType,
  ValidationErrorType,
} from '../../src/types/validation';
import { Documentable } from '../../src/schema/documentable';
import { Int } from '@tofu-apis/common-types';

function createDocumentable<T>(value: T): T & Documentable {
  return {
    ...value,
    docString: 'dummy doc string',
  };
}

describe('StringSetRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is allowed', () => {
    const input = 'foo';
    const restriction: StringSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 'foo' }),
        createDocumentable({ value: 'bar' }),
      ],
      type: RestrictionType.Set,
    };
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(StringSetRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome with one invalidResult when input is not allowed', () => {
    const input = 'baz';
    const restriction: StringSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 'foo' }),
        createDocumentable({ value: 'bar' }),
      ],
      type: RestrictionType.Set,
    };

    const outcome = StringSetRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });
});

describe('IntegerSetRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is allowed', () => {
    const input = 2 as Int;
    const restriction: IntegerSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 2 as Int }),
        createDocumentable({ value: 3 as Int }),
      ],
      type: RestrictionType.Set,
    };
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(IntegerSetRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome with one invalid result when input is not allowed', () => {
    const input = 4 as Int;
    const restriction: IntegerSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 1 as Int }),
        createDocumentable({ value: 2 as Int }),
        createDocumentable({ value: 3 as Int }),
      ],
      type: RestrictionType.Set,
    };

    const outcome = IntegerSetRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });
});

describe('ArraySizeRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input size is within bounds', () => {
    const input = [1, 2, 3];
    const restriction = createDocumentable({
      bounds: [1 as Int, 5 as Int] as [Int, Int],
      type: RestrictionType.Size as RestrictionType.Size,
    });
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(ArraySizeRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome with one invalid result when input size is outside bounds', () => {
    const input = [1, 2, 3, 4, 5, 6];
    const restriction = createDocumentable({
      bounds: [1 as Int, 5 as Int] as [Int, Int],
      type: RestrictionType.Size as RestrictionType.Size,
    });

    const outcome = ArraySizeRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SizeRestriction,
    );
  });
});

describe('StringSizeRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input size is within bounds', () => {
    const input = 'hello';
    const restriction = createDocumentable({
      bounds: [1 as Int, 10 as Int] as [Int, Int],
      type: RestrictionType.Size as RestrictionType.Size,
    });
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(StringSizeRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome when input size is outside bounds', () => {
    const input = 'this string is too long';
    const restriction = createDocumentable({
      bounds: [1 as Int, 10 as Int] as [Int, Int],
      type: RestrictionType.Size as RestrictionType.Size,
    });

    const outcome = StringSizeRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SizeRestriction,
    );
  });
});

describe('IntegerRangeRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is within bounds', () => {
    const input = 5 as Int;
    const restriction: IntegerRangeRestriction = createDocumentable({
      bounds: [1 as Int, 10 as Int] as [Int, Int],
      isMinimumExclusive: false,
      isMaximumExclusive: false,
      type: RestrictionType.Range as RestrictionType.Range,
    });

    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(IntegerRangeRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome when input is outside bounds', () => {
    const input = 15 as Int;
    const restriction: IntegerRangeRestriction = createDocumentable({
      bounds: [1 as Int, 10 as Int] as [Int, Int],
      isMinimumExclusive: false,
      isMaximumExclusive: false,
      type: RestrictionType.Range as RestrictionType.Range,
    });

    const outcome = IntegerRangeRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.RangeRestriction,
    );
  });
});

describe('FloatRangeRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is within bounds', () => {
    const input = 3.5;
    const restriction: FloatRangeRestriction = createDocumentable({
      bounds: [1.0, 5.0],
      isMinimumExclusive: true,
      isMaximumExclusive: false,
      type: RestrictionType.Range as RestrictionType.Range,
    });
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(FloatRangeRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome when input is below bounds', () => {
    const input = 1.0;
    const restriction: FloatRangeRestriction = createDocumentable({
      bounds: [1.0, 5.0],
      isMinimumExclusive: true,
      isMaximumExclusive: false,
      type: RestrictionType.Range as RestrictionType.Range,
    });

    const outcome = FloatRangeRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.RangeRestriction,
    );
  });

  test('should return an invalid outcome when input is above bounds', () => {
    const input = 5.0;
    const restriction: FloatRangeRestriction = createDocumentable({
      bounds: [1.0, 5.0],
      isMinimumExclusive: false,
      isMaximumExclusive: true,
      type: RestrictionType.Range as RestrictionType.Range,
    });

    const outcome = FloatRangeRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.RangeRestriction,
    );
  });
});

describe('StringSetRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is allowed', () => {
    const input = 'apple';
    const restriction: StringSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 'apple' }),
        createDocumentable({ value: 'banana' }),
        createDocumentable({ value: 'cherry' }),
      ],
      type: RestrictionType.Set,
    };
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(StringSetRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome when input is not allowed', () => {
    const input = 'orange';
    const restriction: StringSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 'apple' }),
        createDocumentable({ value: 'banana' }),
        createDocumentable({ value: 'cherry' }),
      ],
      type: RestrictionType.Set,
    };

    const outcome = StringSetRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });
});

describe('IntegerSetRestrictionValidator', () => {
  test('should return a valid expectedOutcome when input is allowed', () => {
    const input = 3 as Int;
    const restriction: IntegerSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 1 as Int }),
        createDocumentable({ value: 2 as Int }),
        createDocumentable({ value: 3 as Int }),
      ],
      type: RestrictionType.Set,
    };
    const expectedOutcome =
      ValidationOutcome.createValid<ValidationErrorType>();
    expect(IntegerSetRestrictionValidator(input, restriction)).toEqual(
      expectedOutcome,
    );
  });

  test('should return an invalid outcome when input is not allowed', () => {
    const input = 4 as Int;
    const restriction: IntegerSetRestriction = {
      allowedValues: [
        createDocumentable({ value: 1 as Int }),
        createDocumentable({ value: 2 as Int }),
        createDocumentable({ value: 3 as Int }),
      ],
      type: RestrictionType.Set,
    };

    const outcome = IntegerSetRestrictionValidator(input, restriction);
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    expect(outcome.getInvalidResults()[0].type).toBe(
      ValidationErrorType.SetRestriction,
    );
  });
});
