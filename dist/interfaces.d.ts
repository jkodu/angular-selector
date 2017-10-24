import { Subject } from 'rxjs/Subject';
export declare namespace ISelector {
    namespace BaseComponent {
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
            filteredOptionsOutput$: Subject<ISelector.DropdownItemsComponent.Output$>;
            createOption: any;
            selectedValues: Array<any>;
            selectedValuesInput$: Subject<Array<any>>;
            selectedValuesOutput$: Subject<Array<any>>;
            set(option?: any): void;
            unset(index?: number): void;
            onNgModelChanged(propertyName: string, oldValue: any, newValue: any): void;
            angularCompileItems: boolean;
        }
    }
    namespace DropdownItemsComponent {
        enum StreamType {
            BOOT = "BOOT",
            RENDER = "RENDER",
            DESTROY = "DESTROY",
        }
        interface Input$ {
            type: StreamType;
            groupAttr?: any;
            getObjValue?: any;
            filteredOptions?: any[];
            highlighted?: number;
        }
        interface Output$ {
        }
        interface Scope extends angular.IScope {
            input: Subject<Input$>;
            output: Subject<Output$>;
        }
    }
}
