import { FIELD_TYPE } from '../constants/main';

export const getRequiredErrorMessage = (fieldName: string): string => (
  `Field ${fieldName} is required.`
);

export const getIncorrectFieldTypeErrorMessage = (fieldName: string, fieldType: FIELD_TYPE): string => (
  `Type of field '${fieldName}' is wrong. It's should be ${fieldType}.`
);

export const getIncorrectArrayElementTypeErrorMessage = (fieldName: string, fieldType: FIELD_TYPE): string => (
  `Array field '${fieldName}' contain some elements with incorrect type. It's should be an array of ${fieldType}.`
);
