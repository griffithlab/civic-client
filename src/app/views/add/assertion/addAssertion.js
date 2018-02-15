(function() {
  'use strict';
  angular.module('civic.add')
    .config(AddAssertionConfig)
    .controller('AddAssertionController', AddAssertionController);

  // @ngInject
  function AddAssertionConfig($stateProvider) {
    $stateProvider
      .state('add.assertion', {
        url: '/assertion?geneId?variantId',
        templateUrl: 'app/views/add/assertion/addAssertion.tpl.html',
        resolve: {
          Assertions: 'Assertions',
          acmgCodes: function(Assertions) {
            return Assertions.queryAcmgCodes();
          }
        },
        controller: 'AddAssertionController',
        controllerAs: 'vm',
        data: {
          title: 'Add Assertion',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AddAssertionController($scope,
                                  $stateParams,
                                  _,
                                  formConfig,
                                  ConfigService,
                                  Assertions,
                                  acmgCodes,
                                  Datatables,
                                  Security,
                                  Genes,
                                  Diseases,
                                  Phenotypes,
                                  DrugSuggestions) {
    var vm = this;
    vm.type = 'ASSERTION';

    var help = ConfigService.evidenceHelpText;
    var descriptions = ConfigService.evidenceAttributeDescriptions;
    var assertDescriptions = ConfigService.assertionAttributeDescriptions;
    var make_options = ConfigService.optionMethods.make_options; // make options for pull down
    var cs_options = ConfigService.optionMethods.cs_options; // make options for clinical significance
    var merge_props = ConfigService.optionMethods.merge_props; // reduce depth of object tree by 1; by merging properties of properties of obj
    var ampLevels = ConfigService.assertionAttributeDescriptions.ampLevels;
    var nccnGuidelines = ConfigService.assertionAttributeDescriptions.nccnGuidelines;

    vm.isEditor = Security.isEditor();
    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.validationMessages = formConfig.validationMessages;
    vm.errorPrompts = formConfig.errorPrompts;


    vm.assertion = {
      gene: {name:''},
      variant: {name:''},
      description: '',
      disease: {
        name: ''
      },
      drugs: [],
      drug_interaction_type: null,
      evidence_direction: '',
      evidence_type: '',
      clinical_significance: '',
      amp_level: '',
      acmg_codes: [''],
      phenotypes: [],
      nccn_guideline: '',
      nccn_guideline_version: '',
      fda_regulatory_approval: false,
      fda_companion_test: false,
      evidence_items: [],
      comment: { title: 'Additional Comments', text:'' }
    };

    vm.options= {
      removeChromeAutoComplete: true
    };

    vm.assertionFields = [
      {
        key: 'gene',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['entrezIdDisplay'],
        controller: /* @ngInject */ function($scope, $stateParams, Genes) {
          // populate field if geneId provided
          if ($stateParams.geneId) {
            Genes.getName($stateParams.geneId).then(function(gene) {
              $scope.model.gene = _.pick(gene, ['id', 'name', 'entrez_id']);
              $scope.to.data.entrez_id = gene.entrez_id;
            });
          }
          // if gene name provided, get id, entrez_id
          if ($stateParams.geneName) {
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
          minLength: 32,
          required: true,
          editable: false,
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          templateUrl: 'components/forms/fieldTypes/geneTypeahead.tpl.html',
          onSelect: 'to.data.entrez_id = $model.entrez_id',
          selectOnBlur: true,
          helpText: help['Gene Entrez Name'],
          data: {
            entrez_id: '--',
            typeaheadSearch: function(val) {
              return Genes.queryLocal(val)
                .then(function(response) {
                  var labelLimit = 70;
                  var list = _.map(response, function(gene) {
                    if (gene.aliases.length > 0) {
                      gene.alias_list = gene.aliases.join(', ');
                      if (gene.alias_list.length > labelLimit) {
                        gene.alias_list = _.truncate(gene.alias_list, labelLimit);
                      }
                    }
                    return gene;
                  });
                  return list;
                });
            }
          }
        },
        watcher: {
          listener: function(field, newValue, oldValue, scope) {
            // if gene is valid, remove the 'please specify gene...' message
            if(!_.isUndefined(field.formControl) && field.formControl.$valid) {
              _.find(scope.fields, { key: 'variant'}).templateOptions.data.message = '';
            }
            // if gene is invalid, remove any defined variant and show 'pls specify gene' msg
            if(!_.isUndefined(field.formControl) && field.formControl.$invalid) {
              scope.model.variant = {name:''};
              _.find(scope.fields, { key: 'variant'}).templateOptions.data.message = 'Please specify a gene before selecting a variant.';
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
        wrapper: ['fieldMessage'],
        className: 'input-caps',
        controller: /* @ngInject */ function($scope, $stateParams, Variants) {
          // populate field if variantId provided
          if ($stateParams.variantId) {
            Variants.get($stateParams.variantId).then(function(variant) {
              $scope.model.variant = {
                name: variant.name
              };
            });
          }
          // just drop in the variant name string if provided
          if ($stateParams.variantName) {
            $scope.model.variant = {
              name: $stateParams.variantName
            };
          }
        },
        templateOptions: {
          label: 'Variant Name',
          required: true,
          editable: false,
          value: 'vm.newEvidence.variant',
          minLength: 32,
          helpText: help['Variant Name'],
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue, model.gene.name)',
          typeaheadMinLength: 0,
          selectOnBlur: true,
          data: {
            message: ''
          }
        },
        expressionProperties: {
          'templateOptions.disabled': function($viewValue, $modelValue, scope) {
            var geneField = _.find(scope.fields, { key: 'gene'});
            return geneField.formControl.$invalid;
          }
        },
        data: {
          message: 'Please specify a Gene before choosing a Variant.',
          typeaheadSearch: function(val, gene) {
            var request = {
              mode: 'variants',
              count: 50,
              page: 0,
              'filter[variant]': val,
              'filter[entrez_gene]': gene
            };
            return Datatables.query(request)
              .then(function(response) {
                return _.map(_.uniq(response.result, 'variant'), function(event) {
                  return {
                    name: event.variant
                  };
                });
              });
          }
        }
      },
      {
        key: 'disease',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['loader', 'diseasedisplay'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.doid',
          required: true,
          minLength: 32,
          helpText: 'Please enter a disease name. Disease must exist in the CIViC database.',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.doid = $model.doid',
          templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',
          data: {
            doid: '--',
            typeaheadSearch: function(val) {
              return Diseases.beginsWith(val)
                .then(function(response) {
                  var labelLimit = 70;
                  return _.map(response, function(disease) {
                    if (disease.aliases.length > 0) {
                      disease.alias_list = disease.aliases.join(', ');
                      if(disease.alias_list.length > labelLimit) { disease.alias_list = _.truncate(disease.alias_list, labelLimit); }
                    } else {
                      disease.alias_list = '--';
                    }

                    return disease;
                  });
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
        }
      },
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.evidenceType) {
            var et = $stateParams.evidenceType;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_type);
            if(_.includes(permitted, et)) {
              $scope.model.evidence_type = $stateParams.evidenceType;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[et];
            } else {
              console.warn('Ignoring pre-population of Assertion Type with invalid value: ' + et);
            }
          }
        },
        templateOptions: {
          label: 'Assertion Type',
          required: true,
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [{ value: '', label: 'Please select an Assertion Type' }].concat(make_options(descriptions.evidence_type)),
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

            // reset ACMG codes if new Type != Predisposing
            if(value !== 'Predisposing') {
              scope.model.acmg_codes = [''];
            }
          },
          helpText: 'Type of clinical outcome associated with the assertion description.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.evidence_type
          }
        },
        watcher: {
          listener: function(field, newValue, oldValue, scope) {
            if(!_.isUndefined(field.formControl) && field.formControl.$valid) {
              _.find(scope.fields, { key: 'evidence_direction'}).templateOptions.data.attributeDefinition= '';
              _.find(scope.fields, { key: 'clinical_significance'}).templateOptions.data.attributeDefinition= '';
            }
            if(_.isUndefined(field.formControl) || field.formControl.$invalid) {
              _.find(scope.fields, { key: 'evidence_direction'}).templateOptions.data.attributeDefinition= 'Please choose Assertion Type before selecting Assertion Direction.';
              _.find(scope.fields, { key: 'clinical_significance'}).templateOptions.data.attributeDefinition= 'Please choose Assertion Type before selecting Assertion Direction.';
            }
          }
        }
      },
      {
        key: 'evidence_direction',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.evidenceDirection) {
            // ensure evidence type defined before setting evidence direction
            if($stateParams.evidenceType) {
              var et = $stateParams.evidenceType;
              var ed = $stateParams.evidenceDirection;
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_direction[et]);
              if(_.includes(permitted, ed)) {
                $scope.model.evidence_direction = $stateParams.evidenceDirection;
                $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[et][ed];
              } else {
                console.warn('Ignoring pre-population of Assertion Direction with invalid value: ' + ed);
              }

            } else {
              console.warn('Cannot pre-populate Assertion Direction without specifying Assertion Type.');
            }
          }
        },
        templateOptions: {
          label: 'Assertion Direction',
          required: true,
          value: 'vm.newEvidence.evidence_direction',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [{ value: '', label: 'Please select an Assertion Direction' }].concat(make_options(descriptions.evidence_direction['Diagnostic'])), //dummy index e.g. 'Diagnostic'
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'An indicator of whether the evidence statement supports or refutes the clinical significance of an event. Assertion Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: '',
            attributeDefinitions: descriptions.evidence_direction,
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
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.clinicalSignificance) {
            // ensure evidence type defined before setting evidence direction
            if($stateParams.evidenceType) {
              var et = $stateParams.evidenceType;
              var cs = $stateParams.clinicalSignificance;
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.clinical_significance[et]);
              if(_.includes(permitted, cs)) {
                $scope.model.clinical_significance = $stateParams.clinicalSignificance;
                $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[cs];
              } else {
                console.warn('Ignoring pre-population of Clinical Significance with invalid value: ' + cs);
              }

            } else {
              console.warn('Cannot pre-populate Clinical Significance without specifying Assertion Type.');
            }
          }
        },
        templateOptions: {
          label: 'Clinical Significance',
          required: true,
          value: 'vm.newEvidence.clinical_significance',
          // stores unmodified options array for expressionProperties
          clinicalSignificanceOptions: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance)),
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          // actual options displayed in the select, modified by expressionProperties
          options: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance)),
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, diagnostic, or predisposing assertion types. If the variant was not associated with a positive or negative outcome, N/A should be selected. Assertion Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: 'Please choose Assertion Type before selecting Clinical Significance.',
            attributeDefinitions: merge_props(descriptions.clinical_significance),
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
          label: 'Drug(s)',
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
                return DrugSuggestions.localQuery(val)
                  .then(function(response) {
                    return _.map(response, function(drugname) {
                      return { name: drugname };
                    });
                  });
              }
            }
          },
          helpText: help['Drug Names']
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
          required: true,
          options: [{ type: 'default', value: null, label: 'Please select a Drug Interaction Type' }].concat(make_options(descriptions.drug_interaction_type)),
          valueProp: 'value',
          labelProp: 'label',
          helpText: help['Drug Interaction Type'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.drug_interaction_type
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
        key: 'amp_level',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'AMP Category',
          options: ([{ value: '', label: 'Please select an AMP Category' }].concat(make_options(ampLevels))),
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'If applicable, please provide the <a href="http://www.ncbi.nlm.nih.gov/pubmed/27993330" target="_blank">AMP somatic variant classification</a>.',
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: assertDescriptions.ampLevels
          },
          onChange: function(value, options) {
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return scope.model.evidence_type === 'Predisposing';
        }
      },
      {
        key: 'acmg_codes',
        type: 'multiInput',
        templateOptions: {
          label: 'ACMG Code(s)',
          entityName: 'ACMG Code',
          data: { message: '' },
          inputOptions: {
            type: 'select',
            wrapper: null,
            templateOptions: {
              onSelect: 'options.data.setNote(model, index)',
              ngOptions: 'option["value"] as option["label"] for option in to.options',
              options: _.chain(acmgCodes).map(function(code) {
                return { value: code.code, label: code.code };
              }).unshift({value: '', label:'Please choose an ACMG Code'}).value(),
              valueProp: 'value',
              labelProp: 'label'
            },
            data: {
              setNote: function(model) {
                console.log('Setting acmg code to: ' + model);
              }
            }
          }
        },
        expressionProperties: {
          isUnique: function (viewValue, modelValue, scope) {
            var codes = _.without(modelValue, '');
            if(_.uniq(codes).length < codes.length) {
              scope.to.data.message = 'NOTE: Duplicate ACMG codes will be ignored.';
            } else {
              scope.to.data.message = '';
            }
          }
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return  scope.model.evidence_type !== 'Predisposing';
        }
      },
      {
        key: 'phenotypes',
        type: 'multiInput',
        templateOptions: {
          label: 'Associated Phenotypes',
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)',
              templateUrl: 'components/forms/fieldTypes/hpoTypeahead.tpl.html',
              // focus: true,
              onSelect: 'options.data.pushNew(model, index)',
              editable: true
            },
            data: {
              pushNew: function(model, index) {
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                return Phenotypes.query(val)
                  .then(function(response) {
                    return _.map(response, function(phenotype) {
                      return { id: phenotype.hpo_id, name: phenotype.hpo_class };
                    });
                  });
              }
            }
          },
          helpText: help['Phenotypes']
        }
      },
      {
        key: 'nccn_guideline',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'NCCN Guideline',
          options: ([{ value: '', label: 'Please select an NCCN Guideline' }].concat(_.map(nccnGuidelines, function(guideline) {
            return { value: guideline, label: guideline};
          }))),
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'If applicable, please provide cancer (e.g., Breast Cancer) and version (e.g., 5.2016) for the appropriate <a href="http://www.nccn.org/professionals/physician_gls/default.aspx#site" target="_blank">NCCN guideline</a>.'
        }
      },
      {
        key: 'nccn_guideline_version',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'NCCN Guideline Version',
          minLength: 32,
          helpText: ''
        }
      },
      {
        key: 'fda_regulatory_approval',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Assertion has FDA regulatory approval.',
          onChange: function(value, options, scope) {
            // set companion test to false if no regulatory approval
            if(value===false) {
              scope.model.fda_companion_test = false;
            }
          }
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return  scope.model.evidence_type !== 'Predictive';
        }

      },
      {
        key: 'fda_companion_test',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Assertion has FDA companion test.'
        }
      },
      {
        key: 'summary',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Summary',
          required: true,
          minLength: 24,
          helpText: 'A short, one sentence summary of this new assertion'
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Description',
          required: true,
          minLength: 32,
          helpText: 'A complete description of this new assertion, limited to one paragraph'
        }
      },
      {
        key: 'evidence_items',
        type: 'evidenceSelectorField',
        wrapper: ['simpleHasError'],
        templateOptions: {
          label: 'Supporting Evidence',
          required: true,
          minLength: 2,
          helpText: 'Please use the grids to add/remove evidence items.'
        }
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.assertion.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Additional Comments',
          currentUser: Security.currentUser,
          value: 'text',
          required: false,
          helpText: 'Please provide any additional comments you wish to make about this assertion. This comment will appear as the first comment in this assertion\'s comment thread.'
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

    vm.add = function(assertion) {
      var newAssertion = _.cloneDeep(assertion);
      newAssertion.drugs = _.without(newAssertion.drugs, '');
      newAssertion.acmg_codes = _.without(newAssertion.acmg_codes, '');
      newAssertion.evidence_items = _.map(newAssertion.evidence_items, 'id');
      newAssertion.phenotypes = _.chain(newAssertion.phenotypes).without('').map('name').value(); // delete blank input values, pluck hpo classes to create array of strings
      Assertions.add(newAssertion)
        .then(function(response) {
          console.log('new assertion created!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.newAssertionId = response.assertion.id;
          vm.newAssertionName = response.assertion.name;
        })
        .catch(function(error) {
          console.error('assertion submit error!');
          vm.formErrors[error.status] = error;
        })
        .finally(function() {
          console.log('assertion submit done!');
        });
    };
  }

})();
