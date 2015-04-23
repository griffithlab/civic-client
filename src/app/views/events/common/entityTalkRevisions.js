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
        entityTalkModel: '='
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
    ctrl.revisionItems = entityTalkModel.data.changes.concat(entityTalkModel.data.revisions);

    // normalize revisions and suggested_changes
    ctrl.revisionItems = _.map(ctrl.revisionItems, function(item) {
      if(_.has(item, 'suggested_changes')) {
        item.changes = item.suggested_changes;
        item.type = 'suggested';
      } else {
        item.type = 'applied';
        item.status = item.action;
      }
      return item;
    })

  }

})();
