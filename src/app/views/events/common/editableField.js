(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EditableFieldController', EditableFieldController)
    .directive('editableField', editableField);

  // @ngInject
  function editableField() {

    return {
      restrict: 'A',
      transclude: true,
      scope: {
        entityViewModel: '=',
        entityViewRevisions: '=',
        entityViewOptions: '=',
        type: '=',
        name: '='
      },
      controller: 'EditableFieldController',
      templateUrl: 'app/views/events/common/editableField.tpl.html'
    };
  }

  // @ngInject
  function EditableFieldController($scope, $state, _, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.baseState = '';
    ctrl.stateParams = {};
    ctrl.isAuthenticated = Security.isAuthenticated;


    ctrl.baseState = $scope.entityViewOptions.state.baseState;
    ctrl.gstateParams = $scope.entityViewOptions.state.params;
    ctrl.flags = [];
    ctrl.hasActiveFlag = false;
    ctrl.hasResolvedFlag = false;

    ctrl.newFlag = {
      entityId: $scope.entityViewModel.data.item.id,
      comment: {
        title: 'Flag Comment for ' + $scope.type + ' ' + $scope.name,
        text: ''
      }
    };

    $scope.$watchCollection(function() {
      return $scope.entityViewModel.data.flags;
    }, function(flags) {
      ctrl.flags = _.map(flags, function(flag) {
        flag.comments = _.sortBy(flag.comments, 'id');
        flag.flagComment = flag.comments[0];
        flag.resolveComment = flag.comments[1];
        return flag;
      });

      ctrl.hasActiveFlag = _.some(flags, {
        state: 'flagged'
      });

      ctrl.hasResolvedFlag = _.some(flags, {
        state: 'resolved'
      });
    });

    ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    $scope.$on('$stateChangeSuccess', function() {
      ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    });

    ctrl.edit = function() {
      if (Security.isAuthenticated()) {
        $state.go(ctrl.baseState + '.edit.basic', ctrl.stateParams);
      }
    };

    ctrl.flag = function(newFlag) {
      console.log('ctrl.flag() called.');
      $scope.entityViewModel.submitFlag(newFlag);
    };

    ctrl.resolve = function() {
      console.log('ctrl.resolve() called');
    };
  }


})();
