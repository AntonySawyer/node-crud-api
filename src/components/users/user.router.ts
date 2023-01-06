import { METHOD } from '../../shared/server/http.constants';
import { ROUTE } from '../../shared/server/routes';
import { IRouteDefinition } from '../../shared/server/router.interface';
import Router from '../../shared/server/router';
import { USER_ROUTE_ARG } from './user.constants';
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUser,
} from './user.controller';

const USER_ROUTES_MAP: IRouteDefinition[] = [
  {
    basePath: ROUTE.USERS,
    execute: getUserById,
    method: METHOD.GET,
    pathParts: [USER_ROUTE_ARG.ID],
    shouldHaveBody: false,
  },
  {
    basePath: ROUTE.USERS,
    execute: getAllUsers,
    method: METHOD.GET,
    shouldHaveBody: false,
  },
  {
    basePath: ROUTE.USERS,
    execute: createUser,
    method: METHOD.POST,
    shouldHaveBody: true,
  },
  {
    basePath: ROUTE.USERS,
    execute: updateUser,
    method: METHOD.PUT,
    pathParts: [USER_ROUTE_ARG.ID],
    shouldHaveBody: true,
  },
  {
    basePath: ROUTE.USERS,
    execute: deleteUserById,
    method: METHOD.DELETE,
    pathParts: [USER_ROUTE_ARG.ID],
    shouldHaveBody: false,
  },
];

export const prepareUserRoutes = (appRouter: Router) => {
  USER_ROUTES_MAP.forEach((route) => {
    appRouter.addRoute(route);
  });
};
