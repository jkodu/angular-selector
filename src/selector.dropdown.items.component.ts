import { ISelector } from './interfaces';
import { CONSOLE_LOGGER } from './utils';
export class SelectorDropdownItemsComponent {

    public link: (scope: ISelector.DropdownItemsComponent.Scope, element: angular.IAugmentedJQuery, attrs: angular.IAttributes) => void;
    public replace: boolean = true;
    public restrict: string = 'E';
    public templateUrl: string = 'selector/selector-dropdown-item.html';

    public scope: ISelector.DropdownItemsComponent.Scope | any = {
        input: '<',
        output: '<',
    }

    private PARENT_REFS: any = {
        // auto constructed object
    };


    private getGroupTpl(option, index, filteredOptions) {
        if (this.PARENT_REFS.groupAttr &&
            (this.PARENT_REFS.getObjValue(option, this.PARENT_REFS.groupAttr) &&
                index == 0 ||
                this.PARENT_REFS.getObjValue(filteredOptions[index - 1], this.PARENT_REFS.groupAttr) !=
                this.PARENT_REFS.getObjValue(option, this.PARENT_REFS.groupAttr))) {
            return `
            <li
                class="selector-optgroup">
                ${JSON.stringify(option)}
            </li>                                      
            `;
            // TODO: ng-bind - group template
        } else {
            return ``;
        }
    };

    private getItemTpl(option, index, filteredOptions, highlighted) {
        let cls = `
            ${highlighted === index ? 'active' : ''} 
            ${this.PARENT_REFS.groupAttr && this.PARENT_REFS.getObjValue(option, this.PARENT_REFS.groupAttr) ? 'grouped' : ''}
        `;
        return `
            <li
                class="selector-option ${cls}">
                ${JSON.stringify(option)}
            </li>`;
            // TODO: 
            // ng-bind - item template
            // ng-mouseover="highlight(index)"
            // ng-click="set()"
    };


    constructor($log: angular.ILogService) {


        SelectorDropdownItemsComponent.prototype.link =
            (scope: ISelector.DropdownItemsComponent.Scope,
                element: angular.IAugmentedJQuery,
                attrs: angular.IAttributes) => {


                const render = (items: Array<any>, highlighted: number) => {

                    let tpl = `
                        ${items
                            .map((currentValue: any, index: number, array: Array<any>) => `
                                ${this.getGroupTpl(currentValue, index, array)}
                                ${this.getItemTpl(currentValue, index, array, highlighted)}
                            `).join(' ')
                        }
                      
                    `;
                    element[0].innerHTML = tpl;
                };

                const destroy = () => {

                };

                if (scope &&
                    scope.input &&
                    scope.output) {

                    // TODO: Move to post link?
                    scope.input
                        .subscribe(
                        (inputData: ISelector.DropdownItemsComponent.Input$) => {

                            switch (inputData.type) {
                                case ISelector.DropdownItemsComponent.StreamType.BOOT:
                                    {
                                        this.PARENT_REFS['groupAttr'] = inputData.groupAttr;
                                        this.PARENT_REFS['getObjValue'] = inputData.getObjValue;
                                    }
                                case ISelector.DropdownItemsComponent.StreamType.RENDER:
                                    {
                                        if (inputData.filteredOptions && inputData.filteredOptions.length) {
                                            render(inputData.filteredOptions, inputData.highlighted);
                                        }
                                    }
                                case ISelector.DropdownItemsComponent.StreamType.DESTROY:
                                    {
                                        destroy();
                                    }
                            }

                        },
                        (error: any) => {
                            CONSOLE_LOGGER($log, `Cannot initialize, promise init error!`);
                        });
                }

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