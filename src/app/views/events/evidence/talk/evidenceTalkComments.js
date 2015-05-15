(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceTalkCommentsController', EvidenceTalkCommentsController)
    .directive('evidenceTalkComments', evidenceTalkCommentsDirective);

  // @ngInject
  function evidenceTalkCommentsDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'EvidenceTalkCommentsController',
      templateUrl: 'app/views/events/evidence/talk/evidenceTalkComments.tpl.html'
    }
  }


  // @ngInject
  function EvidenceTalkCommentsController($scope, Evidence) {
    var ctrl = $scope.ctrl = {};

    ctrl.evidenceTalkModel = Evidence;
  }

})();
