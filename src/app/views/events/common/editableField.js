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
  function EditableFieldController($scope, $log, _) {
    var ctrl = $scope.ctrl = {};
    var unwatch = $scope.$watch('entityModel', function(entityModel){
      ctrl.editState = entityModel.config.state.baseUrl + '.edit';
      ctrl.entityModel = entityModel;
      unwatch();
    });

    ctrl.mouseOver = function() {
      ctrl.hover = true;
    };

    ctrl.mouseLeave = function() {
      ctrl.hover = false;
    }
  }


})();
