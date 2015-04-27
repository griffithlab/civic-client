(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceTalkRevisionsController', EvidenceTalkRevisionsController)
    .directive('evidenceTalkRevisions', evidenceTalkRevisionsDirective);

  // @ngInject
  function evidenceTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {},
      require: '^^entityTalkView',
      link: evidenceTalkRevisionsLink,
      controller: 'EvidenceTalkRevisionsController',
      templateUrl: 'app/views/events/evidence/talk/evidenceTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function evidenceTalkRevisionsLink(scope, element, attrs, entityTalkView) {
    scope.evidenceTalkModel = entityTalkView.entityTalkModel;
  }

  // @ngInject
  function EvidenceTalkRevisionsController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.$watch('evidenceTalkModel', function(evidenceTalkModel) {
      ctrl.evidenceTalkModel = evidenceTalkModel;
    });
  }

})();
