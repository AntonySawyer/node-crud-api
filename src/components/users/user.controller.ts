import { ServerResponse } from 'http';

import storage from './user.storage';
import { STATUS_CODE } from '../../shared/server/http.constants';
import { IUserResponse, IUserRequest } from './user.interface';
import { combineResponse, combineResponseWithError } from '../../shared/server/utils/combineResponse';
import userValidatorInstance from './user.validator';
import { NotFoundError, AppError, BadRequestError } from '../../shared/error/errorInstance';
import { getRequestBody } from '../../shared/server/utils/requestBody';
import { getUserIdFromRequest } from './user.utils';
import { IClientIncomingMessage } from '../../shared/server/server.interface';

export const getAllUsers = async (request: IClientIncomingMessage, response: ServerResponse): Promise<void> => {
  try {
    const users: IUserResponse[] = await storage.getUsers();

    combineResponse(response, STATUS_CODE.OK, users);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const getUserById = async (request: IClientIncomingMessage, response: ServerResponse): Promise<void> => {
  const id = getUserIdFromRequest(request);

  try {
    await userValidatorInstance.validateUserId(id);

    const user = await storage.getUserByIdOrThrowNotFound(id);

    combineResponse(response, STATUS_CODE.OK, user);
  } catch (error) {
    combineResponseWithError(response, error as NotFoundError);
  }
};

export const createUser = async (request: IClientIncomingMessage, response: ServerResponse): Promise<void> => {
  const body = await getRequestBody<IUserRequest>(request);

  try {
    if (body === null) {
      throw new BadRequestError();
    }

    await userValidatorInstance.validateUserForCreation(body);

    const user = await storage.createUser(body);

    combineResponse(response, STATUS_CODE.CREATED, user);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const updateUser = async (request: IClientIncomingMessage, response: ServerResponse): Promise<void> => {
  const id = getUserIdFromRequest(request);

  const body = await getRequestBody<IUserRequest>(request);

  try {
    if (body === null) {
      throw new BadRequestError();
    }

    await userValidatorInstance.validateUserForUpdate(body, id);

    const user = await storage.updateUser(id, body);

    combineResponse(response, STATUS_CODE.OK, user);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const deleteUserById = async (request: IClientIncomingMessage, response: ServerResponse): Promise<void> => {
  const id = getUserIdFromRequest(request);

  try {
    await userValidatorInstance.validateUserId(id);
    await storage.deleteUserById(id);

    combineResponse(response, STATUS_CODE.NO_CONTENT);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};
