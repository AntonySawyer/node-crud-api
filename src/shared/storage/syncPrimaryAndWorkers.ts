import cluster, { Worker } from 'cluster';
import { ISyncPayload } from './interface';

export const initClusterListeners = <TType>() => {
  if (cluster.isPrimary) {
    cluster.on('message', (emittedWorker, payload: Record<string, TType>) => {
      if (payload) {
        const dataToSend: ISyncPayload<TType> = {
          data: payload,
        };

        Object.keys(cluster.workers as Record<string, Worker>).forEach((workerKey) => {
          const worker = cluster?.workers?.[workerKey];

          if (worker?.id !== emittedWorker.id) {
            worker?.send(dataToSend);
          }
        });
      }
    });
  } else {
    cluster.on('message', (payload: ISyncPayload<TType>) => {
      if (payload.data) {
        cluster.worker?.send(payload.data);
      }
    });
  }
};
