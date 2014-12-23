(function() {
  'use strict';
  angular.module('civic.events')
    .directive('variantTalk', variantTalk);

// @ngInject
  function variantTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/variants/directives/variantTalk.tpl.html',
      link: /*ngInject*/ function() {
        console.log('variantTalk linked.');
      }
    };

    return directive;
  }
})();
