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
      link: editableFieldLink,
      templateUrl: 'app/views/events/common/editableField.tpl.html'
    }
  }

  // @ngInject
  function editableFieldLink(scope, element, attrs) {
//    console.log('editableFieldLink fn called.');
  }

  // @ngInject
  function EditableFieldController($scope, $state, $log, _) {
    var ctrl = $scope.ctrl = {};
    var baseState = '';
    var stateParams = {};

    baseState  = $scope.entityViewOptions.state.baseState;
    stateParams = $scope.entityViewOptions.state.params;
    ctrl.entityModel = $scope.entityModel;

    ctrl.active = $state.includes('*.*.edit.*');
    $scope.$on('$stateChangeSuccess', function() {
      ctrl.active = $state.includes('*.*.edit.*');
    });

    ctrl.mouseOver = function() {
      ctrl.hover = true;
    };

    ctrl.mouseLeave = function() {
      ctrl.hover = false;
    };

    ctrl.click = function() {
      $state.go(baseState + '.edit.basic', stateParams);
    }

  }


})();
