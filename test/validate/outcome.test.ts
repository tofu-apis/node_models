import { describe, expect, test } from '@jest/globals';
import {
  InvalidResult,
  ValidationOutcome,
  InvalidOutcomeBuilder,
  Validator,
} from '../../src/validate/outcome';
import { NonEmptyArray, requireArrayNonEmpty } from '@tofu-apis/common-types';

enum TestInvalidType {
  FirstInvalidType = 'FIRST_INVALID_TYPE',
  SecondInvalidType = 'SECOND_INVALID_TYPE',
}

const VALID_STRING = 'valid';
const INVALID_STRING = 'invalid';
const INVALID_RESULT_REASON = 'Input has an invalid value.';

// Example validator function
const testValidator: Validator<string, TestInvalidType> = (input: string) => {
  if (input === INVALID_STRING) {
    return new ValidationOutcome<TestInvalidType>(
      requireArrayNonEmpty([
        {
          type: TestInvalidType.FirstInvalidType,
          reason: INVALID_RESULT_REASON,
        },
      ]),
    );
  }
  return ValidationOutcome.createValid<TestInvalidType>();
};

describe(ValidationOutcome.name, () => {
  test(`isValid should return true when the result is ${VALID_STRING}`, () => {
    const result = testValidator(VALID_STRING);
    expect(result.isValid()).toBe(true);
  });

  test(`isValid should return false when the result is ${INVALID_STRING}`, () => {
    const result = testValidator(INVALID_STRING);
    expect(result.isValid()).toBe(false);
  });
});

describe('Validator', () => {
  test(`should return a ${ValidationOutcome.name} with an error when input is ${INVALID_STRING}`, () => {
    const result = testValidator(INVALID_STRING);
    expect(result.isValid()).toBe(false);
    const invalidResults = result.getInvalidResults();
    expect(invalidResults).toHaveLength(1);
    const invalidResult = invalidResults[0];
    expect(invalidResult.type).toBe(TestInvalidType.FirstInvalidType);
    expect(invalidResult.reason).toBe(INVALID_RESULT_REASON);
  });

  test(`should return a ${ValidationOutcome.name} without an error when input is ${VALID_STRING}`, () => {
    const result = testValidator(VALID_STRING);
    expect(result.isValid()).toBe(true);
  });
});

describe(InvalidOutcomeBuilder.name, () => {
  test(`should build a ${ValidationOutcome.name} with a single invalid result`, () => {
    const builder = new InvalidOutcomeBuilder<TestInvalidType>();

    const invalidResult: InvalidResult<TestInvalidType> = {
      type: TestInvalidType.FirstInvalidType,
      reason: INVALID_RESULT_REASON,
    };

    const outcome = builder.addInvalidResult(invalidResult).build();
    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toEqual([invalidResult]);
  });

  test(`should build a ${ValidationOutcome.name} with multiple invalid results`, () => {
    const builder = new InvalidOutcomeBuilder<TestInvalidType>();

    const invalidResults: NonEmptyArray<InvalidResult<TestInvalidType>> = [
      {
        type: TestInvalidType.FirstInvalidType,
        reason: INVALID_RESULT_REASON,
      },
      {
        type: TestInvalidType.SecondInvalidType,
        reason: INVALID_RESULT_REASON,
      },
    ];
    const outcome = builder.addInvalidResults(invalidResults).build();

    expect(outcome.isValid()).toBe(false);
    expect(outcome.getInvalidResults()).toEqual(invalidResults);
  });

  test(`should throw an error if no invalid results are added before building`, () => {
    const builder = new InvalidOutcomeBuilder<TestInvalidType>();

    const outcome = builder.build();
    expect(outcome.isValid()).toBe(true);
  });
});
