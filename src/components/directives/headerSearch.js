(function() {
  'use strict';
  angular.module('civic.common')
    .directive('headerSearch', headerSearch)
    .controller('HeaderSearchController', HeaderSearchController);

  function headerSearch() {
    return {
      restrict: 'E',
      templateUrl: 'components/directives/headerSearch.tpl.html',
      controller: 'HeaderSearchController'
    };

  }

  // @ngInject
  function HeaderSearchController($scope, Security) {
    var vm = $scope.vm = {};
    vm.isEditor= Security.isEditor;
    vm.isAuthenticated = Security.isAuthenticated;
    vm.test = "test";
  }
})();
