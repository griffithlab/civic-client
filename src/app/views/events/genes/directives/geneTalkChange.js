(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkChange', geneTalkChange)
    .controller('GeneTalkChangeController', GeneTalkChangeController);

  // @ngInject
  function geneTalkChange() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkChange.tpl.html',
      controller: 'GeneTalkChangeController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function GeneTalkChangeController($scope, $stateParams, GenesSuggestedChanges, GenesSuggestedChangesComments, $log) {
    $log.info('GeneTalkChangeController instantiated.');
    $log.info('Requesting change:' + $stateParams.geneId + 'suggestedChangeId: ' + $stateParams.suggestedChangeId);

    GenesSuggestedChanges.get({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.suggestedChange = response;
      });

    GenesSuggestedChangesComments.query({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.geneTalkComments = response;
      });
  }
})();
