(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AngularSelectorOnSteroids"] = factory();
	else
		root["AngularSelectorOnSteroids"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var toSubscriber_1 = __webpack_require__(42);
var observable_1 = __webpack_require__(21);
var pipe_1 = __webpack_require__(45);
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to a {@link create} static factory, but most of the time it is
     * a library implementation, which defines what and when will be emitted by an Observable. This means that calling
     * `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, that if `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where first function is equivalent
     * of a `next` method, second of an `error` method and third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whatever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a {@link Scheduler}.
     *
     * @example <caption>Subscribe with an Observer</caption>
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Subscribe with functions</caption>
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     *
     *
     * @example <caption>Cancel a subscription</caption>
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     *
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source ? this._subscribe(sink) : this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * @example
     *
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i - 0] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
                PromiseCtor = root_1.root.Rx.config.Promise;
            }
            else if (root_1.root.Promise) {
                PromiseCtor = root_1.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
//# sourceMappingURL=Observable.js.map

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof global !== 'undefined' && global;
var _root = __window || __global || __self;
exports.root = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();
//# sourceMappingURL=root.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = "2"


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(3)

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONSTANTS = exports.CONSTANTS = {
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
        TEMPLATE_ITEM_CREATE: function TEMPLATE_ITEM_CREATE() {
            return 'Add <i ng-bind="search"></i>';
        },
        TEMPLATE_ITEM_DEFAULT: function TEMPLATE_ITEM_DEFAULT() {
            return '<span ng-bind="getObjValue(option, labelAttr) || option"></span>';
        },
        TEMPLATE_GROUP_DEFAULT: function TEMPLATE_GROUP_DEFAULT() {
            return '<span ng-bind="getObjValue(option, groupAttr)"></span>';
        },
        TEMPLATE_SELECTOR_SELECTED_ITEMS: function TEMPLATE_SELECTOR_SELECTED_ITEMS() {
            return '<div></div>';
        },
        TEMPLATE_SELECTOR_DROPDOWN_ITEMS: function TEMPLATE_SELECTOR_DROPDOWN_ITEMS() {
            return '<div></div>';
        },
        TEMPLATE_SELECTOR: function TEMPLATE_SELECTOR() {
            return '<div class="selector-container"\n                ng-attr-dir="{{ rtl ? \'rtl\' : \'ltr\' }}"\n                ng-class="{\n                    open: isOpen, \n                    empty: !filteredOptions.length && \n                        (!create || !search), multiple: multiple, \n                        \'has-value\': hasValue(), \n                        rtl: rtl, \n                        \'loading\': loading, \n                        \'remove-button\': removeButton, \n                        disabled: disabled}">\n                <select name="{{name}}"\n                    ng-hide="true"\n                    ng-required="required && !hasValue()"\n                    ng-model="selectedValues"\n                    multiple\n                    ng-options="option as getObjValue(option, labelAttr) for option in selectedValues">\n                </select>\n                <label class="selector-input">\n                    <ul class="selector-values">\n                        <li \n                            ng-if="steroids === false"\n                            ng-repeat="(index, option) in selectedValues track by $index">\n                            <div ng-include="viewItemTemplate"></div>\n                            <div \n                                ng-if="multiple" \n                                class="selector-helper" \n                                ng-click="!disabled && unset(index)">\n                                <span class="selector-icon"></span>\n                            </div>\n                        </li>\n                        <sos-selected-items\n                            ng-if="steroids === true"\n                            input=\'selectedValuesInput$\'>\n                        </sos-selected-items>\n                    </ul>\n                    <input \n                        ng-model="search"                         \n                        placeholder="{{!hasValue() ? placeholder : \'\'}}" \n                        ng-model-options="{debounce: debounce}"\n                        ng-disabled="disabled" \n                        ng-readonly="disableSearch" \n                        ng-required="required && !hasValue()" \n                        autocomplete="off">\n                    <div ng-if="!multiple || loading" \n                        class="selector-helper selector-global-helper" \n                        ng-click="!disabled && removeButton && unset()">\n                        <span class="selector-icon"></span>\n                    </div>\n                </label>\n                <ul class="selector-dropdown">\n        \n                    <li \n                        class="selector-option create"\n                        ng-class="{active: highlighted == -1}"\n                        ng-if="create && search"\n                        ng-include="dropdownCreateTemplate"\n                        ng-mouseover="highlight(-1)"\n                        ng-click="createOption(search)">\n                    </li>\n        \n                    <li \n                        class="selector-option loading"\n                        ng-show="loading === true">\n                        Loading...\n                    </li>\n        \n                    <li \n                        class="selector-option no-data"\n                        ng-show="!loading && (!filteredOptions || filteredOptions.length <= 0)"\n                        >\n                        No Data\n                    </li>\n        \n                    <sos-dropdown-items\n                        ng-if="steroids === true"\n                        ng-show=\'filteredOptions.length > 0\'\n                        input=\'filteredOptionsInput$\'>\n                    </sos-dropdown-items>\n        \n                    <li \n                        ng-if="steroids === false"\n                        ng-repeat-start="(index, option) in filteredOptions track by $index"\n                        class="selector-optgroup"\n                        ng-include="dropdownGroupTemplate"\n                        ng-show="filteredOptions.length > 0 && groupAttr && (getObjValue(option, groupAttr) && index == 0 || getObjValue(filteredOptions[index - 1], groupAttr) != getObjValue(option, groupAttr))">\n                    </li>\n        \n                    <li \n                        ng-if="steroids === false"\n                        ng-show="filteredOptions.length > 0"\n                        ng-repeat-end\n                        ng-class="{active: highlighted == index, grouped: groupAttr && getObjValue(option, groupAttr)}"\n                        class="selector-option js-data-item"\n                        ng-include="dropdownItemTemplate"\n                        ng-mouseover="highlight(index)"\n                        ng-click="set()">\n                    </li>\n                </ul>\n            </div>';
        }
    },
    FUNCTIONS: {
        CONSOLE_LOGGER: function CONSOLE_LOGGER($log, type, message) {
            if ($log[type]) {
                $log[type]('Component: Selector On Sterorids: ' + message);
            } else {
                $log['debug']('Component: Selector On Sterorids: ' + message);
            }
        },
        GET_DOM_STYLES: function GET_DOM_STYLES(element) {
            return !(element instanceof HTMLElement) ? {} : element.ownerDocument && element.ownerDocument.defaultView.opener ? element.ownerDocument.defaultView.getComputedStyle(element) : window.getComputedStyle(element);
        }
    }
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var isFunction_1 = __webpack_require__(12);
var Subscription_1 = __webpack_require__(7);
var Observer_1 = __webpack_require__(20);
var rxSubscriber_1 = __webpack_require__(14);
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer_1.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer_1.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber_1.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
exports.Subscriber = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer_1.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));
//# sourceMappingURL=Subscriber.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isArray_1 = __webpack_require__(43);
var isObject_1 = __webpack_require__(18);
var isFunction_1 = __webpack_require__(12);
var tryCatch_1 = __webpack_require__(19);
var errorObject_1 = __webpack_require__(13);
var UnsubscriptionError_1 = __webpack_require__(44);
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject_1.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject_1.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject_1.errorObject.e.errors) : [errorObject_1.errorObject.e]);
            }
        }
        if (isArray_1.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject_1.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject_1.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
exports.Subscription = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}
//# sourceMappingURL=Subscription.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(3)

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isFunction(x) {
    return typeof x === 'function';
}
exports.isFunction = isFunction;
//# sourceMappingURL=isFunction.js.map

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// typeof any so that it we don't have to cast when comparing a result to the error object
exports.errorObject = { e: {} };
//# sourceMappingURL=errorObject.js.map

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var Symbol = root_1.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;
//# sourceMappingURL=rxSubscriber.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(0);
var merge_1 = __webpack_require__(47);
Observable_1.Observable.merge = merge_1.merge;
//# sourceMappingURL=merge.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(0);
var fromEvent_1 = __webpack_require__(60);
Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;
//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 17 */
/***/ (function(module, exports) {

var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isObject(x) {
    return x != null && typeof x === 'object';
}
exports.isObject = isObject;
//# sourceMappingURL=isObject.js.map

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var errorObject_1 = __webpack_require__(13);
var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject_1.errorObject.e = e;
        return errorObject_1.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
exports.tryCatch = tryCatch;
;
//# sourceMappingURL=tryCatch.js.map

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};
//# sourceMappingURL=Observer.js.map

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root_1.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;
//# sourceMappingURL=observable.js.map

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(0);
var ArrayObservable_1 = __webpack_require__(49);
var mergeAll_1 = __webpack_require__(51);
var isScheduler_1 = __webpack_require__(24);
/* tslint:enable:max-line-length */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return function (source) { return source.lift.call(mergeStatic.apply(void 0, [source].concat(observables))); };
}
exports.merge = merge;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (as arguments), and simply
 * forwards (without doing any transformation) all the values from all the input
 * Observables to the output Observable. The output Observable only completes
 * once all input Observables have completed. Any error delivered by an input
 * Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = Rx.Observable.merge(clicks, timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // timer will emit ascending values, one every second(1000ms) to console
 * // clicks logs MouseEvents to console everytime the "document" is clicked
 * // Since the two streams are merged you see these happening
 * // as they occur.
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = Rx.Observable.merge(timer1, timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // - First timer1 and timer2 will run concurrently
 * // - timer1 will emit a value every 1000ms for 10 iterations
 * // - timer2 will emit a value every 2000ms for 6 iterations
 * // - after timer1 hits it's max iteration, timer2 will
 * //   continue, and timer3 will start to run concurrently with timer2
 * // - when timer2 hits it's max iteration it terminates, and
 * //   timer3 will continue to emit a value every 500ms until it is complete
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {...ObservableInput} observables Input Observables to merge together.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} an Observable that emits items that are the result of
 * every input Observable.
 * @static true
 * @name merge
 * @owner Observable
 */
function mergeStatic() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    var concurrent = Number.POSITIVE_INFINITY;
    var scheduler = null;
    var last = observables[observables.length - 1];
    if (isScheduler_1.isScheduler(last)) {
        scheduler = observables.pop();
        if (observables.length > 1 && typeof observables[observables.length - 1] === 'number') {
            concurrent = observables.pop();
        }
    }
    else if (typeof last === 'number') {
        concurrent = observables.pop();
    }
    if (scheduler === null && observables.length === 1 && observables[0] instanceof Observable_1.Observable) {
        return observables[0];
    }
    return mergeAll_1.mergeAll(concurrent)(new ArrayObservable_1.ArrayObservable(observables, scheduler));
}
exports.mergeStatic = mergeStatic;
//# sourceMappingURL=merge.js.map

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(0);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var EmptyObservable = (function (_super) {
    __extends(EmptyObservable, _super);
    function EmptyObservable(scheduler) {
        _super.call(this);
        this.scheduler = scheduler;
    }
    /**
     * Creates an Observable that emits no items to the Observer and immediately
     * emits a complete notification.
     *
     * <span class="informal">Just emits 'complete', and nothing else.
     * </span>
     *
     * <img src="./img/empty.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the complete notification. It can be used for composing with other
     * Observables, such as in a {@link mergeMap}.
     *
     * @example <caption>Emit the number 7, then complete.</caption>
     * var result = Rx.Observable.empty().startWith(7);
     * result.subscribe(x => console.log(x));
     *
     * @example <caption>Map and flatten only odd numbers to the sequence 'a', 'b', 'c'</caption>
     * var interval = Rx.Observable.interval(1000);
     * var result = interval.mergeMap(x =>
     *   x % 2 === 1 ? Rx.Observable.of('a', 'b', 'c') : Rx.Observable.empty()
     * );
     * result.subscribe(x => console.log(x));
     *
     * // Results in the following to the console:
     * // x is equal to the count on the interval eg(0,1,2,3,...)
     * // x will occur every 1000ms
     * // if x % 2 is equal to 1 print abc
     * // if x % 2 is not equal to 1 nothing will be output
     *
     * @see {@link create}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emission of the complete notification.
     * @return {Observable} An "empty" Observable: emits only the complete
     * notification.
     * @static true
     * @name empty
     * @owner Observable
     */
    EmptyObservable.create = function (scheduler) {
        return new EmptyObservable(scheduler);
    };
    EmptyObservable.dispatch = function (arg) {
        var subscriber = arg.subscriber;
        subscriber.complete();
    };
    EmptyObservable.prototype._subscribe = function (subscriber) {
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(EmptyObservable.dispatch, 0, { subscriber: subscriber });
        }
        else {
            subscriber.complete();
        }
    };
    return EmptyObservable;
}(Observable_1.Observable));
exports.EmptyObservable = EmptyObservable;
//# sourceMappingURL=EmptyObservable.js.map

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isScheduler(value) {
    return value && typeof value.schedule === 'function';
}
exports.isScheduler = isScheduler;
//# sourceMappingURL=isScheduler.js.map

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(62)
var patch = __webpack_require__(65)
var h = __webpack_require__(71)
var create = __webpack_require__(80)
var VNode = __webpack_require__(32)
var VText = __webpack_require__(33)

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(3)

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var isVNode = __webpack_require__(4)
var isVText = __webpack_require__(8)
var isWidget = __webpack_require__(1)
var isThunk = __webpack_require__(9)

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = __webpack_require__(67);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(29)

var applyProperties = __webpack_require__(31)

var isVNode = __webpack_require__(4)
var isVText = __webpack_require__(8)
var isWidget = __webpack_require__(1)
var handleThunk = __webpack_require__(27)

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(28)
var isHook = __webpack_require__(10)

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(3)
var isVNode = __webpack_require__(4)
var isWidget = __webpack_require__(1)
var isThunk = __webpack_require__(9)
var isVHook = __webpack_require__(10)

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(3)

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var attrToProp = __webpack_require__(81)

var VAR = 0, TEXT = 1, OPEN = 2, CLOSE = 3, ATTR = 4
var ATTR_KEY = 5, ATTR_KEY_W = 6
var ATTR_VALUE_W = 7, ATTR_VALUE = 8
var ATTR_VALUE_SQ = 9, ATTR_VALUE_DQ = 10
var ATTR_EQ = 11, ATTR_BREAK = 12
var COMMENT = 13

module.exports = function (h, opts) {
  if (!opts) opts = {}
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b)
  }
  if (opts.attrToProp !== false) {
    h = attrToProp(h)
  }

  return function (strings) {
    var state = TEXT, reg = ''
    var arglen = arguments.length
    var parts = []

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i+1]
        var p = parse(strings[i])
        var xstate = state
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE
        if (xstate === ATTR) xstate = ATTR_KEY
        p.push([ VAR, xstate, arg ])
        parts.push.apply(parts, p)
      } else parts.push.apply(parts, parse(strings[i]))
    }

    var tree = [null,{},[]]
    var stack = [[tree,-1]]
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length-1][0]
      var p = parts[i], s = p[0]
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length-1][1]
        if (stack.length > 1) {
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === OPEN) {
        var c = [p[1],{},[]]
        cur[2].push(c)
        stack.push([c,cur[2].length-1])
      } else if (s === ATTR_KEY || (s === VAR && p[1] === ATTR_KEY)) {
        var key = ''
        var copyKey
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1])
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey]
                }
              }
            } else {
              key = concat(key, parts[i][2])
            }
          } else break
        }
        if (parts[i][0] === ATTR_EQ) i++
        var j = i
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1])
            else parts[i][1]==="" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR
          && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2])
            else parts[i][2]==="" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j
            && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase()
            }
            if (parts[i][0] === CLOSE) {
              i--
            }
            break
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length-1][1]
          stack.pop()
          stack[stack.length-1][0][2][ix] = h(
            cur[0], cur[1], cur[2].length ? cur[2] : undefined
          )
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = ''
        else if (!p[2]) p[2] = concat('', p[2])
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2])
        } else {
          cur[2].push(p[2])
        }
      } else if (s === TEXT) {
        cur[2].push(p[1])
      } else if (s === ATTR_EQ || s === ATTR_BREAK) {
        // no-op
      } else {
        throw new Error('unhandled: ' + s)
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift()
    }

    if (tree[2].length > 2
    || (tree[2].length === 2 && /\S/.test(tree[2][1]))) {
      throw new Error(
        'multiple root elements must be wrapped in an enclosing tag'
      )
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string'
    && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2])
    }
    return tree[2][0]

    function parse (str) {
      var res = []
      if (state === ATTR_VALUE_W) state = ATTR
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i)
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg])
          reg = ''
          state = OPEN
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN) {
            res.push([OPEN,reg])
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY,reg])
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE,reg])
          }
          res.push([CLOSE])
          reg = ''
          state = TEXT
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE,reg.substr(0, reg.length - 1)],[CLOSE])
          }
          reg = ''
          state = TEXT
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg],[ATTR_KEY,'comment'],[ATTR_EQ])
          }
          reg = c
          state = COMMENT
        } else if (state === TEXT || state === COMMENT) {
          reg += c
        } else if (state === OPEN && /\s/.test(c)) {
          res.push([OPEN, reg])
          reg = ''
          state = ATTR
        } else if (state === OPEN) {
          reg += c
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY
          reg = c
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY,reg])
          res.push([ATTR_BREAK])
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY,reg])
          reg = ''
          state = ATTR_KEY_W
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY,reg],[ATTR_EQ])
          reg = ''
          state = ATTR_VALUE_W
        } else if (state === ATTR_KEY) {
          reg += c
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ])
          state = ATTR_VALUE_W
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK])
          if (/[\w-]/.test(c)) {
            reg += c
            state = ATTR_KEY
          } else state = ATTR
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE
          i--
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE,reg],[ATTR_BREAK])
          reg = ''
          state = ATTR
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ
        || state === ATTR_VALUE_DQ) {
          reg += c
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT,reg])
        reg = ''
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE,reg])
        reg = ''
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY,reg])
        reg = ''
      }
      return res
    }
  }

  function strfn (x) {
    if (typeof x === 'function') return x
    else if (typeof x === 'string') return x
    else if (x && typeof x === 'object') return x
    else return concat('', x)
  }
}

function quot (state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ
}

var hasOwn = Object.prototype.hasOwnProperty
function has (obj, key) { return hasOwn.call(obj, key) }

var closeRE = RegExp('^(' + [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
  'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
  'source', 'track', 'wbr', '!--',
  // SVG TAGS
  'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
  'feBlend', 'feColorMatrix', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
  'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
  'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
  'vkern'
].join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$')
function selfClosing (tag) { return closeRE.test(tag) }


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AngularSelectorOnSteroids = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(36);

var _selector = __webpack_require__(5);

var _selectorDropdownItems = __webpack_require__(41);

var _selectorSelectedItems = __webpack_require__(82);

var _selector2 = __webpack_require__(83);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODULE_NAME = 'selectorOnSteroids';

var AngularSelectorOnSteroids = exports.AngularSelectorOnSteroids = function () {
    function AngularSelectorOnSteroids() {
        _classCallCheck(this, AngularSelectorOnSteroids);
    }

    _createClass(AngularSelectorOnSteroids, [{
        key: 'init',
        value: function init() {
            var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var module = angular.module(MODULE_NAME, []).run(['$templateCache', function ($templateCache) {
                $templateCache.put('selector-on-steroids/selector.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR());
                $templateCache.put('selector-on-steroids/selector-dropdown-item.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR_DROPDOWN_ITEMS());
                $templateCache.put('selector-on-steroids/selector-selected-item.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR_SELECTED_ITEMS());
                $templateCache.put('selector-on-steroids/item-create.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_ITEM_CREATE());
                $templateCache.put('selector-on-steroids/item-default.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_ITEM_DEFAULT());
                $templateCache.put('selector-on-steroids/group-default.html', _selector.CONSTANTS.TEMPLATES.TEMPLATE_GROUP_DEFAULT());
            }]).directive('sosSelectedItems', _selectorSelectedItems.SelectorSelectedItemsComponent.Factory(debug)).directive('sosDropdownItems', _selectorDropdownItems.SelectorDropdownItemsComponent.Factory(debug)).directive(MODULE_NAME, _selector2.SelectorComponent.Factory(debug));
            return module;
        }
    }]);

    return AngularSelectorOnSteroids;
}();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(39)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./selector.pcss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./selector.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(38)(undefined);
// imports


// module
exports.push([module.i, "@-webkit-keyframes selector-rotate {\r\n    0% {\r\n        //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)\r\n        transform: rotateZ(-359deg);\r\n    }\r\n    100% {\r\n        //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)\r\n        transform: rotateZ(0deg);\r\n    }\r\n}\r\n\r\n@keyframes selector-rotate {\r\n    0% {\r\n        //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)\r\n        transform: rotateZ(-359deg);\r\n    }\r\n    100% {\r\n        //Instead of the line below you could use @include transform($scale, $rotate, $transx, $transy, $skewx, $skewy, $originx, $originy)\r\n        transform: rotateZ(0deg);\r\n    }\r\n}\r\n\r\n[selector] {\r\n    display: none;\r\n}\r\n\r\n.selector {\r\n    display: none;\r\n}\r\n\r\n.selector-container {\r\n    display: block;\r\n    position: relative;\r\n    font-size: 1em;\r\n    line-height: normal;\r\n    color: #495c68;\r\n    //Instead of the line below you could use @include text-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n    text-shadow: 0 1px 0 rgba(255, 255, 255, .5);\r\n}\r\n\r\n.selector-container input {\r\n        font-size: 1em;\r\n        line-height: normal;\r\n        color: #495c68;\r\n        //Instead of the line below you could use @include text-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n        text-shadow: 0 1px 0 rgba(255, 255, 255, .5);\r\n        outline: none;\r\n        background: none !important;\r\n        border-color: transparent !important;\r\n        width: 2px;\r\n        display: inline-block;\r\n        cursor: pointer;\r\n        padding: 0;\r\n        margin: 0;\r\n        border: 0;\r\n        display: inline;\r\n    }\r\n\r\n.selector-container.rtl .selector-input {\r\n            padding-right: .7em;\r\n            padding-left: 2.6em;\r\n        }\r\n\r\n.selector-container.rtl .selector-helper {\r\n            right: inherit;\r\n            left: 0;\r\n        }\r\n\r\n.selector-container .selector-values {\r\n        list-style: none;\r\n        padding: 0;\r\n        margin: 0;\r\n        border: 0;\r\n        float: left;\r\n    }\r\n\r\n.selector-container .selector-values >li,\r\n        .selector-container .selector-values >div li {\r\n            padding: 0;\r\n            margin: 0;\r\n            border: 0;\r\n            display: inline;\r\n        }\r\n\r\n.selector-container .selector-values >li >div, .selector-container .selector-values >div li >div {\r\n                padding: 0;\r\n                margin: 0;\r\n                border: 0;\r\n                display: inline;\r\n            }\r\n\r\n.selector-container.open input {\r\n            cursor: text;\r\n        }\r\n\r\n.selector-container.open .selector-input {\r\n            background: none;\r\n            border-bottom-color: #eee;\r\n            padding-right: 2.6em;\r\n            //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n            border-radius: 4px 4px 0 0;\r\n        }\r\n\r\n.selector-container.open .selector-global-helper {\r\n            border-left: none !important;\r\n            border-right: none !important;\r\n        }\r\n\r\n.selector-container.open .selector-dropdown {\r\n            display: block;\r\n        }\r\n\r\n.selector-container.open.rtl .selector-input {\r\n            padding-right: .7em;\r\n            padding-left: 2.6em;\r\n        }\r\n\r\n.selector-container.open.empty .selector-input {\r\n            //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n            border-radius: 4px;\r\n            border-bottom-color: #bbb;\r\n        }\r\n\r\n.selector-container.has-value input {\r\n            cursor: text;\r\n        }\r\n\r\n.selector-container.has-value.remove-button .selector-helper {\r\n                border-left: 1px solid #bbb;\r\n            }\r\n\r\n.selector-container.has-value.remove-button .selector-icon {\r\n                display: table;\r\n                width: 100%;\r\n            }\r\n\r\n.selector-container.has-value.remove-button .selector-icon:after {\r\n                    content: '\\D7';\r\n                    display: table-cell;\r\n                    position: relative;\r\n                    top: 0;\r\n                    left: 0;\r\n                    margin: 0;\r\n                    border: none;\r\n                    height: 100%;\r\n                    text-align: center;\r\n                    vertical-align: middle;\r\n                }\r\n\r\n.selector-container.has-value.remove-button.rtl .selector-helper {\r\n                border-left: none;\r\n                border-right: 1px solid #bbb;\r\n            }\r\n\r\n.selector-container.disabled {\r\n        opacity: .6;\r\n    }\r\n\r\n.selector-container.multiple input {\r\n            float: left;\r\n            padding: .2em .6em;\r\n            margin: 0 .15em .25em;\r\n            border-width: 1px;\r\n            border-style: solid;\r\n            float: left;\r\n            line-height: normal;\r\n        }\r\n\r\n.selector-container.multiple .selector-values {\r\n            float: left; \r\n            margin-right: 8px;\r\n        }\r\n\r\n.selector-container.multiple .selector-values >li {\r\n                padding: .2em .6em;\r\n                margin: 0 .15em .25em;\r\n                border-width: 1px;\r\n                border-style: solid;\r\n                float: left;\r\n                line-height: normal;\r\n                display: inline-block;\r\n                position: relative;\r\n                border-color: #0987d6;\r\n                color: #fff;\r\n                //Instead of the line below you could use @include text-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n                text-shadow: 0 1px 1px rgba(0, 0, 0, .2);\r\n                font-weight: 300;\r\n                //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n                border-radius: 3px;\r\n                //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n                box-shadow: inset 0 1px 1px rgba(255, 255, 255, .5), 0 1px 1px rgba(0, 0, 0, .2);\r\n                background-color: #2dadef;\r\n            }\r\n\r\n.selector-container.multiple .selector-values >div li {\r\n                padding: .2em .6em;\r\n                margin: 0 .15em .25em;\r\n                border-width: 1px;\r\n                border-style: solid;\r\n                float: left;\r\n                line-height: normal;\r\n                display: inline-block;\r\n                position: relative;\r\n                border-color: #0987d6;\r\n                color: #fff;\r\n                //Instead of the line below you could use @include text-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n                text-shadow: 0 1px 1px rgba(0, 0, 0, .2);\r\n                font-weight: 300;\r\n                //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n                border-radius: 3px;\r\n                //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n                box-shadow: inset 0 1px 1px rgba(255, 255, 255, .5), 0 1px 1px rgba(0, 0, 0, .2);\r\n                background-color: #2dadef;\r\n            }\r\n\r\n.selector-container.multiple.rtl input {\r\n                float: right;\r\n                float: right;\r\n            }\r\n\r\n.selector-container.multiple.rtl .selector-values {\r\n                float: right;\r\n            }\r\n\r\n.selector-container.multiple.rtl .selector-values >li,\r\n                .selector-container.multiple.rtl .selector-values >div li {\r\n                    float: right;\r\n                }\r\n\r\n.selector-container.multiple.rtl.remove-button .selector-values>li, \r\n            .selector-container.multiple.rtl.remove-button .selector-values>div li, \r\n            .selector-container.multiple.rtl  {\r\n                padding-right: .6em;\r\n                padding-left: 1.9em;\r\n            }\r\n\r\n.selector-container.multiple .selector-input {\r\n            padding: .5em .55em .2em .55em !important;\r\n            cursor: text;\r\n            background: #fff;\r\n            //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n            box-shadow: inset 0 1px 1px rgba(0, 0, 0, .1);\r\n        }\r\n\r\n.selector-container.multiple.remove-button .selector-helper {\r\n                display: block;\r\n                width: 1.3em;\r\n                border-left: 1px solid #0987d6;\r\n                cursor: pointer;\r\n            }\r\n\r\n.selector-container.multiple.remove-button .selector-helper:hover {\r\n                    background: rgba(0, 0, 0, .1);\r\n                }\r\n\r\n.selector-container.multiple.remove-button .selector-values>li,\r\n            .selector-container.multiple.remove-button .selector-values>div li {\r\n                padding-right: 1.9em;\r\n            }\r\n\r\n.selector-container.multiple.remove-button.rtl .selector-helper {\r\n                border-left: none;\r\n                border-right: 1px solid #0987d6;\r\n            }\r\n\r\n.selector-container.multiple .selector-helper {\r\n            display: none;\r\n        }\r\n\r\n.selector-container.multiple.loading .selector-input {\r\n                padding-right: 3em !important;\r\n            }\r\n\r\n.selector-container.multiple.loading .selector-global-helper {\r\n                margin: .75em .8em;\r\n                border-left: none;\r\n                border-right: none;\r\n            }\r\n\r\n.selector-container.multiple.loading.rtl .selector-input {\r\n                    padding-right: .55em !important;\r\n                    padding-left: 3em !important;\r\n                }\r\n\r\n.selector-container.multiple.loading.rtl.has-value .selector-input {\r\n                    padding-right: .25em !important;\r\n                }\r\n\r\n.selector-container.multiple.has-value .selector-input {\r\n            padding-left: .35em !important;\r\n            padding-right: .35em !important;\r\n        }\r\n\r\n.selector-container.loading .selector-global-helper {\r\n            border-left: none !important;\r\n            border-right: none !important;\r\n        }\r\n\r\n.selector-container.loading .selector-global-helper .selector-icon {\r\n                display: table;\r\n                width: 100%;\r\n            }\r\n\r\n.selector-container.loading .selector-global-helper .selector-icon:after {\r\n                    content: '';\r\n                    width: 100%;\r\n                    height: 100%;\r\n                    margin: 0;\r\n                    top: 0;\r\n                    left: 0;\r\n                    opacity: .5;\r\n                    border-top: 1px solid #545a6a;\r\n                    border-bottom: 1px solid #d4d4db;\r\n                    border-left: 1px solid #545a6a;\r\n                    border-right: 1px solid #d4d4db;\r\n                    -webkit-animation: selector-rotate .5s linear infinite;\r\n                            animation: selector-rotate .5s linear infinite;\r\n                    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n                    border-radius: 100%;\r\n                }\r\n\r\n.selector-container.loading .selector-helper.selector-global-helper {\r\n            width: 1.3em;\r\n            height: 1.3em;\r\n            margin: .65em .7em;\r\n        }\r\n\r\n.selector-container.remove-button.has-value .selector-input {\r\n            padding-right: 3.5em;\r\n        }\r\n\r\n.selector-container.remove-button.has-value.rtl .selector-input {\r\n            padding-right: .7em;\r\n            padding-left: 3.5em;\r\n        }\r\n\r\n.selector-input {\r\n    display: block;\r\n    margin: 0;\r\n    position: relative;\r\n    width: 100%;\r\n    padding: .8em 2.6em .7em .7em;\r\n    overflow: hidden;\r\n    cursor: pointer;\r\n    border: 1px solid #bbb;\r\n    //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n    box-shadow: 0 1px 0 rgba(0, 0, 0, .05), inset 0 1px 0 rgba(255, 255, 255, .8);\r\n    //Instead of the line below you could use @include box-sizing($bs)\r\n    box-sizing: border-box;\r\n    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n    border-radius: 4px;\r\n    font-weight: inherit;\r\n    background-color: #f9f9f9;\r\n    background-image: linear-gradient(#fafafa, #eee);\r\n}\r\n\r\n.selector-input input {\r\n        padding-left: 0 !important;\r\n        padding-right: 0 !important;\r\n        border-left: 0 !important;\r\n        border-right: 0 !important;\r\n        max-width: 100% !important;\r\n    }\r\n\r\n.selector-helper {\r\n    position: absolute;\r\n    display: block;\r\n    width: 2.6em;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n}\r\n\r\n.selector-helper .selector-icon {\r\n        display: block;\r\n        position: relative;\r\n        height: 100%;\r\n    }\r\n\r\n.selector-helper .selector-icon:after {\r\n            content: '';\r\n            display: block;\r\n            position: absolute;\r\n            top: 50%;\r\n            left: 50%;\r\n            margin-top: -.1em;\r\n            margin-left: -.4em;\r\n            width: 0;\r\n            height: 0;\r\n            border: .4em solid #888;\r\n            border-left-color: transparent;\r\n            border-right-color: transparent;\r\n            border-bottom: none;\r\n        }\r\n\r\n.selector-shadow {\r\n    padding-left: 0 !important;\r\n    padding-right: 0 !important;\r\n    border-left: 0 !important;\r\n    border-right: 0 !important;\r\n    max-width: 100% !important;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    opacity: 0;\r\n    visibility: hidden;\r\n    white-space: pre;\r\n    margin: 0;\r\n}\r\n\r\n.selector-dropdown {\r\n    display: none;\r\n    list-style: none;\r\n    padding: 0 !important;\r\n    margin: 0 !important;\r\n    position: absolute;\r\n    z-index: 1;\r\n    background: #fff;\r\n    border: 1px solid #ccc;\r\n    border-top: 0;\r\n    max-height: 15.5em;\r\n    overflow-x: hidden;\r\n    overflow-y: auto;\r\n    z-index: 1000;\r\n    //Instead of the line below you could use @include border-radius($radius, $vertical-radius)\r\n    border-radius: 0 0 3px 3px;\r\n    //Instead of the line below you could use @include box-shadow($shadow-1, $shadow-2, $shadow-3, $shadow-4, $shadow-5, $shadow-6, $shadow-7, $shadow-8, $shadow-9, $shadow-10)\r\n    box-shadow: 0 1px 3px rgba(0, 0, 0, .1);\r\n    //Instead of the line below you could use @include box-sizing($bs)\r\n    box-sizing: border-box;\r\n    \r\n}\r\n\r\n.selector-dropdown >li,\r\n    .selector-dropdown >div li {\r\n        padding: .65em .8em;\r\n        overflow: hidden;\r\n        cursor: pointer;\r\n    }\r\n\r\n.selector-dropdown .selector-optgroup {\r\n        background: #fefefe;\r\n        border-top: 1px solid #eee;\r\n        border-bottom: 1px solid #eee;\r\n    }\r\n\r\n.selector-dropdown .selector-option:hover {\r\n            background: #f5fafd;\r\n        }\r\n\r\n.selector-dropdown .selector-option.grouped {\r\n            padding-left: 1.6em;\r\n        }\r\n\r\n.selector-dropdown .selector-option.active {\r\n            background: #f5fafd;\r\n        }\r\n\r\n.selector-dropdown .selector-option.no-data{\r\n\r\n        }\r\n\r\n.selector-dropdown .selector-option.loading{\r\n            \r\n        }\r\n\r\n.selector-dropdown .selector-option.create {\r\n            color: rgba(73, 92, 104, .6);\r\n        }\r\n\r\n.selector-dropdown .selector-option.create.active {\r\n                color: #495c68;\r\n            }", ""]);

// exports


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(40);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 40 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectorDropdownItemsComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<li class="selector-option js-data-item ', '" id="sos-data-index-', '">', '</li>'], ['<li class="selector-option js-data-item ', '" id="sos-data-index-', '">', '</li>']),
    _templateObject2 = _taggedTemplateLiteral(['<li class="selector-optgroup">', '</li>'], ['<li class="selector-optgroup">', '</li>']),
    _templateObject3 = _taggedTemplateLiteral([''], ['']),
    _templateObject4 = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject5 = _taggedTemplateLiteral(['<span>', '', '</span>'], ['<span>', '', '</span>']),
    _templateObject6 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']);

var _Observable = __webpack_require__(0);

__webpack_require__(15);

__webpack_require__(16);

var _selector = __webpack_require__(5);

var _virtualDom = __webpack_require__(25);

var vdom = _interopRequireWildcard(_virtualDom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hyperx = __webpack_require__(34);

var SelectorDropdownItemsComponent = exports.SelectorDropdownItemsComponent = function () {
    function SelectorDropdownItemsComponent($log, debug) {
        _classCallCheck(this, SelectorDropdownItemsComponent);

        this.$log = $log;
        this.debug = debug;
        this.replace = true;
        this.restrict = 'E';
        this.templateUrl = 'selector-on-steroids/selector-dropdown-item.html';
        this.scope = {
            input: '<'
        };
    }

    _createClass(SelectorDropdownItemsComponent, [{
        key: 'link',
        value: function link(scope, element, attrs) {
            var _this = this;

            var hx = hyperx(vdom.h, {
                vdom: true
            });
            var _subscribers = [];
            var _parentReferences = {};
            var _isBooted = false;
            var _isFirstRendered = false;
            var _tree = null;
            var _rootNode = null;
            var GET_DROPDOWN_ITEM_TEMPLATE = function GET_DROPDOWN_ITEM_TEMPLATE(option, index, filteredOptions, highlighted) {
                var cls = (highlighted === index ? 'active' : '') + ' ' + (_parentReferences.groupAttr && _parentReferences.getObjValue(option, _parentReferences.groupAttr) ? 'grouped' : '');
                var boundValue = _parentReferences.getObjValue(option, _parentReferences.labelAttr);
                boundValue = boundValue ? boundValue : (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' ? JSON.stringify(option) : option;
                return hx(_templateObject, cls, index, boundValue);
            };
            var GET_DROPDOWN_GROUP_TEMPLATE = function GET_DROPDOWN_GROUP_TEMPLATE(option, index, filteredOptions) {
                if (_parentReferences.groupAttr) {
                    var boundValue = _parentReferences.getObjValue(option, _parentReferences.groupAttr);
                    if (boundValue && index === 0 || _parentReferences.getObjValue(filteredOptions[index - 1], _parentReferences.groupAttr) !== boundValue) {
                        return hx(_templateObject2, boundValue);
                    } else {
                        return hx(_templateObject3);
                    }
                } else {
                    return hx(_templateObject3);
                }
            };
            var getRenderableItems = function getRenderableItems(items, highlighted) {
                var liList = hx(_templateObject4, items.map(function (currentValue, index, array) {
                    return hx(_templateObject5, GET_DROPDOWN_GROUP_TEMPLATE(currentValue, index, array), GET_DROPDOWN_ITEM_TEMPLATE(currentValue, index, array, highlighted));
                }));
                var tpl = hx(_templateObject6, liList);
                return tpl;
            };
            _Observable.Observable.merge(_Observable.Observable.fromEvent(element[0], 'mouseenter'), _Observable.Observable.fromEvent(element[0], 'click')).subscribe(function (e) {
                if (e.type === 'mouseover') {
                    var el = e.srcElement.getAttribute('id');
                    if (!el) {
                        return;
                    }
                    var index = parseInt(el.replace('sos-data-index-', ''));
                    if (_parentReferences['highlight']) {
                        _parentReferences['highlight'](index < -1 ? -1 : index);
                    }
                }
                if (e.type === 'click') {
                    var _el = e.srcElement.getAttribute('id');
                    if (!_el) {
                        return;
                    }
                    var _index = parseInt(_el.replace('sos-data-index-', ''));
                    if (_parentReferences['highlight']) {
                        _parentReferences['highlight'](_index < -1 ? -1 : _index);
                    }
                    if (_parentReferences['set']) {
                        _parentReferences['set'](undefined);
                    }
                }
                e.stopPropagation();
            });
            if (scope.input) {
                // TODO: Move to post link?
                _subscribers.push(scope.input.subscribe(function (inputData) {
                    if (inputData.filteredOptions && inputData.filteredOptions.length) {
                        if (!_isBooted) {
                            if (!_parentReferences.hasOwnProperty('groupAttr') || !_parentReferences.hasOwnProperty('valueAttr') || !_parentReferences.hasOwnProperty('labelAttr') || !_parentReferences.hasOwnProperty('getObjValue') || !_parentReferences.hasOwnProperty('set') || !_parentReferences.hasOwnProperty('highlight')) {
                                _parentReferences['groupAttr'] = inputData.groupAttr;
                                _parentReferences['valueAttr'] = inputData.valueAttr;
                                _parentReferences['labelAttr'] = inputData.labelAttr;
                                _parentReferences['getObjValue'] = inputData.getObjValue;
                                _parentReferences['set'] = inputData.set;
                                _parentReferences['highlight'] = inputData.highlight;
                                _isBooted = true;
                            }
                        }
                        if (_isBooted) {
                            if (!_isFirstRendered) {
                                var tpl = getRenderableItems(inputData.filteredOptions, inputData.highlighted);
                                _tree = tpl;
                                _rootNode = vdom.create(_tree);
                                element[0].appendChild(_rootNode);
                                _isFirstRendered = true;
                            } else {
                                var _tpl = getRenderableItems(inputData.filteredOptions, inputData.highlighted);
                                var newTree = _tpl;
                                var patches = vdom.diff(_tree, newTree);
                                _rootNode = vdom.patch(_rootNode, patches);
                                _tree = newTree;
                            }
                        }
                        if (_this.debug) {
                            _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'debug', 'Re-drawing items/ options.');
                        }
                    }
                }, function (error) {
                    _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', 'Cannot initialize, Selector Dropdown Items Component!');
                }));
            }
            scope.$on('$destroy', function () {
                // dispose subscribers
                if (_subscribers && _subscribers.length) {
                    _subscribers.forEach(function (s) {
                        s.unsubscribe();
                    });
                    _subscribers = null;
                }
            });
        }
    }], [{
        key: 'Factory',
        value: function Factory(debug) {
            var directive = function directive($log) {
                return new SelectorDropdownItemsComponent($log, debug);
            };
            directive['$inject'] = ['$log'];
            return directive;
        }
    }]);

    return SelectorDropdownItemsComponent;
}();

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Subscriber_1 = __webpack_require__(6);
var rxSubscriber_1 = __webpack_require__(14);
var Observer_1 = __webpack_require__(20);
function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber_1.rxSubscriber]) {
            return nextOrObserver[rxSubscriber_1.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer_1.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
exports.toSubscriber = toSubscriber;
//# sourceMappingURL=toSubscriber.js.map

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArray.js.map

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
exports.UnsubscriptionError = UnsubscriptionError;
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var noop_1 = __webpack_require__(46);
/* tslint:enable:max-line-length */
function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i - 0] = arguments[_i];
    }
    return pipeFromArray(fns);
}
exports.pipe = pipe;
/* @internal */
function pipeFromArray(fns) {
    if (!fns) {
        return noop_1.noop;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
exports.pipeFromArray = pipeFromArray;
//# sourceMappingURL=pipe.js.map

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/* tslint:disable:no-empty */
function noop() { }
exports.noop = noop;
//# sourceMappingURL=noop.js.map

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var merge_1 = __webpack_require__(48);
exports.merge = merge_1.mergeStatic;
//# sourceMappingURL=merge.js.map

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var merge_1 = __webpack_require__(22);
var merge_2 = __webpack_require__(22);
exports.mergeStatic = merge_2.mergeStatic;
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which concurrently emits all values from every
 * given input Observable.
 *
 * <span class="informal">Flattens multiple Observables together by blending
 * their values into one Observable.</span>
 *
 * <img src="./img/merge.png" width="100%">
 *
 * `merge` subscribes to each given input Observable (either the source or an
 * Observable given as argument), and simply forwards (without doing any
 * transformation) all the values from all the input Observables to the output
 * Observable. The output Observable only completes once all input Observables
 * have completed. Any error delivered by an input Observable will be immediately
 * emitted on the output Observable.
 *
 * @example <caption>Merge together two Observables: 1s interval and clicks</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var timer = Rx.Observable.interval(1000);
 * var clicksOrTimer = clicks.merge(timer);
 * clicksOrTimer.subscribe(x => console.log(x));
 *
 * @example <caption>Merge together 3 Observables, but only 2 run concurrently</caption>
 * var timer1 = Rx.Observable.interval(1000).take(10);
 * var timer2 = Rx.Observable.interval(2000).take(6);
 * var timer3 = Rx.Observable.interval(500).take(10);
 * var concurrent = 2; // the argument
 * var merged = timer1.merge(timer2, timer3, concurrent);
 * merged.subscribe(x => console.log(x));
 *
 * @see {@link mergeAll}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 *
 * @param {ObservableInput} other An input Observable to merge with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {Scheduler} [scheduler=null] The IScheduler to use for managing
 * concurrency of input Observables.
 * @return {Observable} An Observable that emits items that are the result of
 * every input Observable.
 * @method merge
 * @owner Observable
 */
function merge() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i - 0] = arguments[_i];
    }
    return merge_1.merge.apply(void 0, observables)(this);
}
exports.merge = merge;
//# sourceMappingURL=merge.js.map

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(0);
var ScalarObservable_1 = __webpack_require__(50);
var EmptyObservable_1 = __webpack_require__(23);
var isScheduler_1 = __webpack_require__(24);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ArrayObservable = (function (_super) {
    __extends(ArrayObservable, _super);
    function ArrayObservable(array, scheduler) {
        _super.call(this);
        this.array = array;
        this.scheduler = scheduler;
        if (!scheduler && array.length === 1) {
            this._isScalar = true;
            this.value = array[0];
        }
    }
    ArrayObservable.create = function (array, scheduler) {
        return new ArrayObservable(array, scheduler);
    };
    /**
     * Creates an Observable that emits some values you specify as arguments,
     * immediately one after the other, and then emits a complete notification.
     *
     * <span class="informal">Emits the arguments you provide, then completes.
     * </span>
     *
     * <img src="./img/of.png" width="100%">
     *
     * This static operator is useful for creating a simple Observable that only
     * emits the arguments given, and the complete notification thereafter. It can
     * be used for composing with other Observables, such as with {@link concat}.
     * By default, it uses a `null` IScheduler, which means the `next`
     * notifications are sent synchronously, although with a different IScheduler
     * it is possible to determine when those notifications will be delivered.
     *
     * @example <caption>Emit 10, 20, 30, then 'a', 'b', 'c', then start ticking every second.</caption>
     * var numbers = Rx.Observable.of(10, 20, 30);
     * var letters = Rx.Observable.of('a', 'b', 'c');
     * var interval = Rx.Observable.interval(1000);
     * var result = numbers.concat(letters).concat(interval);
     * result.subscribe(x => console.log(x));
     *
     * @see {@link create}
     * @see {@link empty}
     * @see {@link never}
     * @see {@link throw}
     *
     * @param {...T} values Arguments that represent `next` values to be emitted.
     * @param {Scheduler} [scheduler] A {@link IScheduler} to use for scheduling
     * the emissions of the `next` notifications.
     * @return {Observable<T>} An Observable that emits each given input value.
     * @static true
     * @name of
     * @owner Observable
     */
    ArrayObservable.of = function () {
        var array = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            array[_i - 0] = arguments[_i];
        }
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len > 1) {
            return new ArrayObservable(array, scheduler);
        }
        else if (len === 1) {
            return new ScalarObservable_1.ScalarObservable(array[0], scheduler);
        }
        else {
            return new EmptyObservable_1.EmptyObservable(scheduler);
        }
    };
    ArrayObservable.dispatch = function (state) {
        var array = state.array, index = state.index, count = state.count, subscriber = state.subscriber;
        if (index >= count) {
            subscriber.complete();
            return;
        }
        subscriber.next(array[index]);
        if (subscriber.closed) {
            return;
        }
        state.index = index + 1;
        this.schedule(state);
    };
    ArrayObservable.prototype._subscribe = function (subscriber) {
        var index = 0;
        var array = this.array;
        var count = array.length;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ArrayObservable.dispatch, 0, {
                array: array, index: index, count: count, subscriber: subscriber
            });
        }
        else {
            for (var i = 0; i < count && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            subscriber.complete();
        }
    };
    return ArrayObservable;
}(Observable_1.Observable));
exports.ArrayObservable = ArrayObservable;
//# sourceMappingURL=ArrayObservable.js.map

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(0);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ScalarObservable = (function (_super) {
    __extends(ScalarObservable, _super);
    function ScalarObservable(value, scheduler) {
        _super.call(this);
        this.value = value;
        this.scheduler = scheduler;
        this._isScalar = true;
        if (scheduler) {
            this._isScalar = false;
        }
    }
    ScalarObservable.create = function (value, scheduler) {
        return new ScalarObservable(value, scheduler);
    };
    ScalarObservable.dispatch = function (state) {
        var done = state.done, value = state.value, subscriber = state.subscriber;
        if (done) {
            subscriber.complete();
            return;
        }
        subscriber.next(value);
        if (subscriber.closed) {
            return;
        }
        state.done = true;
        this.schedule(state);
    };
    ScalarObservable.prototype._subscribe = function (subscriber) {
        var value = this.value;
        var scheduler = this.scheduler;
        if (scheduler) {
            return scheduler.schedule(ScalarObservable.dispatch, 0, {
                done: false, value: value, subscriber: subscriber
            });
        }
        else {
            subscriber.next(value);
            if (!subscriber.closed) {
                subscriber.complete();
            }
        }
    };
    return ScalarObservable;
}(Observable_1.Observable));
exports.ScalarObservable = ScalarObservable;
//# sourceMappingURL=ScalarObservable.js.map

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var mergeMap_1 = __webpack_require__(52);
var identity_1 = __webpack_require__(59);
/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * <img src="./img/mergeAll.png" width="100%">
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * @example <caption>Spawn a new interval Observable for each click event, and blend their outputs as one Observable</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000));
 * var firstOrder = higherOrder.mergeAll();
 * firstOrder.subscribe(x => console.log(x));
 *
 * @example <caption>Count from 0 to 9 every second for each click, but only allow 2 concurrent timers</caption>
 * var clicks = Rx.Observable.fromEvent(document, 'click');
 * var higherOrder = clicks.map((ev) => Rx.Observable.interval(1000).take(10));
 * var firstOrder = higherOrder.mergeAll(2);
 * firstOrder.subscribe(x => console.log(x));
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switch}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @method mergeAll
 * @owner Observable
 */
function mergeAll(concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return mergeMap_1.mergeMap(identity_1.identity, null, concurrent);
}
exports.mergeAll = mergeAll;
//# sourceMappingURL=mergeAll.js.map

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var subscribeToResult_1 = __webpack_require__(53);
var OuterSubscriber_1 = __webpack_require__(58);
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link mergeAll}.</span>
 *
 * <img src="./img/mergeMap.png" width="100%">
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger.
 *
 * @example <caption>Map and flatten each letter to an Observable ticking every 1 second</caption>
 * var letters = Rx.Observable.of('a', 'b', 'c');
 * var result = letters.mergeMap(x =>
 *   Rx.Observable.interval(1000).map(i => x+i)
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // a0
 * // b0
 * // c0
 * // a1
 * // b1
 * // c1
 * // continues to list a,b,c with respective ascending integers
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link merge}
 * @see {@link mergeAll}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @param {function(outerValue: T, innerValue: I, outerIndex: number, innerIndex: number): any} [resultSelector]
 * A function to produce the value on the output Observable based on the values
 * and the indices of the source (outer) emission and the inner Observable
 * emission. The arguments passed to this function are:
 * - `outerValue`: the value that came from the source
 * - `innerValue`: the value that came from the projected Observable
 * - `outerIndex`: the "index" of the value that came from the source
 * - `innerIndex`: the "index" of the value from the projected Observable
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional `resultSelector`) to each item emitted
 * by the source Observable and merging the results of the Observables obtained
 * from this transformation.
 * @method mergeMap
 * @owner Observable
 */
function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return function mergeMapOperatorFunction(source) {
        if (typeof resultSelector === 'number') {
            concurrent = resultSelector;
            resultSelector = null;
        }
        return source.lift(new MergeMapOperator(project, resultSelector, concurrent));
    };
}
exports.mergeMap = mergeMap;
var MergeMapOperator = (function () {
    function MergeMapOperator(project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
    }
    MergeMapOperator.prototype.call = function (observer, source) {
        return source.subscribe(new MergeMapSubscriber(observer, this.project, this.resultSelector, this.concurrent));
    };
    return MergeMapOperator;
}());
exports.MergeMapOperator = MergeMapOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeMapSubscriber = (function (_super) {
    __extends(MergeMapSubscriber, _super);
    function MergeMapSubscriber(destination, project, resultSelector, concurrent) {
        if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
        _super.call(this, destination);
        this.project = project;
        this.resultSelector = resultSelector;
        this.concurrent = concurrent;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    MergeMapSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            this._tryNext(value);
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeMapSubscriber.prototype._tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.active++;
        this._innerSub(result, value, index);
    };
    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
        this.add(subscribeToResult_1.subscribeToResult(this, ish, value, index));
    };
    MergeMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            this.destination.complete();
        }
    };
    MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (this.resultSelector) {
            this._notifyResultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        else {
            this.destination.next(innerValue);
        }
    };
    MergeMapSubscriber.prototype._notifyResultSelector = function (outerValue, innerValue, outerIndex, innerIndex) {
        var result;
        try {
            result = this.resultSelector(outerValue, innerValue, outerIndex, innerIndex);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        this.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            this.destination.complete();
        }
    };
    return MergeMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeMapSubscriber = MergeMapSubscriber;
//# sourceMappingURL=mergeMap.js.map

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
var isArrayLike_1 = __webpack_require__(54);
var isPromise_1 = __webpack_require__(55);
var isObject_1 = __webpack_require__(18);
var Observable_1 = __webpack_require__(0);
var iterator_1 = __webpack_require__(56);
var InnerSubscriber_1 = __webpack_require__(57);
var observable_1 = __webpack_require__(21);
function subscribeToResult(outerSubscriber, result, outerValue, outerIndex) {
    var destination = new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex);
    if (destination.closed) {
        return null;
    }
    if (result instanceof Observable_1.Observable) {
        if (result._isScalar) {
            destination.next(result.value);
            destination.complete();
            return null;
        }
        else {
            destination.syncErrorThrowable = true;
            return result.subscribe(destination);
        }
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        for (var i = 0, len = result.length; i < len && !destination.closed; i++) {
            destination.next(result[i]);
        }
        if (!destination.closed) {
            destination.complete();
        }
    }
    else if (isPromise_1.isPromise(result)) {
        result.then(function (value) {
            if (!destination.closed) {
                destination.next(value);
                destination.complete();
            }
        }, function (err) { return destination.error(err); })
            .then(null, function (err) {
            // Escaping the Promise trap: globally throw unhandled errors
            root_1.root.setTimeout(function () { throw err; });
        });
        return destination;
    }
    else if (result && typeof result[iterator_1.iterator] === 'function') {
        var iterator = result[iterator_1.iterator]();
        do {
            var item = iterator.next();
            if (item.done) {
                destination.complete();
                break;
            }
            destination.next(item.value);
            if (destination.closed) {
                break;
            }
        } while (true);
    }
    else if (result && typeof result[observable_1.observable] === 'function') {
        var obs = result[observable_1.observable]();
        if (typeof obs.subscribe !== 'function') {
            destination.error(new TypeError('Provided object does not correctly implement Symbol.observable'));
        }
        else {
            return obs.subscribe(new InnerSubscriber_1.InnerSubscriber(outerSubscriber, outerValue, outerIndex));
        }
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = ("You provided " + value + " where a stream was expected.")
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        destination.error(new TypeError(msg));
    }
    return null;
}
exports.subscribeToResult = subscribeToResult;
//# sourceMappingURL=subscribeToResult.js.map

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.isArrayLike = (function (x) { return x && typeof x.length === 'number'; });
//# sourceMappingURL=isArrayLike.js.map

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function isPromise(value) {
    return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
}
exports.isPromise = isPromise;
//# sourceMappingURL=isPromise.js.map

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root_1 = __webpack_require__(2);
function symbolIteratorPonyfill(root) {
    var Symbol = root.Symbol;
    if (typeof Symbol === 'function') {
        if (!Symbol.iterator) {
            Symbol.iterator = Symbol('iterator polyfill');
        }
        return Symbol.iterator;
    }
    else {
        // [for Mozilla Gecko 27-35:](https://mzl.la/2ewE1zC)
        var Set_1 = root.Set;
        if (Set_1 && typeof new Set_1()['@@iterator'] === 'function') {
            return '@@iterator';
        }
        var Map_1 = root.Map;
        // required for compatability with es6-shim
        if (Map_1) {
            var keys = Object.getOwnPropertyNames(Map_1.prototype);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
                if (key !== 'entries' && key !== 'size' && Map_1.prototype[key] === Map_1.prototype['entries']) {
                    return key;
                }
            }
        }
        return '@@iterator';
    }
}
exports.symbolIteratorPonyfill = symbolIteratorPonyfill;
exports.iterator = symbolIteratorPonyfill(root_1.root);
/**
 * @deprecated use iterator instead
 */
exports.$$iterator = exports.iterator;
//# sourceMappingURL=iterator.js.map

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(6);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        _super.call(this);
        this.parent = parent;
        this.outerValue = outerValue;
        this.outerIndex = outerIndex;
        this.index = 0;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=InnerSubscriber.js.map

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscriber_1 = __webpack_require__(6);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var OuterSubscriber = (function (_super) {
    __extends(OuterSubscriber, _super);
    function OuterSubscriber() {
        _super.apply(this, arguments);
    }
    OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
        this.destination.error(error);
    };
    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
        this.destination.complete();
    };
    return OuterSubscriber;
}(Subscriber_1.Subscriber));
exports.OuterSubscriber = OuterSubscriber;
//# sourceMappingURL=OuterSubscriber.js.map

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function identity(x) {
    return x;
}
exports.identity = identity;
//# sourceMappingURL=identity.js.map

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var FromEventObservable_1 = __webpack_require__(61);
exports.fromEvent = FromEventObservable_1.FromEventObservable.create;
//# sourceMappingURL=fromEvent.js.map

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(0);
var tryCatch_1 = __webpack_require__(19);
var isFunction_1 = __webpack_require__(12);
var errorObject_1 = __webpack_require__(13);
var Subscription_1 = __webpack_require__(7);
var toString = Object.prototype.toString;
function isNodeStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.addListener === 'function' && typeof sourceObj.removeListener === 'function';
}
function isJQueryStyleEventEmitter(sourceObj) {
    return !!sourceObj && typeof sourceObj.on === 'function' && typeof sourceObj.off === 'function';
}
function isNodeList(sourceObj) {
    return !!sourceObj && toString.call(sourceObj) === '[object NodeList]';
}
function isHTMLCollection(sourceObj) {
    return !!sourceObj && toString.call(sourceObj) === '[object HTMLCollection]';
}
function isEventTarget(sourceObj) {
    return !!sourceObj && typeof sourceObj.addEventListener === 'function' && typeof sourceObj.removeEventListener === 'function';
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var FromEventObservable = (function (_super) {
    __extends(FromEventObservable, _super);
    function FromEventObservable(sourceObj, eventName, selector, options) {
        _super.call(this);
        this.sourceObj = sourceObj;
        this.eventName = eventName;
        this.selector = selector;
        this.options = options;
    }
    /* tslint:enable:max-line-length */
    /**
     * Creates an Observable that emits events of a specific type coming from the
     * given event target.
     *
     * <span class="informal">Creates an Observable from DOM events, or Node.js
     * EventEmitter events or others.</span>
     *
     * <img src="./img/fromEvent.png" width="100%">
     *
     * `fromEvent` accepts as a first argument event target, which is an object with methods
     * for registering event handler functions. As a second argument it takes string that indicates
     * type of event we want to listen for. `fromEvent` supports selected types of event targets,
     * which are described in detail below. If your event target does not match any of the ones listed,
     * you should use {@link fromEventPattern}, which can be used on arbitrary APIs.
     * When it comes to APIs supported by `fromEvent`, their methods for adding and removing event
     * handler functions have different names, but they all accept a string describing event type
     * and function itself, which will be called whenever said event happens.
     *
     * Every time resulting Observable is subscribed, event handler function will be registered
     * to event target on given event type. When that event fires, value
     * passed as a first argument to registered function will be emitted by output Observable.
     * When Observable is unsubscribed, function will be unregistered from event target.
     *
     * Note that if event target calls registered function with more than one argument, second
     * and following arguments will not appear in resulting stream. In order to get access to them,
     * you can pass to `fromEvent` optional project function, which will be called with all arguments
     * passed to event handler. Output Observable will then emit value returned by project function,
     * instead of the usual value.
     *
     * Remember that event targets listed below are checked via duck typing. It means that
     * no matter what kind of object you have and no matter what environment you work in,
     * you can safely use `fromEvent` on that object if it exposes described methods (provided
     * of course they behave as was described above). So for example if Node.js library exposes
     * event target which has the same method names as DOM EventTarget, `fromEvent` is still
     * a good choice.
     *
     * If the API you use is more callback then event handler oriented (subscribed
     * callback function fires only once and thus there is no need to manually
     * unregister it), you should use {@link bindCallback} or {@link bindNodeCallback}
     * instead.
     *
     * `fromEvent` supports following types of event targets:
     *
     * **DOM EventTarget**
     *
     * This is an object with `addEventListener` and `removeEventListener` methods.
     *
     * In the browser, `addEventListener` accepts - apart from event type string and event
     * handler function arguments - optional third parameter, which is either an object or boolean,
     * both used for additional configuration how and when passed function will be called. When
     * `fromEvent` is used with event target of that type, you can provide this values
     * as third parameter as well.
     *
     * **Node.js EventEmitter**
     *
     * An object with `addListener` and `removeListener` methods.
     *
     * **JQuery-style event target**
     *
     * An object with `on` and `off` methods
     *
     * **DOM NodeList**
     *
     * List of DOM Nodes, returned for example by `document.querySelectorAll` or `Node.childNodes`.
     *
     * Although this collection is not event target in itself, `fromEvent` will iterate over all Nodes
     * it contains and install event handler function in every of them. When returned Observable
     * is unsubscribed, function will be removed from all Nodes.
     *
     * **DOM HtmlCollection**
     *
     * Just as in case of NodeList it is a collection of DOM nodes. Here as well event handler function is
     * installed and removed in each of elements.
     *
     *
     * @example <caption>Emits clicks happening on the DOM document</caption>
     * var clicks = Rx.Observable.fromEvent(document, 'click');
     * clicks.subscribe(x => console.log(x));
     *
     * // Results in:
     * // MouseEvent object logged to console every time a click
     * // occurs on the document.
     *
     *
     * @example <caption>Use addEventListener with capture option</caption>
     * var clicksInDocument = Rx.Observable.fromEvent(document, 'click', true); // note optional configuration parameter
     *                                                                          // which will be passed to addEventListener
     * var clicksInDiv = Rx.Observable.fromEvent(someDivInDocument, 'click');
     *
     * clicksInDocument.subscribe(() => console.log('document'));
     * clicksInDiv.subscribe(() => console.log('div'));
     *
     * // By default events bubble UP in DOM tree, so normally
     * // when we would click on div in document
     * // "div" would be logged first and then "document".
     * // Since we specified optional `capture` option, document
     * // will catch event when it goes DOWN DOM tree, so console
     * // will log "document" and then "div".
     *
     * @see {@link bindCallback}
     * @see {@link bindNodeCallback}
     * @see {@link fromEventPattern}
     *
     * @param {EventTargetLike} target The DOM EventTarget, Node.js
     * EventEmitter, JQuery-like event target, NodeList or HTMLCollection to attach the event handler to.
     * @param {string} eventName The event name of interest, being emitted by the
     * `target`.
     * @param {EventListenerOptions} [options] Options to pass through to addEventListener
     * @param {SelectorMethodSignature<T>} [selector] An optional function to
     * post-process results. It takes the arguments from the event handler and
     * should return a single value.
     * @return {Observable<T>}
     * @static true
     * @name fromEvent
     * @owner Observable
     */
    FromEventObservable.create = function (target, eventName, options, selector) {
        if (isFunction_1.isFunction(options)) {
            selector = options;
            options = undefined;
        }
        return new FromEventObservable(target, eventName, selector, options);
    };
    FromEventObservable.setupSubscription = function (sourceObj, eventName, handler, subscriber, options) {
        var unsubscribe;
        if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
            for (var i = 0, len = sourceObj.length; i < len; i++) {
                FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
            }
        }
        else if (isEventTarget(sourceObj)) {
            var source_1 = sourceObj;
            sourceObj.addEventListener(eventName, handler, options);
            unsubscribe = function () { return source_1.removeEventListener(eventName, handler); };
        }
        else if (isJQueryStyleEventEmitter(sourceObj)) {
            var source_2 = sourceObj;
            sourceObj.on(eventName, handler);
            unsubscribe = function () { return source_2.off(eventName, handler); };
        }
        else if (isNodeStyleEventEmitter(sourceObj)) {
            var source_3 = sourceObj;
            sourceObj.addListener(eventName, handler);
            unsubscribe = function () { return source_3.removeListener(eventName, handler); };
        }
        else {
            throw new TypeError('Invalid event target');
        }
        subscriber.add(new Subscription_1.Subscription(unsubscribe));
    };
    FromEventObservable.prototype._subscribe = function (subscriber) {
        var sourceObj = this.sourceObj;
        var eventName = this.eventName;
        var options = this.options;
        var selector = this.selector;
        var handler = selector ? function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var result = tryCatch_1.tryCatch(selector).apply(void 0, args);
            if (result === errorObject_1.errorObject) {
                subscriber.error(errorObject_1.errorObject.e);
            }
            else {
                subscriber.next(result);
            }
        } : function (e) { return subscriber.next(e); };
        FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options);
    };
    return FromEventObservable;
}(Observable_1.Observable));
exports.FromEventObservable = FromEventObservable;
//# sourceMappingURL=FromEventObservable.js.map

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(63)

module.exports = diff


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(17)

var VPatch = __webpack_require__(26)
var isVNode = __webpack_require__(4)
var isVText = __webpack_require__(8)
var isWidget = __webpack_require__(1)
var isThunk = __webpack_require__(9)
var handleThunk = __webpack_require__(27)

var diffProps = __webpack_require__(64)

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(28)
var isHook = __webpack_require__(10)

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var patch = __webpack_require__(66)

module.exports = patch


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(29)
var isArray = __webpack_require__(17)

var render = __webpack_require__(30)
var domIndex = __webpack_require__(68)
var patchOp = __webpack_require__(69)
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}


/***/ }),
/* 67 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 68 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(31)

var isWidget = __webpack_require__(1)
var VPatch = __webpack_require__(26)

var updateWidget = __webpack_require__(70)

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var isWidget = __webpack_require__(1)

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var h = __webpack_require__(72)

module.exports = h


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(17);

var VNode = __webpack_require__(32);
var VText = __webpack_require__(33);
var isVNode = __webpack_require__(4);
var isVText = __webpack_require__(8);
var isWidget = __webpack_require__(1);
var isHook = __webpack_require__(10);
var isVThunk = __webpack_require__(9);

var parseTag = __webpack_require__(73);
var softSetHook = __webpack_require__(75);
var evHook = __webpack_require__(76);

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var split = __webpack_require__(74);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EvStore = __webpack_require__(77);

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OneVersionConstraint = __webpack_require__(78);

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Individual = __webpack_require__(79);

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(30)

module.exports = createElement


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = attributeToProperty

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv'
}

function attributeToProperty (h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr]
        delete attrs[attr]
      }
    }
    return h(tagName, attrs, children)
  }
}


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectorSelectedItemsComponent = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['<div class="selector-helper"><span class="selector-icon" id="sos-data-index-', '"></span></div>'], ['<div class="selector-helper"><span class="selector-icon" id="sos-data-index-', '"></span></div>']),
    _templateObject2 = _taggedTemplateLiteral([''], ['']),
    _templateObject3 = _taggedTemplateLiteral(['<li>', ' ', '</li>'], ['<li>', ' ', '</li>']),
    _templateObject4 = _taggedTemplateLiteral(['', ''], ['', '']),
    _templateObject5 = _taggedTemplateLiteral(['<div>', '</div>'], ['<div>', '</div>']);

var _Observable = __webpack_require__(0);

__webpack_require__(15);

__webpack_require__(16);

var _selector = __webpack_require__(5);

var _virtualDom = __webpack_require__(25);

var vdom = _interopRequireWildcard(_virtualDom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var hyperx = __webpack_require__(34);

var SelectorSelectedItemsComponent = exports.SelectorSelectedItemsComponent = function () {
    function SelectorSelectedItemsComponent($log, debug) {
        _classCallCheck(this, SelectorSelectedItemsComponent);

        this.$log = $log;
        this.debug = debug;
        this.replace = true;
        this.restrict = 'E';
        this.templateUrl = 'selector-on-steroids/selector-selected-item.html';
        this.scope = {
            input: '<'
        };
    }

    _createClass(SelectorSelectedItemsComponent, [{
        key: 'link',
        value: function link(scope, element, attrs) {
            var _this = this;

            var hx = hyperx(vdom.h, {
                vdom: true
            });
            var _subscribers = [];
            var _parentReferences = {};
            var _isBooted = false;
            var _isFirstRendered = false;
            var _tree = null;
            var _rootNode = null;
            var GET_SELECTED_ITEM_TEMPLATE = function GET_SELECTED_ITEM_TEMPLATE(option, index, filteredOptions, parentReferences) {
                var boundValue = parentReferences.getObjValue(option, parentReferences.labelAttr);
                boundValue = boundValue ? boundValue : (typeof option === 'undefined' ? 'undefined' : _typeof(option)) === 'object' ? JSON.stringify(option) : option;
                var closeButton = parentReferences.multiple ? hx(_templateObject, index) : hx(_templateObject2);
                return hx(_templateObject3, boundValue, closeButton);
            };
            var getRenderableItems = function getRenderableItems(items) {
                var liList = hx(_templateObject4, items.map(function (currentValue, index, array) {
                    return hx(_templateObject4, GET_SELECTED_ITEM_TEMPLATE(currentValue, index, array, _parentReferences));
                }));
                var tpl = hx(_templateObject5, liList);
                return tpl;
            };
            _Observable.Observable.fromEvent(element[0], 'click').subscribe(function (e) {
                if (e.type === 'click') {
                    if (e.srcElement.classList.contains('selector-icon')) {
                        var el = e.srcElement.getAttribute('id');
                        if (!el) {
                            return;
                        }
                        var index = parseInt(el.replace('sos-data-index-', ''));
                        if (_parentReferences['unset']) {
                            _parentReferences['unset'](index < -1 ? -1 : index);
                        }
                    }
                }
                e.stopPropagation();
            });
            if (scope.input) {
                // TODO: Move to post link?
                _subscribers.push(scope.input.subscribe(function (inputData) {
                    if (inputData.selectedValues) {
                        if (!_isBooted) {
                            if (!_parentReferences.hasOwnProperty('groupAttr') || !_parentReferences.hasOwnProperty('valueAttr') || !_parentReferences.hasOwnProperty('labelAttr') || !_parentReferences.hasOwnProperty('getObjValue') || !_parentReferences.hasOwnProperty('unset') || !_parentReferences.hasOwnProperty('multiple') || !_parentReferences.hasOwnProperty('disabled')) {
                                _parentReferences['groupAttr'] = inputData.groupAttr;
                                _parentReferences['valueAttr'] = inputData.valueAttr;
                                _parentReferences['labelAttr'] = inputData.labelAttr;
                                _parentReferences['getObjValue'] = inputData.getObjValue;
                                _parentReferences['unset'] = inputData.unset;
                                _parentReferences['multiple'] = inputData.multiple;
                                _parentReferences['disabled'] = inputData.disabled;
                                _isBooted = true;
                            }
                        }
                        if (_isBooted) {
                            if (!_isFirstRendered) {
                                var tpl = getRenderableItems(inputData.selectedValues);
                                _tree = tpl;
                                _rootNode = vdom.create(_tree);
                                element[0].appendChild(_rootNode);
                                // element[0].innerHTML = _rootNode;
                                _isFirstRendered = true;
                            } else {
                                var _tpl = getRenderableItems(inputData.selectedValues);
                                var newTree = _tpl;
                                var patches = vdom.diff(_tree, newTree);
                                _rootNode = vdom.patch(_rootNode, patches);
                                _tree = newTree;
                            }
                        }
                        if (_this.debug) {
                            _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'debug', 'Re-drawing selected items/ options.');
                        }
                    }
                }, function (error) {
                    _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', 'Cannot initialize, Selector Selected Items Component!');
                }));
            }
            scope.$on('$destroy', function () {
                // dispose subscribers
                if (_subscribers && _subscribers.length) {
                    _subscribers.forEach(function (s) {
                        s.unsubscribe();
                    });
                    _subscribers = null;
                }
            });
        }
    }], [{
        key: 'Factory',
        value: function Factory(debug) {
            var directive = function directive($log) {
                return new SelectorSelectedItemsComponent($log, debug);
            };
            directive['$inject'] = ['$log'];
            return directive;
        }
    }]);

    return SelectorSelectedItemsComponent;
}();

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectorComponent = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Observable = __webpack_require__(0);

__webpack_require__(15);

__webpack_require__(84);

__webpack_require__(16);

var _Subject = __webpack_require__(86);

var _selector = __webpack_require__(5);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SelectorComponent = exports.SelectorComponent = function () {
    function SelectorComponent($filter, $timeout, $window, $http, $q, $log, debug) {
        _classCallCheck(this, SelectorComponent);

        this.$filter = $filter;
        this.$timeout = $timeout;
        this.$window = $window;
        this.$http = $http;
        this.$q = $q;
        this.$log = $log;
        this.debug = debug;
        this.restrict = 'EAC';
        this.replace = true;
        this.transclude = true;
        this.templateUrl = 'selector-on-steroids/selector.html';
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
            dropdownGroupTemplate: '=?',
            steroids: '<'
        };
    }

    _createClass(SelectorComponent, [{
        key: 'link',
        value: function link(scope, element, attrs, controller, transclude) {
            var _this = this;

            transclude(scope, function (clone, scope) {
                var _watchers = [];
                var _mutations = [];
                var _subscribers = [];
                var filter = _this.$filter('filter');
                var DOM_SELECTOR_CONTAINER = angular.element(element[0]);
                var DOM_SELECTOR_DROPDOWN = angular.element(element[0].querySelector('.selector-dropdown'));
                var DOM_SELECTOR_INPUT = angular.element(element[0].querySelector('.selector-input input'));
                var OBSERVABLE_FOR_DOM_SELECTOR_INPUT = DOM_SELECTOR_INPUT ? _Observable.Observable.merge(_Observable.Observable.fromEvent(DOM_SELECTOR_INPUT, 'focus'), _Observable.Observable.fromEvent(DOM_SELECTOR_INPUT, 'blur'), _Observable.Observable.fromEvent(DOM_SELECTOR_INPUT, 'keydown'), _Observable.Observable.fromEvent(DOM_SELECTOR_INPUT, 'input')) : _Observable.Observable.empty();
                var OBSERVABLE_FOR_DOM_SELECTOR_DROPDOWN = DOM_SELECTOR_DROPDOWN ? _Observable.Observable.fromEvent(DOM_SELECTOR_DROPDOWN, 'mousedown') : _Observable.Observable.empty();
                var OBSERVABLE_FOR_WINDOW_RESIZE = _this.$window ? _Observable.Observable.fromEvent(_this.$window, 'resze') : _Observable.Observable.empty();
                var inputCtrl = DOM_SELECTOR_INPUT.controller('ngModel');
                var selectCtrl = element.find('select').controller('ngModel');
                var initDeferred = _this.$q.defer();
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
                    viewItemTemplate: 'selector-on-steroids/item-default.html',
                    dropdownItemTemplate: 'selector-on-steroids/item-default.html',
                    dropdownCreateTemplate: 'selector-on-steroids/item-create.html',
                    dropdownGroupTemplate: 'selector-on-steroids/group-default.html',
                    steroids: true,
                    selectedValuesInput$: new _Subject.Subject(),
                    filteredOptionsInput$: new _Subject.Subject()
                };
                // DEFAULTS
                // Default: listen to dropdown dom event
                _subscribers.push(OBSERVABLE_FOR_DOM_SELECTOR_DROPDOWN.subscribe(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, function (error) {
                    _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', error);
                }));
                // Default: listen to window resize event
                _subscribers.push(OBSERVABLE_FOR_WINDOW_RESIZE.subscribe(function (e) {
                    dropdownPosition();
                }, function (error) {
                    _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', error);
                }));
                // Default attributes
                if (!angular.isDefined(scope.value) && scope.multiple) {
                    scope.value = [];
                }
                ;
                // this is where default initialization happens
                angular.forEach(defaults, function (value, key) {
                    if (!angular.isDefined(scope[key])) {
                        scope[key] = value;
                    }
                    ;
                });
                // create custom scope properties
                // scope.onNgModelChanged = (propertyName, oldValue, newValue) => { // watch alternative - model change listener
                //     if (propertyName === `search`) {
                //         if (scope.remote) {
                //             this.$timeout(fetch);
                //         }
                //     }
                // };
                var _onSelectedValuesChanged = function _onSelectedValuesChanged(oldValue, newValue) {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    updateValue();
                    if (angular.isFunction(scope.change)) {
                        scope.change(scope.multiple ? {
                            newValue: newValue,
                            oldValue: oldValue
                        } : {
                            newValue: (newValue || [])[0],
                            oldValue: (oldValue || [])[0]
                        });
                    }
                    if (scope.steroids) {
                        scope.selectedValuesInput$.next({
                            groupAttr: scope.groupAttr,
                            valueAttr: scope.valueAttr,
                            labelAttr: scope.labelAttr,
                            getObjValue: scope.getObjValue,
                            unset: scope.unset,
                            selectedValues: scope.selectedValues,
                            multiple: scope.multiple,
                            disabled: scope.disabled
                        });
                    }
                };
                var _onFilteredOptionsChanged = function _onFilteredOptionsChanged() {
                    scope.filteredOptionsInput$.next({
                        groupAttr: scope.groupAttr,
                        valueAttr: scope.valueAttr,
                        labelAttr: scope.labelAttr,
                        getObjValue: scope.getObjValue,
                        filteredOptions: scope.filteredOptions,
                        highlighted: scope.highlighted,
                        set: scope.set,
                        highlight: scope.highlight
                    });
                };
                angular.forEach(['name', 'valueAttr', 'labelAttr'], function (attr) {
                    if (!attrs[attr]) {
                        attrs[attr] = scope[attr];
                    }
                    ;
                });
                // Options' utilities
                var optionValue = function optionValue(option) {
                    return scope.valueAttr == null ? option : scope.getObjValue(option, scope.valueAttr);
                };
                var setObjValue = function setObjValue(obj, path, value) {
                    var key = void 0;
                    if (!angular.isDefined(obj)) {
                        obj = {};
                    }
                    ;
                    path = angular.isArray(path) ? path : path.split('.');
                    key = path.shift();
                    if (key.indexOf('[') > 0) {
                        var match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    obj[key] = path.length === 0 ? value : setObjValue(obj[key], path, value);
                    return obj;
                };
                var optionEquals = function optionEquals(option, value) {
                    return angular.equals(optionValue(option), angular.isDefined(value) ? value : scope.value);
                };
                scope.getObjValue = function (obj, path) {
                    if (!angular.isDefined(obj) || !angular.isDefined(path)) {
                        return obj;
                    }
                    path = angular.isArray(path) ? path : path.split('.');
                    var key = path.shift();
                    if (key.indexOf('[') > 0) {
                        var match = key.match(/(\w+)\[(\d+)\]/);
                        if (match !== null) {
                            obj = obj[match[1]];
                            key = match[2];
                        }
                    }
                    return path.length === 0 ? obj[key] : scope.getObjValue(obj[key], path);
                };
                // Value utilities
                var setValue = function setValue(value) {
                    scope.value = !scope.multiple ? scope.valueAttr == null ? value : scope.getObjValue(value || {}, scope.valueAttr) : scope.valueAttr == null ? value || [] : (value || []).map(function (option) {
                        return scope.getObjValue(option, scope.valueAttr);
                    });
                };
                scope.hasValue = function () {
                    return scope.multiple ? (scope.value || []).length > 0 : !!scope.value;
                };
                // Remote fetching
                var request = function request(paramName, paramValue, remote, remoteParam) {
                    var promise = void 0;
                    var remoteOptions = {};
                    if (scope.disabled) {
                        return _this.$q.reject();
                    }
                    if (!angular.isDefined(remote)) {
                        throw 'Remote attribute is not defined';
                    }
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
                        promise = _this.$http(settings);
                    }
                    promise.then(function (response) {
                        _this.$timeout(function () {
                            scope.$apply(function () {
                                var options = response.data || response;
                                scope.options = options;
                                filterOptions();
                                scope.loading = false;
                                initDeferred.resolve();
                            });
                        });
                    }, function (error) {
                        _this.$timeout(function () {
                            scope.$apply(function () {
                                scope.loading = false;
                            });
                        });
                        initDeferred.reject();
                        var errorMsg = 'Error while fetching data: ' + (error.message || error);
                        _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', errorMsg);
                        throw errorMsg;
                    });
                    return promise;
                };
                var fetch = function fetch(triggeredFromAction) {
                    if (triggeredFromAction) {
                        return request('search', scope.search || '', scope.remote, scope.remoteParam);
                    } else {
                        return request('search', scope.search || '', scope.remote, scope.remoteParam);
                    }
                };
                var fetchValidation = function fetchValidation(value) {
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
                    _this.$timeout(function () {
                        _this.$q.when(!scope.hasValue() || !scope.remoteValidation ? angular.noop : fetchValidation(scope.value)).then(function () {
                            // NOTE: Here used to be watcher for search attribute, wich now is moved to $viewChangeListener.
                            _watchers.push(scope.$watch('search', function () {
                                scope.$evalAsync(fetch(false));
                            }));
                        });
                    });
                }
                // Fill with options in the select
                var optionToObject = function optionToObject(option, group) {
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
                        setObjValue(object, scope.labelAttr, element.text().trim());
                    }
                    if (angular.isDefined(group)) {
                        setObjValue(object, scope.groupAttr, group);
                    }
                    scope.options.push(object);
                    if (element.attr('selected') && (scope.multiple || !scope.hasValue())) if (!scope.multiple) {
                        if (!scope.value) {
                            scope.value = optionValue(object);
                        }
                        ;
                    } else {
                        if (!scope.value) {
                            scope.value = [];
                        }
                        scope.value.push(optionValue(object));
                    }
                };
                var fillWithHtml = function fillWithHtml() {
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
                // Initialization
                var initialize = function initialize() {
                    if (!scope.remote && (!angular.isArray(scope.options) || !scope.options.length)) {
                        fillWithHtml();
                    }
                    if (scope.hasValue()) {
                        if (!scope.multiple) {
                            if (angular.isArray(scope.value)) {
                                scope.value = scope.value[0];
                            }
                        } else {
                            if (!angular.isArray(scope.value)) {
                                scope.value = [scope.value];
                            }
                        }
                        updateSelected();
                        filterOptions();
                        updateValue();
                    }
                };
                var reInitMultiple = function reInitMultiple() {
                    _this.$timeout(setInputWidth);
                    if (scope.remote) {
                        _this.$timeout(fetch(false));
                    }
                    initDeferred.promise.then(function () {
                        initialize();
                    }, function () {
                        if (_this.debug) {
                            _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'debug', 'Cannot initialize, promise init error!');
                        }
                    });
                };
                var _previousClassString = null;
                var m2 = new MutationObserver(function (event) {
                    var newClassString = event[0].target.classList.toString();
                    if (_previousClassString && newClassString !== _previousClassString) {
                        var newHasMultiple = newClassString.indexOf('multiple') !== -1;
                        var oldHasMultiple = _previousClassString.indexOf('multiple') !== -1;
                        if (newHasMultiple !== oldHasMultiple) {
                            reInitMultiple();
                        }
                    }
                    // on first init
                    if (!_previousClassString) {
                        reInitMultiple();
                    }
                    _previousClassString = newClassString;
                });
                m2.observe(DOM_SELECTOR_CONTAINER[0], {
                    attributes: true,
                    attributeFilter: ['class']
                });
                _mutations.push(m2);
                // Dropdown utilities
                var dropdownPosition = function dropdownPosition() {
                    var label = DOM_SELECTOR_INPUT.parent()[0];
                    var styles = _selector.CONSTANTS.FUNCTIONS.GET_DOM_STYLES(label);
                    var marginTop = parseFloat(styles.marginTop || 0);
                    var marginLeft = parseFloat(styles.marginLeft || 0);
                    if (label) {
                        DOM_SELECTOR_DROPDOWN.css({
                            top: label.offsetTop + label.offsetHeight + marginTop + 'px',
                            left: label.offsetLeft + marginLeft + 'px',
                            width: label.offsetWidth + 'px'
                        });
                    }
                };
                var open = function open() {
                    if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) {
                        return;
                    }
                    scope.isOpen = true;
                    dropdownPosition();
                    if (scope.remote) {
                        _this.$timeout(fetch(true));
                    }
                    if (!scope.multiple) {
                        _this.$timeout(scrollToHighlighted);
                    }
                };
                var close = function close() {
                    scope.isOpen = false;
                    resetInput();
                    // Note: not necessary to make a fetch call on close
                    // if (scope.remote) {
                    //     this.$timeout(fetch);
                    // };
                };
                var decrementHighlighted = function decrementHighlighted() {
                    scope.highlight(scope.highlighted - 1);
                    scrollToHighlighted();
                };
                var incrementHighlighted = function incrementHighlighted() {
                    scope.highlight(scope.highlighted + 1);
                    scrollToHighlighted();
                };
                scope.highlight = function (index) {
                    if (attrs.create && scope.search && index == -1) {
                        scope.highlighted = -1;
                    } else {
                        if (scope.filteredOptions.length) {
                            scope.highlighted = (scope.filteredOptions.length + index) % scope.filteredOptions.length;
                        }
                    }
                    _onFilteredOptionsChanged();
                };
                var scrollToHighlighted = function scrollToHighlighted() {
                    var dd = DOM_SELECTOR_DROPDOWN[0];
                    var option = dd.querySelectorAll('li.selector-option.js-data-item')[scope.highlighted];
                    var styles = _selector.CONSTANTS.FUNCTIONS.GET_DOM_STYLES(option);
                    var marginTop = parseFloat(styles.marginTop || 0);
                    var marginBottom = parseFloat(styles.marginBottom || 0);
                    if (!scope.filteredOptions.length) {
                        return;
                    }
                    if (option) {
                        if (option.offsetTop + option.offsetHeight + marginBottom > dd.scrollTop + dd.offsetHeight) {
                            _this.$timeout(function () {
                                dd.scrollTop = option.offsetTop + option.offsetHeight + marginBottom - dd.offsetHeight;
                            });
                        }
                        if (option.offsetTop - marginTop < dd.scrollTop) {
                            _this.$timeout(function () {
                                dd.scrollTop = option.offsetTop - marginTop;
                            });
                        }
                    }
                };
                scope.createOption = function (value) {
                    _this.$q.when(function () {
                        var option = {};
                        if (angular.isFunction(scope.create)) {
                            option = scope.create({
                                input: value
                            });
                        } else {
                            setObjValue(option, scope.labelAttr, value);
                            setObjValue(option, scope.valueAttr || 'value', value);
                        }
                        return option;
                    }()).then(function (option) {
                        scope.options.push(option);
                        scope.set(option);
                    });
                };
                scope.set = function (option) {
                    if (scope.multiple && (scope.selectedValues || []).length >= scope.limit) {
                        return;
                    }
                    ;
                    if (!angular.isDefined(option)) {
                        option = scope.filteredOptions[scope.highlighted];
                    }
                    if (!option) {
                        return;
                    }
                    var _oldSelectedValues = angular.copy(scope.selectedValues);
                    if (!scope.multiple) {
                        scope.selectedValues = [option];
                    } else {
                        if (!scope.selectedValues) {
                            scope.selectedValues = [];
                        }
                        if (scope.selectedValues.indexOf(option) < 0) {
                            scope.selectedValues.push(option);
                        }
                    }
                    _onSelectedValuesChanged(_oldSelectedValues, scope.selectedValues);
                    if (!scope.multiple || scope.closeAfterSelection || (scope.selectedValues || []).length >= scope.limit) {
                        close();
                    }
                    resetInput();
                    selectCtrl.$setDirty();
                };
                scope.unset = function (index) {
                    var _oldSelectedValues = angular.copy(scope.selectedValues);
                    if (!scope.multiple) {
                        scope.selectedValues = [];
                    } else {
                        scope.selectedValues.splice(angular.isDefined(index) ? index : scope.selectedValues.length - 1, 1);
                    }
                    _onSelectedValuesChanged(_oldSelectedValues, scope.selectedValues);
                    resetInput();
                    selectCtrl.$setDirty();
                };
                var keydown = function keydown(e) {
                    switch (e.keyCode) {
                        case _selector.CONSTANTS.KEYS.up:
                            {
                                if (!scope.isOpen) {
                                    break;
                                }
                                decrementHighlighted();
                                e.preventDefault();
                                break;
                            }
                        case _selector.CONSTANTS.KEYS.down:
                            {
                                if (!scope.isOpen) {
                                    open();
                                } else {
                                    incrementHighlighted();
                                }
                                e.preventDefault();
                                break;
                            }
                        case _selector.CONSTANTS.KEYS.escape:
                            {
                                scope.highlight(0);
                                close();
                                break;
                            }
                        case _selector.CONSTANTS.KEYS.enter:
                            {
                                if (scope.isOpen) {
                                    if (attrs.create && scope.search && scope.highlighted == -1) {
                                        scope.createOption(e.target.value);
                                    } else {
                                        if (scope.filteredOptions.length) {
                                            scope.set();
                                        }
                                    }
                                    e.preventDefault();
                                }
                                break;
                            }
                        case _selector.CONSTANTS.KEYS.backspace:
                            {
                                if (!DOM_SELECTOR_INPUT.val()) {
                                    var search = scope.getObjValue(scope.selectedValues.slice(-1)[0] || {}, scope.labelAttr || '');
                                    scope.unset();
                                    // open();
                                    if (scope.softDelete && !scope.disableSearch) _this.$timeout(function () {
                                        scope.search = search;
                                    });
                                    e.preventDefault();
                                }
                                break;
                            }
                        case _selector.CONSTANTS.KEYS.left:
                        case _selector.CONSTANTS.KEYS.right:
                        case _selector.CONSTANTS.KEYS.shift:
                        case _selector.CONSTANTS.KEYS.ctrl:
                        case _selector.CONSTANTS.KEYS.alt:
                        case _selector.CONSTANTS.KEYS.tab:
                        case _selector.CONSTANTS.KEYS.leftCmd:
                        case _selector.CONSTANTS.KEYS.rightCmd:
                            {
                                break;
                            }
                        default:
                            {
                                if (!scope.multiple && scope.hasValue()) {
                                    e.preventDefault();
                                } else {
                                    open();
                                    scope.highlight(0);
                                }
                                break;
                            }
                    }
                };
                // Filtered options
                var inOptions = function inOptions(options, value) {
                    // if options are fetched from a remote source, it's not possibile to use
                    // the simplest check with native `indexOf` function, beacause every object
                    // in the results array has it own new address
                    if (scope.remote) {
                        return options.filter(function (option) {
                            return angular.equals(value, option);
                        }).length > 0;
                    } else {
                        return options.indexOf(value) >= 0;
                    }
                };
                var filterOptions = function filterOptions() {
                    scope.filteredOptions = filter(scope.options || [], scope.search);
                    var _oldSelectedValues = angular.copy(scope.selectedValues);
                    if (!angular.isArray(scope.selectedValues)) {
                        scope.selectedValues = [];
                    }
                    if (scope.multiple) {
                        scope.filteredOptions = scope.filteredOptions.filter(function (option) {
                            return !inOptions(scope.selectedValues, option);
                        });
                    } else {
                        var index = scope.filteredOptions.indexOf(scope.selectedValues[0]);
                        if (index >= 0) {
                            scope.highlight(index);
                        }
                        ;
                    }
                    _onFilteredOptionsChanged();
                    _onSelectedValuesChanged(_oldSelectedValues, scope.selectedValues);
                };
                // Input width utilities
                var measureWidth = function measureWidth() {
                    var width = void 0;
                    var styles = _selector.CONSTANTS.FUNCTIONS.GET_DOM_STYLES(DOM_SELECTOR_INPUT[0]);
                    var shadow = angular.element('<span class="selector-shadow"></span>');
                    shadow.text(DOM_SELECTOR_INPUT.val() || (!scope.hasValue() ? scope.placeholder : '') || '');
                    angular.element(document.body).append(shadow);
                    angular.forEach(['fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'textTransform', 'wordSpacing', 'textIndent'], function (style) {
                        shadow.css(style, styles[style]);
                    });
                    width = shadow[0].offsetWidth;
                    shadow.remove();
                    return width;
                };
                var setInputWidth = function setInputWidth() {
                    var width = measureWidth() + 1;
                    DOM_SELECTOR_INPUT.css('width', width + 'px');
                };
                var resetInput = function resetInput() {
                    DOM_SELECTOR_INPUT.val('');
                    setInputWidth();
                    _this.$timeout(function () {
                        scope.$apply(function () {
                            scope.search = '';
                        });
                    });
                };
                _watchers.push(scope.$watchGroup(['search', 'options', 'value'], function (nV, oV) {
                    if (JSON.stringify(nV) === JSON.stringify(oV)) {
                        return;
                    }
                    // hide selected items
                    console.log('watch::group');
                    filterOptions();
                    _this.$timeout(function () {
                        // set input width
                        setInputWidth();
                        // repositionate dropdown
                        if (scope.isOpen) {
                            dropdownPosition();
                        }
                    });
                }));
                // Update value
                var updateValue = function updateValue(origin) {
                    if (!angular.isDefined(origin)) {
                        origin = scope.selectedValues || [];
                    }
                    setValue(!scope.multiple ? origin[0] : origin);
                };
                _watchers.push(scope.$watch('selectedValues', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    ;
                    updateValue();
                    if (angular.isFunction(scope.change)) {
                        scope.change(scope.multiple ? { newValue: newValue, oldValue: oldValue } : { newValue: (newValue || [])[0], oldValue: (oldValue || [])[0] });
                    }
                }, true));
                _watchers.push(scope.$watchCollection('options', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue) || scope.remote) {
                        return;
                    }
                    ;
                    updateSelected();
                }));
                // Update selected values
                var updateSelected = function updateSelected() {
                    var _oldSelectedValues = angular.copy(scope.selectedValues);
                    if (!scope.multiple) {
                        var o = scope.options || [];
                        var f = o.filter(function (option) {
                            return optionEquals(option);
                        });
                        var nV = f.slice(0, 1);
                        scope.selectedValues = nV;
                    } else {
                        var _o = scope.value || [];
                        var _f = _o.map(function (value) {
                            return filter(scope.options, function (option) {
                                return optionEquals(option, value);
                            })[0];
                        }).filter(function (value) {
                            return angular.isDefined(value);
                        });
                        var _nV = _f.slice(0, scope.limit);
                        scope.selectedValues = _nV;
                    }
                    _onSelectedValuesChanged(_oldSelectedValues, scope.selectedValues);
                };
                _watchers.push(scope.$watch('value', function (newValue, oldValue) {
                    if (angular.equals(newValue, oldValue)) {
                        return;
                    }
                    ;
                    console.log('watch::value');
                    _this.$q.when(!scope.remote || !scope.remoteValidation || !scope.hasValue() ? angular.noop : fetchValidation(newValue)).then(function () {
                        // updateSelected();
                        filterOptions();
                        updateValue();
                    });
                }, true));
                // DOM event listeners
                _subscribers.push(OBSERVABLE_FOR_DOM_SELECTOR_INPUT.subscribe(function (e) {
                    _this.$timeout(function () {
                        if (e.type === 'focus') {
                            open();
                        }
                        if (e.type === 'blur') {
                            close();
                            //     scope.$apply(close);
                        }
                        if (e.type === 'keydown') {
                            keydown(e);
                        }
                        if (e.type === 'input') {
                            setInputWidth();
                        }
                    });
                }, function (error) {
                    _selector.CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(_this.$log, 'error', error);
                }));
                var m1 = new MutationObserver(function (event) {
                    var _target = event[0].target;
                    var _inputElem = angular.element(_target).find('input');
                    if (_inputElem) {
                        selectCtrl[inputCtrl.$touched ? '$setTouched' : '$setUntouched']();
                        selectCtrl[inputCtrl.$pristine ? '$setPristine' : '$setDirty']();
                    }
                });
                m1.observe(DOM_SELECTOR_CONTAINER[0], {
                    attributes: true,
                    attributeFilter: ['class']
                });
                _mutations.push(m1);
                // Expose APIs
                scope.api.fetch = fetch;
                scope.api.open = open;
                scope.api.close = close;
                scope.api.focus = function () {
                    DOM_SELECTOR_INPUT[0].focus();
                };
                scope.api.set = function (value) {
                    return scope.value = value;
                };
                scope.api.unset = function (value) {
                    var values = !value ? scope.selectedValues : (scope.selectedValues || []).filter(function (option) {
                        return optionEquals(option, value);
                    });
                    var indexes = scope.selectedValues.map(function (option, index) {
                        return inOptions(values, option) ? index : -1;
                    }).filter(function (index) {
                        return index >= 0;
                    });
                    angular.forEach(indexes, function (index, i) {
                        scope.unset(index - i);
                    });
                };
                // destroy
                scope.$on('$destroy', function () {
                    // dispose watchers
                    if (_watchers && _watchers.length) {
                        // call all unbind on the watchers
                        _watchers.forEach(function (wFn) {
                            if (wFn && angular.isFunction(wFn)) {
                                wFn();
                            }
                        });
                        // reset watchers array
                        _watchers = null;
                    }
                    // dispose all mutation observers;
                    if (_mutations && _mutations.length) {
                        _mutations.forEach(function (m) {
                            m.disconnect();
                        });
                        _mutations = null;
                    }
                    // dispose subscribers
                    if (_subscribers && _subscribers.length) {
                        _subscribers.forEach(function (s) {
                            s.unsubscribe();
                        });
                        _subscribers = null;
                    }
                });
            });
        }
    }], [{
        key: 'Factory',
        value: function Factory(debug) {
            var directive = function directive($filter, $timeout, $window, $http, $q, $log) {
                return new SelectorComponent($filter, $timeout, $window, $http, $q, $log, debug);
            };
            directive['$inject'] = ['$filter', '$timeout', '$window', '$http', '$q', '$log'];
            return directive;
        }
    }]);

    return SelectorComponent;
}();

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__(0);
var empty_1 = __webpack_require__(85);
Observable_1.Observable.empty = empty_1.empty;
//# sourceMappingURL=empty.js.map

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var EmptyObservable_1 = __webpack_require__(23);
exports.empty = EmptyObservable_1.EmptyObservable.create;
//# sourceMappingURL=empty.js.map

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = __webpack_require__(0);
var Subscriber_1 = __webpack_require__(6);
var Subscription_1 = __webpack_require__(7);
var ObjectUnsubscribedError_1 = __webpack_require__(87);
var SubjectSubscription_1 = __webpack_require__(88);
var rxSubscriber_1 = __webpack_require__(14);
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber));
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * @class Subject<T>
 */
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=Subject.js.map

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = (function (_super) {
    __extends(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var err = _super.call(this, 'object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ObjectUnsubscribedError;
}(Error));
exports.ObjectUnsubscribedError = ObjectUnsubscribedError;
//# sourceMappingURL=ObjectUnsubscribedError.js.map

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Subscription_1 = __webpack_require__(7);
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = (function (_super) {
    __extends(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription));
exports.SubjectSubscription = SubjectSubscription;
//# sourceMappingURL=SubjectSubscription.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=angular-selector-on-steroids.js.map