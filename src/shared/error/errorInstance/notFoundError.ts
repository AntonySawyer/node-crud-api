import { NOT_FOUND_ERROR_MESSAGE } from '../messages';
import { AppError } from './appError';

export class NotFoundError extends AppError {
  constructor() {
    super(NOT_FOUND_ERROR_MESSAGE);
    this.name = 'NotFoundError';
  }
}
