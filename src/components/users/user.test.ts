import { Server } from 'http';
import supertest from 'supertest';
import { v4 as uuidv4 } from 'uuid';

import { runApp } from '../../app/app';
import { IUserRequest, IUserResponse } from './interface';

let server: Server;
let request: supertest.SuperTest<supertest.Test>;

beforeEach(() => {
  server = runApp();
  request = supertest(server);
});

afterEach(() => {
  server.close();
});

const createUser = async (): Promise<IUserResponse> => {
  const userRequest: IUserRequest = {
    age: 1,
    hobbies: [],
    username: 'Test',
  };

  const user: IUserResponse = await (await request.post('/api/users').send(userRequest)).body;

  return user;
};

describe('Users', () => {
  describe('GET `api/users`', () => {
    test('should return empty array after init app', async () => {
      const response = (await request.get('/api/users'));

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });

    test('should return array with users if exist', async () => {
      const userRequest: IUserRequest = {
        age: 1,
        hobbies: [],
        username: 'Test',
      };

      await request.post('/api/users').send(userRequest);

      const response = (await request.get('/api/users'));

      expect(response.body.length).toEqual(1);

      const createdUser = response.body[0];

      expect(createdUser).toHaveProperty('id');

      const { id, ...createrUserWithoutId } = createdUser;

      expect(response.statusCode).toEqual(200);
      expect(createrUserWithoutId).toEqual({
        age: 1,
        hobbies: [],
        username: 'Test',
      });
    });
  });

  describe('GET `api/users/:id`', () => {
    test('valid id - should return user object', async () => {
      const user = await createUser();

      const response = (await request.get(`/api/users/${user.id}`));

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        ...user,
      });
    });

    test('invalid id - should return error', async () => {
      const response = (await request.get('/api/users/invalid-id'));

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        message: 'Id format is wrong.',
        statusCode: 400,
      });
    });

    test('user not exist - should return error', async () => {
      const uuid = uuidv4();
      const response = (await request.get(`/api/users/${uuid}`));

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({
        message: 'Server cannot find the requested resource.',
        statusCode: 404,
      });
    });
  });

  describe('POST `api/users` should create user', () => {
    test('valid data - should return new user with `id`', async () => {
      const userRequest: IUserRequest = {
        age: 1,
        hobbies: [],
        username: 'Test',
      };

      const response = await request.post('/api/users').send(userRequest);

      expect(response.body).toHaveProperty('id');

      const { id, ...createrUserWithoutId } = response.body;

      expect(response.statusCode).toEqual(201);
      expect(createrUserWithoutId).toEqual({
        age: 1,
        hobbies: [],
        username: 'Test',
      });
    });

    test('invalid data - should return error', async () => {
      const userRequest = {
        hobbies: [],
        username: 'Test',
      } as unknown as IUserRequest;

      const response = await request.post('/api/users').send(userRequest);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        message: 'Field age is required.',
        statusCode: 400,
      });
    });
  });

  describe('PUT `api/users/:id`', () => {
    test('valid data - should return updated user object', async () => {
      const user = await createUser();

      const userRequest: IUserRequest = {
        age: 2,
        hobbies: [],
        username: 'Test',
      };

      const response = await request.put(`/api/users/${user.id}`).send(userRequest);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        id: user.id,
        ...userRequest,
      });
    });

    test('invalid data - should return error', async () => {
      const user = await createUser();

      const userRequest = {
        age: 'age',
        hobbies: [],
        username: 'Test',
      } as unknown as IUserRequest;

      const response = await request.put(`/api/users/${user.id}`).send(userRequest);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        message: 'Type of field \'age\' is wrong. It\'s should be NUMBER.',
        statusCode: 400,
      });
    });

    test('invalid id - should return error', async () => {
      const response = (await request.put('/api/users/invalid-id'));

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        // eslint-disable-next-line max-len
        message: 'Server cannot or will not process the request due to something that is perceived to be a client error.',
        statusCode: 400,
      });
    });

    test('user with passed `id` not exist - should return error', async () => {
      const uuid = uuidv4();
      const userRequest: IUserRequest = {
        age: 2,
        hobbies: [],
        username: 'Test',
      };

      const response = await request.put(`/api/users/${uuid}`).send(userRequest);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toEqual({
        message: 'Server cannot find the requested resource.',
        statusCode: 404,
      });
    });
  });

  describe('DELETE `api/users/:id`', () => {
    test('valid id - should remove user and this `id` will return 404 later', async () => {
      const user = await createUser();
      const { id: idToDelete } = user;
      const response = await request.delete(`/api/users/${idToDelete}`);

      expect(response.statusCode).toEqual(204);

      const userByIdResponse = (await request.get(`/api/users/${user.id}`));

      expect(userByIdResponse.body).toEqual({
        message: 'Server cannot find the requested resource.',
        statusCode: 404,
      });
    });

    test('invalid id - should return error', async () => {
      const idToDelete = 'invalid-id';
      const response = await request.delete(`/api/users/${idToDelete}`);

      expect(response.body).toEqual({
        message: 'Id format is wrong.',
        statusCode: 400,
      });
    });

    test('user with passed `id` not exist - should return error', async () => {
      const uuid = uuidv4();
      const response = await request.delete(`/api/users/${uuid}`);

      expect(response.body).toEqual({
        message: 'Server cannot find the requested resource.',
        statusCode: 404,
      });
    });
  });
});
