import cluster from 'cluster';
import http, { IncomingMessage, RequestOptions, ServerResponse } from 'http';

import { IWorkerToPortMap } from '../shared/server/server.interface';
import { createWorker } from './createWorker';
import { LoadBalancer } from './loadBalancer';

export const createLoadBalancerServer = (port: number, workersMap: IWorkerToPortMap): void => {
  const loadBalancer = new LoadBalancer(workersMap);

  cluster.on('exit', (worker) => {
    const deadWorkerPid = worker.process.pid as number;
    const deadWorkerPort = loadBalancer.getWorkerPortByPid(deadWorkerPid);
    const newWorkerPid = createWorker(deadWorkerPort);

    loadBalancer.removeWorkerKeyByPid(deadWorkerPid);
    loadBalancer.addWorkerPidToMap(newWorkerPid, deadWorkerPort);
  });

  // TODO: await for workers start and control that worker not crushed (workers.length or something else)
  const server = http.createServer((appRequest: IncomingMessage, appResponse: ServerResponse) => {
    const workerToRequestPort = loadBalancer.getWorkerPortByRoundRobin();

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
