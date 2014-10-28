(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk);

// @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: '/civic-client/views/events/genes/directives/geneTalk.tpl.html',
      link: function($scope) {
        console.log('geneTalk linked.');
      }
    };

    return directive;
  }
})();