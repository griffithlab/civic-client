(function() {
  'use strict';

  angular.module('civic.events.common')
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
      templateUrl: 'app/views/events/common/userBlock.tpl.html'
    };
  }

  // @inject
  function UserBlockController() {
    console.log('userBlock controller called.');
  }
})();
