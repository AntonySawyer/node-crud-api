import { INTERNAL_ERROR_MESSAGE } from '../error';
import { AppError } from './appError';

export class InternalError extends AppError {
  constructor() {
    super(INTERNAL_ERROR_MESSAGE);
    this.name = 'InternalError';
  }
}
