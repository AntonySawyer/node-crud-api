import { IncomingMessage, ServerResponse } from 'http';

export interface IRouter {
  processRequest: (request: IncomingMessage, response: ServerResponse) => Promise<void>;
}
