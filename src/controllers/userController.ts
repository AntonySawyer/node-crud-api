import { ServerResponse } from 'http';

import storage from '../storage/userStorage';
import { STATUS_CODE } from '../constants/main';
import { IUser, IUserForm } from '../interface/user';
import { combineResponse } from '../utils/combineResponse';

export const getAllUsers = (response: ServerResponse): void => {
  const users: IUser[] = storage.getUsers();

  combineResponse(response, STATUS_CODE.OK, users);
};

export const getUserById = (response: ServerResponse, id: IUser['id']): void => {
  const user = storage.getUserById(id);

  if (user) {
    combineResponse(response, STATUS_CODE.OK, user);
  } else {
    combineResponse(response, STATUS_CODE.NOT_FOUND); // TODO: message
  }
};

export const createUser = (response: ServerResponse, newUser: IUserForm): void => {
  const user = storage.createUser(newUser);

  combineResponse(response, STATUS_CODE.OK, user);
};

export const updateUser = (response: ServerResponse, userId: IUser['id'], updatedUser: IUser): void => {
  const user = storage.updateUser(userId, updatedUser);

  combineResponse(response, STATUS_CODE.OK, user);
};

export const deleteUserById = (response: ServerResponse, id: IUser['id']): void => {
  storage.deleteUserById(id);

  combineResponse(response, STATUS_CODE.NO_CONTENT);
};
