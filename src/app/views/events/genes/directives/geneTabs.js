(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTabs', geneTabs);

  // @ngInject
  function geneTabs() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/genes/directives/geneTabs.tpl.html',
      link: function($scope) {
        console.log('geneTabs directive linked.');
      }
    };

    return directive;
  }
})();