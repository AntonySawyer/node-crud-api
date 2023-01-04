import { v4 as uuidv4 } from 'uuid';

import { IUser, IUserForm } from '../interface/user';
import { AppError, NotFoundError } from '../constants/error/index';
import { COMMON_ERROR_MESSAGE } from '../constants/error';

type UserStorageInitial = {
  users?: IUser[];
};

class UserStorageInterface {
  constructor(parameters?: UserStorageInitial) {
    this.users = parameters?.users ?? [];
  }

  private users;

  public async getUsers(): Promise<IUser[]> {
    if (this.users) {
      return this.users;
    }

    throw new AppError(COMMON_ERROR_MESSAGE);
  }

  public async getUserByIdOrThrowNotFound(id: string): Promise<IUser | null> {
    const user = this.users.find((userItem) => userItem.id === id);

    if (user) {
      return user;
    }

    throw new NotFoundError();
  }

  public async createUser(newUser: IUserForm): Promise<IUser> {
    try {
      const uuid = uuidv4();
      const user: IUser = {
        ...newUser,
        id: uuid,
      };

      this.users.push(user);

      return user;
    } catch (error) {
      throw new AppError(COMMON_ERROR_MESSAGE);
    }
  }

  public async updateUser(userId: string, userToUpdate: IUserForm): Promise<IUser> {
    await this.getUserByIdOrThrowNotFound(userId);

    const updatedUser: IUser = {
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
