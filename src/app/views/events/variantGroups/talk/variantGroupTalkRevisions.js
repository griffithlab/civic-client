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
      require: '^^entityTalkView',
      link: variantGroupTalkRevisionsLink,
      controller: 'VariantGroupTalkRevisionsController',
      templateUrl: 'app/views/events/variantGroups/talk/variantGroupTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function variantGroupTalkRevisionsLink(scope, element, attrs, entityTalkView) {
    scope.variantGroupTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantGroupTalkRevisionsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('variantGroupTalkModel', function(variantGroupTalkModel) {
      ctrl.variantGroupTalkModel = variantGroupTalkModel;
    });
  }

})();
