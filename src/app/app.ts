import { cpus } from 'os';
import cluster from 'cluster';

import { DEFAULT_APP_PORT } from '../shared/server/http.constants';
import { createServerInstance } from './createServer';
import { createLoadBalancerServer } from './loadBalancerServer';
import { IWorkerToPortMap } from '../shared/server/server.interface';
import { createWorker } from './createWorker';

const cpusCount = cpus().length;
// TODO: create separate common storage with running server
export const runApp = () => {
  const {
    APP_PORT = DEFAULT_APP_PORT,
    USE_CLUSTER,
  } = process.env;

  const shouldUseCluster = USE_CLUSTER === 'true';

  if (!shouldUseCluster) {
    createServerInstance(Number(APP_PORT));

    return;
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
        createLoadBalancerServer(Number(APP_PORT), workerToPortMap);
      }
    });
  } else {
    createServerInstance(Number(APP_PORT));
  }
};
