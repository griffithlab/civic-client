(function() {
  'use strict';
  angular.module('civic.events.genes')
    .config(addVariantGroupConfig)
    .controller('AddVariantGroupController', AddVariantGroupController);

  // @ngInject
  function addVariantGroupConfig($stateProvider) {
    $stateProvider
      .state('events.genes.summary.addVariantGroup', {
        url: '/addVariantGroup',
        templateUrl: 'app/views/events/genes/addVariantGroup/addVariantGroup.tpl.html',
        controller: 'AddVariantGroupController',
        resolve: {
          'VariantGroups': 'VariantGroups'
        },
        deepStateRedirect: [ 'geneId' ],
        data: {
          titleExp: '"Add Variant Group"',
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
                                     Genes,
                                     Datatables,
                                     Security) {
    console.log('AddVariantGroupController called.');

    var vm = $scope.vm = {};

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
      gene_id: $stateParams.geneId,
      name: '',
      description: '',
      variants: [{id: 0, name:''}]
    };

    vm.variantGroupFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: false,
          value: vm.variantGroup.name,
          helpText: 'A brief and meaninful name for the new variant group.'
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
        .then(function() {
          console.log('new variant group created!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;

          // update parent Gene object to refresh variant menu
          Genes.queryVariantGroups(Genes.data.item.id);
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

  }

})();
