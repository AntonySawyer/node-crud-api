import http, { RequestListener } from 'http';
import url from 'url';

import { HOST, PORT } from './constants/main';
import { ROUTE } from './constants/routes';
import userRouter from './routers/userRouter';

const requestListener: RequestListener = (request, response) => {
  const { pathname } = url.parse(request.url as string);

  if (!pathname) {
    // TODO: return 404 + message
    return;
  }

  if (pathname?.includes(ROUTE.USERS)) {
    userRouter.processRequest(request, response);

    return;
  }

  // TODO: return 404 + message
  console.log('404');
};

const server = http.createServer(requestListener);

server.listen(PORT, HOST, () => {
  console.log(`Server at ${HOST}:${PORT}`);
});
