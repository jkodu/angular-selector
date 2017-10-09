interface ISelectorScope extends angular.IScope {
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
    selectedValues;
    set(option?: any): void;
    unset(index?: number): void;

    // Alternative to watchers - change listeners
    onNgModelChanged(propertyName: string, oldValue: any, newValue: any): void;
}

const CONSTANTS = {
    // Key codes
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
        SELECTOR: `
        <div class="selector-container"
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
                    <li ng-repeat="(index, option) in selectedValues track by index">
                        <div ng-include="viewItemTemplate"></div>
                        <div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">
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
            <ul class="selector-dropdown"
                ng-show="filteredOptions.length > 0 || (create && search)">
                <li class="selector-option create"
                    ng-class="{active: highlighted == -1}"
                    ng-if="create && search"
                    ng-include="dropdownCreateTemplate"
                    ng-mouseover="highlight(-1)"
                    ng-click="createOption(search)"></li>
                <li ng-repeat-start="(index, option) in filteredOptions track by index"
                    class="selector-optgroup"
                    ng-include="dropdownGroupTemplate"
                    ng-show="groupAttr && (getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))"></li>
                <li ng-repeat-end
                    ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}"
                    class="selector-option"
                    ng-include="dropdownItemTemplate"
                    ng-mouseover="highlight(index)"
                    ng-click="set()">
                </li>
            </ul>
        </div>`,
        ITEM_CREATE: `Add <i ng-bind="search"></i>`,
        ITEM_DEFAULT: `<span ng-bind="getObjValue(option, labelAttr) || option"></span>`,
        GROUP_DEFAULT: `<span ng-bind="getObjValue(option, groupAttr)"></span>`
    }
}

const DOM_FUNCTIONS = {
    getStyles: (element: HTMLElement) => {
        return !(element instanceof HTMLElement)
            ? {}
            : element.ownerDocument && element.ownerDocument.defaultView.opener
                ? element.ownerDocument.defaultView.getComputedStyle(element)
                : window.getComputedStyle(element);
    }
}

class SelectorDirective {

    public link: (scope: ISelectorScope,
        element: angular.IAugmentedJQuery,
        attrs: angular.IAttributes,
        controller: angular.IController,
        transclude: angular.ITranscludeFunction) => void;

    public restrict: string = 'EAC';
    public replace: boolean = true;
    public transclude: boolean = true;
    public templateUrl: string = 'selector/selector.html';

    public scope: any = {
        name: '@?',
        value: '=model',
        disabled: '=?disable',
        disableSearch: '=?',
        required: '=?require',
        multiple: '=?multi',
        placeholder: '@?',
        valueAttr: '@',
        labelAttr: '@?',
        groupAttr: '@?',
        options: '=?',
        debounce: '=?',
        create: '&?',
        limit: '=?',
        rtl: '=?',
        api: '=?',
        change: '&?',
        remote: '&?',
        remoteParam: '@?',
        remoteValidation: '&?',
        remoteValidationParam: '@?',
        removeButton: '=?',
        softDelete: '=?',
        closeAfterSelection: '=?',
        viewItemTemplate: '=?',
        dropdownItemTemplate: '=?',
        dropdownCreateTemplate: '=?',
        dropdownGroupTemplate: '=?'
    };

    constructor(
        private $filter: angular.IFilterService,
        private $timeout: angular.ITimeoutService,
        private $window: angular.IWindowService,
        private $http: angular.IHttpService,
        private $q: angular.IQService) {

        SelectorDirective.prototype.link = (scope: ISelectorScope,
            element: angular.IAugmentedJQuery,
            attrs: angular.IAttributes,
            controller: angular.IController,
            transclude: angular.ITranscludeFunction) => {

            transclude(scope, (clone: any, scope: ISelectorScope) => {

                $timeout(() => {

                }, 0, false);

                const filter = $filter('filter');
                const DOM_SELECTOR_CONTAINER = angular.element(element[0]);
                const DOM_SELECTOR_DROPDOWN = angular.element(element[0].querySelector('.selector-dropdown'));
                const DOM_SELECTOR_INPUT = angular.element(element[0].querySelector('.selector-input input'));

                let inputCtrl = DOM_SELECTOR_INPUT.controller('ngModel');
                let selectCtrl = element.find('select').controller('ngModel');

                let initDeferred = $q.defer();
                let defaults = {
                    api: {},
                    search: '',
                    disableSearch: false,
                    selectedValues: [],
                    highlighted: 0,
                    valueAttr: null,
                    labelAttr: 'label',
                    groupAttr: 'group',
                    options: [],
                    debounce: 0,
                    limit: Infinity,
                    remoteParam: 'q',
                    remoteValidationParam: 'value',
                    removeButton: true,
                    viewItemTemplate: 'selector/item-default.html',
                    dropdownItemTemplate: 'selector/item-default.html',
                    dropdownCreateTemplate: 'selector/item-create.html',
                    dropdownGroupTemplate: 'selector/group-default.html'
                };

                // watch alternative - model change listener
                scope.onNgModelChanged = (propertyName, oldValue, newValue) => {
                    console.log(oldValue, newValue, propertyName);
                    if (propertyName === `search`) {
                        _onSearchModelChanged();
                    }
                };

                const _onSearchModelChanged = () => {
                    if (scope.remote) {
                        $timeout(fetch);
                    }
                }

                const _onSelectedValuesChanges = (newValue, oldValue) => {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    updateValue();
                    if (angular.isFunction(scope.change)) {
                        scope.change(scope.multiple
                            ? {
                                newValue: newValue,
                                oldValue: oldValue
                            }
                            : {
                                newValue: (newValue || [])[0],
                                oldValue: (oldValue || [])[0]
                            });
                    }
                };

             
                // scope.$watch('selectedValues', (newValue, oldValue) => {
                //     _onSelectedValuesChanges(newValue,oldValue)
                // }, true);

                // DEFAULT BOOT WATCH FNS? TODO: think through the logic


                // Default attributes
                if (!angular.isDefined(scope.value) && scope.multiple) {
                    scope.value = []
                };



                angular.forEach(defaults, (value, key) => {
                    if (!angular.isDefined(scope[key])) {
                        scope[key] = value
                    };
                });

                angular.forEach(['name', 'valueAttr', 'labelAttr'], (attr) => {
                    if (!attrs[attr]) attrs[attr] = scope[attr];
                });

                // Options' utilities
                const optionValue = (option) => {
                    return scope.valueAttr == null
                        ? option
                        : scope.getObjValue(option, scope.valueAttr);
                };

                const setObjValue = (obj, path, value) => {
                    let key;
                    if (!angular.isDefined(obj)) {
                        obj = {}
                    };
                    path = angular.isArray(path)
                        ? path
                        : path.split('.');
                    key = path.shift();

                    if (key.indexOf('[') > 0) {
                        const match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    obj[key] = path.length === 0
                        ? value
                        : setObjValue(obj[key], path, value);
                    return obj;
                };

                const optionEquals = (option, value?) => {
                    return angular.equals(optionValue(option), angular.isDefined(value)
                        ? value
                        : scope.value);
                };

                scope.getObjValue = (obj, path) => {
                    let key;
                    if (!angular.isDefined(obj) || !angular.isDefined(path)) return obj;
                    path = angular.isArray(path) ? path : path.split('.');
                    key = path.shift();

                    if (key.indexOf('[') > 0) {
                        const match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
                };

                // Value utilities
                const setValue = (value) => {
                    if (!scope.multiple) scope.value = scope.valueAttr == null ? value : scope.getObjValue(value || {}, scope.valueAttr);
                    else scope.value = scope.valueAttr == null ? (value || []) : (value || [])
                        .map((option) => {
                            return scope.getObjValue(option, scope.valueAttr);
                        });
                };

                scope.hasValue = () => {
                    return scope.multiple ? (scope.value || [])
                        .length > 0 : !!scope.value;
                };

                // Remote fetching
                const request = (paramName, paramValue, remote, remoteParam) => {
                    let promise, remoteOptions = {};
                    if (scope.disabled) return $q.reject();
                    if (!angular.isDefined(remote))
                        throw 'Remote attribute is not defined';

                    scope.loading = true;
                    scope.options = [];
                    remoteOptions[paramName] = paramValue;
                    promise = remote(remoteOptions);
                    if (typeof promise.then !== 'function') {
                        const settings = {
                            method: 'GET',
                            cache: true,
                            params: {}
                        };
                        angular.extend(settings, promise);
                        angular.extend(settings.params, promise.params);
                        settings.params[remoteParam] = paramValue;
                        promise = $http(settings as any);
                    }
                    promise
                        .then((data) => {
                            scope.options = data.data || data;
                            filterOptions();
                            scope.loading = false;
                            initDeferred.resolve();
                        }, (error) => {
                            scope.loading = false;
                            initDeferred.reject();
                            throw 'Error while fetching data: ' + (error.message || error);
                        });
                    return promise;
                };

                const fetch = () => {
                    return request('search', scope.search || '', scope.remote, scope.remoteParam);
                };

                const fetchValidation = (value) => {
                    return request('value', value, scope.remoteValidation, scope.remoteValidationParam);
                };

                if (!angular.isDefined(scope.remote)) {
                    scope.remote = false;
                    scope.remoteValidation = false;
                    initDeferred.resolve();
                } else {
                    if (!angular.isDefined(scope.remoteValidation)) {
                        scope.remoteValidation = false;
                    }
                }
                if (scope.remote) {
                    $timeout(() => {
                        $q.when(!scope.hasValue() || !scope.remoteValidation
                            ? angular.noop
                            : fetchValidation(scope.value)
                        ).then(() => {
                            // NOTE: Here used to be watcher for search attribute, wich now is moved to $viewChangeListener.
                        });
                    });
                }

                // Fill with options in the select
                const optionToObject = (option, group?) => {
                    let object = {};
                    const element = angular.element(option);

                    angular.forEach(option.dataset, (value, key) => {
                        if (!key.match(/^\$/)) {
                            object[key] = value
                        };
                    });
                    if (option.value) {
                        setObjValue(object, scope.valueAttr || 'value', option.value);
                    }
                    if (element.text()) {
                        setObjValue(object, scope.labelAttr, element.text()
                            .trim());
                    }
                    if (angular.isDefined(group)) {
                        setObjValue(object, scope.groupAttr, group);
                    }
                    scope.options.push(object);

                    if (element.attr('selected') && (scope.multiple || !scope.hasValue()))
                        if (!scope.multiple) {
                            if (!scope.value) {
                                scope.value = optionValue(object)
                            };
                        } else {
                            if (!scope.value) {
                                scope.value = [];
                            }
                            scope.value.push(optionValue(object));
                        }
                };

                const fillWithHtml = () => {
                    scope.options = [];
                    angular.forEach(clone, (element) => {
                        const tagName = (element.tagName || '').toLowerCase();
                        if (tagName == 'option') {
                            optionToObject(element);
                        }
                        if (tagName == 'optgroup') {
                            angular.forEach(element.querySelectorAll('option'), (option) => {
                                optionToObject(option, (element.attributes.label || {}).value);
                            });
                        }
                    });
                    updateSelected();
                };

                // Initialization
                const initialize = () => {
                    if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length)) {
                        fillWithHtml();
                    }
                    if (scope.hasValue()) {
                        if (!scope.multiple) {
                            if (angular.isArray(scope.value)) scope.value = scope.value[0];
                        } else {
                            if (!angular.isArray(scope.value)) scope.value = [scope.value];
                        }
                        updateSelected();
                        filterOptions();
                        updateValue();
                    }

                };


                const reInitMultiple = () => {
                    // TODO: Extract to common logging method.
                    console.log(`Component: Angular Selector On Steroids: Log: Multiple Init invoked.`)
                    $timeout(setInputWidth);
                    initDeferred.promise.then(initialize, initialize); //TODO: WHAT IS THIS?
                }

                let _previousClassString: string = null;
                new MutationObserver((event) => {
                    const newClassString = (event[0].target as HTMLElement).classList.toString();
                    if (_previousClassString &&
                        newClassString !== _previousClassString) {
                        const newHasMultiple = (newClassString.indexOf('multiple') !== -1);
                        const oldHasMultiple = (_previousClassString.indexOf('multiple') !== -1);
                        if (newHasMultiple !== oldHasMultiple) {
                            reInitMultiple();
                        }
                    }
                    // on first init
                    if (!_previousClassString) {
                        reInitMultiple();
                    }
                    _previousClassString = newClassString;
                }).observe(DOM_SELECTOR_CONTAINER[0], {
                    attributes: true,
                    attributeFilter: ['class']
                });

                // Dropdown utilities
                const dropdownPosition = () => {
                    const label = DOM_SELECTOR_INPUT.parent()[0];
                    const styles = DOM_FUNCTIONS.getStyles(label);
                    const marginTop = parseFloat((<any>styles).marginTop || 0);
                    const marginLeft = parseFloat((<any>styles).marginLeft || 0);
                    if (label) {
                        DOM_SELECTOR_DROPDOWN.css({
                            top: (label.offsetTop + label.offsetHeight + marginTop) + 'px',
                            left: (label.offsetLeft + marginLeft) + 'px',
                            width: label.offsetWidth + 'px'
                        });
                    }
                };

                const open = () => {
                    if (scope.multiple && (scope.selectedValues || [])
                        .length >= scope.limit) return;
                    scope.isOpen = true;
                    dropdownPosition();
                    $timeout(scrollToHighlighted);
                };
                const close = () => {
                    scope.isOpen = false;
                    resetInput();
                    if (scope.remote) {
                        $timeout(fetch);
                    };
                };

                const decrementHighlighted = () => {
                    scope.highlight(scope.highlighted - 1);
                    scrollToHighlighted();
                };

                const incrementHighlighted = () => {
                    scope.highlight(scope.highlighted + 1);
                    scrollToHighlighted();
                };
                scope.highlight = (index) => {
                    if (attrs.create && scope.search && index == -1)
                        scope.highlighted = -1;
                    else
                        if (scope.filteredOptions.length)
                            scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                };
                const scrollToHighlighted = () => {
                    const dd = DOM_SELECTOR_DROPDOWN[0];
                    const option = dd.querySelectorAll('li.selector-option')[scope.highlighted] as HTMLElement;
                    const styles = DOM_FUNCTIONS.getStyles(option);
                    const marginTop = parseFloat((<any>styles).marginTop || 0);
                    const marginBottom = parseFloat((<any>styles).marginBottom || 0);

                    if (!scope.filteredOptions.length) {
                        return;
                    }

                    if (option.offsetTop + option.offsetHeight + marginBottom > dd.scrollTop + dd.offsetHeight)
                        $timeout(() => {
                            dd.scrollTop = option.offsetTop + option.offsetHeight + marginBottom - dd.offsetHeight;
                        });

                    if (option.offsetTop - marginTop < dd.scrollTop)
                        $timeout(() => {
                            dd.scrollTop = option.offsetTop - marginTop;
                        });
                };
                scope.createOption = (value) => {
                    $q.when((() => {
                        let option = {};
                        if (angular.isFunction(scope.create)) {
                            option = scope.create({
                                input: value
                            });
                        } else {
                            setObjValue(option, scope.labelAttr, value);
                            setObjValue(option, scope.valueAttr || 'value', value);
                        }
                        return option;
                    })())
                        .then((option) => {
                            scope.options.push(option);
                            scope.set(option);
                        });
                };
                scope.set = (option) => {
                    if (scope.multiple && (scope.selectedValues || [])
                        .length >= scope.limit) return;

                    if (!angular.isDefined(option))
                        option = scope.filteredOptions[scope.highlighted];

                    if (!scope.multiple) scope.selectedValues = [option];
                    else {
                        if (!scope.selectedValues)
                            scope.selectedValues = [];
                        if (scope.selectedValues.indexOf(option) < 0)
                            scope.selectedValues.push(option);
                    }
                    if (!scope.multiple || scope.closeAfterSelection || (scope.selectedValues || [])
                        .length >= scope.limit) close();
                    resetInput();
                    _onSelectedValuesChanges(option, scope.selectedValues);
                    selectCtrl.$setDirty();
                };
                scope.unset = (index) => {
                    let oldV = Object.create({}, scope.selectedValues);
                    if (!scope.multiple) {
                        scope.selectedValues = [];
                    }
                    else {
                        scope.selectedValues.splice(
                            angular.isDefined(index)
                                ? index
                                : scope.selectedValues.length - 1, 1);
                    }
                    resetInput();
                    selectCtrl.$setDirty();
                    let nV = scope.selectedValues;
                    _onSelectedValuesChanges(nV, oldV)
                };

                const keydown = (e) => {
                    switch (e.keyCode) {
                        case CONSTANTS.KEYS.up:
                            if (!scope.isOpen) break;
                            decrementHighlighted();
                            e.preventDefault();
                            break;
                        case CONSTANTS.KEYS.down:
                            if (!scope.isOpen) {
                                open();
                            }
                            else {
                                incrementHighlighted();
                            }
                            e.preventDefault();
                            break;
                        case CONSTANTS.KEYS.escape:
                            scope.highlight(0);
                            close();
                            break;
                        case CONSTANTS.KEYS.enter:
                            if (scope.isOpen) {
                                if (attrs.create && scope.search && scope.highlighted == -1)
                                    scope.createOption(e.target.value);
                                else
                                    if (scope.filteredOptions.length)
                                        scope.set();
                                e.preventDefault();
                            }
                            break;
                        case CONSTANTS.KEYS.backspace:
                            if (!DOM_SELECTOR_INPUT.val()) {
                                const search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                scope.unset();
                                open();
                                if (scope.softDelete && !scope.disableSearch)
                                    $timeout(() => {
                                        scope.search = search;
                                    });
                                e.preventDefault();
                            }
                            break;
                        case CONSTANTS.KEYS.left:
                        case CONSTANTS.KEYS.right:
                        case CONSTANTS.KEYS.shift:
                        case CONSTANTS.KEYS.ctrl:
                        case CONSTANTS.KEYS.alt:
                        case CONSTANTS.KEYS.tab:
                        case CONSTANTS.KEYS.leftCmd:
                        case CONSTANTS.KEYS.rightCmd:
                            break;
                        default:
                            if (!scope.multiple && scope.hasValue()) {
                                e.preventDefault();
                            } else {
                                open();
                                scope.highlight(0);
                            }
                            break;
                    }
                };

                // Filtered options
                const inOptions = (options, value) => {
                    // if options are fetched from a remote source, it's not possibile to use
                    // the simplest check with native `indexOf` function, beacause every object
                    // in the results array has it own new address
                    if (scope.remote)
                        return options.filter((option) => {
                            return angular.equals(value, option);
                        })
                            .length > 0;
                    else
                        return options.indexOf(value) >= 0;
                };

                const filterOptions = () => {
                    scope.filteredOptions = filter(scope.options || [], scope.search);
                    if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
                    if (scope.multiple)
                        scope.filteredOptions = scope.filteredOptions.filter((option) => {
                            return !inOptions(scope.selectedValues, option);
                        });
                    else {
                        const index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                        if (index >= 0) {
                            scope.highlight(index)
                        };
                    }
                };

                // Input width utilities
                const measureWidth = () => {
                    let width;
                    const styles = DOM_FUNCTIONS.getStyles(DOM_SELECTOR_INPUT[0]);
                    const shadow = angular.element('<span class="selector-shadow"></span>');

                    shadow.text(DOM_SELECTOR_INPUT.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                    angular.element(document.body)
                        .append(shadow);
                    angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                        shadow.css(style, styles[style]);
                    });
                    width = shadow[0].offsetWidth;
                    shadow.remove();
                    return width;
                };

                const setInputWidth = () => {
                    const width = measureWidth() + 1;
                    DOM_SELECTOR_INPUT.css('width', width + 'px');
                };

                const resetInput = () => {
                    DOM_SELECTOR_INPUT.val('');
                    setInputWidth();
                    $timeout(() => {
                        scope.search = '';
                    });
                };

                scope.$watch('[search, options, value]', () => {
                    // hide selected items
                    filterOptions();
                    $timeout(() => {
                        // set input width
                        setInputWidth();
                        // repositionate dropdown
                        if (scope.isOpen) {
                            dropdownPosition();
                        }
                    });
                }, true);

                // Update value
                const updateValue = (origin?) => {
                    if (!angular.isDefined(origin)) {
                        origin = scope.selectedValues || [];
                    }
                    setValue(!scope.multiple ? origin[0] : origin);
                };

                scope.$watchCollection('options', (newValue, oldValue) => {
                    if (angular.equals(newValue, oldValue) || scope.remote) {
                        return;
                    };
                    updateSelected();
                });

                // Update selected values
                const updateSelected = () => {
                    if (!scope.multiple) {
                        scope.selectedValues =
                            (scope.options || [])
                                .filter((option) => {
                                    return optionEquals(option);
                                })
                                .slice(0, 1);
                    }
                    else {
                        scope.selectedValues =
                            (scope.value || [])
                                .map((value) => {
                                    return filter(scope.options, (option) => {
                                        return optionEquals(option, value);
                                    })[0];
                                })
                                .filter((value) => {
                                    return angular.isDefined(value);
                                })
                                .slice(0, scope.limit);
                    }
                };

                scope.$watch('value', (newValue, oldValue) => {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    $q
                        .when(!scope.remote || !scope.remoteValidation || !scope.hasValue()
                            ? angular.noop
                            : fetchValidation(newValue))
                        .then(() => {
                            updateSelected();
                            filterOptions();
                            updateValue();
                        });
                }, true);

                // DOM event listeners
                //  = angular.element(element[0].querySelector('.selector-input input'))
                DOM_SELECTOR_INPUT
                    .on('focus', () => {
                        $timeout(() => {
                            scope.$apply(open);
                        });
                    })
                    .on('blur', () => {
                        scope.$apply(close);
                    })
                    .on('keydown', (e) => {
                        scope.$apply(() => {
                            keydown(e);
                        });
                    })
                    .on('input', () => {
                        setInputWidth();
                    });
                DOM_SELECTOR_DROPDOWN
                    .on('mousedown', (e) => {
                        e.preventDefault();
                    });
                angular.element($window)
                    .on('resize', () => {
                        dropdownPosition();
                    });

                // Update select controller
                // TODO: Rajesh - mutation observer
                // scope.$watch(() => {
                //     return inputCtrl.$pristine;
                // }, ($pristine) => {
                //     selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
                // });

                // TODO: Rajesh - mutation observer
                // scope.$watch(() => {
                //     return inputCtrl.$touched;
                // }, ($touched) => {
                //     selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
                // });
                let _previousStateClassString: string = null;
                new MutationObserver((event) => {
                    const _target = (event[0].target as HTMLElement);
                    const _inputElem = angular.element(_target).find('input')
                    
                    if(_inputElem) {
                        selectCtrl[inputCtrl.$touched ? '$setTouched' : '$setUntouched']();
                        selectCtrl[inputCtrl.$pristine ? '$setPristine' : '$setDirty']();
                    }
                }).observe(DOM_SELECTOR_CONTAINER[0], {
                    attributes: true,
                    attributeFilter: ['class']
                });                

                // Expose APIs
                scope.api.fetch = fetch;
                scope.api.open = open;
                scope.api.close = close;
                scope.api.focus = () => {
                    DOM_SELECTOR_INPUT[0].focus();
                };
                scope.api.set = (value) => {
                    return scope.value = value;
                };
                scope.api.unset = (value) => {
                    const values = !value ? scope.selectedValues : (scope.selectedValues || [])
                        .filter((option) => {
                            return optionEquals(option, value);
                        });
                    const indexes =
                        scope.selectedValues
                            .map((option, index) => {
                                return inOptions(values, option) ? index : -1;
                            })
                            .filter((index) => {
                                return index >= 0;
                            });
                    angular.forEach(indexes, (index, i) => {
                        scope.unset(index - i);
                    });
                };

            });
        }
    }

    public static Factory() {
        let directive = ($filter, $timeout, $window, $http, $q) => {
            return new SelectorDirective($filter, $timeout, $window, $http, $q);
        };
        directive['$inject'] = ['$filter', '$timeout', '$window', '$http', '$q'];
        return directive;
    }
}

angular
    .module('selector', [])
    .run(['$templateCache', ($templateCache) => {
        $templateCache.put('selector/selector.html', CONSTANTS.TEMPLATES.SELECTOR);
        $templateCache.put('selector/item-create.html', CONSTANTS.TEMPLATES.ITEM_CREATE);
        $templateCache.put('selector/item-default.html', CONSTANTS.TEMPLATES.ITEM_DEFAULT);
        $templateCache.put('selector/group-default.html', CONSTANTS.TEMPLATES.GROUP_DEFAULT);
    }])
    .directive("onSelectorNgModelChanged", () => {
        return {
            scope: {
                onSelectorNgModelChanged: "&"
            },
            require: "ngModel",
            link: function (scope: any, element, attrs, ctrl: any) {
                let oldValue;
                ctrl.$formatters.push((value) => {
                    oldValue = value;
                    return value;
                });
                ctrl.$viewChangeListeners.push(() => {
                    const ngModelName = attrs['ngModel']; // TODO: UNDEFINED CHECK
                    scope.onSelectorNgModelChanged()(ngModelName, oldValue, ctrl.$modelValue);
                    oldValue = ctrl.$modelValue;
                });
            }
        };
    })
    .directive('selector', SelectorDirective.Factory());
