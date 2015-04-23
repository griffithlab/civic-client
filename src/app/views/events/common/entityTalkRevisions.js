(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EntityTalkRevisionsController', EntityTalkRevisionsController)
    .directive('entityTalkRevisions', entityTalkRevisionsDirective);

  // @ngInject
  function entityTalkRevisionsDirective() {
    return {
      restrict: 'E',
      scope: {
        entityTalkModel: '=',
        revisionItems: '='
      },
      link: entityTalkRevisionsLink,
      controller: 'EntityTalkRevisionsController',
      templateUrl: 'app/views/events/common/entityTalkRevisions.tpl.html'
    }
  }

  // @ngInject
  function entityTalkRevisionsLink(scope, element, attrs) {

  }

  // @ngInject
  function EntityTalkRevisionsController($scope) {
    var ctrl = $scope.ctrl = {};
    var entityTalkModel = ctrl.entityTalkModel = $scope.entityTalkModel;

    // merge revisions and suggested changes
    ctrl.revisionItems = $scope.revisionItems;

  }

})();
