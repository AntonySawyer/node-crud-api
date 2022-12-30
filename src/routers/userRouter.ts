import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

import { METHOD } from '../constants/main';
import * as UserConroller from '../controllers/userController';
import { ROUTE } from '../constants/routes';
import { IUser, IUserRouteArguments } from '../interface/user';
import { getRequestBody } from '../utils/requestBody';
import { IRouter } from '../interface/main';

class UserRouter implements IRouter {
  private routerBase = ROUTE.USERS;

  async processRequest(request: IncomingMessage, response: ServerResponse) {
    const { pathname } = url.parse(request.url as string);

    const { userId } = this.parseRouteIfValidOrThrowError(pathname as string);

    const body = await getRequestBody<IUser>(request);

    // TODO - validate uuid
    const isUuid = true;

    if (userId && !isUuid) {
      // TODO: throw error
    }

    switch (request.method) {
      case METHOD.GET:
        if (userId) {
          UserConroller.getUserById(response, userId);

          break;
        }

        UserConroller.getAllUsers(response);

        break;

      case METHOD.POST:
        if (body) {
          UserConroller.createUser(response, body);
        } else {
          // TODO: throw error
        }

        break;

      case METHOD.PUT:
        if (body) {
          UserConroller.updateUser(response, body);
        } else {
          // TODO: throw error
        }

        break;

      case METHOD.DELETE:
        UserConroller.deleteUserById(response, userId);

        break;

      default:
        // TODO: throw error
        break;
    }
  }

  private isValidRoute(requestBase: string, uselessArgs?: string[]): boolean {
    const isRequestHasUselessArguments = uselessArgs?.length !== 0;

    if (isRequestHasUselessArguments) {
      return false;
    }

    return requestBase === this.routerBase;
  }

  private parseRouteIfValidOrThrowError(pathname: string): IUserRouteArguments {
    const [, baseUrl, userRoute, userId, ...rest] = pathname.split('/');
    const requestBase = `${baseUrl}/${userRoute}`;

    const isValidRoute = this.isValidRoute(requestBase, rest);

    if (isValidRoute) {
      // TODO: throw error
    }

    return {
      userId,
    };
  }
}

const userRouter = new UserRouter();

export default userRouter;
