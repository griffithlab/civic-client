(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userCard', userCardDirective)
    .controller('UserCardController', UserCardController);

  // @ngInject
  function userCardDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      controller: 'UserCardController',
      templateUrl: 'components/directives/userCard.tpl.html'
    };
  }

  // @inject
  function UserCardController() {
    console.log('userCard controller called.');
  }
})();
