# angular-selector-on-steroids

[![NPM version](http://img.shields.io/npm/v/angular-selector-on-steroids.svg?style=flat)](https://www.npmjs.com/package/angular-selector-on-steroids)
[![NPM downloads](http://img.shields.io/npm/dm/angular-selector-on-steroids.svg?style=flat)](https://www.npmjs.com/package/angular-selector-on-steroids)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

*angular-selector-on-steroids* is a native AngularJS (1.6.x) directive that transforms a simple `<select>` html tag into a full html select with typeahead/ autocompletion.
This component is a **shameless** upgrade to the [angular-selector](https://npmjs.org/package/angular-selector) directive, which has been booted up with steroids to circumvent the limitations faced by with the older implementation, such as bad-performance, too many digest cycles and unnecessary watchers.


### Why was there a need to upgrade?
The [angular-selector](https://npmjs.org/package/angular-selector) although a well authored component, does not cater to large data-sets in terms of both limiting the amount of repeated processes/ iterations/ functions, and did not embrace better rendering and updating logic. Eventually it relied heavily on AngularJs two way data-binding which drove the performance to a stand-still for even a data-set with 1000 items. This created huge memory bloat and lag in the UI. It was time to upgrade the component.


### What has been done as a part of upgrade?
- Moved to Typescript, obvious reason being better typing and to expose interface of the component to the real consumers. (Previously just js soup).
- Better abstraction and separation of concerns. (Previously non-modular code.)
- Moved the build/ bundling to webpack, to allow for tree-shaking and packaged as UMD to allow imports. (Previously inline scripts).
- Re-authored in es6, keeping up with better coding standards (Previously es5).
- Every directive is a class, embracing OOP (Previously functional).
- Data marshalling via [RxJs](https://github.com/Reactive-Extensions/RxJS), better pub-sub model of communication with in the modules (Previously callback pattern).
- Rendering of html, moved from being dependent on angular DOM manipulation to Virtual dom's diff and patch mechanism, using [virtual-dom](https://www.npmjs.com/package/virtual-dom) and [hyperx](https://www.npmjs.com/package/hyperx) libraries. This provided significant performance boost in rendering. (Previously ng-x repeats and ng-x dom manipulators).


### Dependencies
- Just [AngularJS](https://angularjs.org/)!
- Other dependencies are bundled into the UMD module.

### Features 
- The feature set remains the same as the forked component, please refer original documentation [here](https://github.com/indrimuska/angular-selector).
- The extra added feature is called *steroids*. To enable better rendering and performance boost, set **steroids=true** in the configuration object.
- 100% fallback (reverse compatible) to orignial component logic, by setting a boolean values  **steroids=false** the older way of rendering and non-performance component can be used.

### Limitations
- As the template generation & DOM Manipulation logic was moved [virtual-dom](https://www.npmjs.com/package/virtual-dom) and [hyperx](https://www.npmjs.com/package/hyperx) the current generated template abides by label & value attribute passed for binding interpolation. 
- For any complex dropdown or view item template a JSON structure of the object is shown. Kindly fallback to non-steroids version  **steroids=false** if you need custom and complex template logic. 

### Examples
- I have extended the example to a comparitive example of previous (**steroids=false**) vs new (**steroids=true**) implementation, to highlight difference in performance.
// TODO: Check example link
- An interactive version of all examples is accesible here [https://jkodu.github.io/angular-selector-on-steroids](https://jkodu.github.io/angular-selector-on-steroids)

## Installation
```
npm install --save angular-selector-on-steroids
```
Usage:
```js
import * as sos from '../dist/angular-selector-on-steroids';
new sos.AngularSelectorOnSteroids().init();

const app = angular.module('MyApp', ['selectorOnSteroids']);
```

```html
<select 
    selector-on-steroids
    steroids="true"    
    model="selectedObj" 
    options="arrayOfOptions" 
    value-attr="code" 
    >
</select>
```


### Options/ Configuration

Parameter | Type | Default | Description
---|---|---|---
steroids | `Boolean` | `false` | Enable/disable the get performance boost in rendering and data marshalling.
remoteCancelPendingXhr | `Boolean` | `false` | Enable/disable pending request cancellation, on new XHR requests.
model | `Property` | | Two-way binding property that models the `select` view.
name | `String` | | Input name attribute.
disable | `Boolean` | `false` | Enable/disable the select. Note the name is `disable` not `disabled` to avoid collisions with the HTML5 disabled attribute.
disableSearch | `Boolean` | `false` | Enable/disable the search input field.
require | `Boolean` | `false` | Sets required validation. Note the name is `require` not `required` to avoid collisions with the HTML5 required attribute.
multi | `Boolean` | `false` | Allows to select more than one value. Note the name is `multi` not `multiple` to avoid collisions with the HTML5 multiple attribute.
limit | `Integer` | `Infinity` | Maximum number of selectable items when `multi` is `true`.
placeholder | `String` | | Optional placeholder text to display if input is empty.
options | `Array` | `[]` | Set of options to display.<br><br>Each object must contain a `label` key and a `value` key, otherwise you need to use a custom template (`viewItemTemplate` and `dropdownItemTemplate`) or change the default values of `valueAttr` and `labelAttr` properties.
valueAttr | `String` | `null` | Name of the value key in options array. This also sets the type of result for the model: if you don't set this attribute (`null` by default) the entire object option is returned, otherwise it will be returned only the selected property.
labelAttr | `String` | `"label"` | Name of the label key in options array.
groupAttr | `String` | `"group"` | Name of the `optgroup` label key in options array. It allows to group items by the selected key. Items have to be already sorted to see the groups just one time.
debounce | `Integer` | `0` | Debounce model update value in milliseconds.
rtl | `Boolean` | `false` | Two-way bindable attribute to set Right-To-Left text direction.
api | `Object` | `{}` | This object is equipped with the methods for interacting with the selector. Check out the ["APIs" example](http://indrimuska.github.io/angular-selector/).
create | `Boolean` or `Function` or `Promise` | | Allows users to type the label of their own options and push them into the list. You can pass a function that returns the full format of the option, using `input` as parameter, a `Promise`, or set it to `true` to let Angular Selector create an object with the default properties given by `valueAttr` and `labelAttr`. Check out ["Create custom options"](http://indrimuska.github.io/angular-selector/) and ["Create custom options (using `Promise`)"](http://indrimuska.github.io/angular-selector/) examples.
change | `Function` | | Callback fired every time the selected values change. It provides two parameters: `newValue` and `oldValue`.
remote | `Object` or `Promise` | <pre>{<br>  method: 'GET',<br>  cache: true,<br>  params: {}<br>}</pre> | You can use remote data fetching with the native `$http` service or with your own custom service. In the first case this parameter must be the configuration object to pass to the native `$http` service ([docs](https://docs.angularjs.org/api/ng/service/$http#usage)). In the second case, `remote` is a function that returns a Promise object.
remoteParam | `String` | `"q"` | If `remote` attribute is used with the native `$http` service, this parameter is the name of the query key in the `params` object. You should use this to perform server-side filtering.
remoteValidation | `Object` or `Promise` | <pre>{<br>  method: 'GET',<br>  cache: true,<br>  params: {}<br>}</pre> | This should be used to perform validation after a "manual" update of the model. It has the same structure of the `remote` property, check out ["Remote fetching and validation"](http://indrimuska.github.io/angular-selector/) example.
remoteValidationParam | `String` | `"value"` | If `remoteValidation` attribute is used with the native `$http` service, this parameter is the name of the query key in the `params` object.
removeButton | `Boolean` | `true` | Two-way bindable attribute to show the remove button (cross icon).
softDelete | `Boolean` | `false` | If `disableSearch` is `false`, restores the last selected input text (using `labelAttr` attribute) after pressing <kbd>Backspace</kbd>.
closeAfterSelection | `Boolean` | `false` | Close dropdown after selecting an item.
viewItemTemplate | `String` | `"selector/item-default.html"` | Template URL for the selected item(s).
dropdownItemTemplate | `String` | `"selector/item-default.html"` | Template URL for each item in the dropdown list.
dropdownCreateTemplate | `String` | `"selector/item-create.html"` | Template URL for the dropdown element for the new items.
dropdownGroupTemplate | `String` | `"selector/group-default.html"` | Template URL for each group (header) in the dropdown list.

### Roadmap & Why there is no need to PR to original project
- The code has matured to newer standards of Angular and Javascript, and hence there is no reason to update the older component.
- The plan is to abstract the selector logic to pure Js and provide a bolt-on AngularJs and Angular component.

### Contributions
- PR's are welcome.
- Please raise issues if any.

### License
Licensed under the MIT license.

### Local Development
- npm install
- npm run build-prod - generates a dist directory ready for publishing.
- npm run build - generates the demo/dist directory for local development (no watch).
- npm run dev - builds and watches both source and sandbox directory for local development.
- npm run serve - boots up a http-server and serves the demo directory.