import { ServerResponse } from 'http';

import {
  AppError,
  BadRequestError,
  NotFoundError,
  ValidationError,
} from '../constants/error/index';
import { CONTENT_TYPE, STATUS_CODE } from '../constants/main';
import { INTERNAL_ERROR_MESSAGE } from '../constants/error';

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
  // console.error(error);
  const errorMessage: string = error.message || INTERNAL_ERROR_MESSAGE;
  let statusCode: STATUS_CODE = STATUS_CODE.INTERNAL_SERVER_ERROR;

  if (error instanceof NotFoundError) {
    statusCode = STATUS_CODE.NOT_FOUND;
  }

  if (error instanceof ValidationError) {
    statusCode = STATUS_CODE.BAD_REQUEST;
  }

  if (error instanceof BadRequestError) {
    statusCode = STATUS_CODE.BAD_REQUEST;
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
