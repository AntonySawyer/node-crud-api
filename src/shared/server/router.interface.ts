import { ServerResponse } from 'http';

import { METHOD } from './http.constants';
import { IClientIncomingMessage } from './server.interface';

export interface IRouteDefinition {
  basePath: string;
  execute: (request: IClientIncomingMessage, response: ServerResponse) => Promise<void>;
  method: METHOD;
  pathParts?: string[];
  shouldHaveBody: boolean;
}
