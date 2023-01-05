import { BAD_REQUEST_ERROR_MESSAGE } from '../error.message';
import { AppError } from './appError';

export class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message || BAD_REQUEST_ERROR_MESSAGE);
    this.name = 'BadRequestError';
  }
}
