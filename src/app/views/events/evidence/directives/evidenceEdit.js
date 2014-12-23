(function() {
  'use strict';
  angular.module('civic.events')
    .directive('evidenceEdit', evidenceEdit)
    .controller('EvidenceEditCtrl', EvidenceEditCtrl);

// @ngInject
  function evidenceEdit() {
    var directive = {
      restrict: 'E',
      replace: true,
      controller: 'EvidenceEditCtrl',
      templateUrl: 'app/views/events/evidence/directives/evidenceEdit.tpl.html',
      link: /* ngInject */ function() {
        console.log('evidenceEdit linked.==-=-=-=-=-=-=-=-=-=-=');
      }
    };

    return directive;
  }

  // @ngInject
  function EvidenceEditCtrl($scope, $stateParams, Evidence, _) {

  }
})();
