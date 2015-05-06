(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('VariantTalkCommentsController', VariantTalkCommentsController)
    .directive('variantTalkComments', variantTalkCommentsDirective);

  // @ngInject
  function variantTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantTalkCommentsController',
      templateUrl: 'app/views/events/variants/talk/variantTalkComments.tpl.html'
    }
  }


  // @ngInject
  function VariantTalkCommentsController($scope, Variants) {
    var ctrl = $scope.ctrl = {};

    ctrl.variantTalkModel = Variants;
  }

})();
