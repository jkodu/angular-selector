
import * as angular from 'angular';
import AngularSelectorOnSteroids from '../src/index';

declare const hljs;
new AngularSelectorOnSteroids().init();

function getWatchers(root) {
  root = angular.element(root || document.documentElement);
  var watcherCount = 0;

  function getElemWatchers(element) {
    var isolateWatchers = getWatchersFromScope(element.data()
      .$isolateScope);
    var scopeWatchers = getWatchersFromScope(element.data()
      .$scope);
    var watchers = scopeWatchers.concat(isolateWatchers);
    angular.forEach(element.children(), function (childElement) {
      watchers = watchers.concat(getElemWatchers(angular.element(childElement)));
    });
    return watchers;
  }

  function getWatchersFromScope(scope) {
    if (scope) {
      return scope.$$watchers || [];
    } else {
      return [];
    }
  }

  return getElemWatchers(root);
}

const examples = [{
  "title": "Single element",
  "html": "<select set-watch-count selector\n\tmodel=\"browser\"\n\toptions=\"browsers\"\n\tvalue-attr=\"value\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"browser|json\"></code>\n</p>",
  "js": "$scope.browser = \"GC\";\n\n$scope.browsers = [\n\t{ value: \"GC\", label: \"Chrome\" },\n\t{ value: \"FF\", label: \"Firefox\" },\n\t{ value: \"AS\", label: \"Safari\" },\n\t{ value: \"IE\", label: \"Internet Explorer\" }\n];"
}, {
  "title": "Multiple elements",
  "html": "<select set-watch-count selector\n\tmulti=\"true\"\n\tmodel=\"myBrowsers\"\n\toptions=\"browsers\"\n\tvalue-attr=\"value\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"myBrowsers|json\"></code>\n</p>",
  "js": "$scope.myBrowsers = [ \"GC\", \"AS\" ];\n\n$scope.browsers = [\n\t{ value: \"GC\", label: \"Chrome\" },\n\t{ value: \"FF\", label: \"Firefox\" },\n\t{ value: \"AS\", label: \"Safari\" },\n\t{ value: \"IE\", label: \"Internet Explorer\" }\n];"
}, {
  "title": "Return entire object(s)",
  "html": "<!-- just DON'T add `value-attr` attribute! -->\n<select set-watch-count selector\n\tmodel=\"browser\"\n\toptions=\"browsers\"\n\tlabel-attr=\"name\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"browser|json\"></code>\n</p>",
  "js": "$scope.browser = { name: \"Firefox\" };\n\n$scope.browsers = [\n\t{ name: \"Chrome\" },\n\t{ name: \"Firefox\" },\n\t{ name: \"Safari\" },\n\t{ name: \"Internet Explorer\" }\n];"
}, {
  "title": "Custom template",
  "html": "<script type=\"text/ng-template\" id=\"selector/demo/browserWithURL\">\n\t{{option.label}}\n\t<a class=\"small\" ng-href=\"{{option.url}}\" ng-bind=\"option.url\"></a>\n</script>\n\n<script type=\"text/ng-template\" id=\"selector/demo/browserWithIcon\">\n\t<img ng-src=\"{{option.icon}}\"> {{option.label}}\n</script>\n\n<select set-watch-count selector\n\tmulti=\"true\"\n\tmodel=\"myBrowsers\"\n\toptions=\"browsers\"\n\tvalue-attr=\"code\"\n\tview-item-template=\"'selector/demo/browserWithURL'\"\n\tdropdown-item-template=\"'selector/demo/browserWithIcon'\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"myBrowsers|json\"></code>\n</p>\n\n<p class=\"small\">\n\tIcons:\n\t<a href=\"https://www.iconfinder.com/iconsets/logotypes\" target=\"_blank\">\n\t\tLogotypes\n\t</a>\n</p>",
  "js": "$scope.myBrowsers = [ \"AS\" ];\n\n$scope.browsers = [\n\t{\n\t\tcode: \"GC\",\n\t\tlabel: \"Chrome\",\n\t\ticon: \"https://cdn1.iconfinder.com/data/icons/logotypes/32/chrome-24.png\",\n\t\turl: \"https://www.google.it/chrome\"\n\t},\n\t{\n\t\tcode: \"FF\",\n\t\tlabel: \"Firefox\",\n\t\ticon: \"https://cdn1.iconfinder.com/data/icons/logotypes/32/firefox-24.png\",\n\t\turl: \"https://www.mozilla.org/firefox\"\n\t},\n\t{\n\t\tcode: \"AS\",\n\t\tlabel: \"Safari\",\n\t\ticon: \"https://cdn1.iconfinder.com/data/icons/logotypes/32/safari-24.png\",\n\t\turl: \"http://www.apple.com/safari/\"\n\t},\n\t{\n\t\tcode: \"IE\",\n\t\tlabel: \"Internet Explorer\",\n\t\ticon: \"https://cdn1.iconfinder.com/data/icons/logotypes/32/internet-explorer-24.png\",\n\t\turl: \"http://windows.microsoft.com/internet-explorer\"\n\t}\n];"
}, {
  "title": "Fill options from HTML",
  "html": "<script type=\"text/ng-template\" id=\"selector/demo/currency\">\n\t<kbd ng-bind=\"option.symbol\"></kbd>&nbsp;\n\t<b ng-bind=\"option.code\"></b> - {{option.label}}\n</script>\n\n<script type=\"text/ng-template\" id=\"selector/demo/currencyGroup\">\n\t<img class=\"currency-group\"\n\t\tng-src=\"http://files.softicons.com/download/web-icons/fatcow-hosting-additional-icons-by-fatcow/png/32x32/{{\n\t\t\toption.zone == 'Europe' ? 'flag_european_union' : 'wallet'\n\t\t}}.png\">&nbsp;\n\t{{option.zone}}\n</script>\n\n<select set-watch-count selector\n\tmodel=\"currency\"\n\toptions=\"currencies\"\n\tvalue-attr=\"value\"\n\tgroup-attr=\"zone\"\n\tview-item-template=\"'selector/demo/currency'\"\n\tdropdown-item-template=\"'selector/demo/currency'\"\n\tdropdown-group-template=\"'selector/demo/currencyGroup'\">\n\t\n\t<optgroup label=\"Europe\">\n\t\t<option value=\"2\"\n\t\t\tdata-code=\"EUR\"\n\t\t\tdata-symbol=\"€\">Euro Member Countries</option>\n\t\t<option value=\"3\"\n\t\t\tdata-code=\"GBP\"\n\t\t\tdata-symbol=\"£\">United Kingdom Pound</option>\n\t\t<option value=\"5\"\n\t\t\tdata-code=\"SEK\"\n\t\t\tdata-symbol=\"kr\"\n\t\t\tselected>Sweden Krona</option>\n\t</optgroup>\n\t<optgroup label=\"Others\">\n\t\t<option value=\"1\"\n\t\t\tdata-code=\"USD\"\n\t\t\tdata-symbol=\"$\">United States Dollar</option>\n\t\t<option value=\"4\"\n\t\t\tdata-code=\"EUR\"\n\t\t\tdata-symbol=\"¥\">Japan Yen</option>\n\t</optgroup>\n\t\n</select>\n\n<p>\n\tCurrent value: <code ng-bind=\"currency|json\"></code>\n</p>\n\n<p class=\"small\">\n\tIcons:\n\t<a href=\"http://www.softicons.com/web-icons/fatcow-hosting-additional-icons-by-fatcow\" target=\"_blank\">\n\t\tFatCow Hosting Additional Icons\n\t</a>\n</p>\n\n<p ng-init=\"show=false\">\n\t<a ng-click=\"show=!show\">Hide/show all options</a>\n\t<pre ng-show=\"show\" ng-bind=\"currencies|json\"></pre>\n</p>"
}, {
  "title": "RTL Support",
  "html": "<label class=\"checkbox-inline\">\n\t<input type=\"checkbox\" ng-model=\"multi\"> Multiple\n</label>\n<label class=\"checkbox-inline\">\n\t<input type=\"checkbox\" ng-model=\"rtl\"> RTL\n</label>\n<label class=\"checkbox-inline\">\n\t<input type=\"checkbox\" ng-model=\"remove\"> Remove button\n</label>\n<label class=\"checkbox-inline\">\n\t<input type=\"checkbox\" ng-model=\"restore\"> Restore on backspace\n</label>\n<label class=\"checkbox-inline\">\n\t<input type=\"checkbox\" ng-model=\"disabled\"> Disabled\n</label>\n\n<select set-watch-count selector\n\trtl=\"rtl\"\n\tmulti=\"multi\"\n\tmodel=\"language\"\n\tdisable=\"disabled\"\n\toptions=\"languages\"\n\tvalue-attr=\"value\"\n\tlabel-attr=\"value\"\n\tremove-button=\"remove\"\n\tsoft-delete=\"restore\"\n\tplaceholder=\"Choose your favourite language(s)...\">\n\t\n\t<option value=\"PHP\"></option>\n\t<option value=\"Java\"></option>\n\t<option value=\"Ruby\"></option>\n\t<option value=\"Node\"></option>\n\t\n</select>\n\n<p>\n\tCurrent value: <code ng-bind=\"language|json\"></code>\n</p>"
}, {
  "title": "Remote fetching",
  "html": "<link rel=\"stylesheet\" href=\"https://rawgit.com/Arnoud-B/csscountrycodes/master/flags.css\">\n\n<script type=\"text/ng-template\" id=\"selector/demo/country\">\n\t<i class=\"flag\" ng-class=\"option.code.toLowerCase()\"></i>&nbsp;\n\t{{option.name}}\n</script>\n\n<select set-watch-count selector\n\tmulti=\"true\"\n\tmodel=\"countries\"\n\tremote=\"remoteConfig\"\n\tremote-param=\"text\"\n\tvalue-attr=\"code\"\n\tview-item-template=\"'selector/demo/country'\"\n\tdropdown-item-template=\"'selector/demo/country'\"\n\tplaceholder=\"Choose one or more countries...\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"countries|json\"></code>\n</p>\n\n<p class=\"small\">\n\tIcons:\n\t<a href=\"https://github.com/Arnoud-B/csscountrycodes\" target=\"_blank\">\n\t\tArnoud-B/csscountrycodes\n\t</a>\n</p>",
  "js": "$scope.remoteConfig = {\n\turl: \"http://services.groupkt.com/country/search\",\n\ttransformResponse: function (data) {\n\t\tvar countries = angular.fromJson(data).RestResponse.result;\n\t\treturn countries.map(function (country) {\n\t\t\treturn {\n\t\t\t\tname: country.name,\n\t\t\t\tcode: country.alpha2_code\n\t\t\t};\n\t\t});\n\t}\n};"
}, {
  "title": "Remote fetching and validation",
  "html": "<link rel=\"stylesheet\" href=\"https://rawgit.com/Arnoud-B/csscountrycodes/master/flags.css\">\n\n<script type=\"text/ng-template\" id=\"selector/demo/country\">\n\t<i class=\"flag\" ng-class=\"option.code.toLowerCase()\"></i>&nbsp;\n\t{{option.name}}\n</script>\n\n<select set-watch-count selector\n\tmodel=\"country\"\n\tvalue-attr=\"code\"\n\tdebounce=\"200\"\n\tremote=\"remote\"\n\tremote-param=\"{{remoteParam}}\"\n\tremote-validation=\"remoteValidation(value)\"\n\tview-item-template=\"'selector/demo/country'\"\n\tdropdown-item-template=\"'selector/demo/country'\"\n\tplaceholder=\"Choose one or more countries...\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"country|json\"></code>\n</p>\n\n<p class=\"small\">\n\tIcons:\n\t<a href=\"https://github.com/Arnoud-B/csscountrycodes\" target=\"_blank\">\n\t\tArnoud-B/csscountrycodes\n\t</a>\n</p>",
  "js": "var options = {\n\turl: 'http://services.groupkt.com/country/',\n\tmethod: 'GET',\n\tcache: true,\n\ttransformResponse: function (data) {\n\t\tvar result = angular.fromJson(data).RestResponse.result;\n\t\tif (!angular.isArray(result)) result = [result];\n\t\treturn result.map(function (country) {\n\t\t\treturn {\n\t\t\t\tname: country.name,\n\t\t\t\tcode: country.alpha2_code\n\t\t\t};\n\t\t});\n\t}\n};\n\n$scope.country = 'SV';\n\n$scope.remote = angular.copy(options);\n$scope.remote.url += 'search';\n$scope.remoteParam = 'text';\n\n$scope.remoteValidation = function (value) {\n\tvar settings = angular.copy(options);\n\tsettings.url += 'get/iso2code/' + value;\n\treturn settings;\n}"
}, {
  "title": "Remote fetching with custom service",
  "html": "<link rel=\"stylesheet\" href=\"https://rawgit.com/Arnoud-B/csscountrycodes/master/flags.css\">\n\n<script type=\"text/ng-template\" id=\"selector/demo/country\">\n\t<i class=\"flag\" ng-class=\"option.code.toLowerCase()\"></i>&nbsp;\n\t{{option.name}}\n</script>\n\n<select set-watch-count selector\n\tmodel=\"country\"\n\tvalue-attr=\"code\"\n\tdebounce=\"200\"\n\tremote=\"remote(search)\"\n\tremote-validation=\"validate(value)\"\n\tview-item-template=\"'selector/demo/country'\"\n\tdropdown-item-template=\"'selector/demo/country'\"\n\tplaceholder=\"Choose one or more countries...\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"country|json\"></code>\n</p>\n\n<p class=\"small\">\n\tIcons:\n\t<a href=\"https://github.com/Arnoud-B/csscountrycodes\" target=\"_blank\">\n\t\tArnoud-B/csscountrycodes\n\t</a>\n</p>",
  "js": "$scope.country = 'SV';\n\n$scope.remote = function (search) {\n\treturn $countries.search(search);\n};\n$scope.validate = function (value) {\n\treturn $countries.validate(value);\n};",
  "service": {
    "name": "$countries",
    "deps": ["$http", "$q"],
    "js": "var options = {\n\turl: 'http://services.groupkt.com/country/',\n\tmethod: 'GET',\n\tcache: true,\n\ttransformResponse: function (data) {\n\t\tvar result = angular.fromJson(data).RestResponse.result;\n\t\tif (!angular.isArray(result)) result = [result];\n\t\treturn result.map(function (country) {\n\t\t\treturn {\n\t\t\t\tname: country.name,\n\t\t\t\tcode: country.alpha2_code\n\t\t\t};\n\t\t});\n\t}\n};\n\nfunction Countries() {}\nCountries.prototype.search = function (search) {\n\tif (!search) return $q.resolve([]);\n\tvar settings = angular.copy(options);\n\tsettings.url += 'search';\n\tsettings.params = { text: search };\n\treturn $http(settings);\n};\nCountries.prototype.validate = function (value) {\n\tif (!value) return $q.resolve([]);\n\tvar settings = angular.copy(options);\n\tsettings.url += 'get/iso2code/' + value;\n\treturn $http(settings);\n};\n\nreturn new Countries();"
  }
}, {
  "title": "APIs",
  "html": "<div class=\"btn-group\">\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.open()\">\n\t\tOpen\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.focus()\">\n\t\tFocus\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.close()\">\n\t\tClose\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.fetch()\">\n\t\tFetch\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.set('SXM')\">\n\t\tSet <code>SXM</code>\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.set('ITA')\">\n\t\tSet <code>ITA</code>\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.unset('ITA')\">\n\t\tUnset <code>ITA</code>\n\t</button>\n\t<button class=\"btn btn-default\" ng-click=\"countriesAPI.unset()\">\n\t\tUnset all\n\t</button>\n</div>\n\n<select set-watch-count selector\n\tmodel=\"countries\"\n\tmulti=\"true\"\n\tapi=\"countriesAPI\"\n\tremote=\"remoteConfig\"\n\tremote-param=\"text\"\n\tlabel-attr=\"name\"\n\tvalue-attr=\"alpha3_code\"\n\tplaceholder=\"Choose one or more countries...\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"countries|json\"></code>\n</p>",
  "js": "$scope.remoteConfig = {\n\tcache: false,\n\turl: \"http://services.groupkt.com/country/search\",\n\ttransformResponse: function (data) {\n\t\treturn angular.fromJson(data).RestResponse.result;\n\t}\n};"
}, {
  "title": "Change options dynamically",
  "html": "<div class=\"btn-group\">\n\t<button class=\"btn btn-default\"\n\t\tng-class=\"{active:zone=='global'}\"\n\t\tng-click=\"zone='global'\">\n\t\tGlobal Rivers\n\t</button>\n\t<button class=\"btn btn-default\"\n\t\tng-class=\"{active:zone=='european'}\"\n\t\tng-click=\"zone='european'\">\n\t\tEuropean Rivers\n\t</button>\n</div>\n\n<select set-watch-count selector\n\tmodel=\"river\"\n\toptions=\"rivers\"\n\tlabel-attr=\"name\"\n\tplaceholder=\"Select a river...\"></select>\n\n<dl class=\"dl-horizontal\">\n\t<dt>River</dt>\n\t<dd ng-bind=\"river.name || '-'\"></dd>\n\t\n\t<dt>Length</dt>\n\t<dd ng-bind=\"river.length ? (river.length | number) + ' km' : '-'\"></dd>\n\t\n\t<dt>Outflow</dt>\n\t<dd ng-bind=\"river.outflow || '-'\"></dd>\n</dl>\n\n<p>\n\tCurrent value: <code ng-bind=\"river|json\"></code>\n</p>",
  "js": "$scope.zone = \"global\";\n\n$scope.globalRivers = [\n\t{ name: \"Nile\",        length: 6690, outflow: \"Mediterranean\" },\n\t{ name: \"Amazon\",      length: 6296, outflow: \"Atlantic Ocean\" },\n\t{ name: \"Mississippi\", length: 5970, outflow: \"Gulf of Mexico\" },\n\t{ name: \"Yangtze\",     length: 5797, outflow: \"China Sea\" },\n\t{ name: \"Ob\",          length: 5567, outflow: \"Gulf of Ob\" },\n\t{ name: \"Yellow\",      length: 4667, outflow: \"Gulf of Chihli\" },\n\t{ name: \"Yenisei\",     length: 4506, outflow: \"Arctic Ocean\" },\n\t{ name: \"Paraná\",      length: 4498, outflow: \"Río de la Plata\" },\n\t{ name: \"Irtish\",      length: 4438, outflow: \"Ob River\" },\n\t{ name: \"Chambeshi\",   length: 4371, outflow: \"Atlantic Ocean\" }\n];\n\n$scope.europeanRivers = [\n\t{ name: \"Volga\",       length: 3692, outflow: \"Caspian Sea\" },\n\t{ name: \"Danube\",      length: 2860, outflow: \"Black Sea\" },\n\t{ name: \"Ural\",        length: 2428, outflow: \"Caspian Sea\" },\n\t{ name: \"Dnieper\",     length: 2290, outflow: \"Black Sea\" },\n\t{ name: \"Don\",         length: 1950, outflow: \"Sea of Azov\" },\n\t{ name: \"Pechora\",     length: 1809, outflow: \"Arctic Ocean\" },\n\t{ name: \"Kama\",        length: 1805, outflow: \"Volga\" },\n\t{ name: \"Oka\",         length: 1500, outflow: \"Volga\" },\n\t{ name: \"Belaya\",      length: 1430, outflow: \"Kama\" },\n\t{ name: \"Dniester\",    length: 1362, outflow: \"Black Sea\" }\n];\n\n$scope.$watch('zone', function (zone) {\n\t$scope.rivers = $scope[zone + 'Rivers'];\n\t// select first\n\t$scope.river = $scope.rivers[0];\n});"
}, {
  "title": "Create custom options",
  "html": "<select set-watch-count selector\n\tmodel=\"myHobbies\"\n\tmulti=\"true\"\n\toptions=\"hobbies\"\n\tvalue-attr=\"value\"\n\tplaceholder=\"Which are your hobbies? (type something that is not in the list)\"\n\tcreate=\"createFunction(input)\"></select>\n\n<p>\n\tCurrent value: <code ng-bind=\"myHobbies|json\"></code>\n</p>",
  "js": "$scope.hobbies =[\n\t{ value: 0, label: \"Basketball\" },\n\t{ value: 1, label: \"Videogames\" },\n\t{ value: 2, label: \"Travelling\" }\n];\n\n$scope.createFunction = function (input) {\n\t// format the option and return it\n\treturn {\n\t\tvalue: $scope.hobbies.length,\n\t\tlabel: input\n\t};\n};"
}, {
  "title": "Create custom options (using <code>Promise</code>)",
  "html": "<div ng-show=\"!creation.active\">\n\t<select set-watch-count selector\n\t\tmodel=\"myHobbies\"\n\t\tmulti=\"true\"\n\t\toptions=\"hobbies\"\n\t\tvalue-attr=\"value\"\n\t\tplaceholder=\"Which are your hobbies? (type something that is not in the list)\"\n\t\tcreate=\"creation.show(input)\"></select>\n\t\n\t<p>\n\t\tCurrent value: <code ng-bind=\"myHobbies|json\"></code>\n\t</p>\n</div>\n\n<form ng-show=\"creation.active\" ng-submit=\"creation.insert()\">\n\t<div class=\"form-group\">\n\t\t<label>Value</label>\n\t\t<input ng-model=\"creation.value\" required autofocus\n\t\t\tplaceholder=\"value\" class=\"form-control\">\n\t</div>\n\t<div class=\"form-group\">\n\t\t<label>Label</label>\n\t\t<input ng-model=\"creation.label\" required\n\t\t\tplaceholder=\"label\" class=\"form-control\">\n\t</div>\n\t<button type=\"submit\" class=\"btn btn-success\">\n\t\tInsert value!\n\t</button>\n\t<button type=\"button\" class=\"btn btn-default\"\n\t\tng-click=\"creation.cancel()\">\n\t\tCancel\n\t</button>\n</form>",
  "js": "$scope.hobbies = [\n\t{ value: 0, label: \"Basketball\" },\n\t{ value: 1, label: \"Videogames\" },\n\t{ value: 2, label: \"Travelling\" }\n];\n\n$scope.creation = {\n\tactive: false,\n\tdeferred: null,\n\tshow: function (input) {\n\t\tthis.deferred = $q.defer();\n\t\tthis.active   = true;\n\t\tthis.value    = $scope.hobbies.length;\n\t\tthis.label    = input;\n\t\treturn this.deferred.promise;\n\t},\n\tinsert: function () {\n\t\tthis.active = false;\n\t\tthis.deferred.resolve({\n\t\t\tvalue: this.value,\n\t\t\tlabel: this.label\n\t\t});\n\t},\n\tcancel: function () {\n\t\tthis.active = false;\n\t\tthis.deferred.reject();\n\t}\n};"
}];

angular
  .module('AngularSelectorDemo', ['selector'])
  .controller('AngularSelectorDemoCtrl', ['$http', '$scope', function ($http, $scope) {
    $scope.examples = examples;
  }])
  .filter('trustAsHtml', ['$sce', function ($sce) {
    return function (input) {
      return $sce.trustAsHtml(input);
    };
  }])
  .filter('highlight', ['$sce', function ($sce) {
    return function (input, lang) {
      return $sce.trustAsHtml(lang && input ? hljs.highlight(lang, input)
        .value : input);
    };
  }])
  .directive('example', ['$compile', '$q', function ($compile, $q) {
    return {
      restrict: 'C',
      link: function ($scope, $element) {
        if ((<any>$scope).example.service) {
          return;
        }
        $element.html((<any>$scope).example.html);
        $compile($element.contents())($scope);
        eval((<any>$scope).example.js);
      }
    };
  }])
  .directive('setWatchCount', [function () {
    return {
      restrict: 'A',
      link: function ($scope, $element) {
        setInterval(() => {
          let wC = getWatchers($element[0])
            .length
          $element[0].setAttribute('watchCount', wC);
        }, 200);
      }
    };
  }])
  .directive('plunker', [function () {
    return {
      restrict: 'A',
      template: (
        '<form method="post" action="http://plnkr.co/edit/?p=preview" target="_blank" class="plunker">' +
        '<button type="submit">' +
        '<img src="https://plnkr.co/img/plunker.png" alt="Plunker">&nbsp; Plunker' +
        '</button>' +
        '</form>'
      ),
      link: function ($scope, $element, $attrs) {
        var example = (<any>$scope).example;
        let form = angular.element($element[0].querySelector('form')),
          desc = angular.element('<input type="hidden" name="description">')
            .val('Angular Selector example: ' + example.title),
          html = angular.element('<input type="hidden" name="files[index.html]">'),
          css = angular.element('<input type="hidden" name="files[style.css]">'),
          js = angular.element('<input type="hidden" name="files[script.js]">'),
          services = '';
        // plunker settings
        form.append(angular.element('<input type="hidden" name="private" value="true">'));
        ['select', 'angular', 'selector', 'directive', 'typeahead', 'tag'].concat(example.title.toLowerCase()
          .split(' '))
          .forEach(function (tag, index) {
            var element = angular.element('<input type="hidden" name="tags[' + index + ']">')
              .val(tag);
            form.append(element);
          });
        form.append(desc);
        html.val([
          '<!DOCTYPE html>',
          '<html ng-app="myApp" ng-controller="ExampleCtrl as ctrl">',
          '	<head>',
          '		<meta charset="utf-8">',
          '		<meta http-equiv="X-UA-Compatible" content="IE=edge">',
          '		<meta name="viewport" content="width=device-width, initial-scale=1">',
          '		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">',
          '		<link rel="stylesheet" href="//cdn.rawgit.com/indrimuska/angular-selector/master/dist/angular-selector.css">',
          '		<link rel="stylesheet" href="style.css">',
          '	</head>',
          '	<body>',
          '		<h1 class="page-header">' + example.title + '</h1>',
          '		',
          '		' + example.html.replace(/\n/g, "\n\t\t"),
          '		',
          '		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.4.1/angular.js"></script>',
          '		<script src="//cdn.rawgit.com/indrimuska/angular-selector/master/dist/angular-selector.js"></script>',
          '		<script src="script.js"></script>',
          '	</body>',
          '</html>'
        ].join("\n"));
        form.append(html);

        css.val([
          'body { margin: 30px; }',
          'p { margin-top: 10px; }',
          'dl { margin-top: 15px; }',
          '.btn-group { margin-bottom: 15px; }',
          '.checkbox-inline { font-weight: bold; margin-bottom: 10px; }'
        ].join("\n"));
        form.append(css);

        services = !example.service ? null : [
          '	.service(\'' + example.service.name + '\', [' +
          (example.service.deps || [])
            .map(function (name) {
              return '\'' + name + '\'';
            })
            .join(', ') +
          ((example.service.deps || [])
            .length > 0 ? ', ' : '') +
          'function (' +
          (example.service.deps || [])
            .join(', ') +
          ') {',
          '		' + (example.service.js || '')
            .replace(/\n/g, "\n\t\t"),
          '	}])'
        ].join("\n");

        js.val([
          'angular',
          '	.module(\'myApp\', [\'selector\'])',
          services,
          '	.controller(\'ExampleCtrl\', [\'$scope\', ' +
          (example.service ? '\'' + example.service.name + '\', ' : '') +
          'function ($scope' +
          (example.service ? ', ' + example.service.name : '') +
          ') {',
          '		' + (example.js || '')
            .replace(/\n/g, "\n\t\t"),
          '	}]);'
        ].filter(function (l) {
          return l;
        })
          .join("\n"));
        form.append(js);
      }
    };
  }]);