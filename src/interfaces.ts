

export namespace ISelector {

    export interface Scope extends angular.IScope {
        name,
        value,
        disabled,
        disableSearch,
        required,
        multiple,
        placeholder,
        valueAttr,
        labelAttr,
        groupAttr,
        options,
        debounce,
        create,
        limit,
        rtl,
        api, // to type this
        change,
        remote,
        remoteParam,
        remoteValidation,
        remoteValidationParam,
        removeButton,
        softDelete,
        closeAfterSelection,
        viewItemTemplate,
        dropdownItemTemplate,
        dropdownCreateTemplate,
        dropdownGroupTemplate,

        // CUSTOM MEMBERS ADDED to scope by old code, USED IN BINDINGS.
        getObjValue;
        hasValue;
        loading;
        search;
        highlight;
        highlighted;
        isOpen;
        filteredOptions;
        createOption;
        selectedValues : Array<any>;
        set(option?: any): void;
        unset(index?: number): void;

        // Alternative to watchers - change listeners
        onNgModelChanged(propertyName: string, oldValue: any, newValue: any): void;
    }
}
