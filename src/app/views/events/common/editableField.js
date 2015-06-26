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
        entityViewOptions: '='
      },
      controller: 'EditableFieldController',
      templateUrl: 'app/views/events/common/editableField.tpl.html'
    };
  }

  // @ngInject
  function EditableFieldController($scope, $state, Security) {
    var ctrl = $scope.ctrl = {};
    ctrl.baseState = '';
    ctrl.stateParams = {};

    ctrl.baseState  = $scope.entityViewOptions.state.baseState;
    ctrl.gstateParams = $scope.entityViewOptions.state.params;
    ctrl.entityViewModel = $scope.entityViewModel;

    ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    $scope.$on('$stateChangeSuccess', function() {
      ctrl.active = $state.includes(ctrl.baseState + '.edit.*');
    });

    ctrl.mouseOver = function() {
      Security.isAuthenticated() ? ctrl.hover = true: ctrl.hover = false;
    };

    ctrl.mouseLeave = function() {
      ctrl.hover = false;
    };

    ctrl.click = function() {
      if (Security.isAuthenticated()) {
        $state.go(ctrl.baseState + '.edit.basic', ctrl.stateParams);
      }
    };

  }


})();
