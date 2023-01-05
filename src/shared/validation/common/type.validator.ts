import { getIncorrectArrayElementTypeErrorMessage, getIncorrectFieldTypeErrorMessage } from '../../error/error.message';
import { ValidationError } from '../../error/errorInstance';
import { FIELD_TYPE } from '../validation.constants';

const validateType = <TValue>(value: TValue, type: FIELD_TYPE): boolean => {
  let isFieldTypeValid = false;

  switch (type) {
    case FIELD_TYPE.ARRAY:
      isFieldTypeValid = Array.isArray(value);

      break;

    case FIELD_TYPE.NUMBER:
      isFieldTypeValid = typeof value === 'number';

      break;

    case FIELD_TYPE.STRING:
      isFieldTypeValid = typeof value === 'string';

      break;

    default:
      isFieldTypeValid = true;

      break;
  }

  return isFieldTypeValid;
};

export const validateFieldType = <TObject>(
  object: TObject,
  fieldName: keyof TObject,
  fieldType: FIELD_TYPE,
): void => {
  const fieldValue = object[fieldName];
  const isFieldTypeValid = validateType(fieldValue, fieldType);

  if (!isFieldTypeValid) {
    const errorMessage = getIncorrectFieldTypeErrorMessage(fieldName as string, fieldType);

    throw new ValidationError(errorMessage);
  }
};

export const validateArrayElementsType = <TArrayEl>(array: TArrayEl[], expectedType: FIELD_TYPE, fieldName: string) => {
  const someElementHaveWrongType = array.some((element) => {
    const isValueHaveValidType = validateType(element, expectedType);

    return !isValueHaveValidType;
  });

  if (someElementHaveWrongType) {
    const errorMessage = getIncorrectArrayElementTypeErrorMessage(fieldName as string, expectedType);

    throw new ValidationError(errorMessage);
  }
};
