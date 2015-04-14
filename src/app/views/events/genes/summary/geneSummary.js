(function() {
  'use strict';
  angular.module('civic.events.genes')
    .controller('GeneSummaryController', GeneSummaryController)
    .directive('geneSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: GeneSummaryLink,
        controller: 'GeneSummaryController',
        templateUrl: 'app/views/events/genes/summary/geneSummary.tpl.html'
      }
    });

  function GeneSummaryLink(scope, element, attributes, entityView) {
    scope.ctrl = {};
    scope.ctrl.entityModel = entityView.entityModel;
  }

  //@ngInject
  function GeneSummaryController($scope) {
    var unwatch = $scope.$watch('ctrl.entityModel', function(entityModel){
      var config = entityModel.config;
      var ctrl = $scope.ctrl;
      ctrl.gene = entityModel.data.entity;
      ctrl.myGeneInfo = entityModel.data.myGeneInfo;
      ctrl.variants = entityModel.data.variants;
      ctrl.variantGroups = entityModel.data.variantGroups;
      ctrl.variantMenuOptions = {
        styles: config.styles.variantMenu,
        state: config.state
      };
      // unbind watcher after first digest
      unwatch();
    }, true);
  }
})();

//backgroundColor: '#CDCDCD',
//  variantHeaderColor: '#4b2065',
//  baseState: ctrl.entityModel.config.baseState,
//  baseUrl: ctrl.entityModel.config.baseUrl
