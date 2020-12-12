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
                                      Phenotypes,
                                      Datatables,
                                      Sources,
                                      DrugSuggestions,
                                      AddEvidenceViewOptions,
                                      formConfig,
                                      _,
                                      ConfigService) {
    var descriptions = ConfigService.evidenceAttributeDescriptions;

    var make_options = ConfigService.optionMethods.make_options; // make options for pull down
    var el_options = ConfigService.optionMethods.el_options; // make options for evidence level
    var cs_options = ConfigService.optionMethods.cs_options; // make options for clinical significance
    var merge_props = ConfigService.optionMethods.merge_props; // reduce depth of object tree by 1; by merging properties of properties of obj
    var ratingLabel = function(index) { //handle labels for rating template options
      return index + ' - ' + descriptions.rating[index].replace(' - ','<br/>');
    };

    var help = ConfigService.evidenceHelpText;
    var vm = $scope.vm = {};

    vm.evidenceModel = Evidence;
    vm.evidenceOptions = AddEvidenceViewOptions;

    vm.currentUser = null; // will be updated with requestCurrentUser call later

    vm.showPrefillPrompt = !_.isUndefined(_.find($stateParams, function(val) { return !_.isUndefined(val); })) ? true : false;

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
      source: {citation_id: '', source_type: ''},
      description: '',
      disease: {
        name: ''
      },
      disease_name: '',
      noDoid: false,
      drugs: [],
      drug_interaction_type: null,
      rating: '',
      phenotypes: [],
      evidence_level: '',
      evidence_type: '',
      evidence_direction: '',
      clinical_significance: '',
      variant_origin: '',
      keepSourceStatus: false,
      organization: null
    };

    vm.newEvidence.comment = { title: 'Additional Comments', text:'' };
    vm.newEvidence.drugs  = [];

    vm.newEvidence.source_suggestion_id = _.isUndefined($stateParams.sourceId) ? null : Number($stateParams.sourceId);

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.newEvidence.organization = vm.currentUser.most_recent_organization;
    });

    // form helper functions
    var hideDiseaseFields = function(model) {
      var isFunctional = model.evidence_type === 'Functional';
      var isOncogenic = model.clinical_significance === 'Oncogenic';
      return (isFunctional && !isOncogenic);
    };

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
          // if gene name provided, get id, entrez_id
          if($stateParams.geneName){
            Genes.exactMatch($stateParams.geneName)
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
          templateUrl: 'components/forms/fieldTypes/geneTypeahead.tpl.html',
          onSelect: 'to.data.entrez_id = $model.entrez_id',
          helpText: help['Gene Entrez Name'],
          data: {
            entrez_id: '--',
            typeaheadSearch: function(val) {
              return Genes.beginsWith(val)
                .then(function(response) {
                  var labelLimit = 100;
                  var list = _.map(response, function(gene) {
                    if (gene.aliases.length > 0) {
                      gene.alias_list = gene.aliases.join(', ');
                      if(gene.alias_list.length > labelLimit) { gene.alias_list = _.truncate(gene.alias_list, labelLimit); }
                    }
                    return gene;
                  });
                  return list;
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
        wrapper: ['noResultsMessage'],
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
          popupTemplateUrl: 'components/forms/fieldTypes/variantTypeaheadPopup.tpl.html',
          templateUrl: 'components/forms/fieldTypes/variantTypeahead.tpl.html',
          minLength: 32,
          helpText: help['Variant Name'],
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue, model.gene.name)',
          typeaheadMinLength: 0,
          editable: true,
          noResults: 'to.data.noResults',
          data: {
            noResults: false,
            noResultsMessage: 'NOTE: This appears to be a new variant for the selected gene. Please ensure it has not already been entered under a similar name before you create it.'
          }
        },
        data: {
          typeaheadSearch: function(val, gene) {
            var request = {
              mode: 'variants',
              count: 50,
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
          },
        }
      },
      {
        key: 'source.source_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.sourceType) {
            var st = $stateParams.sourceType;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.source_type);
            if(_.includes(permitted, st)) {
              $scope.model.source.source_type = st;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[st];
              // update source field info
              // this unfortunately reproduces code in onChange below, but updating value above doesn't trigger onChange...
              var sourceField = _.find($scope.fields, { key: 'source.citation_id'});
              sourceField.templateOptions.data.sourceType = st;
            } else {
              console.warn('Ignoring pre-population of Source Type with invalid value: ' + st);
            }
          }
        },
        templateOptions: {
          label: 'Source Type',
          required: true,
          options: [{ value: '', label: 'Please select a Source Type' }].concat(make_options(descriptions.source_type)),
          valueProp: 'value',
          labelProp: 'label',
          helpText: help['Source Type'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.source_type
          },
          onChange: function(value, options, scope) {
            // field value is showing up undefined here for some reason, accessing it via options
            var val = options.value();
            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[val];
            // set source_type on citation_id and clear field
            var sourceField = _.find(scope.fields, { key: 'source.citation_id'});
            sourceField.value('');
            sourceField.templateOptions.data.citation = '--';
            if(val) { sourceField.templateOptions.data.sourceType = val; }
            else {  sourceField.templateOptions.data.sourceType = undefined; }
          }
        }
      },
      {
        key: 'source.citation_id',
        type: 'publication',
        templateOptions: {
          label: 'Source ID',
          required: true,
          data: {
            citation: '--',
            sourceType: undefined,
          },
        },
        asyncValidators: {
          validId: {
            expression: function($viewValue, $modelValue, scope) {
              var type = scope.model.source.source_type;
              var deferred = $q.defer();
              scope.options.templateOptions.loading = true;
              if ($viewValue.length > 0 && type !== '') { // type must be defined
                if ($viewValue.match(/[^0-9]+/)) { // must be number
                  scope.options.templateOptions.data.citation = 'Citation ID must be a number';
                  deferred.reject(false);
                } else { // get citation
                  var reqObj = {
                    citationId: $viewValue,
                    sourceType: type
                  };
                  Publications.verify(reqObj).then(
                    function (response) {
                      scope.options.templateOptions.data.citation = response.citation;
                      deferred.resolve(true);
                    },
                    function (error) {
                      if(error.status === 404) {
                        scope.options.templateOptions.data.citation = 'No ' + type + ' source found with specified ID.';
                      } else {
                        scope.options.templateOptions.data.citation = 'Error fetching source, check console log for details.';
                      }
                      deferred.reject(false);
                    }
                  );
                }
              } else {
                scope.options.templateOptions.data.citation = '--';
                deferred.resolve(false);
              }
              scope.options.templateOptions.loading = false;
              return deferred.promise;
            },
            message: '"This does not appear to be a valid source ID."'
          }
        },
        controller: /* @ngInject */ function($scope, $stateParams) {
          if($stateParams.citationId) {
            $scope.model.source.citation_id = $stateParams.citationId;
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'to.data.sourceType === "" || to.data.sourceType === undefined',
          'templateOptions.label': 'to.data.sourceType ? to.data.sourceType === "ASCO" ? "ASCO Web ID" : "PubMed ID" : "Source ID"',
          'templateOptions.placeholder': 'to.data.sourceType ? to.data.sourceType === "ASCO" ? "Search by ASCO ID" : "Search by PubMed ID" : "Please select Source Type"',
          // ng expressions here don't have access to config help objects, so we must clumsily insert them into the expression here
          'templateOptions.helpText': 'to.data.sourceType ? to.data.sourceType === "ASCO" ? "' + help['SourceASCO'] + '" : "' + help['SourcePubMed'] + '" : "Please enter a Source Type before entering a Source ID."',
        },
        modelOptions: {
          debounce: {
            default: 300,
            blur: 0
          },
          updateOn: 'default blur'
        }
      },
      { // duplicates warning row
        templateUrl: 'app/views/add/evidence/addEvidenceDuplicateWarning.tpl.html',
        controller: /* @ngInject */ function($scope, Search) {
          var vm = $scope.vm = {};
          vm.duplicates = [];
          vm.pubmedName = '';

          function searchForDups(values) {
            vm.duplicates = [];
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
                    'field': 'source_type',
                    'condition': {'name': 'is_equal_to', 'parameters': [values[2]]}
                  },
                  {
                    'field': 'citation_id',
                    'condition': {'name': 'is_equal_to', 'parameters': [values[3]]}
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
            'model.source.source_type',
            'model.source.citation_id'
          ], searchForDups);
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
          required: true,
          value: 'vm.newEvidence.variant_origin',
          options: [{ value: '', label: 'Please select a Variant Origin' }].concat(make_options(descriptions.variant_origin)),
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
          helpText: help['Disease'],
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.doid = $model.doid',
          templateUrl: 'components/forms/fieldTypes/diseaseTypeahead.tpl.html',
          data: {
            doid: '--',
            prepopSearched: false, // flag to ensure prepop search only performed once
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
          if($stateParams.diseaseName && !$scope.to.prepopSearched) {
            // without the prepopSearched logic, unchecking noDoid checkbox
            // will show this field, instantiating this controller, and
            // performing search for the non-existen disease again,
            // re-checking the noDoid checkbox
            Diseases.exactMatch($stateParams.diseaseName)
              .then(function(response) {
                if(response[0]) {
                  // disease found, set model.disease
                  $scope.model.disease = response[0];
                  $scope.to.data.doid = response[0].doid;
                } else {
                  // disease not found, show msg to user
                  $scope.to.data.doid = 'Suggested disease "' + $stateParams.diseaseName + '" not found.';
                }
                // toggle searched flag, ensuring prepopulation search is
                // only performed once
                $scope.to.prepopSearched = true;
              });
          }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.noDoid === true', // deactivate if noDoid is checked
          'templateOptions.required': 'model.noDoid === false' // required only if noDoid is unchecked
        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return hideDiseaseFields(scope.model) || scope.model.noDoid;
        }
      },
      {
        key: 'disease_name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Disease Name',
          required: true,
          value: 'vm.newEvidence.disease_name',
          minLength: 32,
          helpText: help['Disease Name']
        },
        hideExpression: '!model.noDoid'
      },
      {
        key: 'noDoid',
        type: 'horizontalCheckbox',
        templateOptions: {
          label: 'Could not find disease.',
          onChange: function(value, options, scope) {
            // reset disease fields
            scope.model.disease = { name: '' };
            scope.model.disease_name = '';
          }

        },
        hideExpression: function($viewValue, $modelValue, scope) {
          return hideDiseaseFields(scope.model);
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          required: true,
          label: 'Evidence Statement',
          value: 'vm.newEvidence.description',
          minLength: 32,
          helpText: help['Evidence Statement']
        }
      },
      {
        key: 'evidence_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.evidenceType) {
            var et = $stateParams.evidenceType;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_type.evidence_item);
            if(_.includes(permitted, et)) {
              $scope.model.evidence_type = $stateParams.evidenceType;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[et];
            } else {
              console.warn('Ignoring pre-population of Evidence Type with invalid value: ' + et);
            }
          }
        },
        templateOptions: {
          label: 'Evidence Type',
          required: true,
          value: 'vm.newEvidence.evidence_type',
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          options: [{ value: '', label: 'Please select an Evidence Type' }].concat(make_options(descriptions.evidence_type.evidence_item)),
          onChange: function(value, options, scope) {
            // reset evidence_direction and clinical_significance, as their options will change
            // also update $touched so user notices
            var csField = _.find(scope.fields, { key: 'clinical_significance'});
            var edField = _.find(scope.fields, { key: 'evidence_direction'});

            csField.value('');
            edField.value('');
            csField.templateOptions.data.attributeDefinition = '';
            edField.templateOptions.data.attributeDefinition = '';

            // if we're switching to Predictive, seed the drugs array w/ a blank entry,
            // otherwise set to empty array
            value === 'Predictive' ? scope.model.drugs = [''] : scope.model.drugs = [];

            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          },
          helpText: help['Evidence Type'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.evidence_type.evidence_item
          }
        }
      },
      {
        key: 'evidence_level',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        templateOptions: {
          label: 'Evidence Level',
          options: ([{ value: '', label: 'Please select an Evidence Level' }].concat(el_options(descriptions.evidence_level_brief))),
          valueProp: 'value',
          required: true,
          labelProp: 'label',
          helpText: help['Evidence Level'],
          data: {
            attributeDefinition: '&nbsp;',
            attributeDefinitions: descriptions.evidence_level
          },
          onChange: function(value, options) {
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
          }
        },
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService) {
          // populate field if evidenceLevel provided
          if($stateParams.evidenceLevel){
            var vo = $stateParams.evidenceLevel;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_level);
            if(_.includes(permitted, vo)) {
              $scope.model.evidence_level = $stateParams.evidenceLevel;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[vo];
            } else {
              console.warn('Ignoring pre-population of Evidence Level with invalid value: ' + vo);
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
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.evidence_direction.evidence_item[et]);
              if(_.includes(permitted, ed)) {
                $scope.model.evidence_direction = $stateParams.evidenceDirection;
                $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[et][ed];
              } else {
                console.warn('Ignoring pre-population of Evidence Direction with invalid value: ' + ed);
              }

            } else {
              console.warn('Cannot pre-populate Evidence Direction without specifying Evidence Type.');
            }
          }
        },
        templateOptions: {
          label: 'Evidence Direction',
          required: true,
          value: 'vm.newEvidence.evidence_direction',
          options: [{ value: '', label: 'Please select an Evidence Direction' }].concat(make_options(descriptions.evidence_direction.evidence_item['Diagnostic'])), //dummy index e.g. 'Diagnostic'
          valueProp: 'value',
          labelProp: 'label',
          helpText: help['Evidence Direction'],
          evidenceDirectionOptions: [{ type: 'default', value: '', label: 'Please select an Evidence Direction' }].concat(cs_options(descriptions.evidence_direction.evidence_item)),
          data: {
            attributeDefinition: 'Please choose Evidence Type before selecting Evidence Direction.',
            attributeDefinitions: descriptions.evidence_direction.evidence_item,
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
              var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.clinical_significance.evidence_item[et]);
              if(_.includes(permitted, cs)) {
                $scope.model.clinical_significance = $stateParams.clinicalSignificance;
                $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[cs];
              } else {
                console.warn('Ignoring pre-population of Clinical Significance with invalid value: ' + cs);
              }

            } else {
              console.warn('Cannot pre-populate Clinical Significance without specifying Evidence Type.');
            }
          }
        },
        templateOptions: {
          label: 'Clinical Significance',
          required: true,
          value: 'vm.newEvidence.clinical_significance',
          // stores unmodified options array for expressionProperties
          clinicalSignificanceOptions: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance.evidence_item)),
          ngOptions: 'option["value"] as option["label"] for option in to.options',
          // actual options displayed in the select, modified by expressionProperties
          options: [{ type: 'default', value: '', label: 'Please select a Clinical Significance' }].concat(cs_options(descriptions.clinical_significance.evidence_item)),
          helpText: help['Clinical Significance'],
          data: {
            attributeDefinition: 'Please choose Evidence Type before selecting Clinical Significance.',
            attributeDefinitions: merge_props(descriptions.clinical_significance.evidence_item),
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
                    var labelLimit = 100;
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
          value: 'vm.newEvidence.drug_interaction_type',
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
              editable: false
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
        key: 'rating',
        type: 'horizontalRatingHelp',
        templateOptions: {
          label: 'Rating',
          required: true,
          options: [
            { value: '', label: 'Please select an Evidence Rating' },
            { value: 1, label: ratingLabel(1) },
            { value: 2, label: ratingLabel(2) },
            { value: 3, label: ratingLabel(3) },
            { value: 4, label: ratingLabel(4) },
            { value: 5, label: ratingLabel(5) }
          ],
          valueProp: 'value',
          labelProp: 'label',
          helpText: help['Rating']
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
          helpText: help['keepSourceStatus']
        }
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.newEvidence.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Additional Comments',
          currentUser: Security.currentUser,
          value: 'text',
          required: false,
          helpText: help['Additional Comments']
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

    vm.switchOrg = function(id) {
      vm.newEvidence.organization = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.submit = function(newEvidence) {
      newEvidence.evidenceId = newEvidence.id;
      newEvidence.drugs = _.without(newEvidence.drugs, '');
      newEvidence.phenotypes = _.without(newEvidence.phenotypes, '');

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
          // reload current user if org changed
          if (newEvidence.organization.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
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
