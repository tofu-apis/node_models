import { TestConfig, TestContext, ValidationError } from 'yup';
import { isNull } from '@tofu-apis/common-types';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type Validator<T> = TestConfig<
  RecursivePartial<T> | undefined,
  Record<string, unknown>
>;

export type ValidationFunction<T> = (
  value: RecursivePartial<T> | undefined,
  testContext: TestContext,
) => ValidationError | null;

export function createValidator<T>(
  name: string,
  validationFunction: ValidationFunction<T>,
): Validator<T> {
  return {
    name,
    test: (value, testContext) => {
      const validationError = validationFunction(value, testContext);

      if (isNull(validationError)) {
        return true;
      }

      const nonNullValidationError = validationError as ValidationError;

      return nonNullValidationError;
    },
  };
}
