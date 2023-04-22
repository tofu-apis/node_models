import { number } from 'yup';

export const UnixTimestamp = number().integer().positive();
