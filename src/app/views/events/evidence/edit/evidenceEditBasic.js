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
                                       $q,
                                       Publications,
                                       PubchemTypeahead,
                                       Diseases,
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
        wrapper: 'attributeDefinition',
        controller: function($scope) {
          // set attribute definition
          $scope.options.templateOptions.data.attributeDefinition =
            $scope.options.templateOptions.data.attributeDefinitions[$scope.model.evidence_type];
        },
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.evidenceEdit.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { value: '', label: 'Please select an Evidence Type' },
            { value: 'Predictive', label: 'Predictive' },
            { value: 'Diagnostic', label: 'Diagnostic' },
            { value: 'Prognostic', label: 'Prognostic' }
          ],
          onChange: function(value, options, scope) {
            // reset clinical_significance, as its options will change
            scope.model.clinical_significance = '';

            // if we're switching to Predictive, seed the drugs array w/ a blank entry,
            // otherwise set to empty array
            value === 'Predictive' ? scope.model.drugs = [''] : scope.model.drugs = [];

            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];

            // update evidence direction attribute definition
            var edField = _.find(scope.fields, { key: 'evidence_direction'});
            if (edField.value() !== '') { // only update if user has selected an option
              edField.templateOptions.data.updateDefinition(null, edField, scope);
            }
          },
          helpText: 'Type of clinical outcome associated with the evidence statement.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Predictive': 'Evidence pertains to a variant\'s effect on therapeutic response',
              'Diagnostic': 'Evidence pertains to a variant\'s impact on patient diagnosis',
              'Prognostic': 'Evidence pertains to a variant\'s impact on disease progression, severity, or patient survival'
            }
          }
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
        key: 'doid',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['loader', 'diseasedisplay', 'validationMessages'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.evidenceEdit.doid',
          required: true,
          minLength: 32,
          helpText: 'Please enter a disease name. If you are unable to locate the disease in the dropdown, please check the \'Could not find disease\' checkbox below and enter the disease in the field that appears.',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.doid = $model.doid',
          templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',
          data: {
            doid: '--',
            typeaheadSearch: function(val) {
              return Diseases.beginsWith(val)
                .then(function(response) {
                  return response;
                });
            }
          }
        }
      },
      {
        key: 'disease',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease Name',
          value: 'vm.evidenceEdit.disease',
          minLength: 32,
          helpText: 'If the disease has no DOID, enter its name here.'
        },
        hideExpression: '!model.noDoid'
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          label: 'Evidence Statement',
          value: 'vm.evidenceEdit.description',
          minLength: 32,
          helpText: 'Description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.'
        }
      },
      {
        key: 'pubmed_id',
        type: 'publication',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.evidenceEdit.pubmed_id',
          minLength: 1,
          required: true,
          data: {
            description: '--'
          },
          helpText: 'PubMed ID for the publication associated with the evidence statement (e.g. 23463675)'
        },
        modelOptions: {
          updateOn: 'default blur',
          allowInvalid: false,
          debounce: {
            default: 300,
            blur: 0
          }
        },
        validators: {
          validPubmedId: {
            expression: function($viewValue, $modelValue, scope) {
              if ($viewValue.length > 0) {
                var deferred = $q.defer();
                scope.options.templateOptions.loading = true;
                Publications.verify($viewValue).then(
                  function (response) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.description = response.description;
                    deferred.resolve(response);
                  },
                  function (error) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.description = '--';
                    deferred.reject(error);
                  }
                );
                return deferred.promise;
              } else {
                scope.options.templateOptions.data.description = '--';
                return true;
              }
            },
            message: '"This does not appear to be a valid Pubmed ID."'
          }
        }
      },
      {
        key: 'drugs',
        type: 'multiInput',
        templateOptions: {
          label: 'Drug Names',
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              inputFormatter: 'model[options.key]',
              typeahead: 'item.name for item in options.data.typeaheadSearch($viewValue)',
              // focus: true,
              onSelect: 'options.data.pushNew(model, index)'
            },
            data: {
              pushNew: function(model, index) {
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                return PubchemTypeahead.get(val)
                  .then(function(response) {
                    return _.map(response.autocp_array, function(drugname) {
                      return { name: drugname };
                    });
                  });
              }
            }
          },
          helpText: 'For predictive evidence, specify one or more drug names. Drugs specified must possess a PubChem ID (e.g., 44462760 for Dabrafenib).'
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return  scope.model.evidence_type !== 'Predictive';
        }
      },
      {
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Drug Names',
          placeholder: 'N/A',
          disabled: true,
          helpText: 'Drug names are only applicable for Predictive evidence.'
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return scope.model.evidence_type === 'Predictive';
        }
      },
      {
        template: '<hr/>'
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: function($scope) {
          // set attribute definition
          $scope.options.templateOptions.data.attributeDefinition =
            $scope.options.templateOptions.data.attributeDefinitions[$scope.model.evidence_level];
        },
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
          helpText: 'Type of study performed to produce the evidence statement',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              A: 'Proven/consensus association in human medicine',
              B: 'Clinical trial or other primary patient data supports association',
              C: 'In vivo or in vitro models support association',
              D: 'Individual case reports from clinical journals',
              E: 'Indirect evidence'
            }
          },
          onChange: function(value, options, scope) {
            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }

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
        wrapper: 'attributeDefinition',
        controller: function($scope) {
          // set attribute definition
          $scope.options.templateOptions.data.attributeDefinition =
            $scope.options.templateOptions.data.attributeDefinitions[$scope.model.evidence_type][$scope.model.evidence_direction];
        },
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
          helpText: 'A indicator of whether the evidence statement supports or refutes the clinical significance of an event. Evidence Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Predictive': {
                'Supports': 'The experiment or study supports this variant\'s response to a drug',
                'Does Not Support': 'The experiment or study does not support, or was inconclusive of an interaction between the variant and a drug'
              },
              'Diagnostic': {
                'Supports': 'The experiment or study supports variant\'s impact on the diagnosis of disease or subtype',
                'Does Not Support': 'The experiment or study does not support the variant\'s impact on diagnosis of disease or subtype'
              },
              'Prognostic': {
                'Supports': 'The experiment or study supports a variant\'s impact on prognostic outcome',
                'Does Not Support': 'The experiment or study does not support a prognostic association between variant and outcome'
              }
            },
            updateDefinition: function(value, options, scope) {
              // set attribute definition
              options.templateOptions.data.attributeDefinition =
                options.templateOptions.data.attributeDefinitions[scope.model.evidence_type][scope.model.evidence_direction];
            }
          },
          onChange: function(value, options, scope) {
            options.templateOptions.data.updateDefinition(value, options, scope);
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.evidence_type === ""' // deactivate if evidence_type unselected
        }
      },
      {
        key: 'clinical_significance',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: function($scope) {
          // set attribute definition
          $scope.options.templateOptions.data.attributeDefinition =
            $scope.options.templateOptions.data.attributeDefinitions[$scope.model.clinical_significance];
        },
        templateOptions: {
          label: 'Clinical Significance',
          required: true,
          value: 'vm.evidenceEdit.clinical_significance',
          clinicalSignificanceOptions: [ // stores unmodified options array for expressionProperties
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
          options: [ // acutal options displayed in the select, modified by expressionProperties
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, or diagnostic evidence types. If the variant was not associated with a positive or negative outcome, N/A/ should be selected. Evidence Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Sensitivity': 'Subject exhibits response to drug treatment',
              'Resistance or Non-Response': 'Subject exhibits a lack of response or active resistance to drug treatment',
              'Better Outcome': 'Demonstrates better than expected clinical outcome',
              'Poor Outcome': 'Demonstrates worse than expected clinical outcome',
              'Positive': 'Associated with diagnosis of disease or subtype',
              'Negative': 'Associated with lack of disease or subtype',
              'N/A': 'Not applicable'
            },
            updateDefinition: function(value, options, scope) {
              // set attribute definition
              options.templateOptions.data.attributeDefinition =
                options.templateOptions.data.attributeDefinitions[scope.model.clinical_significance];
            }
          },
          onChange: function(value, options, scope) {
            options.templateOptions.data.updateDefinition(value, options, scope);
          }
        },
        expressionProperties: {
          'templateOptions.options': function($viewValue, $modelValue, scope) {
            return  _.filter(scope.to.clinicalSignificanceOptions, function(option) {
              return !!(option.type === scope.model.evidence_type || option.type === 'default' || option.type === 'N/A');
            });
          },
          'templateOptions.disabled': 'model.evidence_type === ""' // deactivate if evidence_type unselected
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
      evidenceEdit.doid = evidenceEdit.doid.doid; // replace disease obj with DOID string
      evidenceEdit.drugs = _.without(evidenceEdit.drugs, ''); // delete blank input values
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
      evidenceEdit.drugs = _.without(evidenceEdit.drugs, '');
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
