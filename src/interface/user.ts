export interface IUserForm {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUser extends IUserForm {
  id: string;
}

export interface IUserRouteArguments {
  userId: string;
}
