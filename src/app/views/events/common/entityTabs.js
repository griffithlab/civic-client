(function() {
  angular.module('civic.events.common')
    .controller('EntityTabsController', EntityTabsController)
    .directive('entityTabs', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: function(scope, element, attributes, entityView) {
          scope.entityModel = entityView.entityModel;
        },
        controller: 'EntityTabsController',
        templateUrl: 'app/views/events/common/entityTabs.tpl.html'
      }
    });

  //@ngInject
  function EntityTabsController($scope, $state) {
    console.log('EntityTabsController instantiated.');
    //var entityModel = $scope.entityModel;
    //var type = entityModel.config.type;
    //
    //var ctrl = $scope.ctrl;
    //ctrl.summarySref = '';

  }
})();
