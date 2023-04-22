import isURL from 'validator/lib/isURL';
import { createYupValidator, YupValidator } from '../../../validate/yup/yup';

export const YupUrlValidator: YupValidator<string> = createYupValidator(
  'url',
  (value, testContext) => {
    // Forcing the cast for the time being until we find a better solution
    const definedValue = value as string;

    if (!isURL(definedValue)) {
      return testContext.createError({
        message: `Input url string ${definedValue} must be a valid URL string.`,
      });
    }

    return null;
  },
);
