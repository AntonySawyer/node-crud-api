import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

import { METHOD } from '../constants/main';
import * as UserConroller from '../controllers/userController';
import { ROUTE } from '../constants/routes';
import { IUser, IUserRouteArguments } from '../interface/user';
import { getRequestBody } from '../utils/requestBody';
import { IRouter } from '../interface/main';
import userValidatorInstance from '../validation/UserValidator';
import { combineResponseWithError } from '../utils/combineResponse';
import { COMMON_ERROR_MESSAGE } from '../constants/error';
import { BadRequestError, NotFoundError, ValidationError } from '../constants/error/index';

class UserRouter implements IRouter {
  private routerBase = ROUTE.USERS;

  async processRequest(request: IncomingMessage, response: ServerResponse) {
    const { pathname } = url.parse(request.url as string);

    const routeArgs = await this.parseRouteIfValidOrReturnError(pathname as string, response);
    const canContinueProcessing = routeArgs !== null;

    if (!canContinueProcessing) {
      return;
    }

    const { userId } = routeArgs as IUserRouteArguments;

    if (userId) {
      try {
        await userValidatorInstance.validateUserId(userId);
      } catch (error) {
        combineResponseWithError(
          response,
          error as ValidationError,
        );

        return;
      }
    }

    const body = await getRequestBody<IUser>(request);

    switch (request.method) {
      case METHOD.GET:
        if (userId) {
          UserConroller.getUserByIdOrThrowNotFound(response, userId);

          break;
        }

        UserConroller.getAllUsers(response);

        break;

      case METHOD.POST:
        if (body) {
          UserConroller.createUser(response, body);
        } else {
          combineResponseWithError(
            response,
            new BadRequestError(COMMON_ERROR_MESSAGE),
          );
        }

        break;

      case METHOD.PUT:
        if (userId && body) {
          UserConroller.updateUser(response, userId, body);
        } else {
          combineResponseWithError(
            response,
            new BadRequestError(COMMON_ERROR_MESSAGE),
          );
        }

        break;

      case METHOD.DELETE:
        UserConroller.deleteUserById(response, userId);

        break;

      default:
        combineResponseWithError(
          response,
          new BadRequestError(COMMON_ERROR_MESSAGE),
        );
    }
  }

  private isValidRoute(requestBase: string, uselessArgs?: string[]): boolean {
    const isRequestHasUselessArguments = uselessArgs?.length !== 0;

    if (isRequestHasUselessArguments) {
      return false;
    }

    return requestBase === this.routerBase;
  }

  private async parseRouteIfValidOrReturnError(
    pathname: string,
    response: ServerResponse,
  ): Promise<IUserRouteArguments | null> {
    const [, baseUrl, userRoute, userId, ...rest] = pathname.split('/');
    const requestBase = `${baseUrl}/${userRoute}`;

    const isValidRoute = this.isValidRoute(requestBase, rest);

    if (!isValidRoute) {
      combineResponseWithError(
        response,
        new NotFoundError(),
      );

      return null;
    }

    return {
      userId,
    };
  }
}

const userRouter = new UserRouter();

export default userRouter;
