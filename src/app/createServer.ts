import cluster from 'cluster';
import http, { Server } from 'http';

import { requestListenerWithErrorHandling } from './requestListenerWithErrorHandling';
import { logger } from '../shared/server/utils/logger';

export const createServerInstance = (port: number): Server => {
  const server = http.createServer(requestListenerWithErrorHandling);

  server.listen(port, () => {
    if (cluster.isPrimary) {
      logger(`Server at port ${port}`);
    } else {
      logger(`Worker at port ${port}`);
    }
  });

  return server;
};
