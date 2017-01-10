 (function() {
  'use strict';
  angular.module('civic.common')
     .directive('simpleTabs', simpleTabs);

// @ngInject
  function simpleTabs() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        tabs: '='
      },
      templateUrl: 'components/directives/simpleTabs.tpl.html'
    };
  }
 })();
