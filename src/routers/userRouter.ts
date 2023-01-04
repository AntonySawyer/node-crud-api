import { IncomingMessage, ServerResponse } from 'http';
import url from 'url';

import { METHOD } from '../constants/main';
import * as UserConroller from '../controllers/userController';
import { ROUTE } from '../constants/routes';
import { IUserRequest, IUserRouteArguments } from '../interface/user';
import { getRequestBody } from '../utils/requestBody';
import { IRouter } from '../interface/main';
import userValidatorInstance from '../validation/UserValidator';
import { combineResponseWithError } from '../utils/combineResponse';
import { COMMON_ERROR_MESSAGE } from '../constants/error';
import { BadRequestError, NotFoundError, ValidationError } from '../constants/error/index';

class UserRouter implements IRouter {
  private response: ServerResponse | undefined;

  private routerBase = ROUTE.USERS;

  async processRequest(request: IncomingMessage, response: ServerResponse) {
    this.response = response;

    const routeArgs = await this.parseRouteIfValidOrResponseWithError(request, response);
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

    switch (request.method) {
      case METHOD.GET:
        this.processGetRequest(userId);

        break;

      case METHOD.POST:
        this.processPostRequest(request);

        break;

      case METHOD.PUT:
        this.processPutRequest(request, userId);

        break;

      case METHOD.DELETE:
        this.processDeleteRequest(userId);

        break;

      default:
        combineResponseWithError(
          response,
          new BadRequestError(COMMON_ERROR_MESSAGE),
        );
    }
  }

  private async processGetRequest(userId?: string) {
    if (!this.response) {
      return;
    }

    if (userId) {
      UserConroller.getUserByIdOrThrowNotFound(this.response, userId);

      return;
    }

    UserConroller.getAllUsers(this.response);
  }

  private async processPostRequest(request: IncomingMessage) {
    if (!this.response) {
      return;
    }

    const body = await this.getBodyOrResponseWithError(request);

    const isRequestPossible = body !== null;

    if (isRequestPossible) {
      UserConroller.createUser(this.response, body);
    }
  }

  private async processPutRequest(request: IncomingMessage, userId: string) {
    if (!this.response) {
      return;
    }

    const body = await this.getBodyOrResponseWithError(request);

    const isRequestPossible = body !== null;

    if (isRequestPossible) {
      UserConroller.updateUser(this.response, userId, body as IUserRequest);
    }
  }

  private async processDeleteRequest(userId: string) {
    if (!this.response) {
      return;
    }

    UserConroller.deleteUserById(this.response, userId);
  }

  private isValidRoute(requestBase: string, uselessArgs?: string[]): boolean {
    const isRequestHasUselessArguments = uselessArgs?.length !== 0;

    if (isRequestHasUselessArguments) {
      return false;
    }

    return requestBase === this.routerBase;
  }

  private async parseRouteIfValidOrResponseWithError(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<IUserRouteArguments | null> {
    const { pathname } = url.parse(request.url as string);

    const [, baseUrl, userRoute, userId, ...rest] = (pathname as string).split('/');
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

  private async getBodyOrResponseWithError(request: IncomingMessage): Promise<IUserRequest | null> {
    if (!this.response) {
      return null;
    }

    const body = await getRequestBody<IUserRequest>(request);

    const isRequestPossible = body !== null;

    if (!isRequestPossible) {
      combineResponseWithError(
        this.response,
        new BadRequestError(COMMON_ERROR_MESSAGE),
      );

      return null;
    }

    return body;
  }
}

const userRouter = new UserRouter();

export default userRouter;
