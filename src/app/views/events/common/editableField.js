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
      scope: false,
      controller: 'EditableFieldController',
      link: editableFieldLink,
      templateUrl: 'app/views/events/common/editableField.tpl.html'
    }
  }

  // @ngInject
  function editableFieldLink(scope, element, attrs) {
    console.log('editableFieldLink fn called.');
  }

  // @ngInject
  function EditableFieldController($scope) {
    console.log('EditableFieldController fn called.');

    // check for entityModel on scope
    if(!$scope.entityModel) {
      console.warn('editable-field directive requires an entityModel to work!');
    }

    var ctrl = $scope.ctrl;
    ctrl.mouseOver = function() {
      ctrl.hover = true;
    };

    ctrl.mouseLeave = function() {
      ctrl.hover = false;
    }
  }


})();
