import {
  ArraySchema,
  BooleanSchema,
  FieldSetSchema,
  FloatSchema,
  IntegerSchema,
  OptionalSchema,
} from '../../src/schema/field';
import {
  ArrayValidator,
  FieldSetValidator,
  OptionalValidator,
  RequiredValidator,
} from '../../src/validate/complex';
import {
  RestrictionType,
  ValidationErrorType,
} from '../../src/types/validation';
import { Int, requireArrayNonEmpty } from '@tofu-apis/common-types';
import { Documentable } from '../../src/schema/documentable';

function createDocumentable<T>(value: T): T & Documentable {
  return {
    ...value,
    docString: 'dummy doc string',
  };
}

describe('ArrayValidator', () => {
  const schema = new ArraySchema(
    'dummy doc string',
    new IntegerSchema(
      requireArrayNonEmpty([
        createDocumentable({
          bounds: [1, 10] as [Int, Int],
          isMinimumExclusive: false,
          isMaximumExclusive: false,
          type: RestrictionType.Range,
        }),
      ]),
    ),
    requireArrayNonEmpty([
      createDocumentable({
        type: RestrictionType.Size,
        bounds: [1, 5] as [Int, Int],
      }),
    ]),
  );

  it('should return true when the size of the array is within the min and max', () => {
    expect(ArrayValidator([1, 2, 3], schema).isValid()).toEqual(true);
  });

  it('should return false when the input is not an array', () => {
    const outcome = ArrayValidator(true, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toEqual(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return false when the size of the array is below the min', () => {
    const outcome = ArrayValidator([], schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toEqual(ValidationErrorType.SizeRestriction);
  });

  it('should return false when the size of the array is above the max', () => {
    const outcome = ArrayValidator([1, 2, 3, 4, 5, 6, 7], schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toEqual(ValidationErrorType.SizeRestriction);
  });

  it('should return false when nested value is unexpected type', () => {
    const outcome = ArrayValidator([true], schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults()).toHaveLength(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toEqual(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });
});

describe('FieldSetValidator', () => {
  const schema = new FieldSetSchema('dummy doc string', {
    bool: {
      docString: 'dummy doc string',
      value: new BooleanSchema(),
    },
    float: {
      docString: 'dummy doc string',
      value: new FloatSchema(
        requireArrayNonEmpty([
          {
            docString: 'dummy doc string',
            bounds: [1, 5],
            isMaximumExclusive: false,
            isMinimumExclusive: false,
            type: RestrictionType.Range,
          },
        ]),
      ),
    },
  });

  it('should return a valid outcome when the input is valid', () => {
    expect(
      FieldSetValidator(
        {
          bool: true,
          float: 1.5,
        },
        schema,
      ).isValid(),
    ).toEqual(true);
  });

  it('should return a invalid outcome when the input is not a record', () => {
    const outcome = FieldSetValidator(3, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const firstInvalidResult = outcome.getInvalidResults()[0];
    expect(firstInvalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return a invalid outcome when the input has an additional unexpected field', () => {
    const outcome = FieldSetValidator(
      {
        bool: true,
        float: 1.5,
        unexpected: 'unexpected',
      },
      schema,
    );
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const firstInvalidResult = outcome.getInvalidResults()[0];
    expect(firstInvalidResult.type).toBe(
      ValidationErrorType.UnexpectedFieldRestriction,
    );
  });

  it('should return a invalid outcome when the input is missing a field', () => {
    const outcome = FieldSetValidator(
      {
        bool: true,
      },
      schema,
    );
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(2);
    const firstInvalidResult = outcome.getInvalidResults()[0];
    expect(firstInvalidResult.type).toBe(
      ValidationErrorType.RequiredRestriction,
    );
    const secondInvalidResult = outcome.getInvalidResults()[1];
    expect(secondInvalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return a invalid outcome when the input is an empty record', () => {
    const outcome = FieldSetValidator({}, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(4);
    const firstInvalidResult = outcome.getInvalidResults()[0];
    expect(firstInvalidResult.type).toBe(
      ValidationErrorType.RequiredRestriction,
    );
    const secondInvalidResult = outcome.getInvalidResults()[1];
    expect(secondInvalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
    const thirdInvalidResult = outcome.getInvalidResults()[2];
    expect(thirdInvalidResult.type).toBe(
      ValidationErrorType.RequiredRestriction,
    );
    const fourthInvalidResult = outcome.getInvalidResults()[3];
    expect(fourthInvalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });
});

describe('RequiredValidator', () => {
  const schema = new BooleanSchema();

  it('should return a valid outcome when the input is valid', () => {
    expect(RequiredValidator(true, schema).isValid()).toEqual(true);
  });

  it('should return a invalid outcome when the input is null', () => {
    const outcome = RequiredValidator(null, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(ValidationErrorType.RequiredRestriction);
  });

  it('should return a invalid outcome when the input is undefined', () => {
    const outcome = RequiredValidator(undefined, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(ValidationErrorType.RequiredRestriction);
  });
});

describe('OptionalValidator', () => {
  const schema = new OptionalSchema('dummy doc string', new BooleanSchema());

  it('should return a valid outcome when the input is undefined', () => {
    expect(OptionalValidator(undefined, schema).isValid()).toEqual(true);
  });

  it('should return a valid outcome when the input is nested valid', () => {
    expect(OptionalValidator(true, schema).isValid()).toEqual(true);
  });

  it('should return a invalid outcome when the input is nested invalid', () => {
    const outcome = OptionalValidator([], schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(
      ValidationErrorType.UnexpectedTypeRestriction,
    );
  });

  it('should return a invalid outcome when the input is null', () => {
    const outcome = OptionalValidator(null, schema);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.isValid()).toEqual(false);
    expect(outcome.getInvalidResults().length).toBe(1);
    const invalidResult = outcome.getInvalidResults()[0];
    expect(invalidResult.type).toBe(ValidationErrorType.NonNullRestriction);
  });
});
