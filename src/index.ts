import * as dotenv from 'dotenv';
import http, { RequestListener } from 'http';

import { AppError } from './constants/error/index';
import { combineResponseWithError } from './utils/combineResponse';
import { navigateRequestToProcessing } from './utils/navigateRequestToProcessing';

dotenv.config();
const { PORT } = process.env;

const requestListenerWithErrorHandling: RequestListener = async (request, response) => {
  try {
    navigateRequestToProcessing(request, response);
  } catch (error) {
    combineResponseWithError(response, error as AppError);
  }
};

const server = http.createServer(requestListenerWithErrorHandling);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server at port ${PORT}`);
});
