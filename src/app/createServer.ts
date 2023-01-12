import cluster from 'cluster';
import http from 'http';

import { requestListenerWithErrorHandling } from './requestListenerWithErrorHandling';

export const createServerInstance = (port: number): void => {
  const server = http.createServer(requestListenerWithErrorHandling);

  server.listen(port, () => {
    if (cluster.isPrimary) {
      // TODO: logging
      console.log(`Server at port ${port}`);
    } else {
      // TODO: logging
      console.log(`Worker at port ${port}`);
    }
  });
};
