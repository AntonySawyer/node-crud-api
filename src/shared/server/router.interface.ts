import { IncomingMessage, ServerResponse } from 'http';
import { METHOD } from './http.constants';

export interface IRouteDefinition {
  basePath: string;
  execute: (request: IncomingMessage, response: ServerResponse) => Promise<void>;
  method: METHOD;
  pathParts?: string[];
  shouldHaveBody: boolean;
}
