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
    };
  }

  // @ngInject
  function EvidenceEditBasicController($scope,
                                       $stateParams,
                                       Security,
                                       EvidenceRevisions,
                                       Evidence,
                                       EvidenceHistory,
                                       EvidenceViewOptions,
                                       formConfig,
                                       _) {

    var vm = $scope.vm = {};

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.evidence = Evidence.data.item;
    vm.evidenceRevisions = EvidenceRevisions;
    vm.evidenceHistory = EvidenceHistory;
    vm.evidenceEdit = angular.copy(vm.evidence);
    vm.evidenceEdit.comment = { title: 'Evidence EID' + vm.evidence.id + ' Revision Description', text:'' };
    vm.evidenceEdit.drugs = _.filter(_.pluck(vm.evidence.drugs, 'name'), function(name){ return name !== 'N/A'; });
    vm.styles = EvidenceViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;
    vm.newRevisionId = Number();
    vm.stateParams = $stateParams;

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.evidenceFields = [
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: '', label: 'Please select an Evidence Type' },
            { value: 'Predictive', label: 'Predictive' },
            { value: 'Diagnostic', label: 'Diagnostic' },
            { value: 'Prognostic', label: 'Prognostic' }
          ],
          onChange: function(value, options, scope) {
            scope.model.clinical_significance = '';
            console.log('evidence_type changed.');
          },
          helpText: 'Type of clinical outcome associated with the evidence statement.'
        }
      },
      {
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.evidenceEdit.variant_origin',
          options: [
            { value: '', label: 'Please select a Variant Origin' },
            { value: 'Somatic', label: 'Somatic'},
            { value: 'Germline', label: 'Germline' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Origin of variant'
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
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          label: 'Description',
          value: 'vm.evidenceEdit.description',
          minLength: 32,
          helpText: 'Description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.'
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
        key: 'drugs',
        type: 'multiInput',
        templateOptions: {
          label: 'Drug Names',
          inputOptions: {
            type: 'input'
          },
          helpText: 'For predictive evidence, specify one or more drug names. Drugs specified must possess a PubChem ID (e.g., 44462760 for Dabrafenib).'
        },
        expressionProperties: {
          'hide': function($viewValue, $modelValue, scope) {
            return  scope.model.evidence_type !== 'Predictive';
          }
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.evidenceEdit.rating',
          options: [
            { value: '', label: 'Please select an Evidence Level' },
            { value: 'A', label: 'A - Validated'},
            { value: 'B', label: 'B - Clinical'},
            { value: 'C', label: 'C - Preclinical'},
            { value: 'D', label: 'D - Case Study'},
            { value: 'E', label: 'E - Inferential'}
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Description of the study performed to produce the evidence statement'
        }
      },
      {
        key: 'rating',
        type: 'horizontalRatingHelp',
        templateOptions: {
          label: 'Rating',
          options: [
            { value: '', label: 'Please select an Evidence Rating' },
            { value: 1, label: '1 - Poor<br/>Claim is not supported well by experimental evidence. Results are not reproducible, or have very small sample size. No follow-up is done to validate novel claims.' },
            { value: 2, label: '2 - Adequate<br/>Evidence is not well supported by experimental data, and little follow-up data is available. Publication is from a journal with low academic impact. Experiments may lack proper controls, have small sample size, or are not statistically convincing.' },
            { value: 3, label: '3 - Average<br/>Evidence is convincing, but not supported by a breadth of experiments. May be smaller scale projects, or novel results without many follow-up experiments. Discrepancies from expected results are explained and not concerning.' },
            { value: 4, label: '4 - Good<br/>Strong, well supported evidence. Experiments are well controlled, and results are convincing. Any discrepancies from expected results are well-explained and not concerning.' },
            { value: 5, label: '5 - Excellent<br/>Strong, well supported evidence from a lab or journal with respected academic standing. Experiments are well controlled, and results are clean and reproducible across multiple replicates. Evidence confirmed using separate methods.'}
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: '<p>Please rate your evidence on a scale of one to five stars. Use the star rating descriptions for guidance.</p>'
        }
      },
      {
        key: 'evidence_direction',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Direction',
          value: 'vm.evidenceEdit.evidence_direction',
          options: [
            { value: '', label: 'Please select an Evidence Direction' },
            { value: 'Supports', label: 'Supports'},
            { value: 'Does Not Support', label: 'Does Not Support' }
          ],
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
          clinicalSignificanceOptions: [
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, or diagnostic evidence types. If the variant was not associated with a positive or negative outcome, N/A/ should be selected.'
        },
        expressionProperties: {
          'templateOptions.options': function($viewValue, $modelValue, scope) {
            return  _.filter(scope.to.clinicalSignificanceOptions, function(option) {
              return !!(option.type === scope.model.evidence_type || option.type === 'default' || option.type === 'N/A');
            });
          }
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'text',
        type: 'horizontalTextareaHelp',
        model: vm.evidenceEdit.comment,
        templateOptions: {
          rows: 5,
          label: 'New Evidence Description',
          value: 'text',
          helpText: 'Please provide a short paragraph that supports the inclusion of this evidence item into the CIViC database.'
        }
      }
    ];

    vm.submit = function(evidenceEdit) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};

      EvidenceRevisions.submitRevision(evidenceEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.newRevisionId = response.id;
          vm.formMessages.submitSuccess = true;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.showInstructions = false;
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.apply = function(evidenceEdit) {
      evidenceEdit.evidenceId = evidenceEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Evidence.apply(evidenceEdit)
        .then(function() {
          console.log('revision appy success!');
          vm.formMessages.applySuccess = true;
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
