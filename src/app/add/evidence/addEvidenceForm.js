(function() {
  'use strict';
  angular.module('civic.add')
    .directive('addEvidenceForm', addEvidenceForm)
    .controller('AddEvidenceFormCtrl', AddEvidenceFormCtrl);

// @ngInject
  function addEvidenceForm(Security) {
    var directive = {
      restrict: 'E',
      scope: {
        addEvidence: '&addEvidence'
      },
      templateUrl: 'app/add/evidence/addEvidenceForm.tpl.html',
      controller: 'AddEvidenceFormCtrl',
      link: /* ngInject */ function ($scope) {
        $scope.isAuthenticated = Security.isAuthenticated;
        $scope.isAdmin = Security.isAdmin;
      }
    };

    return directive;
  }

  // @ngInject
  function AddEvidenceFormCtrl($scope, _, aaNotify, $log) {
    $log.info('EvidenceEditFormCtrl loaded.');

    var evidenceItem = $scope.evidenceItem = {};

    var formConfig = $scope.formConfig = {
      validations: {
        doid: {
          required: true,
          'ng-minlength': 3
        },
        pubchem_id: {
          required: true
        },
        pubmed_id: {
          required: true
        },
        entrez_id: {
          required: true
        },
        variant_name: {
          required: true
        }
      }
    };

    var comment = $scope.comment = {
      title: '',
      text: ''
    };

    $scope.submit = function() {
      $log.info('addEvidenceForm.submit() called.');
      $scope.addEvidence({ evidenceItem: evidenceItem })
        .then(function(response) { // success
          $log.info('Evidence item successfully added.');
          aaNotify.error('Evidence item successfully submitted.', {ttl:0, allowHtml: true });
        }, function(response) { // fail
          $log.error('Evidence item failed to be added!');
          aaNotify.error('Your update failed to to be submitted.', {ttl:0, allowHtml: true });
        });
    }
  }
})();
