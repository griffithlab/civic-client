(function() {
  'use strict';
  angular.module('civic.add')
    .controller('AddEvidenceViewCtrl', AddEvidenceViewCtrl);

  // @ngInject
  function AddEvidenceViewCtrl($scope, $stateParams, Evidence, _, $log) {
    $log.info('EvidenceViewCtrl loaded.');

    var addEvidenceView = $scope.addEvidenceView = {};

    // add evidence item
    addEvidenceView.add = function(evidenceItem) {
      $log.info('addEvidenceView.add() called.');
      // TODO switch to using entrez_id instead of geneId like the other gene related services
      Evidence.add({}, evidenceItem);
    };
  }
})();
