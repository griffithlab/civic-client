(function() {
  angular.module('civic.events.common', [])
    .controller('EntityViewController', EntityViewController)
    .directive('entityView', function() {
      return {
        restrict: 'E',
        transclude: true,
        controller: function($scope) {
          console.log('EntityViewController instantiated.');
          $scope.marco = function() {
            return 'polo';
          };
        },
        templateUrl: 'app/views/events/common/entityView.tpl.html'
      }
    });

  //@ngInject
  function EntityViewController($scope, $element) {
    console.log('EntityViewController instantiated.');
  }
})();
