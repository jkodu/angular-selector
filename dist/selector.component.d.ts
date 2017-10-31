/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorComponent {
    private $filter;
    private $timeout;
    private $window;
    private $http;
    private $q;
    private $log;
    private debug;
    restrict: string;
    replace: boolean;
    transclude: boolean;
    templateUrl: string;
    scope: ISelector.BaseComponent.Scope | any;
    constructor($filter: angular.IFilterService, $timeout: angular.ITimeoutService, $window: angular.IWindowService, $http: angular.IHttpService, $q: angular.IQService, $log: angular.ILogService, debug: any);
    link(scope: ISelector.BaseComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.IController, transclude: angular.ITranscludeFunction): void;
    static Factory(debug: boolean): ($filter: any, $timeout: any, $window: any, $http: any, $q: any, $log: any) => SelectorComponent;
}
