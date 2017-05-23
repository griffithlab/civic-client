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
    ctrl.isEditor = Security.isEditor;
    ctrl.isAdmin = Security.isAdmin;

    ctrl.baseState = $scope.entityViewOptions.state.baseState;
    ctrl.stateParams = $scope.entityViewOptions.state.params;
    ctrl.flags = [];
    ctrl.hasActiveFlag = false;
    ctrl.hasResolvedFlag = false;
    ctrl.activeFlag = undefined;
    ctrl.resolvedCount = undefined;
    ctrl.entityId = $scope.entityViewModel.data.item.id;
    ctrl.showResolved = false;

    ctrl.popoverPlacement = $scope.type === 'GENE' ? 'right-top' : 'right';

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
      if(!_.isUndefined(flags) && flags.length > 0) {
        ctrl.flags = _.chain(flags)
          .map(function(flag) {
            flag.comments = _.sortBy(flag.comments, 'id');
            flag.flagComment = flag.comments[0];
            flag.resolveComment = flag.comments[1];
            return flag;
          })
          .value();
        ctrl.resolvedCount =  _.chain(flags).filter({state:'resolved'}).value().length;
        var activeFlag = ctrl.activeFlag = _.chain(flags).filter({state:'open'}).value()[0];
        if(!_.isUndefined(activeFlag)) {
          ctrl.activeFlagId = activeFlag.id;
        }
        ctrl.hasActiveFlag = _.some(flags, {
          state: 'open'
        });

        ctrl.hasResolvedFlag = _.some(flags, {
          state: 'resolved'
        });
      }
    });

    ctrl.toggleResolved = function() {
      ctrl.showResolved = !ctrl.showResolved;
    };

    ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    $scope.$on('$stateChangeSuccess', function() {
      ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    });

    ctrl.edit = function() {
      if (Security.isAuthenticated()) {
        $state.go(ctrl.baseState + '.edit.basic', ctrl.stateParams);
      }
    };

    ctrl.submit = function(newFlag) {
      console.log('ctrl.flag() called.');
      $scope.entityViewModel.submitFlag(newFlag).then(function() {
        console.log('flag accepted.');

        ctrl.newFlag.comment.text = '';
      });
    };

    ctrl.resolve = function(resolveFlag) {
      console.log('ctrl.resolve() called');
      resolveFlag.flagId = ctrl.activeFlagId;
      $scope.entityViewModel.resolveFlag(resolveFlag).then(function() {
        console.log('flag resolved.');
        ctrl.showResolved = true;
      });
    };
  }


})();
