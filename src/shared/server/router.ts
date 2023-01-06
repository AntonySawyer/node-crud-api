import { IncomingMessage } from 'http';
import url from 'url';

import { IRouteDefinition } from './router.interface';
import { getRouteParts } from './utils/getRouteParts';
import { NotFoundError } from '../error/errorInstance';

class Router {
  private routes: IRouteDefinition[] = [];

  public addRoute(route: IRouteDefinition) {
    this.routes.push(route);
  }

  public resolveRouteByRequest(request: IncomingMessage): IRouteDefinition {
    const { pathname } = url.parse(request.url as string);

    const similarRoutesByPath = this.routes.filter((route) => (pathname as string).includes(route.basePath));
    const similarRoutesByMethod = similarRoutesByPath.filter((route) => route.method === request.method);

    const [, ...requestPathParts] = getRouteParts(request);
    const routeBaseIndex = 0;
    const pathPartsWithoutBase = requestPathParts?.slice(routeBaseIndex + 1);

    const resultRoute = similarRoutesByMethod.find((route) => {
      const isRouteShouldHaveParts = Boolean(route.pathParts);
      const isPartsHaveSameLength = route.pathParts?.length === pathPartsWithoutBase?.length;

      if (isRouteShouldHaveParts && isPartsHaveSameLength) {
        return true;
      }

      if (!isRouteShouldHaveParts && pathPartsWithoutBase?.length === 0) {
        return true;
      }

      return false;
    });

    if (!resultRoute) {
      throw new NotFoundError();
    }

    return resultRoute;
  }
}

export default Router;
