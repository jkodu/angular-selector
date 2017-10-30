/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorSelectedItemsComponent {
    private debug;
    link: (scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.SelectedItemsComponent.Scope | any;
    private _subscribers;
    private _parentReferences;
    private getRenderableItems;
    constructor($log: angular.ILogService, debug: boolean);
    static Factory(debug: boolean): ($log: any) => SelectorSelectedItemsComponent;
}
