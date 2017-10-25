/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorDropdownItemsComponent {
    link: (scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    replace: boolean;
    restrict: string;
    templateUrl: string;
    scope: ISelector.DropdownItemsComponent.Scope | any;
    private _subscribers;
    private getGroupTpl(option, index, filteredOptions, groupAttr, getObjValue);
    private getItemTpl(option, index, filteredOptions, highlighted, groupAttr, getObjValue);
    constructor($log: angular.ILogService);
    static Factory(): ($log: any) => SelectorDropdownItemsComponent;
}
