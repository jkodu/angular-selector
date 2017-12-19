declare const angular;
import "./selector.pcss";
import { CONSTANTS } from "./selector.constants";
import { SelectorDropdownItemsComponent } from "./selector.dropdown.items.component";
import { SelectorSelectedItemsComponent } from "./selector.selected.items.component";
import { SelectorComponent } from "./selector.component";
import { SelectorInstanceManagerService } from "./selector.instance.manager.service";

const MODULE_NAME = `selectorOnSteroids`;

export class AngularSelectorOnSteroids {
  BootUp(debug: boolean = false) {
    return angular
      .module(MODULE_NAME, [])
      .run([
        "$templateCache",
        $templateCache => {
          $templateCache.put(
            "selector-on-steroids/selector.html",
            CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR()
          );
          $templateCache.put(
            "selector-on-steroids/selector-dropdown-item.html",
            CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR_DROPDOWN_ITEMS()
          );
          $templateCache.put(
            "selector-on-steroids/selector-selected-item.html",
            CONSTANTS.TEMPLATES.TEMPLATE_SELECTOR_SELECTED_ITEMS()
          );
          $templateCache.put(
            "selector-on-steroids/item-create.html",
            CONSTANTS.TEMPLATES.TEMPLATE_ITEM_CREATE()
          );
          $templateCache.put(
            "selector-on-steroids/item-default.html",
            CONSTANTS.TEMPLATES.TEMPLATE_ITEM_DEFAULT()
          );
          $templateCache.put(
            "selector-on-steroids/group-default.html",
            CONSTANTS.TEMPLATES.TEMPLATE_GROUP_DEFAULT()
          );
        }
      ])
      .service("SelectorInstanceManagerService", SelectorInstanceManagerService)
      .directive(
        "sosSelectedItems",
        SelectorSelectedItemsComponent.Factory(debug)
      )
      .directive(
        "sosDropdownItems",
        SelectorDropdownItemsComponent.Factory(debug)
      )
      .directive(MODULE_NAME, SelectorComponent.Factory(debug));
  }
}
