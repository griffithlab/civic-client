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
        entityModel: '='
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

    var unwatch = $scope.$watch('entityModel', function(entityModel){
      baseState  = entityModel.config.state.baseState;
      stateParams = entityModel.config.state.params;
      ctrl.editState = entityModel.config.state.baseUrl + '.edit';
      ctrl.entityModel = entityModel;
      unwatch();
    });

    //$scope.$watch('baseState', function() {
    //  if (state === ctrl.baseState + '.edit') {
    //    ctrl.active = true;
    //  }
    //});

    ctrl.mouseOver = function() {
      ctrl.hover = true;
    };

    ctrl.mouseLeave = function() {
      ctrl.hover = false;
    };

    ctrl.click = function() {
      $state.go(baseState + '.edit', stateParams);
    }

  }


})();
