import { ISelector } from './interfaces';
import { CONSOLE_LOGGER, GET_ITEM_TEMPLATE } from './utils';
import { Observable, Subject, Subscription } from 'rxjs';

export class SelectorSelectedItemsComponent {

    public link: (scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector/selector-selected-item.html';
    public scope: ISelector.SelectedItemsComponent.Scope | any = {
        input: '<'
    };
    private _subscribers: Subscription[] = [];
    private _parentReferences: any = {
        // dynamically constructed object
    }

    private getRenderableItems = (items: Array<any>) => {
        return `${items.map((currentValue: any, index: number, array: Array<any>) => `${GET_ITEM_TEMPLATE(currentValue, index, array, this._parentReferences)}`).join(' ')}`;
    };

    constructor($log: angular.ILogService) {

        SelectorSelectedItemsComponent.prototype.link =
            (scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                if (scope.input) {
                    // TODO: Move to post link?
                    this._subscribers.push(
                        scope.input
                            .subscribe(
                            (inputData: ISelector.SelectedItemsComponent.Input$) => {
                                if (inputData.selectedValues && inputData.selectedValues.length) {
                                    if (!this._parentReferences.hasOwnProperty('groupAttr') ||
                                        !this._parentReferences.hasOwnProperty('getObjValue') ||
                                        !this._parentReferences.hasOwnProperty('unset')) {
                                        this._parentReferences['groupAttr'] = inputData.groupAttr;
                                        this._parentReferences['getObjValue'] = inputData.getObjValue;
                                        this._parentReferences['unset'] = inputData.unset;
                                    }
                                    element[0].innerHTML = this.getRenderableItems(inputData.selectedValues);
                                    CONSOLE_LOGGER($log, `Re-drawing selected items/ options.`);
                                }
                            },
                            (error: any) => {
                                CONSOLE_LOGGER($log, `Cannot initialize, Selector Selected Items Component!`);
                            })
                    );
                }

                scope.$on('$destroy', () => {
                    // dispose subscribers
                    if (this._subscribers && this._subscribers.length) {
                        this._subscribers.forEach((s: Subscription) => {
                            s.unsubscribe();
                        });
                        this._subscribers = null;
                    }
                });

            }
    }

    public static Factory() {
        let directive = ($log) => {
            return new SelectorSelectedItemsComponent($log);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}

// TO Destroy