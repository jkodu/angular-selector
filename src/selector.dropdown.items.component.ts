import { ISelector } from './interfaces';
import { CONSOLE_LOGGER } from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
const hyperx =require('hyperx');
import * as  vdom from 'virtual-dom';

export class SelectorDropdownItemsComponent {

    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector-on-steroids/selector-dropdown-item.html';
    public scope: ISelector.DropdownItemsComponent.Scope | any = {
        input: '<'
    };

    constructor(private $log: angular.ILogService, private debug: boolean) {
    }

    link(scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) {

        const hx = hyperx(vdom.h, {
            vdom: true
        });

        let _subscribers: Subscription[] = [];
        let _parentReferences: any = {
            // dynamically constructed object
        }
        let _isBooted: boolean = false;
        let _isFirstRendered: boolean = false;

        let _tree = null;
        let _rootNode = null;

        const GET_DROPDOWN_ITEM_TEMPLATE = (option: any, index: number, filteredOptions: any[], highlighted: number) => {
            const cls = `${highlighted === index ? 'active' : ''} ${_parentReferences.groupAttr && _parentReferences.getObjValue(option, _parentReferences.groupAttr) ? 'grouped' : ''}`;
            let boundValue = _parentReferences.getObjValue(option, _parentReferences.labelAttr);
            boundValue = boundValue
                ? boundValue
                : typeof option === 'object'
                    ? JSON.stringify(option)
                    : option;
            return hx`<li class="selector-option js-data-item ${cls}" id="sos-data-index-${index}">${boundValue}</li>`;
        };

        const GET_DROPDOWN_GROUP_TEMPLATE = (option: any, index: number, filteredOptions: any[]) => {
            if (_parentReferences.groupAttr) {
                const boundValue = _parentReferences.getObjValue(option, _parentReferences.groupAttr);
                if (boundValue && index === 0 || _parentReferences.getObjValue(filteredOptions[index - 1], _parentReferences.groupAttr) !== boundValue) {
                    return hx`<li class="selector-optgroup">${boundValue}</li>`;
                } else {
                    return hx``;
                }
            } else {
                return hx``;
            }
        };

        const getRenderableItems = (items: Array<any>, highlighted: number) => {
            const liList = hx`${items.map((currentValue: any, index: number, array: Array<any>) => {
                return hx`<span>${GET_DROPDOWN_GROUP_TEMPLATE(currentValue, index, array)}${GET_DROPDOWN_ITEM_TEMPLATE(currentValue, index, array, highlighted)}</span>`;
            })}`;
            const tpl = hx`<div>${liList}</div>`;
            return tpl;
        };

        Observable.merge(
            Observable.fromEvent(element[0], 'mouseenter'),
            Observable.fromEvent(element[0], 'click')
        ).subscribe((e: Event | MouseEvent) => {
            if (e.type === 'mouseover') {
                const index = parseInt((e.srcElement.getAttribute('id')).replace('sos-data-index-', ''));
                if (_parentReferences['highlight']) {
                    _parentReferences['highlight'](index < -1 ? -1 : index);
                }
            }
            if (e.type === 'click') {
                const index = parseInt((e.srcElement.getAttribute('id')).replace('sos-data-index-', ''));

                if (_parentReferences['highlight']) {
                    _parentReferences['highlight'](index < -1 ? -1 : index);
                }
                if (_parentReferences['set']) {
                    _parentReferences['set'](undefined);
                }
            }
            e.stopPropagation();
        });

        if (scope.input) {
            // TODO: Move to post link?
            _subscribers.push(
                scope.input
                    .subscribe(
                    (inputData: ISelector.DropdownItemsComponent.Input$) => {
                        if (inputData.filteredOptions && inputData.filteredOptions.length) {

                            if (!_isBooted) {
                                if (!_parentReferences.hasOwnProperty('groupAttr') ||
                                    !_parentReferences.hasOwnProperty('valueAttr') ||
                                    !_parentReferences.hasOwnProperty('labelAttr') ||
                                    !_parentReferences.hasOwnProperty('getObjValue') ||
                                    !_parentReferences.hasOwnProperty('set') ||
                                    !_parentReferences.hasOwnProperty('highlight')) {
                                    _parentReferences['groupAttr'] = inputData.groupAttr;
                                    _parentReferences['valueAttr'] = inputData.valueAttr;
                                    _parentReferences['labelAttr'] = inputData.labelAttr;
                                    _parentReferences['getObjValue'] = inputData.getObjValue;
                                    _parentReferences['set'] = inputData.set;
                                    _parentReferences['highlight'] = inputData.highlight;
                                    _isBooted = true;
                                }
                            }

                            if (_isBooted) {
                                if (!_isFirstRendered) {
                                    let tpl = getRenderableItems(
                                        inputData.filteredOptions,
                                        inputData.highlighted
                                    );
                                    _tree = tpl;
                                    _rootNode = vdom.create(_tree);
                                    element[0].appendChild(_rootNode);
                                    // element[0].innerHTML = _rootNode;
                                    _isFirstRendered = true;
                                } else {
                                    let tpl = getRenderableItems(inputData.filteredOptions,inputData.highlighted
                                    );
                                    let newTree = tpl;
                                    let patches = vdom.diff(_tree, newTree);
                                    _rootNode = vdom.patch(_rootNode, patches);
                                    _tree = newTree;
                                }
                            }

                            if (this.debug) {
                                CONSOLE_LOGGER(this.$log, `Re-drawing items/ options.`);
                            }
                        }
                    },
                    (error: any) => {
                        if (this.debug) {
                            CONSOLE_LOGGER(this.$log, `Cannot initialize, Selector Dropdown Items Component!`);
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
            return new SelectorDropdownItemsComponent($log, debug);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}