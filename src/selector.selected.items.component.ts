import { ISelector } from './interfaces';
import { CONSOLE_LOGGER, GET_SELECTED_ITEM_TEMPLATE } from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export class SelectorSelectedItemsComponent {

    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector-on-steroids/selector-selected-item.html';
    public scope: ISelector.SelectedItemsComponent.Scope | any = {
        input: '<'
    };

    constructor(private $log: angular.ILogService, private debug: boolean) {
    }

    link(scope: ISelector.SelectedItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {

        let _subscribers: Subscription[] = [];
        let _parentReferences: any = {
            // dynamically constructed object
        }

        const getRenderableItems = (items: Array<any>) => {
            return `${items.map((currentValue: any, index: number, array: Array<any>) => `${GET_SELECTED_ITEM_TEMPLATE(currentValue, index, array, _parentReferences)}`).join(' ')}`;
        };

        Observable.fromEvent(element[0], 'click')
            .subscribe((e: Event | MouseEvent) => {
                if (e.type === 'click') {
                    if (e.srcElement.classList.contains('selector-icon')) {
                        const index = parseInt((e.srcElement.getAttribute('id')).replace('sos-data-index-', ''));
                        if (_parentReferences['unset']) {
                            _parentReferences['unset'](index < -1 ? -1 : index);
                        }
                    }
                }
                e.stopPropagation();
            });


        if (scope.input) {
            // TODO: Move to post link?
            _subscribers.push(
                scope.input
                    .subscribe(
                    (inputData: ISelector.SelectedItemsComponent.Input$) => {
                        if (inputData.selectedValues && inputData.selectedValues.length) {
                            if (!_parentReferences.hasOwnProperty('groupAttr') ||
                                !_parentReferences.hasOwnProperty('getObjValue') ||
                                !_parentReferences.hasOwnProperty('unset') ||
                                !_parentReferences.hasOwnProperty('multiple') ||
                                !_parentReferences.hasOwnProperty('disabled')) {
                                _parentReferences['groupAttr'] = inputData.groupAttr;
                                _parentReferences['getObjValue'] = inputData.getObjValue;
                                _parentReferences['unset'] = inputData.unset;
                                _parentReferences['multiple'] = inputData.multiple;
                                _parentReferences['disabled'] = inputData.disabled;
                            }
                            element[0].innerHTML = getRenderableItems(inputData.selectedValues);
                            if (this.debug) {
                                CONSOLE_LOGGER(this.$log, `Re-drawing selected items/ options.`);
                            }
                        }
                    },
                    (error: any) => {
                        if (this.debug) {
                            CONSOLE_LOGGER(this.$log, `Cannot initialize, Selector Selected Items Component!`);
                        }
                    })
            );
        }

        scope.$on('$destroy', () => {
            // dispose subscribers
            if (_subscribers && _subscribers.length) {
                _subscribers.forEach((s: Subscription) => {
                    s.unsubscribe();
                });
                _subscribers = null;
            }
        });

    }

    public static Factory(debug: boolean) {
        let directive = ($log) => {
            return new SelectorSelectedItemsComponent($log, debug);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}