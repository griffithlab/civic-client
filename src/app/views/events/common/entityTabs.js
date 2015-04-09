(function() {
  angular.module('civic.events.common')
    .controller('EntityTabsController', EntityTabsController)
    .directive('entityTabs', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: EntityTabsLink,
        controller: 'EntityTabsController',
        templateUrl: 'app/views/events/common/entityTabs.tpl.html'
      }
    });

  function EntityTabsLink(scope, element, attributes, entityView) {
    scope.ctrl = {};
    scope.ctrl.entityModel = entityView.entityModel;
  }

  //@ngInject
  function EntityTabsController($scope, $state) {
    // we don't have access to $scope.ctrl.model until after the linking
    // function runs, so we need to watch for its initialization then
    // generate various template resources
    var unbindModelWatch = $scope.$watch('ctrl.entityModel', function(entityModel) {
      var ctrl = $scope.ctrl;
      var config = entityModel.config;
      var state = entityModel.config.state;

      ctrl.type = config.type;
      ctrl.name = config.name;
      ctrl.baseUrl = state.baseUrl;

      // we only want this watch to execute once
       unbindModelWatch();
    }, true); // use objectEquality
  }
})();
