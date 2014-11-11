(function() {
  'use strict';
  angular.module('civic.events')
    .directive('myGeneInfo', myGeneInfo);

// @ngInject
  function myGeneInfo() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'MyGeneInfoCtrl',
      templateUrl: '/civic-client/views/events/genes/directives/myGeneInfo.tpl.html',
      link: function($scope) {
        console.log('myGeneInfo directive linked.');
      }
    };

    return directive;
  }
})();
