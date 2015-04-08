(function() {
  angular.module('civic.events.common', [])
    .controller('EntityViewController', EntityViewController)
    .directive('entityView', function() {
      return {
        restrict: 'E',
        transclude: true,
        controller: function() {
          console.log('EntityViewController instantiated.');
        },
        templateUrl: 'app/views/events/common/entityView.tpl.html'
      }
    });

  //@ngInject
  function EntityViewController($scope, $element) {
    console.log('EntityViewController instantiated.');
  }
})();
