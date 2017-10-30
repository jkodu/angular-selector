import { ISelector } from './interfaces';
import { CONSOLE_LOGGER, GET_SELECTED_ITEM_TEMPLATE } from './utils';
import { Observable, Subject, Subscription } from 'rxjs';

export class SelectorSelectedItemsComponent {

    public link: (scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector-on-steroids/selector-selected-item.html';
    public scope: ISelector.SelectedItemsComponent.Scope | any = {
        input: '<'
    };
    private _subscribers: Subscription[] = [];
    private _parentReferences: any = {
        // dynamically constructed object
    }

    private getRenderableItems = (items: Array<any>) => {
        return `${items.map((currentValue: any, index: number, array: Array<any>) => `${GET_SELECTED_ITEM_TEMPLATE(currentValue, index, array, this._parentReferences)}`).join(' ')}`;
    };

    constructor($log: angular.ILogService, private debug: boolean) {

        SelectorSelectedItemsComponent.prototype.link =
            (scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => {

                Observable.fromEvent(element[0], 'click')
                    .subscribe((e: Event | MouseEvent) => {
                        if (e.type === 'click') {
                            if (e.srcElement.classList.contains('selector-icon')) {
                                const index = (parseInt(e.srcElement.getAttribute('data-index')));
                                if (this._parentReferences['unset']) {
                                    this._parentReferences['unset'](index < -1 ? -1 : index);
                                }
                            }
                        }
                        e.stopPropagation();
                    });


                if (scope.input) {
                    // TODO: Move to post link?
                    this._subscribers.push(
                        scope.input
                            .subscribe(
                            (inputData: ISelector.SelectedItemsComponent.Input$) => {
                                if (inputData.selectedValues && inputData.selectedValues.length) {
                                    if (!this._parentReferences.hasOwnProperty('groupAttr') ||
                                        !this._parentReferences.hasOwnProperty('getObjValue') ||
                                        !this._parentReferences.hasOwnProperty('unset') ||
                                        !this._parentReferences.hasOwnProperty('multiple') ||
                                        !this._parentReferences.hasOwnProperty('disabled')) {
                                        this._parentReferences['groupAttr'] = inputData.groupAttr;
                                        this._parentReferences['getObjValue'] = inputData.getObjValue;
                                        this._parentReferences['unset'] = inputData.unset;
                                        this._parentReferences['multiple'] = inputData.multiple;
                                        this._parentReferences['disabled'] = inputData.disabled;
                                    }
                                    element[0].innerHTML = this.getRenderableItems(inputData.selectedValues);
                                    if (this.debug) {
                                        CONSOLE_LOGGER($log, `Re-drawing selected items/ options.`);
                                    }
                                }
                            },
                            (error: any) => {
                                if (this.debug) {
                                    CONSOLE_LOGGER($log, `Cannot initialize, Selector Selected Items Component!`);
                                }
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

    public static Factory(debug: boolean) {
        let directive = ($log) => {
            return new SelectorSelectedItemsComponent($log, debug);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}

// TO Destroy