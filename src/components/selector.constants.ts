
export const CONSTANTS = {
    KEYS: {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        escape: 27,
        enter: 13,
        backspace: 8,
        delete: 46,
        shift: 16,
        leftCmd: 91,
        rightCmd: 93,
        ctrl: 17,
        alt: 18,
        tab: 9
    },
    TEMPLATES: {
        TEMPLATE_ITEM_CREATE: () => {
            return `Add <i ng-bind="search"></i>`;
        },
        TEMPLATE_ITEM_DEFAULT: () => {
            return `<span ng-bind="getObjValue(option, labelAttr) || option"></span>`;
        },
        TEMPLATE_GROUP_DEFAULT: () => {
            return `<span ng-bind="getObjValue(option, groupAttr)"></span>`;
        },
        TEMPLATE_SELECTOR_SELECTED_ITEMS: () => {
            return `<div></div>`;
        },
        TEMPLATE_SELECTOR_DROPDOWN_ITEMS: () => {
            return `<div></div>`;
        },
        TEMPLATE_SELECTOR: () => {
            return `<div class="selector-container"
                ng-attr-dir="{{ rtl ? 'rtl' : 'ltr' }}"
                ng-class="{
                    open: isOpen, 
                    empty: !filteredOptions.length && 
                        (!create || !search), multiple: multiple, 
                        'has-value': hasValue(), 
                        rtl: rtl, 
                        'loading': loading, 
                        'remove-button': removeButton, 
                        disabled: disabled}">
                <select name="{{name}}"
                    ng-hide="true"
                    ng-required="required && !hasValue()"
                    ng-model="selectedValues"
                    multiple
                    ng-options="option as getObjValue(option, labelAttr) for option in selectedValues">
                </select>
                <label class="selector-input">
                    <ul class="selector-values">
                        <li 
                            ng-if="steroids === false"
                            ng-repeat="(index, option) in selectedValues track by $index">
                            <div ng-include="viewItemTemplate"></div>
                            <div 
                                ng-if="multiple" 
                                class="selector-helper" 
                                ng-click="!disabled && unset(index)">
                                <span class="selector-icon"></span>
                            </div>
                        </li>
                        <sos-selected-items
                            ng-if="steroids === true"
                            input='selectedValuesInput$'>
                        </sos-selected-items>
                    </ul>

                    <input
                        ng-model="search"                         
                        placeholder="{{!hasValue() ? placeholder : ''}}" 
                        ng-model-options="{debounce: debounce}"
                        ng-disabled="disabled" 
                        ng-readonly="disableSearch" 
                        ng-required="required && !hasValue()" 
                        autocomplete="off">
                        
                    <div ng-if="!multiple || loading" 
                        class="selector-helper selector-global-helper" 
                        ng-click="!disabled && removeButton && unset()">
                        <span class="selector-icon"></span>
                    </div>
                </label>
                <ul class="selector-dropdown">
        
                    <li 
                        class="selector-option create"
                        ng-class="{active: highlighted == -1}"
                        ng-if="create && search"
                        ng-include="dropdownCreateTemplate"
                        ng-mouseover="highlight(-1)"
                        ng-click="createOption(search)">
                    </li>
        
                    <li 
                        class="selector-option loading"
                        ng-show="loading === true">
                        Loading...
                    </li>
        
                    <li 
                        class="selector-option no-data"
                        ng-show="!loading && (!filteredOptions || filteredOptions.length <= 0)"
                        >
                        No Data
                    </li>
        
                    <sos-dropdown-items
                        ng-if="steroids === true"
                        ng-show='filteredOptions.length > 0'
                        input='filteredOptionsInput$'>
                    </sos-dropdown-items>
        
                    <li 
                        ng-if="steroids === false"
                        ng-repeat-start="(index, option) in filteredOptions track by $index"
                        class="selector-optgroup"
                        ng-include="dropdownGroupTemplate"
                        ng-show="filteredOptions.length > 0 && groupAttr && (getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))">
                    </li>
        
                    <li 
                        ng-if="steroids === false"
                        ng-show="filteredOptions.length > 0"
                        ng-repeat-end
                        ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}"
                        class="selector-option js-data-item"
                        ng-include="dropdownItemTemplate"
                        ng-mouseover="highlight(index)"
                        ng-click="set()">
                    </li>
                </ul>
            </div>`;

        }
    },
    FUNCTIONS: {     
        CONSOLE_LOGGER: ($log, type, message: string) => { // TODO: pass method to invoke
            if ($log[type]) {
                $log[type](`Component: Selector On Sterorids: ${message}`);
            } else {
                $log['debug'](`Component: Selector On Sterorids: ${message}`);
            }
        },
        GET_DOM_STYLES: (element: HTMLElement) => {
            return !(element instanceof HTMLElement)
                ? {}
                : (element.ownerDocument && element.ownerDocument.defaultView.opener)
                    ? element.ownerDocument.defaultView.getComputedStyle(element)
                    : window.getComputedStyle(element);
        }
    }
}