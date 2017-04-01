(function() {
  'use strict';
  angular.module('civic.events.common')
    .controller('EditableFieldFlagController', EditableFieldFlagController)
    .directive('editableFieldFlag', editableFieldFlag);

  // @ngInject
  function editableFieldFlag() {

    return {
      restrict: 'A',
      scope: {
        flag: '=',
        submit: '=',
        resolve: '='
      },
      controller: 'EditableFieldFlagController',
      templateUrl: 'app/views/events/common/editableFieldFlag.tpl.html'
    };
  }

  // @ngInject
  function EditableFieldFlagController($scope, $state, _, Security) {
    var ctrl = $scope.ctrl = {};
    console.log('editable field flag controller called. ----------------');
  }
})();
