(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalk', geneTalk)
    .controller('GeneTalkController', GeneTalkController);

  // @ngInject
  function geneTalk() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalk.tpl.html',
      controller: 'GeneTalkController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneTalkController ($scope, $stateParams, GenesSuggestedChanges, $log) {

    GenesSuggestedChanges.query({'geneId': $stateParams.geneId })
      .$promise.then(function(response) {

        $scope.suggestedChanges = response;
    });
  }
})();
