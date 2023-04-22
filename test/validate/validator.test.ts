import { describe, expect, test } from '@jest/globals';
import { ValidationResult, Validator } from '../../src/validate/validator';

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
    return new ValidationResult<TestInvalidType>({
      type: TestInvalidType.FirstInvalidType,
      reason: INVALID_RESULT_REASON,
    });
  }
  return ValidationResult.createValid<TestInvalidType>();
};

describe(ValidationResult.name, () => {
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
  test(`should return a ${ValidationResult.name} with an error when input is ${INVALID_STRING}`, () => {
    const result = testValidator(INVALID_STRING);
    expect(result.isValid()).toBe(false);
    const invalidResult = result.getInvalidResult();
    expect(invalidResult.type).toBe(TestInvalidType.FirstInvalidType);
    expect(invalidResult.reason).toBe(INVALID_RESULT_REASON);
  });

  test(`should return a ${ValidationResult.name} without an error when input is ${VALID_STRING}`, () => {
    const result = testValidator(VALID_STRING);
    expect(result.isValid()).toBe(true);
  });
});
