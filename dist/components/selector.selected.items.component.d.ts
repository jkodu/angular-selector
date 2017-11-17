/// <reference types="angular" />
import { ISelector } from './selector.interfaces';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
export declare class SelectorSelectedItemsComponent {
    private $log;
    private debug;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.SelectedItemsComponent.Scope | any;
    constructor($log: angular.ILogService, debug: boolean);
    link(scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void;
    static Factory(debug: boolean): ($log: any) => SelectorSelectedItemsComponent;
}
