export const PORT = 4000; // TODO
export const HOST = 'localhost';

export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export enum CONTENT_TYPE {
  APP_JSON = 'application/json',
}
