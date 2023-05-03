import { requireArrayNonEmpty } from '@tofu-apis/common-types';
import {
  ArraySchema,
  ArraySizeRestriction,
  ArrayValueSchema,
  BaseSchema,
  Field,
  FieldSetFields,
  FieldSetSchema,
  OptionalSchema,
  RequiredSchema,
  SchemaValueType,
} from '../schema';
import { RestrictionType, ValidationErrorType } from '../types';
import { InvalidOutcomeBuilder, ValidationOutcome } from './outcome';
import { ArraySizeRestrictionValidator } from './restriction';
import { GenericValueValidator } from './field';

export const ArrayValidator = (
  input: unknown,
  schema: ArraySchema<ArrayValueSchema>,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (!Array.isArray(input)) {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not an array: ${input}`,
    });
    return builder.build();
  }

  const arrayInput = input as unknown[];
  const restrictions = schema.restrictions;

  for (const restriction of restrictions) {
    const restrictionType = restriction.type;
    switch (restrictionType) {
      case RestrictionType.Size:
        const sizeRestriction = restriction as ArraySizeRestriction;
        const sizeOutcome = ArraySizeRestrictionValidator(
          arrayInput,
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

  for (const arrayValue of arrayInput) {
    builder.addInvalidResults(
      GenericValueValidator(arrayValue, schema.value).getInvalidResults(),
    );
  }

  return builder.build();
};

function isAFieldSet(obj: unknown): obj is Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return false;
  }
  return Object.keys(obj).every((key) => typeof key === 'string');
}

export const FieldSetValidator = (
  input: unknown,
  schema: FieldSetSchema<FieldSetFields>,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (!isAFieldSet(input)) {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedTypeRestriction,
      reason: `Input is not an field set: ${input}`,
    });
    return builder.build();
  }

  const fields = schema.fields;

  const unexpectedKeys = Object.keys(input).filter((key) => {
    const fieldKeys = new Set(Object.keys(fields));
    return !fieldKeys.has(key);
  });

  for (const unexpectedKey of unexpectedKeys) {
    builder.addInvalidResult({
      type: ValidationErrorType.UnexpectedFieldRestriction,
      reason: `Input ${input} has field that should not exist: ${unexpectedKey}`,
    });
  }

  for (const fieldName in fields) {
    const field: Field<BaseSchema> = fields[fieldName];

    const fieldSchema: BaseSchema = field.value;

    const fieldValue = input[fieldName];

    builder.addInvalidResults(
      GenericValueValidator(fieldValue, fieldSchema).getInvalidResults(),
    );
  }

  return builder.build();
};

export const RequiredValidator = (
  input: unknown,
  _schema: RequiredSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (input === null) {
    builder.addInvalidResult({
      type: ValidationErrorType.RequiredRestriction,
      reason: `Input ${input} is null but should be required`,
    });
  } else if (input === undefined) {
    builder.addInvalidResult({
      type: ValidationErrorType.RequiredRestriction,
      reason: `Input ${input} is undefined but should be required`,
    });
  }

  // We intentionally don't nest on this validator
  // and apply this in GenericValidator since all values
  // are required by default

  return builder.build();
};

export const OptionalValidator = (
  input: unknown,
  schema: OptionalSchema,
): ValidationOutcome<ValidationErrorType> => {
  if (input === undefined) {
    return ValidationOutcome.createValid();
  }

  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (input === null) {
    builder.addInvalidResult({
      type: ValidationErrorType.NonNullRestriction,
      reason: `Input ${input} is null but should be non-null`,
    });
  } else {
    builder.addInvalidResults(
      GenericValueValidator(
        input as Exclude<unknown, null | undefined>,
        schema.value,
      ).getInvalidResults(),
    );
  }

  return builder.build();
};
