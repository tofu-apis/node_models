import { Int, requireArrayNonEmpty } from '@tofu-apis/common-types';
import {
  StringSchema,
  FloatSchema,
  IntegerSchema,
  SchemaValueType,
  ArraySchema,
  ArrayValueSchema,
} from '../schema/field'; // Import from your existing code
import {
  ArraySizeRestriction,
  FloatRangeRestriction,
  IntegerRangeRestriction,
  IntegerSetRestriction,
  StringSetRestriction,
  StringSizeRestriction,
} from '../schema/restriction';
import { ValidationOutcome, InvalidOutcomeBuilder } from './outcome';
import { RestrictionType, ValidationErrorType } from '../types/validation';
import {
  ArraySizeRestrictionValidator,
  FloatRangeRestrictionValidator,
  IntegerRangeRestrictionValidator,
  IntegerSetRestrictionValidator,
  StringSetRestrictionValidator,
  StringSizeRestrictionValidator,
} from './restriction';

export const StringValidator = (
  input: string,
  schema: StringSchema,
): ValidationOutcome<ValidationErrorType> => {
  const restrictions = schema.restrictions;

  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

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
  input: number,
  schema: FloatSchema,
): ValidationOutcome<ValidationErrorType> => {
  const restrictions = schema.restrictions;

  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

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
  input: Int,
  schema: IntegerSchema,
): ValidationOutcome<ValidationErrorType> => {
  const restrictions = schema.restrictions;

  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

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

export const ArrayValidator = (
  input: unknown[],
  schema: ArraySchema<ArrayValueSchema>,
): ValidationOutcome<ValidationErrorType> => {
  const restrictions = schema.restrictions;

  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  for (const restriction of restrictions) {
    const restrictionType = restriction.type;
    switch (restrictionType) {
      case RestrictionType.Size:
        const sizeRestriction = restriction as ArraySizeRestriction;
        const sizeOutcome = ArraySizeRestrictionValidator(
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
      default:
        throw new Error(
          `Unsupported ${SchemaValueType.Array} restriction type: ${restrictionType}`,
        );
    }
  }

  return builder.build();
};
