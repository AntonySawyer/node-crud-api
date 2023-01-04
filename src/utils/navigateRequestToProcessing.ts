import url from 'url';
import { RequestListener } from 'http';

import { combineResponseWithError } from './combineResponse';
import { AppError, BadRequestError } from '../constants/error/index';
import { ROUTE } from '../constants/routes';
import userRouter from '../routers/userRouter';

export const navigateRequestToProcessing: RequestListener = async (request, response) => {
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
