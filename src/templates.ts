export const TEMPLATE_ITEM_CREATE = () => {
    return `Add <i ng-bind="search"></i>`;
}
export const TEMPLATE_ITEM_DEFAULT = () => {
    return `<span ng-bind="getObjValue(option, labelAttr) || option"></span>`;
}

export const TEMPLATE_GROUP_DEFAULT = () => {
    return `<span ng-bind="getObjValue(option, groupAttr)"></span>`;
}

export const TEMPLATE_SELECTOR_SELECTED_ITEMS = () => {
    return `<div></div>`;
}

export const TEMPLATE_SELECTOR_DROPDOWN_ITEMS = () => {
    return `<div></div>`;
}

export const TEMPLATE_SELECTOR = () => {
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
                    ng-repeat="(index, option) in selectedValues track by $index">
                    <div ng-include="viewItemTemplate"></div>
                    <div 
                        ng-if="multiple" 
                        class="selector-helper" 
                        ng-click="!disabled && unset(index)">
                        <span class="selector-icon"></span>
                    </div>
                </li>

            </ul>
            <input 
                ng-model="search" 
                on-selector-ng-model-changed='onNgModelChanged'
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

};


// <li 
// ng-if="steroids === false"
// ng-repeat="(index, option) in selectedValues track by $index">
// <div ng-include="viewItemTemplate"></div>
// <div 
//     ng-if="multiple" 
//     class="selector-helper" 
//     ng-click="!disabled && unset(index)">
//     <span class="selector-icon"></span>
// </div>
// </li>



// <sos-selected-items
// ng-if="steroids === true"
// input='selectedValuesInput$'>
// </sos-selected-items>