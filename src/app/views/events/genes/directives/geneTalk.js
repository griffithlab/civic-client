(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk);

// @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalk.tpl.html',
      link: /* ngInject */ function() {
        console.log('geneTalk linked.');
      }
    };

    return directive;
  }
})();
