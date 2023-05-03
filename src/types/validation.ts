export enum RestrictionType {
  Range = 'range',
  Size = 'size',
  Set = 'set',
  Predicate = 'predicate',
}

export enum ValidationErrorType {
  UnexpectedTypeRestriction = 'UnexpectedTypeRestriction',
  UnexpectedFieldRestriction = 'UnexpectedFieldRestriction',
  NonNullRestriction = 'NonNullRestriction',
  RequiredRestriction = 'RequiredRestriction',
  RangeRestriction = 'RangeRestriction',
  SizeRestriction = 'SizeRestriction',
  SetRestriction = 'SetRestriction',
  PredicateRestriction = 'PredicateRestriction',
}
