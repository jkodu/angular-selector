/// <reference types="angular" />
import { ISelector } from './selector.interfaces';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
export declare class SelectorSelectedItemsComponent {
    private $log;
    private $timeout;
    private debug;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.SelectedItemsComponent.Scope | any;
    constructor($log: angular.ILogService, $timeout: angular.ITimeoutService, debug: boolean);
    static Factory(debug: boolean): ($log: any, $timeout: any) => SelectorSelectedItemsComponent;
    link(scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void;
}
