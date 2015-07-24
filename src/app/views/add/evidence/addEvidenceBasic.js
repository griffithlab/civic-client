(function() {
  'use strict';
  angular.module('civic.add.evidence')
    .directive('addEvidenceBasic', addEvidenceBasicDirective)
    .controller('AddEvidenceBasicController', AddEvidenceBasicController);

  // @ngInject
  function addEvidenceBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'app/views/add/evidence/addEvidenceBasic.tpl.html',
      controller: 'AddEvidenceBasicController'
    };
  }

  // @ngInject
  function AddEvidenceBasicController($scope,
                                      $q,
                                      Security,
                                      Evidence,
                                      Genes,
                                      Publications,
                                      Diseases,
                                      Datatables,
                                      PubchemTypeahead,
                                      AddEvidenceViewOptions,
                                      formConfig,
                                      _) {
    var vm = $scope.vm = {};

    vm.evidenceModel = Evidence;
    vm.evidenceOptions = AddEvidenceViewOptions;

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.newEvidence = {
      entrez_id: '',
      variant_name: '',
      description: '',
      disease: '',
      noDoid: false,
      doid: '',
      pubmed_id: '',
      //pubchem_id: '',
      drugs: [],
      rating: '',
      evidence_level: '',
      evidence_type: '',
      evidence_direction: '',
      clinical_significance: '',
      variant_origin: ''
    };

    //vm.newEvidence = {
    //  entrez_id: '673',
    //  variant_name: 'V600E',
    //  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vehicula sed lorem et cursus. In hac habitasse platea dictumst. Sed rhoncus, enim iaculis malesuada scelerisque, quam tortor porttitor tortor, id blandit tellus libero et lectus. Vestibulum nec purus eget purus suscipit ultricies non in dui.',
    //  disease: 'Breast Cancer',
    //  doid: '3908',
    //  pubmed_id: '20979473',
    //  drugs: [],
    //  rating: 4,
    //  evidence_level: 'C',
    //  evidence_type: 'Predictive',
    //  evidence_direction: 'Supports',
    //  clinical_significance: 'Positive',
    //  variant_origin: 'Somatic'
    //};

    vm.newEvidence.comment = { title: 'Additional Comments', text:'' };
    vm.newEvidence.drugs  = [];

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.evidenceFields = [
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { type: 'default', value: '', label: 'Please select an Evidence Type' },
            { value: 'Predictive', label: 'Predictive' },
            { value: 'Diagnostic', label: 'Diagnostic' },
            { value: 'Prognostic', label: 'Prognostic' }
          ],
          onChange: function(value, options, scope) {
            // need to reset clinical_significance on change
            scope.model.clinical_significance = '';
            // if we're switching to Predictive, seed the drugs array w/ a blank entry,
            // otherwise set to empty array
            value === 'Predictive' ? scope.model.drugs = [''] : scope.model.drugs = [];
          },
          helpText: 'Type of clinical outcome associated with the evidence statement.'
        }
      },
      {
        key: 'entrez_id',
        type: 'gene',
        templateOptions: {
          label: 'Gene Entrez ID',
          value: 'vm.newEvidence.entrez_id',
          minLength: 32,
          required: true,
          data: {
            name: '--'
          },
          helpText: 'Entrez Gene ID (e.g., 673 for BRAF)'
        },
        modelOptions: {
          updateOn: 'default blur',
          allowInvalid: false,
          debounce: {
            default: 1000,
            blur: 1000
          }
        },
        validators: {
          validPubmedId: {
            expression: function($viewValue, $modelValue, scope) {
              if ($viewValue.length > 0) {
                var deferred = $q.defer();
                scope.options.templateOptions.loading = true;
                Genes.verify($viewValue).then(
                  function (response) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.name = response.name;
                    deferred.resolve(response);
                  },
                  function (error) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.name = '--';
                    deferred.reject(error);
                  }
                );
                return deferred.promise;
              } else {
                scope.options.templateOptions.data.name = '--';
                return true;
              }
            },
            message: '"This does not appear to be a valid Entrez ID."'
          }
        }
      },
      {
        key: 'variant_name',
        type: 'horizontalTypeaheadHelp',
        templateOptions: {
          label: 'Variant Name',
          value: 'vm.newEvidence.variant_name',
          minLength: 32,
          helpText: 'Description of the type of variant (e.g., V600E, BCR-ABL fusion, Loss-of-function, exon 12 mutations). Should be as specific as possible (i.e., specific amino acid changes).',
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)',
          editable: true
        },
        data: {
          typeaheadSearch: function(val) {
            var request = {
              mode: 'variants',
              count: 10,
              page: 0,
              'filter[variant]': val
            };
            return Datatables.query(request)
              .then(function(response) {
                return _.map(_.unique(response.result, 'variant'), function(event) {
                  return { name: event.variant, id: event.variant_id };
                });
              });
          }
        }
      },
      {
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.newEvidence.variant_origin',
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
        type: 'disease',
        templateOptions: {
          label: 'Disease ID',
          value: 'vm.newEvidence.doid',
          minLength: 1,
          data: {
            name: '--'
          },
          helpText: 'Disease Ontology ID of the specific disease or disease type (e.g., 1909 for melanoma).'
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
                Diseases.verify($viewValue).then(
                  function (response) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.name = response.name;
                    deferred.resolve(response);
                  },
                  function (error) {
                    scope.options.templateOptions.loading = false;
                    scope.options.templateOptions.data.name = '--';
                    deferred.reject(error);
                  }
                );
                return deferred.promise;
              } else {
                scope.options.templateOptions.data.name = '--';
                return true;
              }
            },
            message: '"This does not appear to be a valid DOID."'
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.noDoid === true'
        }
      },
      {
        key: 'noDoid',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Could not locate a DOID for the associated disease.',
          onChange: 'model.doid = ""'
        }
      },
      {
        key: 'disease',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease Name',
          value: 'vm.newEvidence.disease',
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
          value: 'vm.newEvidence.description',
          minLength: 32,
          helpText: 'Description of evidence from published medical literature detailing the association of or lack of association of a variant with diagnostic, prognostic or predictive value in relation to a specific disease (and treatment for predictive evidence). Data constituting protected health information (PHI) should not be entered. Please familiarize yourself with your jurisdiction\'s definition of PHI before contributing.'
        }
      },
      {
        key: 'pubmed_id',
        type: 'publication',
        templateOptions: {
          label: 'Pubmed Id',
          value: 'vm.newEvidence.pubmed_id',
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
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.newEvidence.rating',
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
          helpText: 'Type of study performed to produce the evidence statement'
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
          value: 'vm.newEvidence.evidence_direction',
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
          required: true,
          value: 'vm.newEvidence.clinical_significance',
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
        model: vm.newEvidence.comment,
        templateOptions: {
          rows: 5,
          label: 'Additional Comments',
          value: 'text',
          helpText: 'Please provide any additional comments you wish to make about this evidence item. This comment will appear as the first comment in this item\'s comment thread.'
        }
      }
    ];

    vm.submit = function(newEvidence) {
      newEvidence.evidenceId = newEvidence.id;
      newEvidence.drugs = _.without(newEvidence.drugs, '');
      vm.formErrors = {};
      vm.formMessages = {};

      Evidence.add(newEvidence)
        .then(function() {
          console.log('add evidence success!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          // options.resetModel();
        })
        .catch(function(error) {
          console.error('add evidence error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('add evidence done!');
        });
    };
  }

})();
