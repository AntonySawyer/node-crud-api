import { getRequiredErrorMessage } from '../../error/error.message';
import { ValidationError } from '../../error/errorInstance';

const validateRequiredString = (value: string, fieldName: string): void => {
  const trimmedString = value.trim();
  const isTrimmedStringEmpty = trimmedString.length === 0;

  if (isTrimmedStringEmpty) {
    const errorMessage = getRequiredErrorMessage(fieldName);

    throw new ValidationError(errorMessage);
  }
};

export const validateRequiredField = <TObject>(
  object: TObject,
  fieldName: keyof TObject,
): void => {
  const fieldValue = object[fieldName];
  const isValueExist = fieldValue !== undefined;

  if (!isValueExist) {
    const errorMessage = getRequiredErrorMessage(fieldName as string);

    throw new ValidationError(errorMessage);
  }

  if (typeof fieldValue === 'string') {
    validateRequiredString(fieldValue, fieldName as string);
  }
};
