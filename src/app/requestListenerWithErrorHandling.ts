import { RequestListener } from 'http';

import { prepareUserRoutes } from '../components/users/user.router';
import Router from '../shared/server/router';
import { AppError, NotFoundError } from '../shared/error/errorInstance';
import { combineResponseWithError } from '../shared/server/utils/combineResponse';
import { getRouteParts } from '../shared/server/utils/getRouteParts';
import { API_URL_BASE } from '../shared/server/http.constants';

export const requestListenerWithErrorHandling: RequestListener = async (request, response) => {
  const routeParts = getRouteParts(request);
  const baseUrlIndex = 0;
  const router = new Router();

  prepareUserRoutes(router);

  try {
    const isValidBase = routeParts[baseUrlIndex] === API_URL_BASE;

    if (!isValidBase) {
      throw new NotFoundError();
    }

    const routeDefinition = router.resolveRouteByRequest(request);
    await routeDefinition.execute(request, response);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};
