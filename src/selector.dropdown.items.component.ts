import { ISelector } from './interfaces';
import { CONSOLE_LOGGER, GET_DROPDOWN_GROUP_TEMPLATE, GET_DROPDOWN_ITEM_TEMPLATE } from './utils';
import { Observable, Subject, Subscription } from 'rxjs';

export class SelectorDropdownItemsComponent {

    public link: (scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector-on-steroids/selector-dropdown-item.html';
    public scope: ISelector.DropdownItemsComponent.Scope | any = {
        input: '<'
    };
    private _subscribers: Subscription[] = [];
    private _parentReferences: any = {
        // dynamically constructed object
    }

    private getRenderableItems = (items: Array<any>, highlighted: number) => {
        return `${items.map((currentValue: any, index: number, array: Array<any>) => `${GET_DROPDOWN_GROUP_TEMPLATE(currentValue, index, array, this._parentReferences)}${GET_DROPDOWN_ITEM_TEMPLATE(currentValue, index, array, this._parentReferences, highlighted)}`).join(' ')}`;
    };

    constructor($log: angular.ILogService, private debug: boolean) {

        SelectorDropdownItemsComponent.prototype.link =
            (scope: ISelector.DropdownItemsComponent.Scope,
                element: angular.IAugmentedJQuery,
                attrs: angular.IAttributes) => {

                Observable.merge(
                    Observable.fromEvent(element[0], 'mouseenter'),
                    Observable.fromEvent(element[0], 'click')
                ).subscribe((e: Event | MouseEvent) => {
                    if (e.type === 'mouseover') {
                        const index = (parseInt(e.srcElement.getAttribute('data-index')));
                        if (this._parentReferences['highlight']) {
                            this._parentReferences['highlight'](index < -1 ? -1 : index);
                        }
                    }
                    if (e.type === 'click') {
                        const index = (parseInt(e.srcElement.getAttribute('data-index')));
                        if (this._parentReferences['highlight']) {
                            this._parentReferences['highlight'](index < -1 ? -1 : index);
                        }
                        if (this._parentReferences['set']) {
                            this._parentReferences['set'](undefined);
                        }
                    }
                    e.stopPropagation();
                });

                if (scope.input) {
                    // TODO: Move to post link?
                    this._subscribers.push(
                        scope.input
                            .subscribe(
                            (inputData: ISelector.DropdownItemsComponent.Input$) => {
                                if (inputData.filteredOptions && inputData.filteredOptions.length) {
                                    if (!this._parentReferences.hasOwnProperty('groupAttr') ||
                                        !this._parentReferences.hasOwnProperty('getObjValue') ||
                                        !this._parentReferences.hasOwnProperty('set') ||
                                        !this._parentReferences.hasOwnProperty('highlight')) {
                                        this._parentReferences['groupAttr'] = inputData.groupAttr;
                                        this._parentReferences['getObjValue'] = inputData.getObjValue;
                                        this._parentReferences['set'] = inputData.set;
                                        this._parentReferences['highlight'] = inputData.highlight;
                                    }
                                    element[0].innerHTML = this.getRenderableItems(
                                        inputData.filteredOptions,
                                        inputData.highlighted
                                    );
                                    if (this.debug) {
                                        CONSOLE_LOGGER($log, `Re-drawing items/ options.`);
                                    }
                                }
                            },
                            (error: any) => {
                                if (this.debug) {
                                    CONSOLE_LOGGER($log, `Cannot initialize, Selector Dropdown Items Component!`);
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
            return new SelectorDropdownItemsComponent($log, debug);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}

// TO Destroy