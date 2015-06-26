(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneTalkCommentsController', GeneTalkCommentsController)
    .directive('geneTalkComments', geneTalkCommentsDirective);

  // @ngInject
  function geneTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'GeneTalkCommentsController',
      templateUrl: 'app/views/events/genes/talk/geneTalkComments.tpl.html'
    };
  }


  // @ngInject
  function GeneTalkCommentsController($scope, Genes) {
    var ctrl = $scope.ctrl = {};

    ctrl.geneTalkModel = Genes;
  }

})();
