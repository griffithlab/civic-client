(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantTalkRevisionsController', VariantTalkRevisionsController)
    .directive('variantTalkRevisions', variantTalkRevisionsDirective);

  // @ngInject
  function variantTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantTalkRevisionsController',
      templateUrl: 'app/views/events/variants/talk/revisions/variantTalkRevisions.tpl.html'
    };
  }

  // @ngInject
  function VariantTalkRevisionsController($scope, VariantRevisions, VariantsTalkViewOptions) {
    $scope.variantRevisions = VariantRevisions;
    $scope.viewOptions = VariantsTalkViewOptions;
  }

})();
