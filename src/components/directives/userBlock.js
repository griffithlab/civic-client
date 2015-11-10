(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userBlock', userBlockDirective)
    .controller('UserBlockController', UserBlockController);

  // @ngInject
  function userBlockDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      controller: 'UserBlockController',
      templateUrl: 'components/directives/userBlock.tpl.html'
    };
  }

  // @inject
  function UserBlockController() {
    console.log('userBlock controller called.');
  }
})();
