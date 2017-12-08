import { ISelector } from './selector.interfaces';

// wire up a service. to build a focus manager and instance manager
export class SelectorInstanceManagerService {
  private _instances: Object = {};

  constructor() {
    return;
  }

  add(instanceId: string, instanceApi: ISelector.IApi) {
    if (!this._instances.hasOwnProperty(instanceId)) {
      this._instances[instanceId] = instanceApi;
    }
  }

  remove(instanceId: string) {
    if (this._instances.hasOwnProperty(instanceId)) {
      delete this._instances[instanceId];
    }
  }

  open(instanceId: string) {
    if (this._instances.hasOwnProperty(instanceId)) {
      const iApi = this._instances[instanceId] as ISelector.IApi;
      iApi.open();
    }
  }

  close(instanceId: string) {
    if (this._instances.hasOwnProperty(instanceId)) {
      const iApi = this._instances[instanceId] as ISelector.IApi;
      iApi.close();
    }
  }

  closeAll() {
    const keys = Object.keys(this._instances);
    if (keys && keys.length) {
      keys.forEach(key => {
        if (this._instances.hasOwnProperty(key)) {
          const iApi = this._instances[key] as ISelector.IApi;
          iApi.close();
        }
      });
    }
  }
}
