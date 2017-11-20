(function() {
  'use strict';

  angular.module('civic.common')
    .directive('organizationBlock', organizationBlockDirective);


  // @ngInject
  function organizationBlockDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      templateUrl: 'components/directives/organizationBlock.tpl.html'
    };
  }
})();
