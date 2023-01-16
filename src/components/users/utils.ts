import { IClientIncomingMessage } from '../../shared/server/interface';
import { getRouteParts } from '../../shared/server/utils/getRouteParts';

export const getUserIdFromRequest = (request: IClientIncomingMessage): string => {
  const userIdIndex = 2;
  const routeParts = getRouteParts(request);
  const userId = routeParts[userIdIndex];

  return userId;
};
