declare const angular;

// Internal
import './index.pcss';
import { ISelector } from './interfaces';
import {
  TEMPLATE_GROUP_DEFAULT,
  TEMPLATE_ITEM_CREATE,
  TEMPLATE_ITEM_DEFAULT,
  TEMPLATE_SELECTOR,
  TEMPLATE_SELECTOR_DROPDOWN_ITEMS,
  TEMPLATE_SELECTOR_SELECTED_ITEMS
} from './templates';
import { SelectorNgModelChangedComponent } from './selector.ngmodelchanged.component';
// import { SelectorSelectedItemsComponent } from './selector.selected.items.component';
import { SelectorDropdownItemsComponent } from './selector.dropdown.items.component';
import { SelectorComponent } from './selector.component';

const MODULE_NAME = `selectorOnSteroids`;

export class AngularSelectorOnSteroids {

  constructor() { }

  init(debug: boolean = false) {
    const module =
      angular.module(MODULE_NAME, [])
        .run(['$templateCache', ($templateCache) => {
          $templateCache.put('selector-on-steroids/selector.html', TEMPLATE_SELECTOR());
          $templateCache.put('selector-on-steroids/selector-dropdown-item.html', TEMPLATE_SELECTOR_DROPDOWN_ITEMS());
          $templateCache.put('selector-on-steroids/selector-selected-item.html', TEMPLATE_SELECTOR_SELECTED_ITEMS());
          $templateCache.put('selector-on-steroids/item-create.html', TEMPLATE_ITEM_CREATE());
          $templateCache.put('selector-on-steroids/item-default.html', TEMPLATE_ITEM_DEFAULT());
          $templateCache.put('selector-on-steroids/group-default.html', TEMPLATE_GROUP_DEFAULT());
        }])
        .directive('onSelectorNgModelChanged', SelectorNgModelChangedComponent.Factory(debug))
        // .directive('sosSelectedItems', SelectorSelectedItemsComponent.Factory(debug))
        .directive('sosDropdownItems', SelectorDropdownItemsComponent.Factory(debug))        
        .directive(MODULE_NAME, SelectorComponent.Factory(debug));
    return module;
  }

}
