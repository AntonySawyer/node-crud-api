import cluster from 'cluster';
import http from 'http';

import { requestListenerWithErrorHandling } from './requestListenerWithErrorHandling';
import { logger } from '../shared/server/utils/logger';

export const createServerInstance = (port: number): void => {
  const server = http.createServer(requestListenerWithErrorHandling);

  server.listen(port, () => {
    if (cluster.isPrimary) {
      logger(`Server at port ${port}`);
    } else {
      logger(`Worker at port ${port}`);
    }
  });
};
