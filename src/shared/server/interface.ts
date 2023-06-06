import { IncomingMessage, ServerResponse } from 'http';

import { METHOD } from './constants';

export interface IClientIncomingMessage extends IncomingMessage {
  url: string;
}

export interface IWorkerToPortMap {
  [workerId: number]: number;
}

export interface IRouteDefinition {
  basePath: string;
  execute: (request: IClientIncomingMessage, response: ServerResponse) => Promise<void>;
  method: METHOD;
  pathParts?: string[];
  shouldHaveBody: boolean;
}
