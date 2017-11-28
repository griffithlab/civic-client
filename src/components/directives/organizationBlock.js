(function() {
  'use strict';

  angular.module('civic.common')
    .directive('organizationBlock', organizationBlockDirective);


  // @ngInject
  function organizationBlockDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        organization: '='
      },
      templateUrl: 'components/directives/organizationBlock.tpl.html'
    };
  }
})();
