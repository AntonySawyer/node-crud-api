import http from 'http';

import { requestListenerWithErrorHandling } from './requestListenerWithErrorHandling';

export const createServerInstance = (port: number): void => {
  const server = http.createServer(requestListenerWithErrorHandling);

  server.listen(port, () => {
    // TODO
    // eslint-disable-next-line no-console
    console.log(`Server at port ${port}`);
  });
};
