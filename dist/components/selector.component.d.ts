/// <reference types="angular" />
import { ISelector } from './selector.interfaces';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import { SelectorInstanceManagerService } from './selector.instance.manager.service';
export declare class SelectorComponent {
    private $filter;
    private $timeout;
    private $window;
    private $document;
    private $http;
    private $q;
    private $log;
    private SelectorInstanceManagerService;
    private debug;
    restrict: string;
    replace: boolean;
    transclude: boolean;
    templateUrl: string;
    scope: ISelector.BaseComponent.Scope | any;
    constructor($filter: angular.IFilterService, $timeout: angular.ITimeoutService, $window: angular.IWindowService, $document: angular.IDocumentService, $http: angular.IHttpService, $q: angular.IQService, $log: angular.ILogService, SelectorInstanceManagerService: SelectorInstanceManagerService, debug: any);
    link(scope: ISelector.BaseComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.IController, transclude: angular.ITranscludeFunction): void;
    static Factory(debug: boolean): ($filter: any, $timeout: any, $window: any, $document: any, $http: any, $q: any, $log: any, SelectorInstanceManagerService: any) => SelectorComponent;
}
