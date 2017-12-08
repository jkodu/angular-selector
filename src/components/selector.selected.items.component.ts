import { ISelector } from './selector.interfaces';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { CONSTANTS } from './selector.constants';
const hyperx = require('hyperx');
import * as vdom from 'virtual-dom';

export class SelectorSelectedItemsComponent {
  public replace: boolean = true;
  public restrict: string = 'E';
  public templateUrl: string = 'selector-on-steroids/selector-selected-item.html';
  public scope: ISelector.SelectedItemsComponent.Scope | any = {
    input: '<',
  };

  constructor(
    private $log: angular.ILogService,
    private $timeout: angular.ITimeoutService,
    private debug: boolean
  ) {
    return;
  }
  static Factory(debug: boolean) {
    let directive = ($log, $timeout) => {
      return new SelectorSelectedItemsComponent($log, $timeout, debug);
    };
    directive['$inject'] = ['$log', '$timeout'];
    return directive;
  }

  link(
    scope: ISelector.SelectedItemsComponent.Scope,
    element: angular.IAugmentedJQuery,
    attrs: angular.IAttributes
  ) {
    const hx = hyperx(vdom.h, {
      vdom: true,
    });

    let _subscribers: Subscription[] = [];
    let _parentReferences: any = {
      // dynamically constructed object
    };
    let _isBooted: boolean = false;
    let _isFirstRendered: boolean = false;
    let _tree = null;
    let _rootNode = null;

    const GET_SELECTED_ITEM_TEMPLATE = (
      option: any,
      index: number,
      filteredOptions: any[],
      parentReferences: any
    ) => {
      let boundValue = parentReferences.getObjValue(option, parentReferences.labelAttr);
      boundValue = boundValue
        ? boundValue
        : typeof option === 'object' ? JSON.stringify(option) : option;
      const closeButton = parentReferences.multiple
        ? hx`<div class="selector-helper"><span class="selector-icon" id="sos-data-index-${
            index
          }"></span></div>`
        : hx``;
      return hx`<li>${boundValue} ${closeButton}</li>`;
    };

    const getRenderableItems = (items: Array<any>) => {
      const liList = hx`${items.map((currentValue: any, index: number, array: Array<any>) => {
        return hx`${GET_SELECTED_ITEM_TEMPLATE(currentValue, index, array, _parentReferences)}`;
      })}`;
      const tpl = hx`<div>${liList}</div>`;
      return tpl;
    };

    Observable.fromEvent(element[0], 'click').subscribe((e: Event | MouseEvent) => {
      if (e.type === 'click') {
        if (e.srcElement.classList.contains('selector-icon')) {
          const el = e.srcElement.getAttribute('id');
          if (!el) {
            return;
          }
          const index = parseInt(el.replace('sos-data-index-', ''), 10);
          if (_parentReferences['unset']) {
            _parentReferences['unset'](index < -1 ? -1 : index);
          }
        }
      }
      e.stopPropagation();
    });

    if (scope.input) {
      // TODO: Move to post link?
      _subscribers.push(
        scope.input.subscribe(
          (inputData: ISelector.SelectedItemsComponent.Input$) => {
            if (inputData.selectedValues) {
              if (!_isBooted) {
                if (
                  !_parentReferences.hasOwnProperty('groupAttr') ||
                  !_parentReferences.hasOwnProperty('valueAttr') ||
                  !_parentReferences.hasOwnProperty('labelAttr') ||
                  !_parentReferences.hasOwnProperty('getObjValue') ||
                  !_parentReferences.hasOwnProperty('unset') ||
                  !_parentReferences.hasOwnProperty('multiple') ||
                  !_parentReferences.hasOwnProperty('disabled')
                ) {
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
                  const tpl = getRenderableItems(inputData.selectedValues);
                  _tree = tpl;
                  _rootNode = vdom.create(_tree);
                  element[0].appendChild(_rootNode);
                  // element[0].innerHTML = _rootNode;
                  _isFirstRendered = true;
                } else {
                  const tpl = getRenderableItems(inputData.selectedValues);
                  const newTree = tpl;
                  const patches = vdom.diff(_tree, newTree);
                  _rootNode = vdom.patch(_rootNode, patches);
                  _tree = newTree;
                }
              }
              if (this.debug) {
                CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(
                  this.$log,
                  'debug',
                  `Re-drawing selected items/ options.`
                );
              }
            }
          },
          (error: any) => {
            CONSTANTS.FUNCTIONS.CONSOLE_LOGGER(
              this.$log,
              'error',
              `Cannot initialize, Selector Selected Items Component!`
            );
            throw new Error(error);
          }
        )
      );
    }

    scope.$on('$destroy', () => {
      // dispose subscribers
      if (_subscribers && _subscribers.length) {
        _subscribers.forEach((s: Subscription) => {
          s.unsubscribe();
        });
        _subscribers = null;
      }
    });
  }
}
