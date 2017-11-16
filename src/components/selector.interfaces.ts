import { Subject } from 'rxjs/Subject';

export namespace ISelector {

    export namespace BaseComponent {
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

            filteredOptions: Array<any>;
            filteredOptionsInput$: Subject<ISelector.DropdownItemsComponent.Input$>;

            createOption;

            selectedValues: Array<any>;
            selectedValuesInput$: Subject<ISelector.SelectedItemsComponent.Input$>;

            set(option?: any): void;
            unset(index?: number): void;

            // optional rendering of rows in angular
            steroids: boolean;
        }
    }

    export namespace DropdownItemsComponent {

        export interface Input$ {
            groupAttr: any;
            valueAttr: any;
            labelAttr: any;
            getObjValue: Function;
            set: Function;
            filteredOptions: any[];
            highlighted: number;
            highlight: Function;
        }

        export interface Scope extends angular.IScope {
            input: Subject<Input$>;
        }
    }

    export namespace SelectedItemsComponent {
        export interface Input$ {
            groupAttr: any;
            valueAttr: any;
            labelAttr: any;
            getObjValue: Function;
            unset: Function;
            selectedValues: any[];
            multiple: boolean;
            disabled: boolean;
        }
        export interface Scope extends angular.IScope {
            input: Subject<Input$>;
        }
    }

}
