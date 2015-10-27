(function() {
  'use strict';
  angular.module('civic.add')
    .config(AddVariantGroupConfig)
    .controller('AddVariantGroupController', AddVariantGroupController);

  // @ngInject
  function AddVariantGroupConfig($stateProvider) {
    $stateProvider
      .state('add.variantGroup', {
        url: '/variantGroup?geneId',
        templateUrl: 'app/views/add/variantGroup/addVariantGroup.tpl.html',
        resolve: {
          VariantGroups: 'VariantGroups'
        },
        controller: 'AddVariantGroupController',
        controllerAs: 'vm',
        data: {
          title: 'Add Variant Group',
          navMode: 'sub'
        }
      });
  }

  // @ngInject
  function AddVariantGroupController($scope,
                                     $stateParams,
                                     _,
                                     formConfig,
                                     VariantGroups,
                                     Datatables,
                                     Security) {
    var vm = this;
    vm.type = 'VARIANT GROUP';

    vm.isEditor = Security.isEditor();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;


    vm.variantGroup = {
      name: '',
      description: '',
      variants: [{id: 0, name:''}]
    };

    vm.variantGroupFields = [
      //{
      //  key: 'gene',
      //  type: 'horizontalTypeaheadHelp',
      //  wrapper: ['entrezIdDisplay', 'validationMessages'],
      //  controller: /* @ngInject */ function($scope, $stateParams, Genes) {
      //    // populate field if geneId provided
      //    if($stateParams.geneId){
      //      Genes.getName($stateParams.geneId).then(function(gene) {
      //        $scope.model.gene = _.pick(gene,['id', 'name', 'entrez_id']);
      //        $scope.to.data.entrez_id = gene.entrez_id;
      //      });
      //    }
      //  },
      //  templateOptions: {
      //    label: 'Gene Entrez Name',
      //    value: 'vm.newEvidence.gene',
      //    minLength: 32,
      //    required: true,
      //    editable: false,
      //    formatter: 'model[options.key].name',
      //    typeahead: 'item as item.name for item in to.data.typeaheadSearch($viewValue)',
      //    onSelect: 'to.data.entrez_id = $model.entrez_id',
      //    helpText: 'Entrez Gene name (e.g. BRAF). Gene name must be known to the Entrez database.',
      //    data: {
      //      entrez_id: '--',
      //      typeaheadSearch: function(val) {
      //        return Genes.beginsWith(val)
      //          .then(function(response) {
      //            return response;
      //          });
      //      }
      //    }
      //  },
      //  modelOptions: {
      //    debounce: {
      //      default: 300
      //    }
      //  }
      //},
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: false,
          value: vm.variantGroup.name,
          helpText: 'A brief and meaningful name for the new variant group.'
        }
      },
      {
        key: 'description',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.variantGroup.description',
          focus: true,
          minLength: 32,
          helpText: 'A brief description of this new variant group.'
        }
      },
      {
        key: 'variants',
        type: 'multiInput',
        templateOptions: {
          label: 'Variants',
          entityName: 'Variant',
          helpText: 'Click the an X button to delete a variant, click the + button to add variant. Note that variants must be known to CIViC to be available for including here. New variants may be added as part of an evidence item using the the <a href="/#/add/evidence/basic">Add Evidence form</a>.',
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              formatter: 'model[options.key].name',
              typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)'
            },
            data: {
              typeaheadSearch: function(val) {
                var request = {
                  mode: 'variants',
                  count: 5,
                  page: 0,
                  'filter[variant]': val
                };
                return Datatables.query(request)
                  .then(function(response) {
                    return _.map(response.result, function(event) {
                      return { name: event.entrez_gene + ' - ' + event.variant, id: event.variant_id };
                    });
                  });
              }
            }
          }
        }
      }
    ];

    vm.add = function(newVariantGroup) {
      VariantGroups.add(newVariantGroup)
        .then(function(response) {
          console.log('new variant group created!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.newGroupId= response.id;
          vm.newGeneId = response.variants[0].gene_id; // grab gene id from first variant in group
        })
        .catch(function(error) {
          console.error('variant group submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('variant group submit done!');
        });
    };
  }

})();
