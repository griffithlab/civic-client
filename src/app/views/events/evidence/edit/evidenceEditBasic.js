(function() {
  'use strict';
  angular.module('civic.events.evidence')
    .directive('evidenceEditBasic', evidenceEditBasicDirective)
    .controller('EvidenceEditBasicController', EvidenceEditBasicController);

  // @ngInject
  function evidenceEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'EvidenceEditBasicController',
      templateUrl: 'app/views/events/evidence/edit/evidenceEditBasic.tpl.html'
    }
  }

  // @ngInject
  function EvidenceEditBasicController($scope,
                                   Security,
                                   EvidenceRevisions,
                                   Evidence,
                                   EvidenceHistory,
                                   EvidenceViewOptions,
                                   formConfig) {
    var evidenceModel, vm;

    vm = $scope.vm = {};
    evidenceModel = vm.evidenceModel = Evidence;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.evidence = Evidence.data.item;
    vm.evidenceRevisions = EvidenceRevisions;
    vm.evidenceHistory = EvidenceHistory;
    vm.evidenceEdit = angular.copy(vm.evidence);
    vm.evidenceEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };

    vm.styles = EvidenceViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.formSelects = {
      evidence_levels: [
        { value: 'A', label: 'A - Validated'},
        { value: 'B', label: 'B - Clinical'},
        { value: 'C', label: 'C - Preclinical'},
        { value: 'D', label: 'D - Inferential'}
      ],
      evidence_ratings: [
        { value: 1, label: '1 - Poor' },
        { value: 2, label: '2 - Adequate' },
        { value: 3, label: '3 - Average' },
        { value: 4, label: '4 - Good' },
        { value: 5, label: '5 - Excellent'}
      ],
      clinical_significance: [
        { value: 'Positive', label: 'Positive' },
        { value: 'Better Outcome', label: 'Better Outcome' },
        { value: 'Sensitivity', label: 'Sensitivity' },
        { value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
        { value: 'Poor Outcome', label: 'Poor Outcome' },
        { value: 'Negative', label: 'Negative' },
        { value: 'N/A', label: 'N/A' }
      ],
      evidence_types: [
        { value: 'Predictive', label: 'Predictive' },
        { value: 'Diagnostic', label: 'Diagnostic' },
        { value: 'Prognostic', label: 'Prognostic' }
      ],
      evidence_directions: [
        { value: 'Supports', label: 'Supports'},
        { value: 'Does Not Support', label: 'Does Not Support' }
      ],
      variant_origins: [
        { value: 'Somatic', label: 'Somatic'},
        { value: 'Germline', label: 'Germline' }
      ]
    };

    vm.evidenceFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: 'vm.evidenceEdit.name'
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 3,
          label: 'Description',
          value: 'vm.evidenceEdit.description',
          minLength: 32
        }
      },
      {
        key: 'disease',
        type: 'input',
        templateOptions: {
          label: 'Disease',
          value: 'vm.evidenceEdit.disease',
          minLength: 32
        }
      },
      {
        key: 'doid',
        type: 'input',
        templateOptions: {
          label: 'DOID',
          value: 'vm.evidenceEdit.doid',
          minLength: 8,
          length: 8
        }
      },
      {
        key: 'pubmed_id',
        type: 'input',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.evidenceEdit.pubmed_id',
          minLength: 8,
          length: 8
        }
      },
      {
        key: 'drugs',
        type: 'input',
        templateOptions: {
          label: 'Drugs',
          value: 'vm.evidenceEdit.drugs',
          disabled: true
        }
      },
      {
        key: 'rating',
        type: 'select',
        templateOptions: {
          label: 'Rating',
          options: vm.formSelects.evidence_ratings,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_level',
        type: 'select',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.evidenceEdit.rating',
          options: vm.formSelects.evidence_levels,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_type',
        type: 'select',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_type',
          options: vm.formSelects.evidence_types,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'evidence_direction',
        type: 'select',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_direction',
          options: vm.formSelects.evidence_directions,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'clinical_significance',
        type: 'select',
        templateOptions: {
          label: 'Clinical Significance',
          value: 'vm.evidenceEdit.clinical_significance',
          options: vm.formSelects.clinical_significance,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      {
        key: 'variant_origin',
        type: 'select',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.evidenceEdit.variant_origin',
          options: vm.formSelects.variant_origins,
          valueProp: 'value',
          labelProp: 'label'
        }
      },
      { template: '<hr/>'},
      {
        type: 'input',
        key: 'title',
        model: vm.evidenceEdit.comment,
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        key: 'text',
        type: 'textarea',
        model: vm.evidenceEdit.comment,
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];



    vm.submit = function(evidenceEdit, options) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      EvidenceRevisions.submitRevision(evidenceEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.formMessages['submitSuccess'] = true;
          // options.resetModel();
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.apply = function(evidenceEdit, options) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Evidence.apply(evidenceEdit)
        .then(function(response) {
          console.log('revision appy success!');
          vm.formMessages['applySuccess'] = true;
          // options.resetModel();
        })
        .catch(function(response) {
          console.error('revision application error!');
          vm.formErrors[response.status] = true;
        })
        .finally(function(){
          console.log('revision apply done!');
        });
    };
  }
})();
