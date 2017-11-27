/// <reference types="angular" />
import { ISelector } from './selector.interfaces';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
export declare class SelectorDropdownItemsComponent {
    private $log;
    private $timeout;
    private debug;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.DropdownItemsComponent.Scope | any;
    constructor($log: angular.ILogService, $timeout: angular.ITimeoutService, debug: boolean);
    link(scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void;
    static Factory(debug: boolean): ($log: any, $timeout: any) => SelectorDropdownItemsComponent;
}
