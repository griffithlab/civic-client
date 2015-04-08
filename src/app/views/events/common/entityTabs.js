(function() {
  angular.module('civic.events.common')
    .controller('EntityTabsController', EntityTabsController)
    .directive('entityTabs', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        //transclude: true,
        link: function(scope, element, attributes, entityView) {
          scope.entityModel = entityView.entityModel;
        },
        controller: 'EntityTabsController',
        templateUrl: 'app/views/events/common/entityTabs.tpl.html'
      }
    });

  //@ngInject
  function EntityTabsController($scope) {
    console.log('EntityTabsController instantiated.');
  }
})();
