// External
import * as angular from 'angular';

// Internal
import './index.pcss';
import { ISelector } from './interfaces';
import {
  TEMPLATE_GROUP_DEFAULT,
  TEMPLATE_ITEM_CREATE,
  TEMPLATE_ITEM_DEFAULT,
  TEMPLATE_SELECTOR,
  TEMPLATE_SELECTOR_DROPDOWN_ITEM
} from './templates';
import { SelectorNgModelChangedComponent } from './selector.ngmodelchanged.component';
import { SelectorDropdownItemComponent } from './selector.dropdown.item.component';
import { SelectorComponent } from './selector.component';

const MODULE_NAME = `selectorOnSteroids`;

export default class AngularSelectorOnSteroids {

  constructor() { }

  init() {

    const module =
      angular.module(MODULE_NAME, [])
        .run(['$templateCache', ($templateCache) => {
          $templateCache.put('selector/selector.html', TEMPLATE_SELECTOR());
          $templateCache.put('selector/selector-dropdown-item.html', TEMPLATE_SELECTOR_DROPDOWN_ITEM());
          $templateCache.put('selector/item-create.html', TEMPLATE_ITEM_CREATE());
          $templateCache.put('selector/item-default.html', TEMPLATE_ITEM_DEFAULT());
          $templateCache.put('selector/group-default.html', TEMPLATE_GROUP_DEFAULT());
        }])
        .directive('onSelectorNgModelChanged', SelectorNgModelChangedComponent.Factory())
        .directive('sosDropdownItem', SelectorDropdownItemComponent.Factory())
        .directive(MODULE_NAME, SelectorComponent.Factory());

    return module;

  }

}
