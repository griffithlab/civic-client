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
                                      $document,
                                      $stateParams,
                                      Security,
                                      Evidence,
                                      Genes,
                                      Publications,
                                      Diseases,
                                      Datatables,
                                      Sources,
                                      DrugSuggestions,
                                      AddEvidenceViewOptions,
                                      formConfig,
                                      _) {
    var vm = $scope.vm = {};

    vm.evidenceModel = Evidence;
    vm.evidenceOptions = AddEvidenceViewOptions;

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.scroll = function() {
      var elem = document.getElementById('add-evidence-basic');
      $document.scrollToElementAnimated(elem);
    };

    vm.duplicates = true;

    vm.newEvidence = {
      gene: '',
      variant: '',
      pubmed_id: '',
      description: '',
      disease: {
        name: ''
      },
      disease_name: '',
      noDoid: false,
      //pubchem_id: '',
      drugs: [],
      drug_interaction_type: '',
      rating: '',
      evidence_level: '',
      evidence_type: '',
      evidence_direction: '',
      clinical_significance: '',
      variant_origin: '',
      keepSourceStatus: false
    };

    vm.newEvidence.comment = { title: 'Additional Comments', text:'' };
    vm.newEvidence.drugs  = [];

    vm.newEvidence.source_suggestion_id = _.isUndefined($stateParams.sourceSuggestionId) ? null : Number($stateParams.sourceSuggestionId);

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.evidenceFields = [
      {
        key: 'gene',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['entrezIdDisplay'],
        controller: /* @ngInject */ function($scope, $stateParams, Genes) {
          // populate field if geneId provided
          if($stateParams.geneId){
            Genes.getName($stateParams.geneId).then(function(gene) {
              $scope.model.gene = _.pick(gene,['id', 'name', 'entrez_id']);
              $scope.to.data.entrez_id = gene.entrez_id;
            });
          }
          // if gene name provide, get id, entrez_id
          if($stateParams.geneName){
            Genes.beginsWith($stateParams.geneName)
              .then(function(response) {
                // set field to first item on typeahead suggest
                $scope.model.gene = response[0];
                $scope.to.data.entrez_id = response[0].entrez_id;
              });
          }
        },
        templateOptions: {
          label: 'Gene Entrez Name',
          value: 'vm.newEvidence.gene',
          minLength: 32,
          required: true,
          editable: false,
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.entrez_id = $model.entrez_id',
          helpText: 'Entrez Gene name (e.g. BRAF). Gene name must be known to the Entrez database.',
          data: {
            entrez_id: '--',
            typeaheadSearch: function(val) {
              return Genes.beginsWith(val)
                .then(function(response) {
                  return response;
                });
            }
          }
        },
        modelOptions: {
          debounce: {
            default: 300
          }
        }
      },
      {
        key: 'variant',
        type: 'horizontalTypeaheadHelp',
        className: 'input-caps',
        controller: /* @ngInject */ function($scope, $stateParams, Variants) {
          // populate field if variantId provided
          if($stateParams.variantId){
            Variants.get($stateParams.variantId).then(function(variant) {
              $scope.model.variant = { name: variant.name };
            });
          }
          // just drop in the variant name string if provided
          if($stateParams.variantName){
            $scope.model.variant = { name: $stateParams.variantName };
          }
        },
        templateOptions: {
          label: 'Variant Name',
          required: true,
          value: 'vm.newEvidence.variant',
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
                  return { name: event.variant };
                });
              });
          }
        }
      },

      {
        key: 'pubmed_id',
        type: 'publication',
        templateOptions: {
          label: 'Pubmed ID',
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
        controller: /* @ngInject */ function($scope, $stateParams) {
          if($stateParams.pubmedId) {
            $scope.model.pubmed_id = $stateParams.pubmedId;
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
      { // duplicates warning row
        templateUrl: 'app/views/add/evidence/addEvidenceDuplicateWarning.tpl.html',
        controller: /* @ngInject */ function($scope, Search) {
          console.log('dup warning controller loaded.');
          var vm = $scope.vm = {};
          vm.duplicates = [];
          vm.pubmedName = '';

          function searchForDups(values) {
            if(_.every(values, function(val) { return _.isString(val) && val.length > 0; })) {
              Search.post({
                  'operator': 'AND',
                  'queries': [
                    {
                      'field': 'gene_name',
                      'condition': {'name': 'contains', 'parameters': [values[0]]}
                    },
                    {
                      'field': 'variant_name',
                      'condition': {'name': 'contains', 'parameters': [values[1]]}
                    },
                    {
                      'field': 'pubmed_id',
                      'condition': {'name': 'is', 'parameters': [values[2]]
                      }
                    }
                  ],
                  'entity': 'evidence_items',
                  'save': false
                })
                .then(function (response) {
                  vm.duplicates = response.results;
                });
            }
          }

          $scope.pubmedField = _.find($scope.fields, { key: 'pubmed_id' });

          $scope.$watchGroup([
            'model.gene.name',
            'model.variant.name',
            'model.pubmed_id'
          ], searchForDups);
        }
      },
      {
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.newEvidence.variant_origin',
          options: [
            { value: '', label: 'Please select a Variant Origin' },
            { value: 'Somatic Mutation', label: 'Somatic Mutation'},
            { value: 'Germline Mutation', label: 'Germline Mutation' },
            { value: 'Germline Polymorphism', label: 'Germline Polymorphism' },
            { value: 'Unknown', label: 'Unknown' },
            { value: 'N/A', label: 'N/A' },
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Origin of variant',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Somatic Mutation': 'Variant is a mutation, found only in tumor cells, having arisen in a specific tissue (non-germ cell), and is not expected to be inherited or passed to offspring.',
              'Germline Mutation': 'Variant is a mutation, found in every cell, not restricted to tumor/diseased cells, is expected to have arisen de novo in the germ cells responsible for the current generation or only very recent generations (e.g., close family members), and is not thought to exist in the population at large.',
              'Germline Polymorphism': 'Variant is found in every cell, not restricted to tumor/diseased cells, and thought to represent common (or relatively rare) variation in the population at large.',
              'Unknown': 'The variant origin is uncertain based on the available evidence.',
              'N/A': 'The variant type (e.g., expression) is not compatible (or easily classified) with the CIViC concepts of variant origin.'
            }
          },
          onChange: function(value, options) {
            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }
        }
      },
      {
        key: 'disease',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['loader', 'diseasedisplay', 'validationMessages'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.doid',
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
        },
        controller: /* @ngInject */ function($scope, $stateParams, Diseases) {
          if($stateParams.diseaseName) {
            Diseases.beginsWith($stateParams.diseaseName)
              .then(function(response) {
                $scope.model.disease = response[0];
                $scope.to.data.doid = response[0].doid;
              });
          }
        },

        expressionProperties: {
          'templateOptions.disabled': 'model.noDoid === true', // deactivate if noDoid is checked
          'templateOptions.required': 'model.noDoid === false' // required only if noDoid is unchecked
        },
        hideExpression: 'model.noDoid'
      },
      {
        key: 'noDoid',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Could not find disease.'
        }
      },
      {
        key: 'disease_name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease Name',
          value: 'vm.newEvidence.disease_name',
          minLength: 32,
          helpText: 'Enter the name of the disease here.'
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
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'Evidence Type',
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [
            { value: '', label: 'Please select an Evidence Type' },
            { value: 'Predictive', label: 'Predictive' },
            { value: 'Diagnostic', label: 'Diagnostic' },
            { value: 'Prognostic', label: 'Prognostic' },
            { value: 'Predisposing', label: 'Predisposing' }
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
              'Diagnostic': 'Evidence pertains to a variant\'s impact on patient diagnosis (cancer subtype)',
              'Prognostic': 'Evidence pertains to a variant\'s impact on disease progression, severity, or patient survival',
              'Predisposing': 'Evidence pertains to a variant\'s role in conferring susceptibility to a disease'
            }
          }
        }
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'Evidence Level',
          value: 'vm.newEvidence.rating',
          options: [
            { value: '', label: 'Please select an Evidence Level' },
            { value: 'A', label: 'A - Validated'},
            { value: 'B', label: 'B - Clinical'},
            { value: 'C', label: 'C - Case Study'},
            { value: 'D', label: 'D - Preclinical'},
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
              C: 'Individual case reports from clinical journals',
              D: 'In vivo or in vitro models support association',
              E: 'Indirect evidence'
            }
          },
          onChange: function(value, options) {
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }

        }
      },
      {
        key: 'evidence_direction',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
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
          helpText: 'An indicator of whether the evidence statement supports or refutes the clinical significance of an event. Evidence Type must be selected before this field is enabled.',
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
              },
            'Predisposing': {
              'Supports': 'The experiment or study supports a variant\'s role in conferring susceptibility to a disease',
              'Does Not Support': 'The experiment or study does not support a variant\'s role in conferring susceptibility to a disease'
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
        templateOptions: {
          label: 'Clinical Significance',
          required: true,
          value: 'vm.newEvidence.clinical_significance',
          clinicalSignificanceOptions: [ // stores unmodified options array for expressionProperties
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Predictive', value: 'Adverse Response', label: 'Adverse Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'Predisposing', value: 'Pathogenic', label: 'Pathogenic' },
            { type: 'Predisposing', value: 'Likely Pathogenic', label: 'Likely Pathogenic' },
            { type: 'Predisposing', value: 'Benign', label: 'Benign' },
            { type: 'Predisposing', value: 'Likely Benign', label: 'Likely Benign' },
            { type: 'Predisposing', value: 'Uncertain Significance', label: 'Uncertain Significance' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [ // actual options displayed in the select, modified by expressionProperties
            { type: 'default', value: '', label: 'Please select a Clinical Significance' },
            { type: 'Predictive', value: 'Sensitivity', label: 'Sensitivity' },
            { type: 'Predictive', value: 'Resistance or Non-Response', label: 'Resistance or Non-Response' },
            { type: 'Predictive', value: 'Adverse Response', label: 'Adverse Response' },
            { type: 'Prognostic', value: 'Better Outcome', label: 'Better Outcome' },
            { type: 'Prognostic', value: 'Poor Outcome', label: 'Poor Outcome' },
            { type: 'Diagnostic', value: 'Positive', label: 'Positive' },
            { type: 'Diagnostic', value: 'Negative', label: 'Negative' },
            { type: 'Predisposing', value: 'Pathogenic', label: 'Pathogenic' },
            { type: 'Predisposing', value: 'Likely Pathogenic', label: 'Likely Pathogenic' },
            { type: 'Predisposing', value: 'Benign', label: 'Benign' },
            { type: 'Predisposing', value: 'Likely Benign', label: 'Likely Benign' },
            { type: 'Predisposing', value: 'Uncertain Significance', label: 'Uncertain Significance' },
            { type: 'N/A', value: 'N/A', label: 'N/A' }
          ],
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, diagnostic, or predisposing evidence types. If the variant was not associated with a positive or negative outcome, N/A should be selected. Evidence Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Sensitivity': 'Variant is associated with positive response to treatment ',
              'Resistance or Non-Response': 'Variant is associated with negative treatment response',
              'Adverse Response': 'Subject exhibits an adverse response to drug treatment',
              'Better Outcome': 'Demonstrates better than expected clinical outcome',
              'Poor Outcome': 'Demonstrates worse than expected clinical outcome',
              'Positive': 'Associated with diagnosis of disease or subtype',
              'Negative': 'Variant is associated with the lack of diagnosis of disease or subtype',
              'Pathogenic': 'Very strong evidence the variant is pathogenic',
              'Likely Pathogenic': 'Strong evidence (>90% certainty) the variant is pathogenic',
              'Benign': 'Very strong evidence the variant is benign',
              'Likely Benign': 'Not expected to have a major effect on disease',
              'Uncertain Significance': 'The variant fullfills the ACMG criteria for pathogenic/benign, or the evidence is conflicting',
              'N/A': 'Variant does not inform clinical action'
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
              return !!(option.type === scope.model.evidence_type ||
              option.type === 'default' ||
              option.type === 'N/A');
            });
          },
          'templateOptions.disabled': 'model.evidence_type === ""' // deactivate if evidence_type unselected
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
              typeahead: 'item.name for item in options.data.typeaheadSearch($viewValue)',
              // focus: true,
              onSelect: 'options.data.pushNew(model, index)',
              editable: true
            },
            data: {
              pushNew: function(model, index) {
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                return DrugSuggestions.query(val)
                  .then(function(response) {
                    return _.map(response, function(drugname) {
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
        key: 'drug_interaction_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'Drug Interaction Type',
          value: 'vm.newEvidence.drug_interaction_type',
          options: [
            { type: 'default', value: '', label: 'Please select a Drug Interaction Type' },
            { value: 'Combination', label: 'Combination'},
            { value: 'Sequential', label: 'Sequential'},
            { value: 'Substitutes', label: 'Substitutes'}
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'Please indicate whether the drugs specified above are substitutes, or are used in sequential or combination treatments.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: {
              'Combination': 'The drugs listed were used in as part of a combination therapy approach',
              'Sequential': 'The drugs listed were used at separate timepoints in the same treatment plan',
              'Substitutes': 'The drugs listed are often considered to be of the same family, or behave similarly in a treatment setting'
            }
          },
          onChange: function(value, options) {
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return !(scope.model.evidence_type === 'Predictive' && // evidence type must be predictive
          _.without(scope.model.drugs, '').length > 1);

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
        key: 'keepSourceStatus',
        type: 'horizontalCheckboxHelp',
        defaultValue: false,
        // hideExpression: 'scope.model.source_suggestion_id != null',
        hideExpression: function(vval, mval, scope) {
          return scope.model.source_suggestion_id === null;
        },
        templateOptions: {
          label: 'Originating source suggestion supports the creation of additional evidence items',
          helpText: 'Check this box if you wish the originating source suggestion to keep its un-curated status. Otherwise, it will be marked as curated and removed from the source suggestion queues.'
        }
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.newEvidence.comment,
        ngModelElAttrs: {
          'msd-elastic': 'true',
          'mentio': '',
          'mentio-id': '"commentForm"'
        },
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Additional Comments',
          currentUser: Security.currentUser,
          value: 'text',
          required: false,
          helpText: 'Please provide any additional comments you wish to make about this evidence item. This comment will appear as the first comment in this item\'s comment thread.'
        },
        validators: {
          length: {
            expression: function(viewValue, modelValue, scope) {
              var value = viewValue || modelValue;
              return value.length >= scope.to.minimum_length || value.length === 0;
            },
            message: '"Comment must be at least " + to.minimum_length + " characters long to submit."'
          }
        }
      }
    ];

    vm.submit = function(newEvidence) {
      newEvidence.evidenceId = newEvidence.id;
      newEvidence.drugs = _.without(newEvidence.drugs, ''); // delete blank input values
      if(newEvidence.drugs.length < 2) { newEvidence.drug_interaction_type = null; } // delete interaction if only 1 drug
      // convert variant name to object, if a string
      // TODO: figure out how to handle this more elegantly using angular-formly config object
      if(_.isString(newEvidence.variant)){
        newEvidence.variant = { name: newEvidence.variant };
      }
      vm.formErrors = {};
      vm.formMessages = {};

      // if keepSourceStatus is checked, remove source_suggestion_id from model
      if(newEvidence.keepSourceStatus === true) {
        newEvidence = _.omit(newEvidence, 'source_suggestion_id');
      }

      // if noDoid, construct disease obj w/ disease_name
      if(newEvidence.noDoid) {
        newEvidence.disease = { name: newEvidence.disease_name };
      }

      Evidence.add(newEvidence)
        .then(function(response) {
          console.log('add evidence success!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          // options.resetModel();
          vm.linkParams = {
            geneId: response.gene.id,
            variantId: response.variant.id,
            evidenceId: response.evidence_item.id
          };
          vm.linkNames = {
            gene: response.gene.name,
            variant: response.variant.name,
            evidence_item: response.evidence_item.name
          };
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
