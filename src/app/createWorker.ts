import cluster from 'cluster';

export const createWorker = (port: number): number => {
  const clusterEnv = {
    APP_PORT: port,
  };
  const worker = cluster.fork(clusterEnv);
  const workerProcessId = worker.process.pid as number;

  return workerProcessId;
};
