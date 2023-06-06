import { cpus } from 'os';
import cluster from 'cluster';
import { Server } from 'http';

import { DEFAULT_APP_PORT } from '../shared/server/constants';
import { createServerInstance } from './createServer';
import { createLoadBalancerServer } from './loadBalancerServer';
import { IWorkerToPortMap } from '../shared/server/interface';
import { createWorker } from './createWorker';

const cpusCount = cpus().length;

export const runApp = (): Server => {
  let server;

  const {
    APP_PORT = DEFAULT_APP_PORT,
    USE_CLUSTER,
  } = process.env;

  const shouldUseCluster = USE_CLUSTER === 'true';

  if (!shouldUseCluster) {
    server = createServerInstance(Number(APP_PORT));

    return server;
  }

  if (shouldUseCluster && cluster.isPrimary) {
    cluster.schedulingPolicy = cluster.SCHED_RR;
    const workerToPortMap: IWorkerToPortMap = {};
    let listeningWorkersCount = 0;

    for (let i = 0; i < cpusCount; i += 1) {
      const workerPort = Number(APP_PORT) + i + 1;
      const workerProcessId = createWorker(workerPort);

      workerToPortMap[workerProcessId] = workerPort;
    }

    cluster.on('listening', () => {
      listeningWorkersCount += 1;

      if (listeningWorkersCount === cpusCount) {
        server = createLoadBalancerServer(Number(APP_PORT), workerToPortMap);
      }
    });
  } else {
    server = createServerInstance(Number(APP_PORT));
  }

  return server as Server;
};
