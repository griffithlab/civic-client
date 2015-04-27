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
      require: '^^entityTalkView',
      link: variantTalkRevisionsLink,
      controller: 'VariantTalkRevisionsController',
      templateUrl: 'app/views/events/variants/talk/variantTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function variantTalkRevisionsLink(scope, element, attrs, entityTalkView) {
    scope.variantTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantTalkRevisionsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('variantTalkModel', function(variantTalkModel) {
      ctrl.variantTalkModel = variantTalkModel;
    });
  }

})();
