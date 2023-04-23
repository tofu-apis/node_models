import { Int } from '@tofu-apis/common-types';
import {
  ArraySizeRestriction,
  FloatRangeRestriction,
  IntegerRangeRestriction,
  IntegerSetRestriction,
  RangeRestriction,
  SchemaValueType,
  SetRestriction,
  SizeRestriction,
  StringSetRestriction,
  StringSizeRestriction,
} from '../schema';
import { ValidationErrorType } from '../types/validation';
import { ValidationOutcome, InvalidOutcomeBuilder } from './outcome';

const SetRestrictionValidator = <T>(
  input: T,
  restriction: SetRestriction<T>,
  schemaValueType: SchemaValueType,
): ValidationOutcome<ValidationErrorType> => {
  const allowedValuesSet = new Set(
    restriction.allowedValues.map((allowableValue) => allowableValue.value),
  );

  if (allowedValuesSet.has(input)) {
    return ValidationOutcome.createValid();
  } else {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.SetRestriction,
        reason: `Input ${schemaValueType} value "${input}" is not allowed by the set restriction.`,
      })
      .build();
  }
};

export const StringSetRestrictionValidator = (
  input: string,
  restriction: StringSetRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return SetRestrictionValidator<string>(
    input,
    restriction,
    SchemaValueType.String,
  );
};

export const IntegerSetRestrictionValidator = (
  input: Int,
  restriction: IntegerSetRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return SetRestrictionValidator<Int>(
    input,
    restriction,
    SchemaValueType.Integer,
  );
};

const SizeRestrictionValidator = <T extends unknown[] | string>(
  input: T,
  restriction: SizeRestriction,
  schemaValueType: SchemaValueType,
): ValidationOutcome<ValidationErrorType> => {
  const { bounds } = restriction;
  const inputSize = input.length;

  if (inputSize >= bounds[0] && inputSize <= bounds[1]) {
    return ValidationOutcome.createValid();
  } else {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.SizeRestriction,
        reason: `Input ${schemaValueType} with size of "${inputSize}" is not within the bounds [${bounds[0]}, ${bounds[1]}] of the size restriction.`,
      })
      .build();
  }
};

export const ArraySizeRestrictionValidator = (
  input: unknown[],
  restriction: ArraySizeRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return SizeRestrictionValidator(input, restriction, SchemaValueType.Array);
};

export const StringSizeRestrictionValidator = (
  input: string,
  restriction: StringSizeRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return SizeRestrictionValidator(input, restriction, SchemaValueType.String);
};

const RangeRestrictionValidator = <T extends number>(
  input: T,
  restriction: RangeRestriction<T>,
  schemaValueType: SchemaValueType,
): ValidationOutcome<ValidationErrorType> => {
  const { bounds, isMinimumExclusive, isMaximumExclusive } = restriction;
  const lowerBound = bounds[0];
  const upperBound = bounds[1];
  const lowerBoundChar = isMinimumExclusive ? '(' : '[';
  const upperBoundChar = isMaximumExclusive ? ')' : ']';

  if (isMinimumExclusive && input <= lowerBound) {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.RangeRestriction,
        reason: `Input ${schemaValueType} value "${input}" is not greater than the minimum bound ${lowerBoundChar}${lowerBound}, ${upperBound}${upperBoundChar} of the range restriction.`,
      })
      .build();
  } else if (isMaximumExclusive && input >= upperBound) {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.RangeRestriction,
        reason: `Input ${schemaValueType} value "${input}" is not less than the maximum bound ${lowerBound}${lowerBoundChar}, ${upperBound}${upperBoundChar} of the range restriction.`,
      })
      .build();
  } else if (!isMinimumExclusive && input < lowerBound) {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.RangeRestriction,
        reason: `Input ${schemaValueType} value "${input}" is less than the minimum bound ${lowerBoundChar}${lowerBound}, ${upperBound}${upperBoundChar} of the range restriction.`,
      })
      .build();
  } else if (!isMaximumExclusive && input > upperBound) {
    return new InvalidOutcomeBuilder<ValidationErrorType>()
      .addInvalidResult({
        type: ValidationErrorType.RangeRestriction,
        reason: `Input ${schemaValueType} value "${input}" is greater than the maximum bound ${lowerBound}${lowerBoundChar}, ${upperBoundChar}${upperBound} of the range restriction.`,
      })
      .build();
  } else {
    return ValidationOutcome.createValid();
  }
};

export const IntegerRangeRestrictionValidator = (
  input: Int,
  restriction: IntegerRangeRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return RangeRestrictionValidator(input, restriction, SchemaValueType.Integer);
};

export const FloatRangeRestrictionValidator = (
  input: number,
  restriction: FloatRangeRestriction,
): ValidationOutcome<ValidationErrorType> => {
  return RangeRestrictionValidator(input, restriction, SchemaValueType.Float);
};
