/// <reference types="angular" />
import { ISelector } from './interfaces';
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
