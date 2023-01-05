import url from 'url';
import { RequestListener } from 'http';

import { combineResponseWithError } from '../shared/server/utils/combineResponse';
import { AppError, BadRequestError } from '../shared/error/errorInstance';
import { ROUTE } from '../shared/server/routes';
import userRouter from '../components/users/user.router';

export const navigateRequestToComponentRouter: RequestListener = async (request, response) => {
  const { pathname } = url.parse(request.url as string);

  if (!pathname) {
    throw new BadRequestError();
  }

  if (pathname?.includes(ROUTE.USERS)) {
    try {
      await userRouter.processRequest(request, response);
    } catch (error) {
      combineResponseWithError(response, error as AppError);
    }

    return;
  }

  throw new BadRequestError();
};
