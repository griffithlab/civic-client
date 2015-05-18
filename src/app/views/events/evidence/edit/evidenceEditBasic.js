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
        { value: 'D', label: 'D - Inferential'},
        { value: 'E', label: 'E - n of 1'}
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
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: 'vm.evidenceEdit.name',
          helpText: 'Evidence Item Name is auto-generated.'
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 3,
          label: 'Description',
          value: 'vm.evidenceEdit.description',
          minLength: 32,
          helpText: 'Description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.'
        }
      },
      {
        key: 'disease',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease',
          value: 'vm.evidenceEdit.disease',
          minLength: 32,
          helpText: 'Enter the disease or subtype that is associated with this evidence statement. This should be a disease in the disease-ontology that carries a DOID (e.g., 1909 for melanoma). If the disease to be entered is not in the disease ontology, enter it as free text. '
        }
      },
      {
        key: 'doid',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'DOID',
          value: 'vm.evidenceEdit.doid',
          minLength: 8,
          length: 8,
          helpText: 'Disease Ontology ID of the specific disease or disease subtype associated with the evidence statement (e.g., 1909 for melanoma).'
        }
      },
      {
        key: 'pubmed_id',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.evidenceEdit.pubmed_id',
          minLength: 8,
          length: 8,
          helpText: 'PubMed ID for the publication associated with the evidence statement (e.g. 23463675)'
        }
      },
      {
        key: 'pubchem_id',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Pubchem Id',
          value: 'vm.evidenceEdit.pubchem_id',
          helpText: 'For predictive evidence, the PubChem ID for relevant drug (e.g., 44462760 for Dabrafenib).'
        }
      },
      {
        key: 'rating',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Rating',
          options: vm.formSelects.evidence_ratings,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Please rate your evidence according to the following scale, basing your subjective evaluation on the following guidelines: One Star: Claim is not supported well by experimental evidence. Results are not reproducible, or have very small sample size. No follow-up is done to validate novel claims. Two Stars: Evidence is not well supported by experimental data, and little follow-up data is available. Publication is from a journal with low academic impact. Experiments may lack proper controls, have small sample size, or are not statistically convincing. Three Stars: Evidence is convincing, but not supported by a breadth of experiments. May be smaller scale projects, or novel results without many follow-up experiments. Discrepancies from expected results are explained and not concerning. Four Stars: Strong, well supported evidence. Experiments are well controlled, and results are convincing. Any discrepancies from expected results are well-explained and not concerning. Five Stars: Strong, well supported evidence from a lab or journal with respected academic standing. Experiments are well controlled, and results are clean and reproducible across multiple replicates. Evidence confirmed using separate methods.'
        }
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.evidenceEdit.rating',
          options: vm.formSelects.evidence_levels,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Description of the study performed to produce the evidence statement'
        }
      },
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_type',
          options: vm.formSelects.evidence_types,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Type of clinical outcome associated with the evidence statement.'
        }
      },
      {
        key: 'evidence_direction',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_direction',
          options: vm.formSelects.evidence_directions,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'A indicator of whether the evidence statement supports or refutes the clinical significance of an event.'
        }
      },
      {
        key: 'clinical_significance',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Clinical Significance',
          value: 'vm.evidenceEdit.clinical_significance',
          options: vm.formSelects.clinical_significance,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, or diagnostic evidence types. If the variant was not associated with a positive or negative outcome, Not Applicable should be selected.'
        }
      },
      {
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.evidenceEdit.variant_origin',
          options: vm.formSelects.variant_origins,
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Origin of variant.'
        }
      },
      { template: '<hr/>'},
      {
        type: 'horizontalInputHelp',
        key: 'title',
        model: vm.evidenceEdit.comment,
        templateOptions: {
          label: 'Comment Title',
          value: 'title',
          helpText: 'Initial Revision Comment Title'
        }
      },
      {
        key: 'text',
        type: 'horizontalTextareaHelp',
        model: vm.evidenceEdit.comment,
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text',
          helpText: 'Initial Revision Comment Text'
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
