import cluster from 'cluster';
import http, { IncomingMessage, RequestOptions, ServerResponse } from 'http';

import { IWorkerToPortMap } from '../shared/server/server.interface';
import { createWorker } from './createWorker';
import { LoadBalancer } from './loadBalancer';
import { logger } from '../shared/server/utils/logger';

export const createLoadBalancerServer = (port: number, workersMap: IWorkerToPortMap): void => {
  const loadBalancer = new LoadBalancer(workersMap);

  cluster.on('exit', (worker) => {
    const deadWorkerId = worker.id;
    const deadWorkerPort = loadBalancer.getWorkerPortById(deadWorkerId);
    const newWorkerId = createWorker(deadWorkerPort);

    loadBalancer.removeWorkerKeyById(deadWorkerId);
    loadBalancer.addWorkerIdToMap(newWorkerId, deadWorkerPort);
  });

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
    logger(`Server at port ${port}`);
  });
};
