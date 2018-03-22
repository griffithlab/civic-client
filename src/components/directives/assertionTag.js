(function() {
  'use strict';

  angular.module('civic.common')
    .directive('assertionTag', assertionTagDirective);


  // @ngInject
  function assertionTagDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        assertion: '='
      },
      templateUrl: 'components/directives/assertionTag.tpl.html'
    };
  }
})();
