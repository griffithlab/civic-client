(function() {
  angular.module('civic.events.common', [])
    .controller('EntityTabsController', EntityTabsController)
    .directive('entityTabs', function() {
      return {
        restrict: 'E',
        scope: {},
        //transclude: true,
        controller: 'EntityTabsController',
        templateUrl: 'app/views/events/common/entityTabs.tpl.html'
      }
    });

  //@ngInject
  function EntityTabsController($scope, $element) {
    console.log('EntityTabsController instantiated.');
  }
})();
