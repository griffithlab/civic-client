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

    var formSelects = $scope.formSelects = {
      evidence_levels: [
        { name: 'A', label: 'Validated'},
        { name: 'B', label: 'Clinical'},
        { name: 'C', label: 'Preclinical'},
        { name: 'D', label: 'Inferential'}
      ],
      evidence_ratings: [
        { id: 1, name: 'One Star', label: 'Really Crappy'},
        { id: 2, name: 'Two Stars', label: 'Pretty Crappy'},
        { id: 3, name: 'Three Stars', label: 'Just OK'},
        { id: 4, name: 'Four Stars', label: 'Not Bad'},
        { id: 5, name: 'Five Stars', label: 'Outstanding'}
      ],
      clinical_significance: [
        { id: 1, name: 'Positive' },
        { id: 2, name: 'Better Outcome' },
        { id: 3, name: 'Sensitivity' },
        { id: 4, name: 'Resistance or Non-Response' },
        { id: 5, name: 'Poor Outcome' },
        { id: 6, name: 'Negative' },
        { id: 7, name: 'N/A' }
      ],
      evidence_types: [
        { name: 'Predictive' },
        { name: 'Diagnostic' },
        { name: 'Prognostic' }
      ],
      evidence_direction: [
        { name: 'Supports' },
        { name: 'Does Not Support' }
      ],
      variant_origins: [
        { name: 'somatic'},
        { name: 'germline' }
      ]
    };

    $scope.formSelectsConfig = {
      clinical_significance: {
        mode: 'id',
        id: 'name',
        text: 'name',
        options: formSelects.clinical_significance
      }
    };

    var formConfig = $scope.formConfig = {
      validations: {
        evidenceItem: {
          entrez_id: {
            required: true
          },
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
          variant_name: {
            required: true
          },
          text: {
            required: true
          },
          //clinical_significance: {
          //  required: false
          //},
          evidence_direction: {
            required: false
          },
          evidence_type: {
            required: false
          },
          evidence_level: {
            required: false
          }
        }
      }
    };

    var comment = $scope.comment = {
      title: '',
      text: ''
    };

    $scope.submit = function() {
      $log.info('addEvidenceForm.submit() called.');
      $scope.addEvidence({ evidenceItem: evidenceItem, comment:comment })
        .then(function(response) { // success
          $log.success('Evidence item successfully added.')('Evidence item successfully submitted.', {ttl:0, allowHtml: true });
          $scope.addEvidenceForm.$aaFormExtensions.$resetChanged();
        }, function(response) { // fail
          $log.error('Evidence item failed to be added!');
          aaNotify.error('Your update failed to to be submitted.', {ttl:0, allowHtml: true });
        });
    }
  }
})();
