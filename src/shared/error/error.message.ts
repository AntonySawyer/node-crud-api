import { FIELD_TYPE } from '../validation/validation.constants';

/* eslint-disable max-len */
export const BAD_REQUEST_ERROR_MESSAGE = 'Server cannot or will not process the request due to something that is perceived to be a client error.';
export const NOT_FOUND_ERROR_MESSAGE = 'Server cannot find the requested resource.';
export const INTERNAL_ERROR_MESSAGE = 'Server encountered an unexpected condition that prevented it from fulfilling the request.';

export const COMMON_ERROR_MESSAGE = 'Something went wrong.';

export const INVALID_UUID_ERROR_MESSAGE = 'Id format is wrong.';
export const INCORRECT_AGE_ERROR_MESSAGE = 'Incorrect age value.';
/* eslint-enable max-len */

export const getRequiredErrorMessage = (fieldName: string): string => (
  `Field ${fieldName} is required.`
);

export const getIncorrectFieldTypeErrorMessage = (fieldName: string, fieldType: FIELD_TYPE): string => (
  `Type of field '${fieldName}' is wrong. It's should be ${fieldType}.`
);

export const getIncorrectArrayElementTypeErrorMessage = (fieldName: string, fieldType: FIELD_TYPE): string => (
  `Array field '${fieldName}' contain some elements with incorrect type. It's should be an array of ${fieldType}.`
);
