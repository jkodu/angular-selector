
import * as  hljs from 'highlight.js';
import * as angular from 'angular';

import { getWatchers } from './utils';
import {
  ex_single_element,
  ex_multiple_element,
  ex_return_entire_obj,
  ex_custom_template,
  ex_fill_options_from_html,
  ex_rtl_support,
  ex_remote_fetching,
  ex_remote_fetching_with_validation,
  ex_remote_fetching_with_custom_service,
  ex_apis,
  ex_change_options_dynamically,
  ex_create_custom_options,
  ex_create_custom_options_using_promise

} from './examples';

import * as sos from '../dist/angular-selector-on-steroids';
new sos.AngularSelectorOnSteroids().init();
// new AngularSelectorOnSteroids.default().init();

// import AngularSelectorOnSteroids from '../src/index';
// new AngularSelectorOnSteroids().init();

const examples = [
  ex_single_element,
  ex_multiple_element,
  ex_return_entire_obj,
  ex_custom_template,
  ex_fill_options_from_html,
  ex_rtl_support,
  ex_remote_fetching,
  ex_remote_fetching_with_validation,
  ex_remote_fetching_with_custom_service,
  ex_apis,
  ex_change_options_dynamically,
  ex_create_custom_options,
  ex_create_custom_options_using_promise
];

angular
  .module('AngularSelectorDemo', ['selectorOnSteroids'])
  .controller('AngularSelectorDemoCtrl', ['$scope', function ($scope) {
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
