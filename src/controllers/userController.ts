import { ServerResponse } from 'http';
import { STATUS_CODE } from '../constants/main';
import { IUser, IUserForm } from '../interface/user';
import { combineResponse } from '../utils/combineResponse';

export const getAllUsers = (response: ServerResponse): void => {
  console.log('get all users');

  const users: IUser[] = [];

  combineResponse(response, STATUS_CODE.OK, users);
};

export const getUserById = (response: ServerResponse, id: IUser['id']): void => {
  console.log(`GET user with id ${id}`);

  const user = {
    age: 18,
    hobbies: [],
    id: '123123123',
    username: 'username',
  };

  if (user) {
    combineResponse(response, STATUS_CODE.OK, user);
  } else {
    combineResponse(response, STATUS_CODE.NOT_FOUND); // TODO: message
  }
};

export const createUser = (response: ServerResponse, newUser: IUserForm): void => {
  console.log('create user');

  const user = {
    ...newUser,
    id: '123123123',
  };

  combineResponse(response, STATUS_CODE.OK, user);
};

export const updateUser = (response: ServerResponse, updatedUser: IUser): void => {
  console.log('update user');

  const user = updatedUser;

  combineResponse(response, STATUS_CODE.OK, user);
};

export const deleteUserById = (response: ServerResponse, id: IUser['id']): void => {
  console.log('delete user', id);

  combineResponse(response, STATUS_CODE.NO_CONTENT);
};
