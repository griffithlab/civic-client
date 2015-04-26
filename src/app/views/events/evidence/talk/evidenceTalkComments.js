(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('EvidenceTalkCommentsController', EvidenceTalkCommentsController)
    .directive('evidenceTalkComments', evidenceTalkCommentsDirective);

  // @ngInject
  function evidenceTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: evidenceTalkCommentsLink,
      controller: 'EvidenceTalkCommentsController',
      templateUrl: 'app/views/events/evidence/talk/evidenceTalkComments.tpl.html'
    }
  }

  // @ngInject
  function evidenceTalkCommentsLink(scope, element, attrs, evidenceTalkView) {
    scope.evidenceTalkModel = evidenceTalkView.entityTalkModel;
  }

  // @ngInject
  function EvidenceTalkCommentsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('evidenceTalkModel', function(evidenceTalkModel) {
      ctrl.evidenceTalkModel = evidenceTalkModel;
    });
  }

})();
