import { array, boolean, number, object, string } from 'yup';

export const NullableArrayType = array().required().nullable();
export const NullableBooleanType = boolean().required().nullable();
export const NullableNumberType = number().required().nullable();
export const NullableObjectType = object().required().nullable();
export const NullableStringType = string().required().nullable();
