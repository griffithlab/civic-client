(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userCardGrid', userCardGridDirective)
    .controller('UserCardGridController', UserCardGridController);

  // @ngInject
  function userCardGridDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        options: '='
      },
      controller: 'UserCardGridController as vm',
      bindToController: true,
      templateUrl: 'components/directives/userCardGrid.tpl.html'
    };
  }

  // @inject
  function UserCardGridController($scope, _, Users) {
    var vm = this;
  }
})();
