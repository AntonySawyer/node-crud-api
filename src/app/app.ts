import { cpus } from 'os';
import cluster from 'cluster';

import { DEFAULT_APP_PORT } from '../shared/server/http.constants';
import { createServerInstance } from './createServer';

const cpusCount = cpus().length;

export const runApp = () => {
  const {
    APP_PORT = DEFAULT_APP_PORT,
    USE_CLUSTER,
  } = process.env;

  const shouldUseCluster = USE_CLUSTER === 'true';

  if (shouldUseCluster && cluster.isPrimary) {
    createServerInstance(Number(APP_PORT));

    for (let i = 0; i < cpusCount; i += 1) {
      const workerPort = Number(APP_PORT) + i + 1;
      const clusterEnv = {
        APP_PORT: workerPort,
      };
      cluster.schedulingPolicy = cluster.SCHED_RR;
      cluster.fork(clusterEnv);
    }
  } else {
    createServerInstance(Number(APP_PORT));
  }
};
