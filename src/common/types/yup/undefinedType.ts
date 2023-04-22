import { array, boolean, number, object, string } from 'yup';

export const UndefinedArrayType = array().nullable(false).oneOf([undefined]);
export const UndefinedBooleanType = boolean()
  .nullable(false)
  .oneOf([undefined]);
export const UndefinedNumberType = number().nullable(false).oneOf([undefined]);
export const UndefinedObjectType = object().nullable(false).oneOf([undefined]);
export const UndefinedStringType = string().nullable(false).oneOf([undefined]);
