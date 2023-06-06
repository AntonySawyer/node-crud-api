import cluster from 'cluster';

import { InternalError, NotFoundError } from '../error/errorInstance';
import { IGenericRepository, ISyncPayload } from './interface';
import { initClusterListeners } from './syncPrimaryAndWorkers';

export class GenericRepository<TType> implements IGenericRepository<TType> {
  constructor() {
    initClusterListeners();

    if (cluster.isWorker) {
      cluster.worker?.on('message', (payload: Record<string, TType>) => {
        if (payload.data) {
          this.dataSource = new Map(Object.entries(payload.data));
        }
      });
    }
  }

  private dataSource = new Map<string, TType>();

  private set data(data: Map<string, TType>) {
    this.dataSource = data;

    this.syncWithPrimary();
  }

  private get data() {
    return this.dataSource;
  }

  public async find(): Promise<TType[]> {
    const dataArray = [...this.data.values()];

    return dataArray;
  }

  public async findById(id: string): Promise<TType | undefined> {
    const result = this.data.get(id);

    if (!result) {
      throw new NotFoundError();
    }

    return result;
  }

  public async create(id: string, entity: TType): Promise<TType> {
    this.data.set(id, entity);
    this.syncWithPrimary();

    return entity;
  }

  public async removeById(id: string): Promise<void> {
    try {
      const isRemoved = this.data.delete(id);

      if (!isRemoved) {
        throw new NotFoundError();
      }

      this.syncWithPrimary();
    } catch (error) {
      throw new InternalError();
    }
  }

  public async updateById(id: string, updatedEntity: TType): Promise<TType> {
    const originalEntity = await this.findById(id);

    try {
      const entityForSave = {
        ...originalEntity,
        ...updatedEntity,
      };

      this.data.set(id, entityForSave);
      this.syncWithPrimary();

      return entityForSave;
    } catch (error) {
      throw new InternalError();
    }
  }

  private syncWithPrimary = () => {
    if (cluster.isWorker) {
      const flatObjFromDataMap = Object.fromEntries(this.data.entries());
      const payloadToSend: ISyncPayload<TType> = {
        data: flatObjFromDataMap,
      };

      cluster.emit('message', payloadToSend);
    }
  };
}
