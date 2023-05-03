import {
  ArraySchema,
  BaseSchema,
  BooleanSchema,
  FieldSetSchema,
  FloatSchema,
  IntegerSchema,
  OptionalSchema,
  StringSchema,
} from '../schema';
import { ValidationErrorType } from '../types';
import {
  ArrayValidator,
  FieldSetValidator,
  OptionalValidator,
  RequiredValidator,
} from './complex';
import { InvalidOutcomeBuilder, ValidationOutcome } from './outcome';
import {
  BooleanValidator,
  FloatValidator,
  IntegerValidator,
  StringValidator,
} from './primitive';

export const GenericValueValidator = (
  input: unknown,
  schema: BaseSchema,
): ValidationOutcome<ValidationErrorType> => {
  const builder = new InvalidOutcomeBuilder<ValidationErrorType>();

  if (schema instanceof OptionalSchema) {
    builder.addInvalidResults(
      OptionalValidator(input, schema).getInvalidResults(),
    );
    return builder.build();
  }

  // If not optional, we default to required.
  builder.addInvalidResults(
    RequiredValidator(input, schema).getInvalidResults(),
  );

  if (schema instanceof BooleanSchema) {
    builder.addInvalidResults(
      BooleanValidator(input, schema).getInvalidResults(),
    );
  } else if (schema instanceof StringSchema) {
    builder.addInvalidResults(
      StringValidator(input, schema).getInvalidResults(),
    );
  } else if (schema instanceof FloatSchema) {
    builder.addInvalidResults(
      FloatValidator(input, schema).getInvalidResults(),
    );
  } else if (schema instanceof IntegerSchema) {
    builder.addInvalidResults(
      IntegerValidator(input, schema).getInvalidResults(),
    );
  } else if (schema instanceof ArraySchema) {
    builder.addInvalidResults(
      ArrayValidator(input, schema).getInvalidResults(),
    );
  } else if (schema instanceof FieldSetSchema) {
    builder.addInvalidResults(
      FieldSetValidator(input, schema).getInvalidResults(),
    );
  } else {
    throw new Error(`Unsupported schema type: ${schema.schemaValueType}`);
  }

  return builder.build();
};
