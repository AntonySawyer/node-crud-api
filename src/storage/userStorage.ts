import { v4 as uuidv4 } from 'uuid';

import { IUserResponse, IUserRequest } from '../interface/user';
import { AppError, NotFoundError, InternalError } from '../constants/error/index';
import { COMMON_ERROR_MESSAGE } from '../constants/error';

type UserStorageInitial = {
  users?: IUserResponse[];
};

class UserStorageInterface {
  constructor(parameters?: UserStorageInitial) {
    this.users = parameters?.users ?? [];
  }

  private users;

  public async getUsers(): Promise<IUserResponse[]> {
    if (this.users) {
      return this.users;
    }

    throw new InternalError();
  }

  public async getUserByIdOrThrowNotFound(id: string): Promise<IUserResponse | null> {
    const user = this.users.find((userItem) => userItem.id === id);

    if (user) {
      return user;
    }

    throw new NotFoundError();
  }

  public async createUser(newUser: IUserRequest): Promise<IUserResponse> {
    try {
      const uuid = uuidv4();
      const user: IUserResponse = {
        ...newUser,
        id: uuid,
      };

      this.users.push(user);

      return user;
    } catch (error) {
      throw new AppError(COMMON_ERROR_MESSAGE);
    }
  }

  public async updateUser(userId: string, userToUpdate: IUserRequest): Promise<IUserResponse> {
    await this.getUserByIdOrThrowNotFound(userId);

    const updatedUser: IUserResponse = {
      id: userId,
      ...userToUpdate,
    };

    const updatedUsers = this.users.map((userItem) => {
      if (userItem.id === userId) {
        return updatedUser;
      }

      return userItem;
    });

    this.users = updatedUsers;

    return updatedUser;
  }

  public async deleteUserById(id: string): Promise<void> {
    await this.getUserByIdOrThrowNotFound(id);

    const usersWithoutDeleted = this.users.filter((userItem) => userItem.id !== id);

    this.users = usersWithoutDeleted;
  }
}

const userStorage = new UserStorageInterface();

export default userStorage;
