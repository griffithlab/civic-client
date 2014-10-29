(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk);

// @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      template: '<div class="geneTalk"><p>gene-talk directive</p></div>',
      link: function($scope) {
        console.log('geneTalk linked.');
      }
    };

    return directive;
  }
})();