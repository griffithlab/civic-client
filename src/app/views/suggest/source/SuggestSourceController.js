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
                                   Sources) {
    console.log('SuggestSourceController called.');
    var vm = $scope.vm = {};
    vm.isAuthenticated = Security.isAuthenticated();
    vm.showSuccessMessage = false;

    vm.newSuggestion= {
      suggestion: {
      },
      comment: {
        title: 'Source Suggestion Comment'
      }
    };

    vm.suggestionFields =[
      {
        key: 'pubmed_id',
        type: 'publication',
        model: vm.newSuggestion.suggestion,
        templateOptions: {
          label: 'Pubmed ID',
          value: 'vm.newEvidence.pubmed_id',
          minLength: 1,
          required: true,
          data: {
            description: '--'
          },
          helpText: 'PubMed ID for your suggested source (e.g. 23463675)'
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
              if (!_.isUndefined($viewValue) && $viewValue.length > 0) {
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
          value: 'vm.newEvidence.gene',
          minLength: 32,
          required: false,
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
          value: 'vm.newEvidence.variant',
          minLength: 32,
          helpText: 'Description of the type of variant (e.g., V600E, BCR-ABL fusion, Loss-of-function, exon 12 mutations). Should be as specific as possible (i.e., specific amino acid changes).',
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
                return _.map(_.unique(response.result, 'variant'), function(event) {
                  return { name: event.variant };
                });
              });
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
                "operator": "AND",
                "queries": [
                  {
                    "field": "gene_name",
                    "condition": {"name": "contains", "parameters": [values[0]]}
                  },
                  {
                    "field": "variant_name",
                    "condition": {"name": "contains", "parameters": [values[1]]}
                  },
                  {
                    "field": "pubmed_id",
                    "condition": {"name": "is", "parameters": [values[2]]
                    }
                  }
                ],
                "entity": "evidence_items",
                "save": false
              })
                .then(function (response) {
                  vm.duplicates = response.results;
                });
            }
          }

          $scope.pubmedField = _.find($scope.fields, { key: 'pubmed_id' });

          $scope.$watchGroup([
            'model.suggestion.gene.name',
            'model.suggestion.variant.name',
            'model.suggestion.pubmed_id'
          ], searchForDups);
        }
      },
      {
        key: 'disease',
        type: 'horizontalTypeaheadHelp',
        model: vm.newSuggestion.suggestion,
        wrapper: ['loader', 'diseasedisplay', 'validationMessages'],
        templateOptions: {
          label: 'Disease',
          value: 'vm.newEvidence.doid',
          required: false,
          minLength: 32,
          helpText: 'Please enter a disease name.',
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
        expressionProperties: {
          'templateOptions.disabled': 'model.noDoid === true', // deactivate if noDoid is checked
          'templateOptions.required': 'model.noDoid === false' // required only if noDoid is unchecked
        },
        hideExpression: 'model.noDoid'
      },
      {
        key: 'text',
        type: 'horizontalCommentHelp',
        model: vm.newSuggestion.comment,
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
          helpText: 'Please provide any additional comments you wish to make about this source. This comment will aid curators when evaluating your suggested source for inclusion.'
        }
      }
    ];

    vm.submit = function(reqObj, options) {
      Sources.suggest(reqObj).then(
        function(response) { // success
          console.log('source suggestion submit success.');
          console.log(response);
        },
        function(error) { // fail
          console.error('source suggestion submit success.');
          console.log(error);
        },
        function() { // complete
          console.error('source suggestion submit complete.');
        }
      );
    }

  }
})();
