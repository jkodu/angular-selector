/*! angular-selector - v1.5.0 - https://github.com/indrimuska/angular-selector - (c) 2015 Indri Muska - MIT */
var CONSTANTS = {
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
        SELECTOR: "\n        <div class=\"selector-container\"\n            ng-attr-dir=\"{{ rtl ? 'rtl' : 'ltr' }}\"\n            ng-class=\"{\n                open: isOpen, \n                empty: !filteredOptions.length && \n                    (!create || !search), multiple: multiple, \n                    'has-value': hasValue(), \n                    rtl: rtl, \n                    'loading': loading, \n                    'remove-button': removeButton, \n                    disabled: disabled}\">\n            <select name=\"{{name}}\"\n                ng-hide=\"true\"\n                ng-required=\"required && !hasValue()\"\n                ng-model=\"selectedValues\"\n                multiple\n                ng-options=\"option as getObjValue(option, labelAttr) for option in selectedValues\">\n            </select>\n            <label class=\"selector-input\">\n                <ul class=\"selector-values\">\n                    <li ng-repeat=\"(index, option) in selectedValues track by index\">\n                        <div ng-include=\"viewItemTemplate\"></div>\n                        <div ng-if=\"multiple\" class=\"selector-helper\" ng-click=\"!disabled && unset(index)\">\n                            <span class=\"selector-icon\"></span>\n                        </div>\n                    </li>\n                </ul>\n                <input \n                    ng-model=\"search\" \n                    placeholder=\"{{!hasValue() ? placeholder : ''}}\" \n                    ng-model-options=\"{debounce: debounce}\"\n                    ng-disabled=\"disabled\" \n                    ng-readonly=\"disableSearch\" \n                    ng-required=\"required && !hasValue()\" \n                    autocomplete=\"off\">\n                <div ng-if=\"!multiple || loading\" \n                    class=\"selector-helper selector-global-helper\" \n                    ng-click=\"!disabled && removeButton && unset()\">\n                    <span class=\"selector-icon\"></span>\n                </div>\n            </label>\n            <ul class=\"selector-dropdown\"\n                ng-show=\"filteredOptions.length > 0 || (create && search)\">\n                <li class=\"selector-option create\"\n                    ng-class=\"{active: highlighted == -1}\"\n                    ng-if=\"create && search\"\n                    ng-include=\"dropdownCreateTemplate\"\n                    ng-mouseover=\"highlight(-1)\"\n                    ng-click=\"createOption(search)\"></li>\n                <li ng-repeat-start=\"(index, option) in filteredOptions track by index\"\n                    class=\"selector-optgroup\"\n                    ng-include=\"dropdownGroupTemplate\"\n                    ng-show=\"groupAttr && (getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))\"></li>\n                <li ng-repeat-end\n                    ng-class=\"{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}\"\n                    class=\"selector-option\"\n                    ng-include=\"dropdownItemTemplate\"\n                    ng-mouseover=\"highlight(index)\"\n                    ng-click=\"set()\">\n                </li>\n            </ul>\n        </div>",
        ITEM_CREATE: "Add <i ng-bind=\"search\"></i>",
        ITEM_DEFAULT: "<span ng-bind=\"getObjValue(option, labelAttr) || option\"></span>",
        GROUP_DEFAULT: "<span ng-bind=\"getObjValue(option, groupAttr)\"></span>"
    }
};
var DOM_FUNCTIONS = {
    getStyles: function (element) {
        return !(element instanceof HTMLElement)
            ? {}
            : element.ownerDocument && element.ownerDocument.defaultView.opener
                ? element.ownerDocument.defaultView.getComputedStyle(element)
                : window.getComputedStyle(element);
    }
};
var SelectorDirective = (function () {
    function SelectorDirective($filter, $timeout, $window, $http, $q) {
        this.$filter = $filter;
        this.$timeout = $timeout;
        this.$window = $window;
        this.$http = $http;
        this.$q = $q;
        this.restrict = 'EAC';
        this.replace = true;
        this.transclude = true;
        this.templateUrl = 'selector/selector.html';
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
        SelectorDirective.prototype.link = function (scope, element, attrs, controller, transclude) {
            transclude(scope, function (clone, scope) {
                var filter = $filter('filter');
                var input = angular.element(element[0].querySelector('.selector-input input'));
                var dropdown = angular.element(element[0].querySelector('.selector-dropdown'));
                var inputCtrl = input.controller('ngModel');
                var selectCtrl = element.find('select').controller('ngModel');
                var initDeferred = $q.defer();
                var defaults = {
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
                if (!angular.isDefined(scope.value) && scope.multiple) {
                    scope.value = [];
                }
                ;
                angular.forEach(defaults, function (value, key) {
                    if (!angular.isDefined(scope[key])) {
                        scope[key] = value;
                    }
                    ;
                });
                angular.forEach(['name', 'valueAttr', 'labelAttr'], function (attr) {
                    if (!attrs[attr])
                        attrs[attr] = scope[attr];
                });
                var optionValue = function (option) {
                    return scope.valueAttr == null
                        ? option
                        : scope.getObjValue(option, scope.valueAttr);
                };
                var setObjValue = function (obj, path, value) {
                    var key;
                    if (!angular.isDefined(obj)) {
                        obj = {};
                    }
                    ;
                    path = angular.isArray(path)
                        ? path
                        : path.split('.');
                    key = path.shift();
                    if (key.indexOf('[') > 0) {
                        var match = key.match(/(\w+)\[(\d+)\]/);
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
                var optionEquals = function (option, value) {
                    return angular.equals(optionValue(option), angular.isDefined(value)
                        ? value
                        : scope.value);
                };
                scope.getObjValue = function (obj, path) {
                    var key;
                    if (!angular.isDefined(obj) || !angular.isDefined(path))
                        return obj;
                    path = angular.isArray(path) ? path : path.split('.');
                    key = path.shift();
                    if (key.indexOf('[') > 0) {
                        var match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
                };
                var setValue = function (value) {
                    if (!scope.multiple)
                        scope.value = scope.valueAttr == null ? value : scope.getObjValue(value || {}, scope.valueAttr);
                    else
                        scope.value = scope.valueAttr == null ? (value || []) : (value || [])
                            .map(function (option) {
                            return scope.getObjValue(option, scope.valueAttr);
                        });
                };
                scope.hasValue = function () {
                    return scope.multiple ? (scope.value || [])
                        .length > 0 : !!scope.value;
                };
                var request = function (paramName, paramValue, remote, remoteParam) {
                    var promise, remoteOptions = {};
                    if (scope.disabled)
                        return $q.reject();
                    if (!angular.isDefined(remote))
                        throw 'Remote attribute is not defined';
                    scope.loading = true;
                    scope.options = [];
                    remoteOptions[paramName] = paramValue;
                    promise = remote(remoteOptions);
                    if (typeof promise.then !== 'function') {
                        var settings = {
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
                        .then(function (data) {
                        scope.options = data.data || data;
                        filterOptions();
                        scope.loading = false;
                        initDeferred.resolve();
                    }, function (error) {
                        scope.loading = false;
                        initDeferred.reject();
                        throw 'Error while fetching data: ' + (error.message || error);
                    });
                    return promise;
                };
                var fetch = function () {
                    return request('search', scope.search || '', scope.remote, scope.remoteParam);
                };
                var fetchValidation = function (value) {
                    return request('value', value, scope.remoteValidation, scope.remoteValidationParam);
                };
                if (!angular.isDefined(scope.remote)) {
                    scope.remote = false;
                    scope.remoteValidation = false;
                    initDeferred.resolve();
                }
                else if (!angular.isDefined(scope.remoteValidation))
                    scope.remoteValidation = false;
                if (scope.remote)
                    $timeout(function () {
                        $q.when(!scope.hasValue() || !scope.remoteValidation
                            ? angular.noop
                            : fetchValidation(scope.value)).then(function () {
                            scope.$watch('search', function () {
                                $timeout(fetch);
                            });
                        });
                    });
                var optionToObject = function (option, group) {
                    var object = {};
                    var element = angular.element(option);
                    angular.forEach(option.dataset, function (value, key) {
                        if (!key.match(/^\$/)) {
                            object[key] = value;
                        }
                        ;
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
                                scope.value = optionValue(object);
                            }
                            ;
                        }
                        else {
                            if (!scope.value) {
                                scope.value = [];
                            }
                            scope.value.push(optionValue(object));
                        }
                };
                var fillWithHtml = function () {
                    scope.options = [];
                    angular.forEach(clone, function (element) {
                        var tagName = (element.tagName || '').toLowerCase();
                        if (tagName == 'option') {
                            optionToObject(element);
                        }
                        if (tagName == 'optgroup') {
                            angular.forEach(element.querySelectorAll('option'), function (option) {
                                optionToObject(option, (element.attributes.label || {}).value);
                            });
                        }
                    });
                    updateSelected();
                };
                var initialize = function () {
                    if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length)) {
                        fillWithHtml();
                    }
                    if (scope.hasValue()) {
                        if (!scope.multiple) {
                            if (angular.isArray(scope.value))
                                scope.value = scope.value[0];
                        }
                        else {
                            if (!angular.isArray(scope.value))
                                scope.value = [scope.value];
                        }
                        updateSelected();
                        filterOptions();
                        scope.updateValue();
                    }
                };
                scope.$watch('multiple', function () {
                    $timeout(scope.setInputWidth);
                    initDeferred.promise.then(initialize, initialize);
                });
                scope.dropdownPosition = function () {
                    var label = input.parent()[0];
                    var styles = DOM_FUNCTIONS.getStyles(label);
                    var marginTop = parseFloat(styles.marginTop || 0);
                    var marginLeft = parseFloat(styles.marginLeft || 0);
                    if (label) {
                        dropdown.css({
                            top: (label.offsetTop + label.offsetHeight + marginTop) + 'px',
                            left: (label.offsetLeft + marginLeft) + 'px',
                            width: label.offsetWidth + 'px'
                        });
                    }
                };
                var open = function () {
                    if (scope.multiple && (scope.selectedValues || [])
                        .length >= scope.limit)
                        return;
                    scope.isOpen = true;
                    scope.dropdownPosition();
                    $timeout(scope.scrollToHighlighted);
                };
                var close = function () {
                    scope.isOpen = false;
                    scope.resetInput();
                    if (scope.remote) {
                        $timeout(fetch);
                    }
                    ;
                };
                scope.decrementHighlighted = function () {
                    scope.highlight(scope.highlighted - 1);
                    scope.scrollToHighlighted();
                };
                scope.incrementHighlighted = function () {
                    scope.highlight(scope.highlighted + 1);
                    scope.scrollToHighlighted();
                };
                scope.highlight = function (index) {
                    if (attrs.create && scope.search && index == -1)
                        scope.highlighted = -1;
                    else if (scope.filteredOptions.length)
                        scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                };
                scope.scrollToHighlighted = function () {
                    var dd = dropdown[0];
                    var option = dd.querySelectorAll('li.selector-option')[scope.highlighted];
                    var styles = DOM_FUNCTIONS.getStyles(option);
                    var marginTop = parseFloat(styles.marginTop || 0);
                    var marginBottom = parseFloat(styles.marginBottom || 0);
                    if (!scope.filteredOptions.length) {
                        return;
                    }
                    if (option.offsetTop + option.offsetHeight + marginBottom > dd.scrollTop + dd.offsetHeight)
                        $timeout(function () {
                            dd.scrollTop = option.offsetTop + option.offsetHeight + marginBottom - dd.offsetHeight;
                        });
                    if (option.offsetTop - marginTop < dd.scrollTop)
                        $timeout(function () {
                            dd.scrollTop = option.offsetTop - marginTop;
                        });
                };
                scope.createOption = function (value) {
                    $q.when((function () {
                        var option = {};
                        if (angular.isFunction(scope.create)) {
                            option = scope.create({
                                input: value
                            });
                        }
                        else {
                            setObjValue(option, scope.labelAttr, value);
                            setObjValue(option, scope.valueAttr || 'value', value);
                        }
                        return option;
                    })())
                        .then(function (option) {
                        scope.options.push(option);
                        scope.set(option);
                    });
                };
                scope.set = function (option) {
                    if (scope.multiple && (scope.selectedValues || [])
                        .length >= scope.limit)
                        return;
                    if (!angular.isDefined(option))
                        option = scope.filteredOptions[scope.highlighted];
                    if (!scope.multiple)
                        scope.selectedValues = [option];
                    else {
                        if (!scope.selectedValues)
                            scope.selectedValues = [];
                        if (scope.selectedValues.indexOf(option) < 0)
                            scope.selectedValues.push(option);
                    }
                    if (!scope.multiple || scope.closeAfterSelection || (scope.selectedValues || [])
                        .length >= scope.limit)
                        close();
                    scope.resetInput();
                    selectCtrl.$setDirty();
                };
                scope.unset = function (index) {
                    if (!scope.multiple) {
                        scope.selectedValues = [];
                    }
                    else {
                        scope.selectedValues.splice(angular.isDefined(index)
                            ? index
                            : scope.selectedValues.length - 1, 1);
                    }
                    scope.resetInput();
                    selectCtrl.$setDirty();
                };
                scope.keydown = function (e) {
                    switch (e.keyCode) {
                        case CONSTANTS.KEYS.up:
                            if (!scope.isOpen)
                                break;
                            scope.decrementHighlighted();
                            e.preventDefault();
                            break;
                        case CONSTANTS.KEYS.down:
                            if (!scope.isOpen) {
                                open();
                            }
                            else
                                scope.incrementHighlighted();
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
                                else if (scope.filteredOptions.length)
                                    scope.set();
                                e.preventDefault();
                            }
                            break;
                        case CONSTANTS.KEYS.backspace:
                            if (!input.val()) {
                                var search_1 = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                scope.unset();
                                open();
                                if (scope.softDelete && !scope.disableSearch)
                                    $timeout(function () {
                                        scope.search = search_1;
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
                            }
                            else {
                                open();
                                scope.highlight(0);
                            }
                            break;
                    }
                };
                scope.inOptions = function (options, value) {
                    if (scope.remote)
                        return options.filter(function (option) {
                            return angular.equals(value, option);
                        })
                            .length > 0;
                    else
                        return options.indexOf(value) >= 0;
                };
                var filterOptions = function () {
                    scope.filteredOptions = filter(scope.options || [], scope.search);
                    if (!angular.isArray(scope.selectedValues))
                        scope.selectedValues = [];
                    if (scope.multiple)
                        scope.filteredOptions = scope.filteredOptions.filter(function (option) {
                            return !scope.inOptions(scope.selectedValues, option);
                        });
                    else {
                        var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                        if (index >= 0) {
                            scope.highlight(index);
                        }
                        ;
                    }
                };
                scope.measureWidth = function () {
                    var width;
                    var styles = DOM_FUNCTIONS.getStyles(input[0]);
                    var shadow = angular.element('<span class="selector-shadow"></span>');
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
                scope.setInputWidth = function () {
                    var width = scope.measureWidth() + 1;
                    input.css('width', width + 'px');
                };
                scope.resetInput = function () {
                    input.val('');
                    scope.setInputWidth();
                    $timeout(function () {
                        scope.search = '';
                    });
                };
                scope.$watch('[search, options, value]', function () {
                    filterOptions();
                    $timeout(function () {
                        scope.setInputWidth();
                        if (scope.isOpen) {
                            scope.dropdownPosition();
                        }
                    });
                }, true);
                scope.updateValue = function (origin) {
                    if (!angular.isDefined(origin)) {
                        origin = scope.selectedValues || [];
                    }
                    setValue(!scope.multiple ? origin[0] : origin);
                };
                scope.$watch('selectedValues', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue))
                        return;
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
                scope.$watchCollection('options', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue) || scope.remote) {
                        return;
                    }
                    ;
                    updateSelected();
                });
                var updateSelected = function () {
                    if (!scope.multiple) {
                        scope.selectedValues =
                            (scope.options || [])
                                .filter(function (option) {
                                return optionEquals(option);
                            })
                                .slice(0, 1);
                    }
                    else {
                        scope.selectedValues =
                            (scope.value || [])
                                .map(function (value) {
                                return filter(scope.options, function (option) {
                                    return optionEquals(option, value);
                                })[0];
                            })
                                .filter(function (value) {
                                return angular.isDefined(value);
                            })
                                .slice(0, scope.limit);
                    }
                };
                scope.$watch('value', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    $q
                        .when(!scope.remote || !scope.remoteValidation || !scope.hasValue()
                        ? angular.noop
                        : fetchValidation(newValue))
                        .then(function () {
                        updateSelected();
                        filterOptions();
                        scope.updateValue();
                    });
                }, true);
                input = angular.element(element[0].querySelector('.selector-input input'))
                    .on('focus', function () {
                    $timeout(function () {
                        scope.$apply(open);
                    });
                })
                    .on('blur', function () {
                    scope.$apply(close);
                })
                    .on('keydown', function (e) {
                    scope.$apply(function () {
                        scope.keydown(e);
                    });
                })
                    .on('input', function () {
                    scope.setInputWidth();
                });
                dropdown
                    .on('mousedown', function (e) {
                    e.preventDefault();
                });
                angular.element($window)
                    .on('resize', function () {
                    scope.dropdownPosition();
                });
                scope.$watch(function () {
                    return inputCtrl.$pristine;
                }, function ($pristine) {
                    selectCtrl[$pristine ? '$setPristine' : '$setDirty']();
                });
                scope.$watch(function () {
                    return inputCtrl.$touched;
                }, function ($touched) {
                    selectCtrl[$touched ? '$setTouched' : '$setUntouched']();
                });
                scope.api.fetch = fetch;
                scope.api.open = open;
                scope.api.close = close;
                scope.api.focus = function () {
                    input[0].focus();
                };
                scope.api.set = function (value) {
                    return scope.value = value;
                };
                scope.api.unset = function (value) {
                    var values = !value ? scope.selectedValues : (scope.selectedValues || [])
                        .filter(function (option) {
                        return optionEquals(option, value);
                    });
                    var indexes = scope.selectedValues
                        .map(function (option, index) {
                        return scope.inOptions(values, option) ? index : -1;
                    })
                        .filter(function (index) {
                        return index >= 0;
                    });
                    angular.forEach(indexes, function (index, i) {
                        scope.unset(index - i);
                    });
                };
            });
        };
    }
    SelectorDirective.Factory = function () {
        var directive = function ($filter, $timeout, $window, $http, $q) {
            return new SelectorDirective($filter, $timeout, $window, $http, $q);
        };
        directive['$inject'] = ['$filter', '$timeout', '$window', '$http', '$q'];
        return directive;
    };
    return SelectorDirective;
}());
angular
    .module('selector', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('selector/selector.html', CONSTANTS.TEMPLATES.SELECTOR);
        $templateCache.put('selector/item-create.html', CONSTANTS.TEMPLATES.ITEM_CREATE);
        $templateCache.put('selector/item-default.html', CONSTANTS.TEMPLATES.ITEM_DEFAULT);
        $templateCache.put('selector/group-default.html', CONSTANTS.TEMPLATES.GROUP_DEFAULT);
    }])
    .directive('selector', SelectorDirective.Factory());
//# sourceMappingURL=angular-selector.js.map