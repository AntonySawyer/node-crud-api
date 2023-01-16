export interface IUserRequest {
  username: string;
  age: number;
  hobbies: string[];
}

export interface IUserResponse extends IUserRequest {
  id: string;
}

export interface IUserRouteArguments {
  userId: string;
}
