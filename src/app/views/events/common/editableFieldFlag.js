(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EditableFieldFlagController', EditableFieldFlagController)
    .directive('editableFieldFlag', editableFieldFlag);

  // @ngInject
  function editableFieldFlag() {

    return {
      restrict: 'E',
      scope: {
        entityId: '=',
        flag: '=',
        type: '=',
        name: '=',
        resolveFn: '='
      },
      controller: 'EditableFieldFlagController',
      templateUrl: 'app/views/events/common/editableFieldFlag.tpl.html'
    };
  }

  // @ngInject
  function EditableFieldFlagController($scope, $state, _, Security) {
    var ctrl = $scope.ctrl = {};
    console.log('editable field flag controller called. ----------------');
    ctrl.isAdmin = Security.isAdmin;
    ctrl.isEditor = Security.isEditor;
    ctrl.actions = {
      flagged: {
        order: 0,
        timestamp: $scope.flag.flagComment.created_at,
        user: $scope.flag.flagging_user
      }
    };

    if(!_.isUndefined($scope.flag.resolving_user.id)) {
      ctrl.actions.resolved = {
        order: 1,
        timestamp: $scope.flag.resolveComment.created_at,
        user: $scope.flag.resolving_user
      };
    }

    ctrl.resolveFlag = {
      entityId: $scope.entityId,
      flagId: $scope.flag.id,
      comment: {
        title: 'Flag Resolve Comment for ' + $scope.type + ' ' + $scope.name,
        text: ''
      }
    };
  }
})();
