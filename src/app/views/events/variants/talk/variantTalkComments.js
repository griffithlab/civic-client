(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('VariantTalkCommentsController', VariantTalkCommentsController)
    .directive('variantTalkComments', variantTalkCommentsDirective);

  // @ngInject
  function variantTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: variantTalkCommentsLink,
      controller: 'VariantTalkCommentsController',
      templateUrl: 'app/views/events/variants/talk/variantTalkComments.tpl.html'
    }
  }

  // @ngInject
  function variantTalkCommentsLink(scope, element, attrs, variantTalkView) {
    scope.variantTalkModel = variantTalkView.entityTalkModel;
  }

  // @ngInject
  function VariantTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('variantTalkModel', function(variantTalkModel) {
      ctrl.variantTalkModel = variantTalkModel;
    });
  }

})();
