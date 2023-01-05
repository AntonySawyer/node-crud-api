import { RequestListener } from 'http';

import { AppError } from '../shared/error/errorInstance';
import { combineResponseWithError } from '../shared/server/utils/combineResponse';
import { navigateRequestToComponentRouter } from './navigateRequestToComponentRouter';

export const requestListenerWithErrorHandling: RequestListener = async (request, response) => {
  try {
    navigateRequestToComponentRouter(request, response);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};
