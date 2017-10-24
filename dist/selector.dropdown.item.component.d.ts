/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorDropdownItemComponent {
    link: (scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    restrict: string;
    templateUrl: string;
    scope: ISelector.DropdownItemsComponent.Scope | any;
    constructor($log: angular.ILogService);
    static Factory(): ($log: any) => SelectorDropdownItemComponent;
}
