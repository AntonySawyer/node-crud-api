import { RequestListener } from 'http';

import { prepareUserRoutes } from '../components/users/user.router';
import Router from '../shared/server/router';
import { AppError, NotFoundError } from '../shared/error/errorInstance';
import { combineResponseWithError } from '../shared/server/utils/combineResponse';
import { getRouteParts } from '../shared/server/utils/getRouteParts';
import { API_URL_BASE } from '../shared/server/http.constants';
import { IClientIncomingMessage } from '../shared/server/server.interface';

export const requestListenerWithErrorHandling: RequestListener = async (request, response) => {
  if (request.url === undefined) {
    throw new NotFoundError();
  }

  const clientRequest = request as IClientIncomingMessage;

  const routeParts = getRouteParts(clientRequest);
  const baseUrlIndex = 0;
  const router = new Router();

  prepareUserRoutes(router);

  try {
    const isValidBase = routeParts[baseUrlIndex] === API_URL_BASE;

    if (!isValidBase) {
      throw new NotFoundError();
    }

    const routeDefinition = router.resolveRouteByRequest(clientRequest);
    await routeDefinition.execute(clientRequest, response);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};
