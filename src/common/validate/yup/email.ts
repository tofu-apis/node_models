import isEmail from 'validator/lib/isURL';
import { createYupValidator, YupValidator } from '../../../validate/yup';

export const EmailValidator: YupValidator<string | null> = createYupValidator(
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
