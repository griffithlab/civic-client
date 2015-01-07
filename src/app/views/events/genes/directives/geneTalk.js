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
  function GeneTalkController ($scope, $stateParams, GenesSuggestedChanges, GenesSuggestedChangesComments, $log) {
    $log.info('GeneTalkController instantiated.');
    $log.info('Requesting changes for gene ' + $stateParams.geneId);

    GenesSuggestedChanges.query({'geneId': $stateParams.geneId })
      .$promise.then(function(response) {
        $scope.suggestedChanges = response;
    });
  }
})();
