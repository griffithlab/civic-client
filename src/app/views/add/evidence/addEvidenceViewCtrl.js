(function() {
  'use strict';
  angular.module('civic.add')
    .controller('AddEvidenceViewCtrl', AddEvidenceViewCtrl);

  // @ngInject
  function AddEvidenceViewCtrl($scope, $stateParams, Evidence, _, $log) {
    $log.info('EvidenceViewCtrl loaded.');

    var addEvidenceView = $scope.addEvidenceView = {};

    // add evidence item
    addEvidenceView.addEvidence = function(evidenceItem, comment) {
      $log.info('addEvidenceView.add() called.');
      evidenceItem.comment = comment;
      return Evidence.add({}, evidenceItem).$promise;
    };
  }
})();
