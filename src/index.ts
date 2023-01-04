import http, { RequestListener } from 'http';

import { AppError } from './constants/error/index';
import { HOST, PORT } from './constants/main';
import { combineResponseWithError } from './utils/combineResponse';
import { navigateRequestToProcessing } from './utils/navigateRequestToProcessing';

const requestListenerWithErrorHandling: RequestListener = async (request, response) => {
  try {
    navigateRequestToProcessing(request, response);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

const server = http.createServer(requestListenerWithErrorHandling);

server.listen(PORT, HOST, () => {
  console.log(`Server at ${HOST}:${PORT}`);
});
