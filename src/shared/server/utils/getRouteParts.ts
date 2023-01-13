import url from 'url';

import { IClientIncomingMessage } from '../server.interface';
import { BadRequestError } from '../../error/errorInstance';

export const getRouteParts = (request: IClientIncomingMessage): string[] => {
  const { pathname } = url.parse(request.url);

  if (pathname === null) {
    throw new BadRequestError();
  }

  const [, ...routeParts] = pathname.split('/');

  return routeParts;
};
