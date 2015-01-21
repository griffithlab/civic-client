(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkComments', geneTalkComments)
    .controller('GeneTalkCommentsController', GeneTalkCommentsController);

  // @ngInject
  function geneTalkComments() {
    var directive = {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkComments.tpl.html',
      controller: 'GeneTalkCommentsController'
    };
    return directive;
  }

  // @ngInject
  function GeneTalkCommentsController(Security, $scope, $stateParams, GeneComments, $log) {
    $scope.isAuthenticated = Security.isAuthenticated;
    $scope.isAdmin = Security.isAdmin;

    $log.info('GeneTalkCommentsController instantiated.');
    GeneComments.query({geneId: $scope.gene.entrez_id})
      .$promise.then(function(response) {
        $scope.comments = response;
      });
  }
})();
