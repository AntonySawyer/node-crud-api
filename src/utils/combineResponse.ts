import { ServerResponse } from 'http';

import { CONTENT_TYPE, STATUS_CODE } from '../constants/main';

export const combineResponse = <TBody>(response: ServerResponse, code: STATUS_CODE, body?: TBody): void => {
  response.setHeader('Content-Type', CONTENT_TYPE.APP_JSON);
  response.statusCode = code;

  if (body) {
    response.end(JSON.stringify(body));
  } else {
    response.end();
  }
};
