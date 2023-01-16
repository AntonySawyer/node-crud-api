import { ServerResponse } from 'http';

import {
  AppError,
  BadRequestError,
  NotFoundError,
  ValidationError,
} from '../../error/errorInstance';
import { CONTENT_TYPE, STATUS_CODE } from '../http.constants';
import { BAD_REQUEST_ERROR_MESSAGE, INTERNAL_ERROR_MESSAGE } from '../../error/error.message';
import { logger } from './logger';

export const combineResponse = <TBody>(response: ServerResponse, code: STATUS_CODE, body?: TBody): void => {
  response.setHeader('Content-Type', CONTENT_TYPE.APP_JSON);
  response.statusCode = code;

  if (body) {
    const serializedBody = JSON.stringify(body);

    response.setHeader('Content-Length', Buffer.from(serializedBody).length);
    response.end(serializedBody);
  } else {
    response.end();
  }
};

export const combineResponseWithError = (
  response: ServerResponse,
  error: AppError,
): void => {
  logger(error);
  let errorMessage: string = error.message || INTERNAL_ERROR_MESSAGE;
  let statusCode: STATUS_CODE = STATUS_CODE.INTERNAL_SERVER_ERROR;

  if (error instanceof NotFoundError) {
    statusCode = STATUS_CODE.NOT_FOUND;
  }

  if (error instanceof ValidationError) {
    statusCode = STATUS_CODE.BAD_REQUEST;
  }

  if (error instanceof BadRequestError) {
    statusCode = STATUS_CODE.BAD_REQUEST;
    errorMessage = BAD_REQUEST_ERROR_MESSAGE;
  }

  combineResponse(
    response,
    statusCode,
    {
      statusCode,
      message: errorMessage,
    },
  );
};
