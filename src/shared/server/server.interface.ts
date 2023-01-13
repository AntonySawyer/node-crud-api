import { IncomingMessage } from 'http';

export interface IClientIncomingMessage extends IncomingMessage {
  url: string;
}

export interface IWorkerToPortMap {
  [workerId: number]: number;
}
