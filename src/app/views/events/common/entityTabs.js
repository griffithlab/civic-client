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
    scope.entityModel = entityView.entityModel;
  }

  //@ngInject
  function EntityTabsController($scope, $state) {
    console.log('EntityTabsController instantiated.');
    var ctrl,
      model;

    ctrl = $scope.ctrl = {};
    model = $scope.entityModel;

    ctrl.tabClick = function(dest) {
      var state,
        params;
      state = $state.current.name + '.' + dest;
      params = { geneId: 238 };

      $state.go(state, params);
    };
  }
})();
