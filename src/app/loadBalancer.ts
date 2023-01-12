import { IWorkerToPortMap } from '../shared/server/server.interface';

const INITIAL_WORKER_INDEX = 0;

export class LoadBalancer {
  constructor(workersMap: IWorkerToPortMap) {
    this.workerToPortMap = workersMap;
    this.totalWorkers = Object.keys(workersMap).length;
  }

  private workerToPortMap: IWorkerToPortMap;

  private totalWorkers: number;

  private currentWorkerIndex: number = INITIAL_WORKER_INDEX;

  public getWorkerPortByRoundRobin = (): number => {
    const port = Object.values(this.workerToPortMap)[this.currentWorkerIndex];

    this.modifyCurrentWorkerIndex();

    return port;
  };

  public getWorkerPortByPid = (pid: number): number => {
    const workerPort = this.workerToPortMap[pid];

    return workerPort;
  };

  public removeWorkerKeyByPid = (pid: number): void => {
    delete this.workerToPortMap[pid];
  };

  public addWorkerPidToMap = (workerPid: number, port: number): void => {
    this.workerToPortMap[workerPid] = port;
  };

  private modifyCurrentWorkerIndex = (): void => {
    const lastIndex = this.totalWorkers - 1;

    if (this.currentWorkerIndex === lastIndex) {
      this.currentWorkerIndex = INITIAL_WORKER_INDEX;
    } else {
      this.currentWorkerIndex += 1;
    }
  };
}