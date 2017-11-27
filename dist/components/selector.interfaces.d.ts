import { Subject } from 'rxjs/Subject';
export declare namespace ISelector {
    namespace BaseComponent {
        enum LastFocusedElement {
            NONE = "NONE",
            SELECTOR_DROPDOWN = "SELECTOR_DROPDOWN",
        }
        interface Scope extends angular.IScope {
            name: any;
            value: any;
            disabled: any;
            disableSearch: any;
            required: any;
            multiple: any;
            placeholder: any;
            valueAttr: any;
            labelAttr: any;
            groupAttr: any;
            options: any;
            debounce: any;
            create: any;
            limit: any;
            rtl: any;
            api: any;
            change: any;
            remote: any;
            remoteParam: any;
            remoteValidation: any;
            remoteValidationParam: any;
            removeButton: any;
            softDelete: any;
            closeAfterSelection: any;
            viewItemTemplate: any;
            dropdownItemTemplate: any;
            dropdownCreateTemplate: any;
            dropdownGroupTemplate: any;
            getObjValue: any;
            hasValue: any;
            loading: any;
            search: any;
            highlight: any;
            highlighted: any;
            isOpen: any;
            filteredOptions: Array<any>;
            filteredOptionsInput$: Subject<ISelector.DropdownItemsComponent.Input$>;
            createOption: any;
            selectedValues: Array<any>;
            selectedValuesInput$: Subject<ISelector.SelectedItemsComponent.Input$>;
            set(option?: any): void;
            unset(index?: number): void;
            steroids: boolean;
        }
    }
    namespace DropdownItemsComponent {
        interface Input$ {
            groupAttr: any;
            valueAttr: any;
            labelAttr: any;
            getObjValue: Function;
            set: Function;
            filteredOptions: any[];
            highlighted: number;
            highlight: Function;
        }
        interface Scope extends angular.IScope {
            input: Subject<Input$>;
        }
    }
    namespace SelectedItemsComponent {
        interface Input$ {
            groupAttr: any;
            valueAttr: any;
            labelAttr: any;
            getObjValue: Function;
            unset: Function;
            selectedValues: any[];
            multiple: boolean;
            disabled: boolean;
        }
        interface Scope extends angular.IScope {
            input: Subject<Input$>;
        }
    }
    namespace InstanceManagerService {
        interface SelectorInstance {
            guid: string;
            api: any;
        }
    }
}
