import { Int } from '@tofu-apis/common-types';
import { Documentable } from './documentable';
import { RestrictionType } from '../types/validation';

export interface Restriction {
  type: RestrictionType;
}

export interface RangeRestriction<T> extends Documentable, Restriction {
  bounds: [T, T];
  isMinimumExclusive: boolean;
  isMaximumExclusive: boolean;
  type: RestrictionType.Range;
}

/*
 Size restrictions are always inclusive to prevent off by one errors to enforce intentionality of bounds.
 */
export interface SizeRestriction extends Documentable, Restriction {
  bounds: [Int, Int];
  type: RestrictionType.Size;
}

interface AllowableValue<T> extends Documentable {
  value: T;
}

export interface SetRestriction<T> extends Restriction {
  allowedValues: AllowableValue<T>[];
  type: RestrictionType.Set;
}

export interface PredicateRestriction<T> extends Restriction {
  predicate: (t: T) => boolean;
  type: RestrictionType.Predicate;
}

/*
 Integer restrictions are always inclusive to prevent off by one errors to enforce intentionality of bounds.

 For example, if you wanted to specify an integer range from 0 up to 5 but not including 5,
 you can simply create an inclusive range from 0 to 4, removing confusion of 5 as an exclusive bounds.
 */
export interface IntegerRangeRestriction extends RangeRestriction<Int> {
  isMinimumExclusive: false;
  isMaximumExclusive: false;
}
/*
 Range restrictions are allowed to have exclusive bounds since the float ranges are continuous,
 and there is no way to specify excluding a certain limit.

 For example, if you wanted to specify seconds up to but not including a minute, this could only be done
 via exclusive maximum at 60 seconds since it is reasonable to create a limit of 59.9...
 */
export interface FloatRangeRestriction extends RangeRestriction<number> {
  isMinimumExclusive: boolean;
  isMaximumExclusive: boolean;
}

export type StringSetRestriction = SetRestriction<string>;
export type IntegerSetRestriction = SetRestriction<Int>;

export type StringSizeRestriction = SizeRestriction;
export type ArraySizeRestriction = SizeRestriction;

export type StringRestriction =
  | PredicateRestriction<string>
  | StringSetRestriction
  | StringSizeRestriction;
export type FloatRestriction =
  | FloatRangeRestriction
  | PredicateRestriction<number>;
export type IntegerRestriction =
  | IntegerRangeRestriction
  | IntegerSetRestriction
  | PredicateRestriction<Int>;
export type ArrayRestriction = ArraySizeRestriction;
