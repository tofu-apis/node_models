import { NonEmptyArray } from '@tofu-apis/common-types';

// Currently, there isn't a clear way to enforce an type to be an enum string type so using extension of a string instead.
export interface InvalidResult<INVALID_TYPE extends string> {
  type: INVALID_TYPE;
  reason: string;
}

export class ValidationOutcome<INVALID_TYPE extends string> {
  private readonly invalidResults: InvalidResult<INVALID_TYPE>[];

  constructor(invalidResults: InvalidResult<INVALID_TYPE>[]) {
    this.invalidResults = invalidResults;
  }

  public isValid(): boolean {
    return this.invalidResults.length === 0;
  }

  public static createValid<
    INVALID_TYPE extends string,
  >(): ValidationOutcome<INVALID_TYPE> {
    return new ValidationOutcome<INVALID_TYPE>([]);
  }

  public getInvalidResults(): InvalidResult<INVALID_TYPE>[] {
    if (this.isValid()) {
      throw new Error(
        `Cannot get InvalidResults for a valid ${this.constructor.name}`,
      );
    }

    return this.invalidResults;
  }
}

export type Validator<INPUT_TYPE, INVALID_TYPE extends string> = (
  input: INPUT_TYPE,
) => ValidationOutcome<INVALID_TYPE>;

export class InvalidOutcomeBuilder<INVALID_TYPE extends string> {
  private invalidResults: InvalidResult<INVALID_TYPE>[] = [];

  public addInvalidResult(
    invalidResult: InvalidResult<INVALID_TYPE>,
  ): InvalidOutcomeBuilder<INVALID_TYPE> {
    this.invalidResults.push(invalidResult);
    return this;
  }

  public addInvalidResults(
    invalidResults: NonEmptyArray<InvalidResult<INVALID_TYPE>>,
  ): InvalidOutcomeBuilder<INVALID_TYPE> {
    this.invalidResults.push(...invalidResults);
    return this;
  }

  public build(): ValidationOutcome<INVALID_TYPE> {
    return new ValidationOutcome<INVALID_TYPE>(this.invalidResults);
  }
}
