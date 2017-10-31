/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorDropdownItemsComponent {
    private $log;
    private debug;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.DropdownItemsComponent.Scope | any;
    constructor($log: angular.ILogService, debug: boolean);
    link(scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes): void;
    static Factory(debug: boolean): ($log: any) => SelectorDropdownItemsComponent;
}
