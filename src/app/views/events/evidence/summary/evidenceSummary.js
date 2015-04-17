(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .controller('EvidenceSummaryController', EvidenceSummaryController)
    .directive('evidenceSummary', function() {
      return {
        restrict: 'E',
        require: '^^entityView',
        scope: {},
        link: EvidenceSummaryLink,
        controller: 'EvidenceSummaryController',
        templateUrl: 'app/views/events/evidence/summary/evidenceSummary.tpl.html'
      }
    });

  function EvidenceSummaryLink(scope, element, attributes, entityView) {
    scope.ctrl = {};
    scope.ctrl.entityModel = entityView.entityModel;
  }

  //@ngInject
  function EvidenceSummaryController($scope) {
    var unwatch = $scope.$watch('ctrl.entityModel', function(entityModel){
      var config = entityModel.config;
      var ctrl = $scope.ctrl;
      ctrl.evidence = entityModel.data.entity;

      ctrl.styles = config.styles;

      ctrl.evidenceLevelLabels = {
        'A': 'Validated',
        'B': 'Clinical',
        'C': 'Preclinical',
        'D': 'Inferential'
      };



      //$scope.evidence.$promise.then(function() {
      //  $scope.evidence.evidenceLevelLabel = evidenceLevelLabels[$scope.evidence.evidence_level];
      //});

      // unbind watcher after first digest
      unwatch();
    }, true);

  }
})();
