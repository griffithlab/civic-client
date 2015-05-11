(function() {
  'use strict';
  angular.module('civic.events.common')
    .directive('diffDescription', diffDescriptionDirective)
    .controller('DiffDescriptionController', DiffDescriptionController);

  // @ngInject
  function diffDescriptionDirective() {
    return {
      restrict: 'E',
      scope: {
        diff: '='
      },
      templateUrl: 'app/views/events/common/diffs/description.tpl.html',
      controller: 'DiffDescriptionController'
    }
  }

  // @ngInject
  function DiffDescriptionController($scope) {
    var vm = $scope.vm = {};
  }

})();
