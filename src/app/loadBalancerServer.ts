import cluster from 'cluster';
import http, { IncomingMessage, RequestOptions, ServerResponse } from 'http';

import { IWorkerToPortMap } from '../shared/server/server.interface';

export const createWorker = (port: number): string => {
  const clusterEnv = {
    APP_PORT: port,
  };
  const worker = cluster.fork(clusterEnv);
  const workerProcessKey = (worker.process.pid as number).toString();

  return workerProcessKey;
};

// TODO: rework load balancer to use class instance instead of closure
const initialWorkerIndex = 0;
let currentWorkerIndex = initialWorkerIndex;

const getWorkerPortByRoundRobin = (workersToPortMap: IWorkerToPortMap): number => {
  const totalWorkers = Object.keys(workersToPortMap).length;

  const port = Object.values(workersToPortMap)[currentWorkerIndex];

  if (currentWorkerIndex === totalWorkers - 1) {
    currentWorkerIndex = initialWorkerIndex;
  } else {
    currentWorkerIndex += 1;
  }

  return port;
};

export const createLoadBalancerServer = (port: number, workersMap: IWorkerToPortMap): void => {
  const workerToPortMap: IWorkerToPortMap = { ...workersMap };

  cluster.on('exit', (worker) => {
    const deadWorkerKey = (worker.process.pid as number).toString();
    const workerPort = workerToPortMap[deadWorkerKey] as number;
    const workerProcessKey = createWorker(workerPort);

    workerToPortMap[workerProcessKey] = workerPort;
    delete workerToPortMap[deadWorkerKey];
  });

  // TODO: await for workers start and control that worker not crushed (workers.length or something else)
  const server = http.createServer((appRequest: IncomingMessage, appResponse: ServerResponse) => {
    const workerToRequestPort = getWorkerPortByRoundRobin(workerToPortMap);

    const requestToWorkerOptions: RequestOptions = {
      ...appRequest,
      port: workerToRequestPort,
      path: appRequest.url,
    };

    appRequest.pipe(
      http.request(requestToWorkerOptions, (workerResponse) => {
        Object.keys(workerResponse.headers).forEach((headerKey) => {
          const headerValue = workerResponse.headers[headerKey];

          if (headerValue) {
            appResponse.setHeader(headerKey, headerValue);
          }
        });

        workerResponse.pipe(appResponse);
      }),
    );
  });

  server.listen(port, () => {
    // TODO: logging
    console.log(`Server at port ${port}`);
  });
};
