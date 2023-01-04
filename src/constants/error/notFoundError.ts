import { NOT_FOUND_ERROR_MESSAGE } from '../error';
import { AppError } from './appError';

export class NotFoundError extends AppError {
  constructor() {
    super(NOT_FOUND_ERROR_MESSAGE);
    this.name = 'NotFoundError';
  }
}
