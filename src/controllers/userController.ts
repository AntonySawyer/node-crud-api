import { ServerResponse } from 'http';

import storage from '../storage/userStorage';
import { STATUS_CODE } from '../constants/main';
import { IUserResponse, IUserRequest } from '../interface/user';
import { combineResponse, combineResponseWithError } from '../utils/combineResponse';
import userValidatorInstance from '../validation/UserValidator';
import { NotFoundError, AppError } from '../constants/error/index';

export const getAllUsers = async (response: ServerResponse): Promise<void> => {
  try {
    const users: IUserResponse[] = await storage.getUsers();

    combineResponse(response, STATUS_CODE.OK, users);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const getUserByIdOrThrowNotFound = async (response: ServerResponse, id: string): Promise<void> => {
  try {
    await userValidatorInstance.validateUserId(id);

    const user = await storage.getUserByIdOrThrowNotFound(id);

    combineResponse(response, STATUS_CODE.OK, user);
  } catch (error) {
    combineResponseWithError(response, error as NotFoundError);
  }
};

export const createUser = async (response: ServerResponse, newUser: IUserRequest): Promise<void> => {
  try {
    await userValidatorInstance.validateUserForCreation(newUser);

    const user = await storage.createUser(newUser);

    combineResponse(response, STATUS_CODE.OK, user);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const updateUser = async (
  response: ServerResponse,
  userId: string,
  updatedUser: IUserRequest,
): Promise<void> => {
  try {
    await userValidatorInstance.validateUserForUpdate(updatedUser, userId);

    const user = await storage.updateUser(userId, updatedUser);

    combineResponse(response, STATUS_CODE.OK, user);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

export const deleteUserById = async (response: ServerResponse, id: string): Promise<void> => {
  try {
    await userValidatorInstance.validateUserId(id);
    await storage.deleteUserById(id);

    combineResponse(response, STATUS_CODE.NO_CONTENT);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};
