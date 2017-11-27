import { ISelector } from './selector.interfaces';
export declare class SelectorInstanceManagerService {
    private _instances;
    constructor();
    add(instanceId: string, instanceApi: ISelector.IApi): void;
    remove(instanceId: string): void;
    open(instanceId: string): void;
    close(instanceId: string): void;
    closeAll(): void;
}
