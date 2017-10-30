import { ISelector } from './interfaces';
import { CONSOLE_LOGGER } from './utils';
import { EMPTY_TEMPLATE } from './constants';
import { Observable, Subject, Subscription } from 'rxjs';

export class SelectorDropdownItemsComponent {

    public link: (scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector/selector-dropdown-item.html';

    public scope: ISelector.DropdownItemsComponent.Scope | any = {
        input: '<'
    };

    private _subscribers: Subscription[] = [];
    private _parentReferences: any = {
        // dynamically constructed object
    }

    private getGroupTpl(option, index: number, filteredOptions: any[]) {
        if (this._parentReferences.groupAttr) {
            const boundValue = this._parentReferences.getObjValue(option, this._parentReferences.groupAttr);
            if (boundValue && index === 0 || this._parentReferences.getObjValue(filteredOptions[index - 1], this._parentReferences.groupAttr) !== boundValue) {
                return `<li class="selector-optgroup">${boundValue}</li>`;
            } else {
                return EMPTY_TEMPLATE;
            }
        } else {
            return EMPTY_TEMPLATE;
        }
    };

    private getItemTpl(option, index, filteredOptions, highlighted) {
        let cls = `
            ${highlighted === index ? 'active' : ''} 
            ${this._parentReferences.groupAttr && this._parentReferences.getObjValue(option, this._parentReferences.groupAttr) ? 'grouped' : ''}
        `;
        let boundValue = this._parentReferences.getObjValue(option, this._parentReferences.groupAttr);
        boundValue = boundValue
            ? boundValue
            : typeof option === 'object'
                ? JSON.stringify(option)
                : option;
        return `<li class="selector-option ${cls}" data-index="${index}">${boundValue}</li>`;
    };

    private getRenderableItems = (items: Array<any>, highlighted: number) => {
        const tpl = `
            ${items
                .map((currentValue: any, index: number, array: Array<any>) => `
                    ${this.getGroupTpl(currentValue, index, array)}
                    ${this.getItemTpl(currentValue, index, array, highlighted)}
                `).join(' ')
            }`;
        return tpl;
    };

    constructor($log: angular.ILogService) {

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
                        this._parentReferences['highlight'](index < -1 ? -1 : index);
                    }
                    if (e.type === 'click') {
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
                                    CONSOLE_LOGGER($log, `Re-drawing items/ options.`);
                                    element[0].innerHTML = this.getRenderableItems(
                                        inputData.filteredOptions,
                                        inputData.highlighted
                                    );
                                }
                            },
                            (error: any) => {
                                CONSOLE_LOGGER($log, `Cannot initialize, promise init error!`);
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
                    console.log('item destroyed, check if this is called');
                });

            }
    }

    public static Factory() {
        let directive = ($log) => {
            return new SelectorDropdownItemsComponent($log);
        };
        directive['$inject'] = ['$log'];
        return directive;
    }
}

// TO Destroy