import { validate as uuidValidate } from 'uuid';

import { INVALID_UUID_ERROR_MESSAGE } from '../../error/error.message';
import { ValidationError } from '../../error/errorInstance';

export const validateUuid = (uuid: string): void => {
  const isUuid = uuidValidate(uuid);

  if (!isUuid) {
    throw new ValidationError(INVALID_UUID_ERROR_MESSAGE);
  }
};
