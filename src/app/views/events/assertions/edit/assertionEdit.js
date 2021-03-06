(function() {
  'use strict';
  angular.module('civic.events.assertions')
    .directive('assertionEdit', assertionEditDirective)
    .controller('AssertionEditController', AssertionEditController);

  // @ngInject
  function assertionEditDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'AssertionEditController',
      templateUrl: 'app/views/events/assertions/edit/assertionEdit.tpl.html'
    };
  }

  // @ngInject
  function AssertionEditController($scope,
                                   $q,
                                   $document,
                                   $state,
                                   $rootScope,
                                   _,
                                   Publications,
                                   Security,
                                   AssertionRevisions,
                                   Assertions,
                                   AssertionHistory,
                                   AssertionsViewOptions,
                                   formConfig,
                                   ConfigService,
                                   Datatables,
                                   Genes,
                                   Diseases,
                                   Phenotypes,
                                   NccnGuidelines,
                                   DrugSuggestions) {
    var vm;

    vm = $scope.vm = {};

    vm.type = 'ASSERTION';

    var acmgCodes = Assertions.data.acmg_codes;
    var help = ConfigService.evidenceHelpText;
    var descriptions = ConfigService.evidenceAttributeDescriptions;
    var assertDescriptions = ConfigService.assertionAttributeDescriptions;
    var make_options = ConfigService.optionMethods.make_options; // make options for pull down

    var cs_options = ConfigService.optionMethods.cs_options; // make options for clinical significance
    var merge_props = ConfigService.optionMethods.merge_props; // reduce depth of object tree by 1; by merging properties of properties of obj
    var ampLevels = ConfigService.assertionAttributeDescriptions.ampLevels;
    var nccnGuidelines = ConfigService.assertionAttributeDescriptions.nccnGuidelines;

    vm.assertion = {};

    angular.copy(Assertions.data.item, vm.assertion);
    vm.assertion.phenotypes = _.map(vm.assertion.phenotypes, function(phenotype) { return phenotype.hpo_class; });
    vm.pendingFields = _.keys(AssertionRevisions.data.pendingFields).length > 0;
    vm.pendingFieldsList = _.map(_.keys(AssertionRevisions.data.pendingFields), function(field) {
      return field.charAt(0).toUpperCase() + field.slice(1);
    });
    vm.assertionRevisions = AssertionRevisions;
    vm.assertionHistory = AssertionHistory;

    // copy current assertion to edit object, adjust some attributes to what the form expects
    vm.assertionEdit = angular.copy(vm.assertion);
    vm.assertionEdit.comment = { title: 'ASSERTION ' + vm.assertion.name + ' Revision Description', text:'' };
    vm.assertionEdit.drugs = _.filter(_.map(vm.assertion.drugs, 'name'), function(name){ return name !== 'N/A'; });
    vm.assertionEdit.nccn_guideline = {
      name: vm.assertionEdit.nccn_guideline ? vm.assertionEdit.nccn_guideline : ''
    };

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.assertionEdit.organization = vm.currentUser.most_recent_organization;
    });

    vm.styles = AssertionsViewOptions.styles;

    vm.user = {};

    vm.newRevisionId = Number();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    // server errors
    vm.serverError = false;
    vm.serverErrorStatus = '';
    vm.serverErrorStatusTxt = '';
    vm.serverErrorMessages = [];

    // scroll to form header
    $document.ready(function() {
      var elem = document.getElementById('assertion-edit-form');
      if(!_.isUndefined(elem)) {
        $document.scrollToElementAnimated(elem);
      }
    });

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
            // if gene is valid, remove the variant's 'please specify gene...' message
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
          popupTemplateUrl: 'components/forms/fieldTypes/variantTypeaheadPopup.tpl.html',
          templateUrl: 'components/forms/fieldTypes/variantTypeahead.tpl.html',
          typeaheadMinLength: 0,
          selectOnBlur: true,
          data: {
            message: ''
          }
        },
        expressionProperties: {
          'templateOptions.disabled': function($viewValue, $modelValue, scope) {
            return scope.model.gene ? scope.model.gene.name == '': false;
          }
        },
        data: {
          message: 'Please specify a Gene before choosing a Variant.',
          typeaheadSearch: function(val, gene) {
            var request = {
              mode: 'variants',
              count: 999,
              page: 0,
              'filter[variant]': val,
              'filter[entrez_gene]': gene,
              'sorting[variant]': 'asc'
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
        key: 'variant_origin',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.variantOrigin) {
            var vo = $stateParams.variantOrigin;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.variant_origin);
            if(_.includes(permitted, vo)) {
              $scope.model.variant_origin = $stateParams.variantOrigin;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[vo];
            } else {
              console.warn('Ignoring pre-population of Variant Origin with invalid value: ' + vo);
            }
          }
        },
        templateOptions: {
          label: 'Variant Origin',
          value: 'vm.newEvidence.variant_origin',
          options: [{ value: '', label: 'Please select a Variant Origin' }].concat(make_options(descriptions.variant_origin)),
          required: true,
          valueProp: 'value',
          labelProp: 'label',
          helpText: help['Variant Origin'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.variant_origin
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
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_type.assertion);
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
          options: [{ value: '', label: 'Please select an Assertion Type' }].concat(make_options(descriptions.evidence_type.assertion)),
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
            attributeDefinitions: descriptions.evidence_type.assertion
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
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_direction.assertion[et]);
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
          options: [{ value: '', label: 'Please select an Assertion Direction' }].concat(make_options(descriptions.evidence_direction.assertion['Diagnostic'])), //dummy index e.g. 'Diagnostic'
          valueProp: 'value',
          labelProp: 'label',
          evidenceDirectionOptions: [{ type: 'default', value: '', label: 'Please select an Assertion Direction' }].concat(cs_options(descriptions.evidence_direction.assertion)),
          helpText: 'An indicator of whether the evidence statement supports or refutes the clinical significance of an event. Assertion Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: '',
            attributeDefinitions: descriptions.evidence_direction.assertion,
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
          'templateOptions.options': function($viewValue, $modelValue, scope) {
            return  _.filter(scope.to.evidenceDirectionOptions, function(option) {
              return !!(option.type === scope.model.evidence_type ||
                        option.type === 'default' ||
                        option.type === 'N/A');
            });
          },
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
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.clinical_significance.assertion[et]);
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
          clinicalSignificanceOptions: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance.assertion)),
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          // actual options displayed in the select, modified by expressionProperties
          options: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance.assertion)),
          helpText: 'Positive or negative association of the Variant with predictive, prognostic, diagnostic, or predisposing assertion types. If the variant was not associated with a positive or negative outcome, N/A should be selected. Assertion Type must be selected before this field is enabled.',
          data: {
            attributeDefinition: 'Please choose Assertion Type before selecting Clinical Significance.',
            attributeDefinitions: merge_props(descriptions.clinical_significance.assertion),
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
          label: 'Drug Name(s)',
          entityName: 'Drug',
          showAddButton: true,
          addFormTemplate: 'components/forms/fieldTypes/multiInputAddDrugForm.tpl.html',
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              typeahead: 'item.name for item in options.data.typeaheadSearch($viewValue)',
              templateUrl: 'components/forms/fieldTypes/drugTypeahead.tpl.html',
              onSelect: 'options.data.pushNew(model, index)',
              editable: false
            },
            data: {
              pushNew: function(model, index) {
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                return DrugSuggestions.query(val)
                  .then(function(response) {
                    var labelLimit = 70;
                    return _.map(response, function(drug) {
                      if (drug.aliases.length > 0) {
                        drug.alias_list = drug.aliases.join(', ');
                        if(drug.alias_list.length > labelLimit) { drug.alias_list = _.truncate(drug.alias_list, labelLimit); }
                      } else {
                        drug.alias_list = '--';
                      }
                      return drug;
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
          label: 'AMP/ASCO/CAP Category',
          options: ([{ value: '', label: 'Please select an AMP/ASCO/CAP Category' }].concat(make_options(ampLevels))),
          valueProp: 'value',
          labelProp: 'label',
          helpText: 'If applicable, please provide the <a href="http://www.ncbi.nlm.nih.gov/pubmed/27993330" target="_blank">AMP/ASCO/CAP somatic variant classification</a>.',
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
        key: 'phenotypes',
        type: 'multiInput',
        templateOptions: {
          label: 'Associated Phenotypes',
          entityName: 'Phenotype',
          showAddButton: false,
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              typeahead: 'item.name for item in options.data.typeaheadSearch($viewValue)',
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
        key: 'acmg_codes',
        type: 'multiInput',
        templateOptions: {
          label: 'ACMG/AMP Code(s)',
          entityName: 'ACMG/AMP Code',
          showAddButton: false,
          data: { message: '' },
          inputOptions: {
            type: 'typeahead',
            wrapper: ['acmgDescription'],
            templateOptions: {
              formatter: 'model[options.key].name',
              typeahead: 'item as item.code for item in options.data.typeaheadSearch($viewValue)',
              onSelect: 'options.data.pushNew(model, index, to)',
              typeaheadMinLength: 1,
              selectOnBlur: true,
              data: {
                message: ''
              },
              controller: function($scope) {
                controller.log('acmg_codes input controller instantiated');
              }
            },
            data: {
              pushNew: function(model, index, to) {
                to.data.message = model[index].description;
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                return Assertions.queryAcmgCodes(val)
                  .then(function(response) {
                    return response;
                  });
              }
            }
          }
        },
        expressionProperties: {
          // isUnique: function (viewValue, modelValue, scope) {
          //   var codes = _.without(modelValue, '');
          //   if(_.uniq(codes).length < codes.length) {
          //     scope.to.data.message = 'NOTE: Duplicate ACMG codes will be ignored.';
          //   } else {
          //     scope.to.data.message = '';
          //   }
          // }
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return  scope.model.evidence_type !== 'Predisposing';
        }
      },
      {
        key: 'nccn_guideline',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['loader'],
        templateOptions: {
          label: 'NCCN Guideline',
          value: 'vm.assertionEdit.nccn_guideline',
          editable: false,
          required: false,
          helpText: 'If applicable, please provide cancer (e.g., Breast Cancer) and version (e.g., 5.2016) for the appropriate <a href="http://www.nccn.org/professionals/physician_gls/default.aspx#site" target="_blank">NCCN guideline</a>.',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          data: {
            typeaheadSearch: function(val) {
              return NccnGuidelines.contains(val)
                .then(function(response) {
                  return response;
                });
            }
          }
        },
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
        model: vm.assertionEdit.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Revision Description',
          required: true,
          value: 'text',
          helpText: help['Revision Description']
        },
        validators: {
          length: {
            expression: function(viewValue, modelValue, scope) {
              var value = viewValue || modelValue;
              return value.length >= scope.to.minimum_length;
            },
            message: '"Comment must be at least " + to.minimum_length + " characters long to submit."'
          }
        }
      }

    ];

    vm.switchOrg = function(id) {
      vm.assertionEdit.organization = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.submit = function(assertionEdit) {
      var newAssertion = _.cloneDeep(assertionEdit);
      newAssertion.drugs = _.without(newAssertion.drugs, '');
      newAssertion.acmg_codes = _.chain(newAssertion.acmg_codes).without('').map('code').value();
      newAssertion.evidence_items = _.map(newAssertion.evidence_items, 'id');
      newAssertion.phenotypes = _.without(newAssertion.phenotypes, '');
      vm.formErrors = {};
      vm.formMessages = {};

      AssertionRevisions.submitRevision(newAssertion)
        .then(function(response) {
          console.log('revision submit success!');
          vm.serverError = false;
          vm.newRevisionId = response.id;
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.pendingFields = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          $rootScope.$broadcast('revisionDecision');
          // reload current user if org changed
          if (newAssertion.organization.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.serverError = true;
          vm.serverErrorStatus = error.status;
          vm.serverErrorStatusTxt = error.statusText;
          vm.serverErrorPrompt = 'Please correct the following errors and resubmit.';
          vm.serverErrorMessages = error.data.errors;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.revisionsClick = function() {
      $state.go('events.assertions.talk.revisions.list', { assertionId: Assertions.data.item.id });
    };
  }
})();
