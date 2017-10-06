
// Key codes
const KEYS = {
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
};

const getStyles = (element: HTMLElement) => {
    return !(element instanceof HTMLElement)
        ? {}
        : element.ownerDocument && element.ownerDocument.defaultView.opener
            ? element.ownerDocument.defaultView.getComputedStyle(element)
            : window.getComputedStyle(element);
}

class SelectorDirective {


    public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller, transclude) => void;
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

        SelectorDirective.prototype.link = (scope, element, attrs, controller, transclude) => {
            transclude(scope, (clone, scope) => {
                let filter = $filter('filter');
                let input = angular.element(element[0].querySelector('.selector-input input'));
                let dropdown = angular.element(element[0].querySelector('.selector-dropdown'));
                let inputCtrl = input.controller('ngModel');
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
                scope.setObjValue = (obj, path, value) => {
                    let key;
                    if (!angular.isDefined(obj)) obj = {};
                    path = angular.isArray(path) ? path : path.split('.');
                    key = path.shift();

                    if (key.indexOf('[') > 0) {
                        const match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
                    return obj;
                };
                scope.optionValue = (option) => {
                    return scope.valueAttr == null ? option : scope.getObjValue(option, scope.valueAttr);
                };
                scope.optionEquals = (option, value) => {
                    return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
                };

                // Value utilities
                scope.setValue = (value) => {
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
                scope.request = (paramName, paramValue, remote, remoteParam) => {
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
                            scope.filterOptions();
                            scope.loading = false;
                            initDeferred.resolve();
                        }, (error) => {
                            scope.loading = false;
                            initDeferred.reject();
                            throw 'Error while fetching data: ' + (error.message || error);
                        });
                    return promise;
                };
                scope.fetch = () => {
                    return scope.request('search', scope.search || '', scope.remote, scope.remoteParam);
                };
                scope.fetchValidation = (value) => {
                    return scope.request('value', value, scope.remoteValidation, scope.remoteValidationParam);
                };
                if (!angular.isDefined(scope.remote)) {
                    scope.remote = false;
                    scope.remoteValidation = false;
                    initDeferred.resolve();
                } else
                    if (!angular.isDefined(scope.remoteValidation))
                        scope.remoteValidation = false;
                if (scope.remote)
                    $timeout(() => {
                        $q.when(!scope.hasValue() || !scope.remoteValidation ?
                            angular.noop :
                            scope.fetchValidation(scope.value)
                        )
                            .then(() => {
                                scope.$watch('search', () => {
                                    $timeout(scope.fetch);
                                });
                            });
                    });

                // Fill with options in the select
                scope.optionToObject = (option, group) => {
                    let object = {};
                    const element = angular.element(option);

                    angular.forEach(option.dataset, (value, key) => {
                        if (!key.match(/^\$/)) {
                            object[key] = value
                        };
                    });
                    if (option.value) {
                        scope.setObjValue(object, scope.valueAttr || 'value', option.value);
                    }
                    if (element.text()) {
                        scope.setObjValue(object, scope.labelAttr, element.text()
                            .trim());
                    }
                    if (angular.isDefined(group)) {
                        scope.setObjValue(object, scope.groupAttr, group);
                    }
                    scope.options.push(object);

                    if (element.attr('selected') && (scope.multiple || !scope.hasValue()))
                        if (!scope.multiple) {
                            if (!scope.value) {
                                scope.value = scope.optionValue(object)
                            };
                        } else {
                            if (!scope.value) {
                                scope.value = [];
                            }
                            scope.value.push(scope.optionValue(object));
                        }
                };
                scope.fillWithHtml = () => {
                    scope.options = [];
                    angular.forEach(clone, (element) => {
                        const tagName = (element.tagName || '').toLowerCase();

                        if (tagName == 'option') {
                            scope.optionToObject(element);
                        }
                        if (tagName == 'optgroup') {
                            angular.forEach(element.querySelectorAll('option'), (option) => {
                                scope.optionToObject(option, (element.attributes.label || {})
                                    .value);
                            });
                        }
                    });
                    scope.updateSelected();
                };

                // Initialization
                scope.initialize = () => {
                    if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length))
                        scope.fillWithHtml();
                    if (scope.hasValue()) {
                        if (!scope.multiple) {
                            if (angular.isArray(scope.value)) scope.value = scope.value[0];
                        } else {
                            if (!angular.isArray(scope.value)) scope.value = [scope.value];
                        }
                        scope.updateSelected();
                        scope.filterOptions();
                        scope.updateValue();
                    }
                };
                scope.$watch('multiple', () => {
                    $timeout(scope.setInputWidth);
                    initDeferred.promise.then(scope.initialize, scope.initialize);
                });

                // Dropdown utilities
                scope.dropdownPosition = () => {
                    const label = input.parent()[0];
                    const styles = getStyles(label);
                    const marginTop = parseFloat((<any>styles).marginTop || 0);
                    const marginLeft = parseFloat((<any>styles).marginLeft || 0);

                    if (label) {
                        dropdown.css({
                            top: (label.offsetTop + label.offsetHeight + marginTop) + 'px',
                            left: (label.offsetLeft + marginLeft) + 'px',
                            width: label.offsetWidth + 'px'
                        });
                    }
                };
                scope.open = () => {
                    if (scope.multiple && (scope.selectedValues || [])
                        .length >= scope.limit) return;
                    scope.isOpen = true;
                    scope.dropdownPosition();
                    $timeout(scope.scrollToHighlighted);
                };
                scope.close = () => {
                    scope.isOpen = false;
                    scope.resetInput();

                    if (scope.remote) {
                        $timeout(scope.fetch);
                    };
                };
                scope.decrementHighlighted = () => {
                    scope.highlight(scope.highlighted - 1);
                    scope.scrollToHighlighted();
                };
                scope.incrementHighlighted = () => {
                    scope.highlight(scope.highlighted + 1);
                    scope.scrollToHighlighted();
                };
                scope.highlight = (index) => {
                    if (attrs.create && scope.search && index == -1)
                        scope.highlighted = -1;
                    else
                        if (scope.filteredOptions.length)
                            scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                };
                scope.scrollToHighlighted = () => {
                    const dd = dropdown[0];
                    const option = dd.querySelectorAll('li.selector-option')[scope.highlighted] as HTMLElement;
                    const styles = getStyles(option);
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
                            scope.setObjValue(option, scope.labelAttr, value);
                            scope.setObjValue(option, scope.valueAttr || 'value', value);
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
                        .length >= scope.limit) scope.close();
                    scope.resetInput();
                    selectCtrl.$setDirty();
                };
                scope.unset = (index) => {
                    if (!scope.multiple) {
                        scope.selectedValues = [];
                    }
                    else {
                        scope.selectedValues.splice(
                            angular.isDefined(index)
                                ? index
                                : scope.selectedValues.length - 1, 1);
                    }
                    scope.resetInput();
                    selectCtrl.$setDirty();
                };
                scope.keydown = (e) => {
                    switch (e.keyCode) {
                        case KEYS.up:
                            if (!scope.isOpen) break;
                            scope.decrementHighlighted();
                            e.preventDefault();
                            break;
                        case KEYS.down:
                            if (!scope.isOpen) scope.open();
                            else scope.incrementHighlighted();
                            e.preventDefault();
                            break;
                        case KEYS.escape:
                            scope.highlight(0);
                            scope.close();
                            break;
                        case KEYS.enter:
                            if (scope.isOpen) {
                                if (attrs.create && scope.search && scope.highlighted == -1)
                                    scope.createOption(e.target.value);
                                else
                                    if (scope.filteredOptions.length)
                                        scope.set();
                                e.preventDefault();
                            }
                            break;
                        case KEYS.backspace:
                            if (!input.val()) {
                                const search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                scope.unset();
                                scope.open();
                                if (scope.softDelete && !scope.disableSearch)
                                    $timeout(() => {
                                        scope.search = search;
                                    });
                                e.preventDefault();
                            }
                            break;
                        case KEYS.left:
                        case KEYS.right:
                        case KEYS.shift:
                        case KEYS.ctrl:
                        case KEYS.alt:
                        case KEYS.tab:
                        case KEYS.leftCmd:
                        case KEYS.rightCmd:
                            break;
                        default:
                            if (!scope.multiple && scope.hasValue()) {
                                e.preventDefault();
                            } else {
                                scope.open();
                                scope.highlight(0);
                            }
                            break;
                    }
                };

                // Filtered options
                scope.inOptions = (options, value) => {
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
                scope.filterOptions = () => {
                    scope.filteredOptions = filter(scope.options || [], scope.search);
                    if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
                    if (scope.multiple)
                        scope.filteredOptions = scope.filteredOptions.filter((option) => {
                            return !scope.inOptions(scope.selectedValues, option);
                        });
                    else {
                        const index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                        if (index >= 0) {
                            scope.highlight(index)
                        };
                    }
                };

                // Input width utilities
                scope.measureWidth = () => {
                    let width;
                    const styles = getStyles(input[0]);
                    const shadow = angular.element('<span class="selector-shadow"></span>');

                    shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                    angular.element(document.body)
                        .append(shadow);
                    angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                        shadow.css(style, styles[style]);
                    });
                    width = shadow[0].offsetWidth;
                    shadow.remove();
                    return width;
                };

                scope.setInputWidth = () => {
                    const width = scope.measureWidth() + 1;
                    input.css('width', width + 'px');
                };

                scope.resetInput = () => {
                    input.val('');
                    scope.setInputWidth();
                    $timeout(() => {
                        scope.search = '';
                    });
                };

                scope.$watch('[search, options, value]', () => {
                    // hide selected items
                    scope.filterOptions();
                    $timeout(() => {
                        // set input width
                        scope.setInputWidth();
                        // repositionate dropdown
                        if (scope.isOpen) {
                            scope.dropdownPosition();
                        }
                    });
                }, true);

                // Update value
                scope.updateValue = (origin) => {
                    if (!angular.isDefined(origin)) {
                        origin = scope.selectedValues || [];
                    }
                    scope.setValue(!scope.multiple ? origin[0] : origin);
                };
                scope.$watch('selectedValues', (newValue, oldValue) => {
                    if (angular.equals(newValue, oldValue)) return;
                    scope.updateValue();
                    if (angular.isFunction(scope.change))
                        scope.change(scope.multiple ? {
                            newValue: newValue,
                            oldValue: oldValue
                        } : {
                                newValue: (newValue || [])[0],
                                oldValue: (oldValue || [])[0]
                            });
                }, true);

                scope.$watchCollection('options', (newValue, oldValue) => {
                    if (angular.equals(newValue, oldValue) || scope.remote) {
                        return;
                    };
                    scope.updateSelected();
                });

                // Update selected values
                scope.updateSelected = () => {
                    if (!scope.multiple) {
                        scope.selectedValues =
                            (scope.options || [])
                                .filter((option) => {
                                    return scope.optionEquals(option);
                                })
                                .slice(0, 1);
                    }
                    else {
                        scope.selectedValues =
                            (scope.value || [])
                                .map((value) => {
                                    return filter(scope.options, (option) => {
                                        return scope.optionEquals(option, value);
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
                            : scope.fetchValidation(newValue))
                        .then(() => {
                            scope.updateSelected();
                            scope.filterOptions();
                            scope.updateValue();
                        });
                }, true);

                // DOM event listeners
                input = angular.element(element[0].querySelector('.selector-input input'))
                    .on('focus', () => {
                        $timeout(() => {
                            scope.$apply(scope.open);
                        });
                    })
                    .on('blur', () => {
                        scope.$apply(scope.close);
                    })
                    .on('keydown', (e) => {
                        scope.$apply(() => {
                            scope.keydown(e);
                        });
                    })
                    .on('input', () => {
                        scope.setInputWidth();
                    });
                dropdown
                    .on('mousedown', (e) => {
                        e.preventDefault();
                    });
                angular.element($window)
                    .on('resize', () => {
                        scope.dropdownPosition();
                    });

                // Update select controller
                scope.$watch(() => {
                    return inputCtrl.$pristine;
                }, ($pristine) => {
                    selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
                });

                scope.$watch(() => {
                    return inputCtrl.$touched;
                }, ($touched) => {
                    selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
                });

                // Expose APIs
                angular.forEach(['open', 'close', 'fetch'], (api) => {
                    scope.api[api] = scope[api];
                });

                scope.api.focus = () => {
                    input[0].focus();
                };

                scope.api.set = (value) => {
                    return scope.value = value;
                };

                scope.api.unset = (value) => {
                    const values = !value ? scope.selectedValues : (scope.selectedValues || [])
                        .filter((option) => {
                            return scope.optionEquals(option, value);
                        });
                    const indexes =
                        scope.selectedValues
                            .map((option, index) => {
                                return scope.inOptions(values, option) ? index : -1;
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

// ((angular) => {

let $filter, $timeout, $window, $http, $q;

const Selector = (() => {

    // Selector directive
    function Selector(
        filter: angular.IFilterService,
        timeout: angular.ITimeoutService,
        window: angular.IWindowService,
        http, q) {
        this.restrict = 'EAC';
        this.replace = true;
        this.transclude = true;
        this.scope = {
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
        this.templateUrl = 'selector/selector.html';
        $filter = filter;
        $timeout = timeout;
        $window = window;
        $http = http;
        $q = q;
    }

    Selector.prototype.$inject = ['$filter', '$timeout', '$window', '$http', '$q'];
    Selector.prototype.link = (scope, element, attrs, controller, transclude) => {
        transclude(scope, (clone, scope) => {
            let filter = $filter('filter');
            let input = angular.element(element[0].querySelector('.selector-input input'));
            let dropdown = angular.element(element[0].querySelector('.selector-dropdown'));
            let inputCtrl = input.controller('ngModel');
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
            scope.setObjValue = (obj, path, value) => {
                let key;
                if (!angular.isDefined(obj)) obj = {};
                path = angular.isArray(path) ? path : path.split('.');
                key = path.shift();

                if (key.indexOf('[') > 0) {
                    const match = key.match(/(\w+)\[(\d+)\]/);
                    if (match !== null) {
                        obj = obj[match[1]];
                        key = match[2];
                    }
                }
                obj[key] = path.length === 0 ? value : scope.setObjValue(obj[key], path, value);
                return obj;
            };
            scope.optionValue = (option) => {
                return scope.valueAttr == null ? option : scope.getObjValue(option, scope.valueAttr);
            };
            scope.optionEquals = (option, value) => {
                return angular.equals(scope.optionValue(option), angular.isDefined(value) ? value : scope.value);
            };

            // Value utilities
            scope.setValue = (value) => {
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
            scope.request = (paramName, paramValue, remote, remoteParam) => {
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
                    promise = $http(settings);
                }
                promise
                    .then((data) => {
                        scope.options = data.data || data;
                        scope.filterOptions();
                        scope.loading = false;
                        initDeferred.resolve();
                    }, (error) => {
                        scope.loading = false;
                        initDeferred.reject();
                        throw 'Error while fetching data: ' + (error.message || error);
                    });
                return promise;
            };
            scope.fetch = () => {
                return scope.request('search', scope.search || '', scope.remote, scope.remoteParam);
            };
            scope.fetchValidation = (value) => {
                return scope.request('value', value, scope.remoteValidation, scope.remoteValidationParam);
            };
            if (!angular.isDefined(scope.remote)) {
                scope.remote = false;
                scope.remoteValidation = false;
                initDeferred.resolve();
            } else
                if (!angular.isDefined(scope.remoteValidation))
                    scope.remoteValidation = false;
            if (scope.remote)
                $timeout(() => {
                    $q.when(!scope.hasValue() || !scope.remoteValidation ?
                        angular.noop :
                        scope.fetchValidation(scope.value)
                    )
                        .then(() => {
                            scope.$watch('search', () => {
                                $timeout(scope.fetch);
                            });
                        });
                });

            // Fill with options in the select
            scope.optionToObject = (option, group) => {
                let object = {};
                const element = angular.element(option);

                angular.forEach(option.dataset, (value, key) => {
                    if (!key.match(/^\$/)) {
                        object[key] = value
                    };
                });
                if (option.value) {
                    scope.setObjValue(object, scope.valueAttr || 'value', option.value);
                }
                if (element.text()) {
                    scope.setObjValue(object, scope.labelAttr, element.text()
                        .trim());
                }
                if (angular.isDefined(group)) {
                    scope.setObjValue(object, scope.groupAttr, group);
                }
                scope.options.push(object);

                if (element.attr('selected') && (scope.multiple || !scope.hasValue()))
                    if (!scope.multiple) {
                        if (!scope.value) {
                            scope.value = scope.optionValue(object)
                        };
                    } else {
                        if (!scope.value) {
                            scope.value = [];
                        }
                        scope.value.push(scope.optionValue(object));
                    }
            };
            scope.fillWithHtml = () => {
                scope.options = [];
                angular.forEach(clone, (element) => {
                    const tagName = (element.tagName || '').toLowerCase();

                    if (tagName == 'option') {
                        scope.optionToObject(element);
                    }
                    if (tagName == 'optgroup') {
                        angular.forEach(element.querySelectorAll('option'), (option) => {
                            scope.optionToObject(option, (element.attributes.label || {})
                                .value);
                        });
                    }
                });
                scope.updateSelected();
            };

            // Initialization
            scope.initialize = () => {
                if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length))
                    scope.fillWithHtml();
                if (scope.hasValue()) {
                    if (!scope.multiple) {
                        if (angular.isArray(scope.value)) scope.value = scope.value[0];
                    } else {
                        if (!angular.isArray(scope.value)) scope.value = [scope.value];
                    }
                    scope.updateSelected();
                    scope.filterOptions();
                    scope.updateValue();
                }
            };
            scope.$watch('multiple', () => {
                $timeout(scope.setInputWidth);
                initDeferred.promise.then(scope.initialize, scope.initialize);
            });

            // Dropdown utilities
            scope.dropdownPosition = () => {
                const label = input.parent()[0];
                const styles = getStyles(label);
                const marginTop = parseFloat((<any>styles).marginTop || 0);
                const marginLeft = parseFloat((<any>styles).marginLeft || 0);

                if (label) {
                    dropdown.css({
                        top: (label.offsetTop + label.offsetHeight + marginTop) + 'px',
                        left: (label.offsetLeft + marginLeft) + 'px',
                        width: label.offsetWidth + 'px'
                    });
                }
            };
            scope.open = () => {
                if (scope.multiple && (scope.selectedValues || [])
                    .length >= scope.limit) return;
                scope.isOpen = true;
                scope.dropdownPosition();
                $timeout(scope.scrollToHighlighted);
            };
            scope.close = () => {
                scope.isOpen = false;
                scope.resetInput();

                if (scope.remote) {
                    $timeout(scope.fetch);
                };
            };
            scope.decrementHighlighted = () => {
                scope.highlight(scope.highlighted - 1);
                scope.scrollToHighlighted();
            };
            scope.incrementHighlighted = () => {
                scope.highlight(scope.highlighted + 1);
                scope.scrollToHighlighted();
            };
            scope.highlight = (index) => {
                if (attrs.create && scope.search && index == -1)
                    scope.highlighted = -1;
                else
                    if (scope.filteredOptions.length)
                        scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
            };
            scope.scrollToHighlighted = () => {
                const dd = dropdown[0];
                const option = dd.querySelectorAll('li.selector-option')[scope.highlighted] as HTMLElement;
                const styles = getStyles(option);
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
                        scope.setObjValue(option, scope.labelAttr, value);
                        scope.setObjValue(option, scope.valueAttr || 'value', value);
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
                    .length >= scope.limit) scope.close();
                scope.resetInput();
                selectCtrl.$setDirty();
            };
            scope.unset = (index) => {
                if (!scope.multiple) {
                    scope.selectedValues = [];
                }
                else {
                    scope.selectedValues.splice(
                        angular.isDefined(index)
                            ? index
                            : scope.selectedValues.length - 1, 1);
                }
                scope.resetInput();
                selectCtrl.$setDirty();
            };
            scope.keydown = (e) => {
                switch (e.keyCode) {
                    case KEYS.up:
                        if (!scope.isOpen) break;
                        scope.decrementHighlighted();
                        e.preventDefault();
                        break;
                    case KEYS.down:
                        if (!scope.isOpen) scope.open();
                        else scope.incrementHighlighted();
                        e.preventDefault();
                        break;
                    case KEYS.escape:
                        scope.highlight(0);
                        scope.close();
                        break;
                    case KEYS.enter:
                        if (scope.isOpen) {
                            if (attrs.create && scope.search && scope.highlighted == -1)
                                scope.createOption(e.target.value);
                            else
                                if (scope.filteredOptions.length)
                                    scope.set();
                            e.preventDefault();
                        }
                        break;
                    case KEYS.backspace:
                        if (!input.val()) {
                            const search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                            scope.unset();
                            scope.open();
                            if (scope.softDelete && !scope.disableSearch)
                                $timeout(() => {
                                    scope.search = search;
                                });
                            e.preventDefault();
                        }
                        break;
                    case KEYS.left:
                    case KEYS.right:
                    case KEYS.shift:
                    case KEYS.ctrl:
                    case KEYS.alt:
                    case KEYS.tab:
                    case KEYS.leftCmd:
                    case KEYS.rightCmd:
                        break;
                    default:
                        if (!scope.multiple && scope.hasValue()) {
                            e.preventDefault();
                        } else {
                            scope.open();
                            scope.highlight(0);
                        }
                        break;
                }
            };

            // Filtered options
            scope.inOptions = (options, value) => {
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
            scope.filterOptions = () => {
                scope.filteredOptions = filter(scope.options || [], scope.search);
                if (!angular.isArray(scope.selectedValues)) scope.selectedValues = [];
                if (scope.multiple)
                    scope.filteredOptions = scope.filteredOptions.filter((option) => {
                        return !scope.inOptions(scope.selectedValues, option);
                    });
                else {
                    const index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                    if (index >= 0) {
                        scope.highlight(index)
                    };
                }
            };

            // Input width utilities
            scope.measureWidth = () => {
                let width;
                const styles = getStyles(input[0]);
                const shadow = angular.element('<span class="selector-shadow"></span>');

                shadow.text(input.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                angular.element(document.body)
                    .append(shadow);
                angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                    shadow.css(style, styles[style]);
                });
                width = shadow[0].offsetWidth;
                shadow.remove();
                return width;
            };

            scope.setInputWidth = () => {
                const width = scope.measureWidth() + 1;
                input.css('width', width + 'px');
            };

            scope.resetInput = () => {
                input.val('');
                scope.setInputWidth();
                $timeout(() => {
                    scope.search = '';
                });
            };

            scope.$watch('[search, options, value]', () => {
                // hide selected items
                scope.filterOptions();
                $timeout(() => {
                    // set input width
                    scope.setInputWidth();
                    // repositionate dropdown
                    if (scope.isOpen) {
                        scope.dropdownPosition();
                    }
                });
            }, true);

            // Update value
            scope.updateValue = (origin) => {
                if (!angular.isDefined(origin)) {
                    origin = scope.selectedValues || [];
                }
                scope.setValue(!scope.multiple ? origin[0] : origin);
            };
            scope.$watch('selectedValues', (newValue, oldValue) => {
                if (angular.equals(newValue, oldValue)) return;
                scope.updateValue();
                if (angular.isFunction(scope.change))
                    scope.change(scope.multiple ? {
                        newValue: newValue,
                        oldValue: oldValue
                    } : {
                            newValue: (newValue || [])[0],
                            oldValue: (oldValue || [])[0]
                        });
            }, true);

            scope.$watchCollection('options', (newValue, oldValue) => {
                if (angular.equals(newValue, oldValue) || scope.remote) {
                    return;
                };
                scope.updateSelected();
            });

            // Update selected values
            scope.updateSelected = () => {
                if (!scope.multiple) {
                    scope.selectedValues =
                        (scope.options || [])
                            .filter((option) => {
                                return scope.optionEquals(option);
                            })
                            .slice(0, 1);
                }
                else {
                    scope.selectedValues =
                        (scope.value || [])
                            .map((value) => {
                                return filter(scope.options, (option) => {
                                    return scope.optionEquals(option, value);
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
                        : scope.fetchValidation(newValue))
                    .then(() => {
                        scope.updateSelected();
                        scope.filterOptions();
                        scope.updateValue();
                    });
            }, true);

            // DOM event listeners
            input = angular.element(element[0].querySelector('.selector-input input'))
                .on('focus', () => {
                    $timeout(() => {
                        scope.$apply(scope.open);
                    });
                })
                .on('blur', () => {
                    scope.$apply(scope.close);
                })
                .on('keydown', (e) => {
                    scope.$apply(() => {
                        scope.keydown(e);
                    });
                })
                .on('input', () => {
                    scope.setInputWidth();
                });
            dropdown
                .on('mousedown', (e) => {
                    e.preventDefault();
                });
            angular.element($window)
                .on('resize', () => {
                    scope.dropdownPosition();
                });

            // Update select controller
            scope.$watch(() => {
                return inputCtrl.$pristine;
            }, ($pristine) => {
                selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
            });

            scope.$watch(() => {
                return inputCtrl.$touched;
            }, ($touched) => {
                selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
            });

            // Expose APIs
            angular.forEach(['open', 'close', 'fetch'], (api) => {
                scope.api[api] = scope[api];
            });

            scope.api.focus = () => {
                input[0].focus();
            };

            scope.api.set = (value) => {
                return scope.value = value;
            };

            scope.api.unset = (value) => {
                const values = !value ? scope.selectedValues : (scope.selectedValues || [])
                    .filter((option) => {
                        return scope.optionEquals(option, value);
                    });
                const indexes =
                    scope.selectedValues
                        .map((option, index) => {
                            return scope.inOptions(values, option) ? index : -1;
                        })
                        .filter((index) => {
                            return index >= 0;
                        });
                angular.forEach(indexes, (index, i) => {
                    scope.unset(index - i);
                });
            };

        });
    };

    return Selector;
})();


angular
    .module('selector', [])
    .run(['$templateCache', ($templateCache) => {
        $templateCache.put('selector/selector.html',
            '<div class="selector-container" ng-attr-dir="{{rtl ? \'rtl\' : \'ltr\'}}" ' +
            'ng-class="{open: isOpen, empty: !filteredOptions.length && (!create || !search), multiple: multiple, \'has-value\': hasValue(), rtl: rtl, ' +
            'loading: loading, \'remove-button\': removeButton, disabled: disabled}">' +
            '<select name="{{name}}" ng-hide="true" ng-required="required && !hasValue()" ' +
            'ng-model="selectedValues" multiple ng-options="option as getObjValue(option, labelAttr) for option in selectedValues"></select>' +
            '<label class="selector-input">' +
            '<ul class="selector-values">' +
            '<li ng-repeat="(index, option) in selectedValues track by index">' +
            '<div ng-include="viewItemTemplate"></div>' +
            '<div ng-if="multiple" class="selector-helper" ng-click="!disabled && unset(index)">' +
            '<span class="selector-icon"></span>' +
            '</div>' +
            '</li>' +
            '</ul>' +
            '<input ng-model="search" placeholder="{{!hasValue() ? placeholder : \'\'}}" ng-model-options="{debounce: debounce}"' +
            'ng-disabled="disabled" ng-readonly="disableSearch" ng-required="required && !hasValue()" autocomplete="off">' +
            '<div ng-if="!multiple || loading" class="selector-helper selector-global-helper" ng-click="!disabled && removeButton && unset()">' +
            '<span class="selector-icon"></span>' +
            '</div>' +
            '</label>' +
            '<ul class="selector-dropdown" ng-show="filteredOptions.length > 0 || (create && search)">' +
            '<li class="selector-option create" ng-class="{active: highlighted == -1}" ng-if="create && search" ' +
            'ng-include="dropdownCreateTemplate" ng-mouseover="highlight(-1)" ng-click="createOption(search)"></li>' +
            '<li ng-repeat-start="(index, option) in filteredOptions track by index" class="selector-optgroup" ' +
            'ng-include="dropdownGroupTemplate" ng-show="groupAttr && ' +
            '(getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))"></li>' +
            '<li ng-repeat-end ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}" class="selector-option" ' +
            'ng-include="dropdownItemTemplate" ng-mouseover="highlight(index)" ng-click="set()"></li>' +
            '</ul>' +
            '</div>'
        );
        $templateCache.put('selector/item-create.html', 'Add <i ng-bind="search"></i>');
        $templateCache.put('selector/item-default.html', '<span ng-bind="getObjValue(option, labelAttr) || option"></span>');
        $templateCache.put('selector/group-default.html', '<span ng-bind="getObjValue(option, groupAttr)"></span>');
    }])
    .directive('selector',  SelectorDirective.Factory() 
    // [
    //     '$filter',
    //     '$timeout',
    //     '$window',
    //     '$http',
    //     '$q',
    //     ($filter, $timeout, $window, $http, $q) => {
    //         ;
            
    //         // return new Selector($filter, $timeout, $window, $http, $q);
    //     }
    // ]
);

// })((<any>window).angular);

