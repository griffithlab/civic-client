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
      require: '^^entityTalkView',
      link: geneTalkCommentsLink,
      controller: 'GeneTalkCommentsController',
      templateUrl: 'app/views/events/genes/talk/geneTalkComments.tpl.html'
    }
  }

  // @ngInject
  function geneTalkCommentsLink(scope, element, attrs, geneTalkView) {
    scope.geneTalkModel = geneTalkView.entityTalkModel;
  }

  // @ngInject
  function GeneTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('geneTalkModel', function(geneTalkModel) {
      ctrl.geneTalkModel = geneTalkModel;
    });
  }

})();
