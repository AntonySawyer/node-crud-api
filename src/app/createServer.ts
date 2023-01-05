import http from 'http';

import { requestListenerWithErrorHandling } from './requestListenerWithErrorHandling';

export const createServerInstance = () => {
  const { APP_PORT } = process.env;

  const server = http.createServer(requestListenerWithErrorHandling);

  server.listen(APP_PORT, () => {
    // TODO
    // eslint-disable-next-line no-console
    console.log(`Server at port ${APP_PORT}`);
  });
};
