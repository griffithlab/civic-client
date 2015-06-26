(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupTalkRevisionsController', VariantGroupTalkRevisionsController)
    .directive('variantGroupTalkRevisions', variantGroupTalkRevisionsDirective);

  // @ngInject
  function variantGroupTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantGroupTalkRevisionsController',
      templateUrl: 'app/views/events/variantGroups/talk/revisions/variantGroupTalkRevisions.tpl.html'
    };
  }

  // @ngInject
  function VariantGroupTalkRevisionsController($scope, VariantGroupRevisions, VariantGroupsTalkViewOptions) {
    $scope.variantGroupRevisions = VariantGroupRevisions;
    $scope.viewOptions = VariantGroupsTalkViewOptions;
  }

})();
