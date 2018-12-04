(function() {
  'use strict';
  angular.module('civic.sources')
    .controller('SuggestSourceController', SuggestSourceController);

  // @ngInject
  function SuggestSourceController($scope,
                                   $q,
                                   _,
                                   Security,
                                   Diseases,
                                   Genes,
                                   Datatables,
                                   Publications,
                                   Sources,
                                   ConfigService) {
    console.log('SuggestSourceController called.');

    var help = ConfigService.evidenceHelpText;
    var descriptions = ConfigService.evidenceAttributeDescriptions;
    var make_options = ConfigService.optionMethods.make_options; // make options for pull down

    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.showSuccessMessage = false;
    vm.showForm = true;

    vm.duplicates = [];

    vm.error = {};

    vm.newSuggestion= {
      source_type: '',
      source: {
        citation_id: '',
        description: ''
      },
      comment: {
        title: 'Source Suggestion Comment'
      }
    };

    vm.suggestionFields =[
      {
        key: 'source_type',
        type: 'horizontalSelectHelp',
        wrapper: 'attributeDefinition',
        controller: /* @ngInject */ function($scope, $stateParams, ConfigService, _) {
          if($stateParams.sourceType) {
            var st = $stateParams.sourceType;
            var permitted = _.keys(ConfigService.evidenceAttributeDescriptions.source_type);
            if(_.includes(permitted, st)) {
              $scope.model.source_type = st;
              $scope.to.data.attributeDefinition = $scope.to.data.attributeDefinitions[st];
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
            // set attribute definition
            options.templateOptions.data.attributeDefinition = options.templateOptions.data.attributeDefinitions[value];
            // set source_type on citation_id and clear field
            var sourceField = _.find(scope.fields, { key: 'source'});
            sourceField.value({citation_id: '', description: ''});
            sourceField.templateOptions.data.citation = '--';
            if(value) { sourceField.templateOptions.data.sourceType = value; }
            else {  sourceField.templateOptions.data.sourceType = undefined; }
          }
        }
      },
      {
        key: 'source',
        type: 'horizontalTypeaheadHelp',
        wrapper: ['citation'],
        templateOptions: {
          label: 'Source',
          required: true,
          editable: false,
          typeahead: 'item as item.citation_id for item in to.data.typeaheadSearch($viewValue, to.data.sourceType)',
          templateUrl: 'components/forms/fieldTypes/citationTypeahead.tpl.html',
          onSelect: 'to.data.citation  = $model.citation',
          data: {
            citation: '--',
            sourceType: undefined, // need to store this here to pass into the typeahead expression as to.data.sourceType
            typeaheadSearch: function(val, sourceType) {
              if (val.match(/[^0-9]+/)) { return false; } // must be numeric
              if(sourceType === 'ASCO' && val.length < 2) { return false; } // asco IDs are all > 2 chr
              var reqObj = {
                citationId: val,
                sourceType: sourceType
              };
              return Publications.verify(reqObj)
                .then(function(response) {
                  return response;
                });
            }
          },
          helpText: help['Source']
        },
        controller: /* @ngInject */ function($scope, $stateParams) {
          // TODO this won't work, will need to query the server to get the entire source object
          // if($stateParams.citationId) {
          //   $scope.model.citation_id = $stateParams.citationId;
          // }
        },
        expressionProperties: {
          'templateOptions.disabled': 'model.source_type === "" || model.source_type === undefined', // deactivate if source type specified
        },
        modelOptions: {
          debounce: {
            default: 300
          }
        }
      },
      {
        key: 'gene',
        type: 'horizontalTypeaheadHelp',
        model: vm.newSuggestion.suggestion,
        wrapper: ['entrezIdDisplay', 'validationMessages'],
        controller: /* @ngInject */ function($scope, $stateParams, Genes) {
          // populate field if geneId provided
          if($stateParams.geneId){
            Genes.getName($stateParams.geneId).then(function(gene) {
              $scope.model.gene = _.pick(gene,['id', 'name', 'entrez_id']);
              $scope.to.data.entrez_id = gene.entrez_id;
            });
          }
        },
        templateOptions: {
          label: 'Gene Entrez Name',
          value: 'vm.newSuggestion.gene',
          minLength: 32,
          required: false,
          editable: true,
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
          onSelect: 'to.data.entrez_id = $model.entrez_id',
          helpText: help['Gene Entrez Name'],
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
        model: vm.newSuggestion.suggestion,
        className: 'input-caps',
        controller: /* @ngInject */ function($scope, $stateParams, Variants) {
          // populate field if variantId provided
          if($stateParams.variantId){
            Variants.get($stateParams.variantId).then(function(variant) {
              $scope.model.variant = { name: variant.name };
            });
          }
        },
        templateOptions: {
          label: 'Variant Name',
          minLength: 32,
          helpText: help['Variant Name'],
          formatter: 'model[options.key].name',
          typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)',
          required: false,
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
                return _.map(_.uniq(response.result, 'variant'), function(event) {
                  return { name: event.variant };
                });
              });
          }
        }
      },
      {
        key: 'disease',
        type: 'horizontalTypeaheadHelp',
        model: vm.newSuggestion.suggestion,
        wrapper: ['loader', 'diseasedisplay', 'validationMessages'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.suggestion.doid',
          required: false,
          editable: true,
          minLength: 32,
          helpText: help['Disease'],
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
        expressionProperties: {
          'templateOptions.disabled': 'model.noDoid === true', // deactivate if noDoid is checked
          'templateOptions.required': 'model.noDoid === false' // required only if noDoid is unchecked
        },
        hideExpression: 'model.noDoid'
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
            'model.source_type',
            'model.source.citation_id'
          ], searchForDups);
        }
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.newSuggestion.comment,
        templateOptions: {
          rows: 5,
          minimum_length: 3,
          label: 'Comment',
          currentUser: Security.currentUser,
          value: 'text',
          required: true,
          helpText: help['suggestionComment']
        }
      }
    ];

    vm.submit = function(req) {
      vm.error = {};
      var reqObj = {
        source: req.source,
        comment: req.comment
      };
      if(!_.isUndefined(req.gene) && _.isObject(req.gene)) {
        reqObj.gene_name = req.gene.name;
      }
      if(!_.isUndefined(req.variant) && _.isObject(req.variant)) {
        reqObj.variant_name = req.variant.name;
      }
      if(!_.isUndefined(req.disease) && _.isObject(req.disease)) {
        reqObj.disease_name = req.disease.name;
      }
      Sources.suggest(reqObj).then(
        function(response) { // success
          console.log('source suggestion submit success.');
          vm.newSourceId = response.id;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          console.log(response);
        },
        function(error) { // fail
          console.error('source suggestion submit error.');
          vm.error = error;
        },
        function() { // complete
          console.error('source suggestion submit complete.');
        }
      );
    };

  }
})();
