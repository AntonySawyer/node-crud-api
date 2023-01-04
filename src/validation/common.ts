import { validate as uuidValidate } from 'uuid';

import { FIELD_TYPE } from '../constants/main';
import { getRequiredErrorMessage, getSomethingWrongWithFieldErrorMessage } from '../utils/error';
import {
  INCORRECT_AGE_ERROR_MESSAGE,
  INVALID_UUID_ERROR_MESSAGE,
} from '../constants/error';
import { ValidationError } from '../constants/error/index';

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

export const validateFieldType = <TObject>(
  object: TObject,
  fieldName: keyof TObject,
  fieldType: FIELD_TYPE,
): void => {
  const fieldValue = object[fieldName];
  let isFieldTypeValid = false;

  switch (fieldType) {
    case FIELD_TYPE.ARRAY:
      isFieldTypeValid = Array.isArray(fieldValue);

      break;

    case FIELD_TYPE.NUMBER:
      isFieldTypeValid = typeof fieldValue === 'number';

      break;

    case FIELD_TYPE.STRING:
      isFieldTypeValid = typeof fieldValue === 'string';

      break;

    default:
      isFieldTypeValid = true;

      break;
  }

  if (!isFieldTypeValid) {
    const errorMessage = getSomethingWrongWithFieldErrorMessage(fieldName as string);

    throw new ValidationError(errorMessage);
  }
};

export const validateUuid = (uuid: string): void => {
  const isUuid = uuidValidate(uuid);

  if (!isUuid) {
    throw new ValidationError(INVALID_UUID_ERROR_MESSAGE);
  }
};

export const validateAge = (age: number, minAge: number): void => {
  const isValidAge = age >= minAge;

  if (!isValidAge) {
    const errorMessage = INCORRECT_AGE_ERROR_MESSAGE;

    throw new ValidationError(errorMessage);
  }
};
