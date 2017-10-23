// External
import * as angular from 'angular';

// Internal
import './index.pcss';
import { ISelector } from './interfaces';
import { CONSTANTS } from './constants';
import { SelectorComponent } from './selector';

const MODULE_NAME = `selectorOnSteroids`;

export default class AngularSelectorOnSteroids {

  constructor() { }

  init() {

    const module =
      angular.module(MODULE_NAME, [])
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
            link: (scope: any, element, attrs, ctrl: any) => {
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
        .directive(MODULE_NAME, SelectorComponent.Factory());

    return module;

  }

}
