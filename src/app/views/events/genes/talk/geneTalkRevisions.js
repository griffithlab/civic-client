(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneTalkRevisionsController', GeneTalkRevisionsController)
    .directive('geneTalkRevisions', geneTalkRevisionsDirective);

  // @ngInject
  function geneTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'GeneTalkRevisionsController',
      templateUrl: 'app/views/events/genes/talk/geneTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function GeneTalkRevisionsController($scope, GeneRevisions, GenesTalkViewOptions) {
    $scope.geneRevisions = GeneRevisions;
    $scope.viewOptions = GenesTalkViewOptions;
  }

})();
