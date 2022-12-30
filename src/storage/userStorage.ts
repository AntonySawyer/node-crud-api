import { IUser, IUserForm } from '../interface/user';

type UserStorageInitial = {
  users?: IUser[];
};

class UserStorageInterface {
  constructor(parameters?: UserStorageInitial) {
    this.users = parameters?.users ?? [];
  }

  private users;

  public getUsers(): IUser[] {
    return this.users;
  }

  public getUserById(id: IUser['id']): IUser | null {
    const user = this.users.find((userItem) => userItem.id === id);

    if (user) {
      return user;
    }

    return null;
    // TODO: 404
  }

  public createUser(newUser: IUserForm): IUser {
    const uuid = (this.users.length + 1).toString(); // TODO: replace with uuid library
    const user: IUser = {
      ...newUser,
      id: uuid,
    };

    this.users.push(user);

    return user;
  }

  public updateUser(userId: IUser['id'], userToUpdate: IUserForm): IUser {
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

  public deleteUserById(id: IUser['id']): void {
    const usersWithoutDeleted = this.users.filter((userItem) => userItem.id !== id);

    this.users = usersWithoutDeleted;
  }
}

const userStorage = new UserStorageInterface();

export default userStorage;
