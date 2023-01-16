import { INCORRECT_AGE_ERROR_MESSAGE } from '../../error/messages';
import { ValidationError } from '../../error/errorInstance';

export const validateAge = (age: number, minAge: number): void => {
  const isValidAge = age >= minAge;

  if (!isValidAge) {
    const errorMessage = INCORRECT_AGE_ERROR_MESSAGE;

    throw new ValidationError(errorMessage);
  }
};
