import { v4 as uuidv4 } from 'uuid';

import { IUserResponse, IUserRequest } from './interface';
import { AppError, InternalError } from '../../shared/error/errorInstance';
import { COMMON_ERROR_MESSAGE } from '../../shared/error/messages';
import { IGenericRepository } from '../../shared/storage/interface';
import { GenericRepository } from '../../shared/storage/repository';

type UserStorageInitial = {
  storage: IGenericRepository<IUserResponse>;
  initialUsers?: IUserResponse[];
};

class UserStorageInterface {
  constructor({ storage, initialUsers }: UserStorageInitial) {
    this.storage = storage;

    if (initialUsers) {
      initialUsers.forEach((initialUser) => {
        this.storage.create(initialUser.id, initialUser);
      });
    }
  }

  private storage: IGenericRepository<IUserResponse>;

  public async getUsers(): Promise<IUserResponse[]> {
    const users = await this.storage.find();

    if (users) {
      return users;
    }

    throw new InternalError();
  }

  public async getUserByIdOrThrowNotFound(id: string): Promise<IUserResponse | undefined> {
    const user = await this.storage.findById(id);

    return user;
  }

  public async createUser(newUser: IUserRequest): Promise<IUserResponse> {
    try {
      const uuid = uuidv4();
      const { age, hobbies, username } = newUser;

      const user: IUserResponse = {
        age,
        hobbies,
        username,
        id: uuid,
      };

      await this.storage.create(uuid, user);

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

    await this.storage.updateById(userId, updatedUser);

    return updatedUser;
  }

  public async deleteUserById(id: string): Promise<void> {
    await this.getUserByIdOrThrowNotFound(id);

    await this.storage.removeById(id);
  }
}

const userRepository = new GenericRepository<IUserResponse>();
const userStorage = new UserStorageInterface({
  storage: userRepository,
  initialUsers: [],
});

export default userStorage;
