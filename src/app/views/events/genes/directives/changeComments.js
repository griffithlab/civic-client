(function() {
  'use strict';
  angular.module('civic.events')
    .directive('changeComments', changeComments)
    .controller('ChangeCommentsController', ChangeCommentsController);

  // @ngInject
  function changeComments() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/changeComments.tpl.html',
      controller: 'ChangeCommentsController',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function ChangeCommentsController($scope, $stateParams, GenesSuggestedChanges, GenesSuggestedChangesComments, $log) {
    $log.info('GeneTalkController instantiated.');
    $log.info('Requesting change:' + $stateParams.geneId + 'suggestedChangeId: ' + $stateParams.suggestedChangeId);

    GenesSuggestedChanges.get({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.suggestedChange = response;
      });

    GenesSuggestedChangesComments.get({'geneId': $stateParams.geneId, 'suggestedChangeId': $stateParams.suggestedChangeId })
      .$promise.then(function(response) {
        $scope.changeComments = response;
      });
  }
})();
