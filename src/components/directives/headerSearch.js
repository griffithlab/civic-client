(function() {
  'use strict';
  angular.module('civic.common')
    .directive('headerSearch', headerSearch);

  function headerSearch() {
    return {
      restrict: 'E',
      templateUrl: 'components/directives/headerSearch.tpl.html',
      controller: HeaderSearchController
    };

  }

  // @ngInject
  function HeaderSearchController($scope, Security) {
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated;
    vm.isEditor = Security.isEditor;
  }
})();
