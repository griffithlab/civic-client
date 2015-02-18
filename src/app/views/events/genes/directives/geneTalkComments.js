(function() {
  'use strict';
  angular.module('civic.events')
    .directive('geneTalkComments', geneTalkComments)
    .controller('GeneTalkCommentsController', GeneTalkCommentsController);

  // @ngInject
  function geneTalkComments() {
    var directive = {
      restrict: 'E',
      scope: {
        gene: '=gene'
      },
      replace: true,
      templateUrl: 'app/views/events/genes/directives/geneTalkComments.tpl.html',
      link: /* ngInject */ function($scope, Security) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      },
      controller: 'GeneTalkCommentsController'
    };
    return directive;
  }

  // @ngInject
  function GeneTalkCommentsController($scope, GeneComments) {
    var gene = $scope.gene;
    GeneComments.query({geneId: gene.entrez_id})
      .$promise.then(function(response) {
        $scope.comments = response;
      });
  }
})();
