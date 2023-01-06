import { IncomingMessage } from 'http';
import url from 'url';

export const getRouteParts = (request: IncomingMessage): string[] => {
  const { pathname } = url.parse(request.url as string);
  const [, ...routeParts] = (pathname as string).split('/');

  return routeParts;
};
