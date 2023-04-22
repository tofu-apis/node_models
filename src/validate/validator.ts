// Currently, there isn't a clear way to enforce an type to be an enum string type so using extension of a string instead.
export interface InvalidResult<INVALID_TYPE extends string> {
  type: INVALID_TYPE;
  reason: string;
}

export class ValidationResult<INVALID_TYPE extends string> {
  private invalidResult: InvalidResult<INVALID_TYPE> | undefined;

  constructor(invalidResult: InvalidResult<INVALID_TYPE> | undefined) {
    this.invalidResult = invalidResult;
  }

  public isValid(): boolean {
    return this.invalidResult === undefined;
  }

  public static createValid<
    INVALID_TYPE extends string,
  >(): ValidationResult<INVALID_TYPE> {
    return new ValidationResult<INVALID_TYPE>(undefined);
  }

  public getInvalidResult(): InvalidResult<INVALID_TYPE> {
    if (this.invalidResult === undefined) {
      throw new Error(
        `Cannot get InvalidResult for a valid ${this.constructor.name}}`,
      );
    }

    return this.invalidResult;
  }
}

export type Validator<INPUT_TYPE, INVALID_TYPE extends string> = (
  input: INPUT_TYPE,
) => ValidationResult<INVALID_TYPE>;
