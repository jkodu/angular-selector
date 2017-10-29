/// <reference types="angular" />
import { ISelector } from './interfaces';
export declare class SelectorComponent {
    private $filter;
    private $timeout;
    private $window;
    private $http;
    private $q;
    private $log;
    link: (scope: ISelector.BaseComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.IController, transclude: angular.ITranscludeFunction) => void;
    restrict: string;
    replace: boolean;
    transclude: boolean;
    templateUrl: string;
    scope: ISelector.BaseComponent.Scope | any;
    constructor($filter: angular.IFilterService, $timeout: angular.ITimeoutService, $window: angular.IWindowService, $http: angular.IHttpService, $q: angular.IQService, $log: angular.ILogService);
    static Factory(): ($filter: any, $timeout: any, $window: any, $http: any, $q: any, $log: any) => SelectorComponent;
}
