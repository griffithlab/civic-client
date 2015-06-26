(function() {
  'use strict';
  angular.module('civic.events.variantGroups')
    .controller('VariantGroupTalkCommentsController', VariantGroupTalkCommentsController)
    .directive('variantGroupTalkComments', VariantGroupTalkCommentsDirective);

  // @ngInject
  function VariantGroupTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantGroupTalkCommentsController',
      templateUrl: 'app/views/events/variantGroups/talk/variantGroupTalkComments.tpl.html'
    };
  }

  // @ngInject
  function VariantGroupTalkCommentsController($scope, VariantGroups) {
    var ctrl = $scope.ctrl = {};

    ctrl.variantGroupTalkModel = VariantGroups;
  }

})();
