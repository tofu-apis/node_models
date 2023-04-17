import isEmail from 'validator/lib/isURL';
import { createValidator, Validator } from '../../validate/validator';

export const EmailValidator: Validator<string | null> = createValidator(
  'url',
  (value, testContext) => {
    if (value === null) {
      return null;
    }

    // Forcing the cast for the time being until we find a better solution
    const definedValue = value as string;

    if (!isEmail(definedValue)) {
      return testContext.createError({
        message: `Input email string ${definedValue} must be a valid email string.`,
      });
    }

    return null;
  },
);
