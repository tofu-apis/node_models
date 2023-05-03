import { isInt, requireArrayNonEmpty } from '@tofu-apis/common-types';
import {
  StringSchema,
  FloatSchema,
  IntegerSchema,
  SchemaValueType,
  BooleanSchema,
} from '../schema/field'; // Import from your existing code
import {
  FloatRangeRestriction,
  IntegerRangeRestriction,
  IntegerSetRestriction,
  StringSetRestriction,
  StringSizeRestriction,
} from '../schema/restriction';
import { ValidationOutcome, InvalidOutcomeBuilder } from './outcome';
import { RestrictionType, ValidationErrorType } from '../types/validation';
import {
  FloatRangeRestrictionValidator,
  IntegerRangeRestrictionValidator,
  IntegerSetRestrictionValidator,
  StringSetRestrictionValidator,
  StringSizeRestrictionValidator,
} from './restriction';

export const BooleanValidator = (
  input: unknown,
  _schema: BooleanSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (typeof input !== 'boolean') {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not a boolean: ${input}`,
    });
  }

  return builder.build();
};

export const StringValidator = (
  input: unknown,
  schema: StringSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (typeof input !== 'string') {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not a string: ${input}`,
    });
    return builder.build();
  }

  const restrictions = schema.restrictions;

  for (const restriction of restrictions) {
    const restrictionType = restriction.type;
    switch (restrictionType) {
      case RestrictionType.Size:
        const sizeRestriction = restriction as StringSizeRestriction;
        const sizeOutcome = StringSizeRestrictionValidator(
          input,
          sizeRestriction,
        );
        if (!sizeOutcome.isValid()) {
          builder.addInvalidResults(
            requireArrayNonEmpty(
              sizeOutcome.getInvalidResults(),
              `Invalid size validation outcome should have non-zero invalid result count for input: "${input}"`,
            ),
          );
        }
        break;
      case RestrictionType.Set:
        const setRestriction = restriction as StringSetRestriction;
        const setOutcome = StringSetRestrictionValidator(input, setRestriction);
        if (!setOutcome.isValid()) {
          builder.addInvalidResults(
            requireArrayNonEmpty(
              setOutcome.getInvalidResults(),
              `Invalid set validation outcome should have non-zero invalid result count for input: "${input}"`,
            ),
          );
        }
        break;
      default:
        throw new Error(
          `Unsupported ${SchemaValueType.String} restriction type: ${restrictionType}`,
        );
    }
  }

  return builder.build();
};

export const FloatValidator = (
  input: unknown,
  schema: FloatSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (typeof input !== 'number') {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not a float: ${input}`,
    });
    return builder.build();
  }

  const restrictions = schema.restrictions;

  for (const restriction of restrictions) {
    const restrictionType = restriction.type;
    switch (restrictionType) {
      case RestrictionType.Range:
        const rangeRestriction = restriction as FloatRangeRestriction;
        const rangeOutcome = FloatRangeRestrictionValidator(
          input,
          rangeRestriction,
        );
        if (!rangeOutcome.isValid()) {
          builder.addInvalidResults(
            requireArrayNonEmpty(
              rangeOutcome.getInvalidResults(),
              `Invalid range validation outcome should have non-zero invalid result count for input: "${input}"`,
            ),
          );
        }
        break;
      default:
        throw new Error(
          `Unsupported ${SchemaValueType.Float} restriction type: ${restrictionType}`,
        );
    }
  }

  return builder.build();
};

export const IntegerValidator = (
  input: unknown,
  schema: IntegerSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (typeof input !== 'number' || !isInt(input)) {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not an integer: ${input}`,
    });
    return builder.build();
  }

  const restrictions = schema.restrictions;

  for (const restriction of restrictions) {
    const restrictionType = restriction.type;
    switch (restrictionType) {
      case RestrictionType.Range:
        const rangeRestriction = restriction as IntegerRangeRestriction;
        const rangeOutcome = IntegerRangeRestrictionValidator(
          input,
          rangeRestriction,
        );
        if (!rangeOutcome.isValid()) {
          builder.addInvalidResults(
            requireArrayNonEmpty(
              rangeOutcome.getInvalidResults(),
              `Invalid range validation outcome should have non-zero invalid result count for input: "${input}"`,
            ),
          );
        }
        break;
      case RestrictionType.Set:
        const setRestriction = restriction as IntegerSetRestriction;
        const setOutcome = IntegerSetRestrictionValidator(
          input,
          setRestriction,
        );
        if (!setOutcome.isValid()) {
          builder.addInvalidResults(
            requireArrayNonEmpty(
              setOutcome.getInvalidResults(),
              `Invalid set validation outcome should have non-zero invalid result count for input: "${input}"`,
            ),
          );
        }
        break;
      default:
        throw new Error(
          `Unsupported ${SchemaValueType.Integer} restriction type: ${restrictionType}`,
        );
    }
  }

  return builder.build();
};
