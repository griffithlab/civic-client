(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneTalkLogController', GeneTalkLogController)
    .directive('geneTalkLog', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        controller: 'GeneTalkLogController',
        link: geneTalkLogLink,
        templateUrl: 'app/views/events/genes/summary/geneTalkLog.tpl.html'
      }
    });

  function geneTalkLogLink(scope, element, attributes, entityView) {
    scope.geneModel = entityView.entityModel;
  }

  //@ngInject
  function GeneTalkLogController($scope) {
    var ctrl = $scope.ctrl = {};
    $scope.geneModel = {};

    var unwatch = $scope.$watchCollection('geneModel', function(geneModel) {

      unwatch();
    });
  }
})();
