// External
import * as angular from 'angular';

// Internal
import './index.pcss';
import { ISelector } from './interfaces';
import { CONSTANTS } from './constants';
import { SelectorNgModelChangedComponent } from './selector.ngmodelchanged.component';
import { SelectorComponent } from './selector.component';

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
        .directive('onSelectorNgModelChanged', SelectorNgModelChangedComponent.Factory())
        .directive(MODULE_NAME, SelectorComponent.Factory());

    return module;

  }

}
