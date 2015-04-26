(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupTalkCommentsController', VariantGroupTalkCommentsController)
    .directive('variantGroupTalkComments', variantGroupTalkCommentsDirective);

  // @ngInject
  function variantGroupTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: variantGroupTalkCommentsLink,
      controller: 'VariantGroupTalkCommentsController',
      templateUrl: 'app/views/events/variantGroups/talk/variantGroupTalkComments.tpl.html'
    }
  }

  // @ngInject
  function variantGroupTalkCommentsLink(scope, element, attrs, entityTalkView) {
    scope.variantGroupTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantGroupTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('variantGroupTalkModel', function(variantGroupTalkModel) {
      ctrl.variantGroupTalkModel = variantGroupTalkModel;
    });
  }

})();
