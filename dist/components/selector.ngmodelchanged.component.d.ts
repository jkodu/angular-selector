/// <reference types="angular" />
export declare class SelectorNgModelChangedComponent {
    require: string;
    scope: any;
    constructor();
    link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes, controller: angular.IController) => void;
    static Factory(debug: boolean): () => SelectorNgModelChangedComponent;
}
