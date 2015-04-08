(function() {
  angular.module('civic.events.genes')
    .controller('GeneSummaryController', GeneSummaryController)
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: function(scope, element, attributes, entityView) {
          scope.entityModel = entityView.entityModel;
        },
        controller: 'GeneSummaryController',
        templateUrl: 'app/views/events/genes/geneSummary.tpl.html'
      }
    });

  //@ngInject
  function GeneSummaryController($scope) {
    console.log('EntityTabsController instantiated.');
  }
})();
