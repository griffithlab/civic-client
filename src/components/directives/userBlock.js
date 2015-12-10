(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userBlock', userBlockDirective);


  // @ngInject
  function userBlockDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'components/directives/userBlock.tpl.html'
    };
  }
})();
