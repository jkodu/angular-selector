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
        input: '<',
        output: '<',
    };

    private _subscribers: Subscription[] = [];

    private getGroupTpl(option, index: number, filteredOptions: any[], groupAttr, getObjValue) {
        if (groupAttr) {
            const boundValue = getObjValue(option, groupAttr);
            if (groupAttr &&
                (boundValue && index === 0 || getObjValue(filteredOptions[index - 1],
                    groupAttr) !== boundValue)) {
                return `
                <li
                    class="selector-optgroup">
                    <span>${boundValue}</span>
                </li>                                      
                `;
            } else {
                return EMPTY_TEMPLATE;
            }
        } else {
            return EMPTY_TEMPLATE;
        }
    };

    private getItemTpl(option, index, filteredOptions, highlighted, groupAttr, getObjValue) {
        let cls = `
            ${highlighted === index ? 'active' : ''} 
            ${groupAttr && getObjValue(option, groupAttr) ? 'grouped' : ''}
        `;
        let boundValue = getObjValue(option, groupAttr);
        boundValue = boundValue
            ? boundValue
            : typeof option === 'object'
                ? JSON.stringify(option)
                : option;
        return `
            <li
                class="selector-option ${cls}">
                <span>${boundValue}</span>
            </li>`;
        // TODO:
        // ng-mouseover="highlight(index)"
        // ng-click="set()"
    };


    constructor($log: angular.ILogService) {

        SelectorDropdownItemsComponent.prototype.link =
            (scope: ISelector.DropdownItemsComponent.Scope,
                element: angular.IAugmentedJQuery,
                attrs: angular.IAttributes) => {

                Observable.fromEvent(element[0], 'click enter').subscribe((e) => {
                    //todo: get selection ???
                    console.log(`test: ${e}`);
                });

                const render = (items: Array<any>, highlighted: number, groupAttr, getObjValue) => {
                    const tpl = `
                        ${items
                            .map((currentValue: any, index: number, array: Array<any>) => `
                                ${this.getGroupTpl(currentValue, index, array, groupAttr, getObjValue)}
                                ${this.getItemTpl(currentValue, index, array, highlighted, groupAttr, getObjValue)}
                            `).join(' ')
                        }`;
                    element[0].innerHTML = tpl;
                };

                if (scope.input &&
                    scope.output) {

                    // TODO: Move to post link?
                    this._subscribers.push(
                        scope.input
                            .subscribe(
                            (inputData: ISelector.DropdownItemsComponent.Input$) => {
                                if (inputData.filteredOptions && inputData.filteredOptions.length) {
                                    render(inputData.filteredOptions, inputData.highlighted, inputData.groupAttr, inputData.getObjValue);
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