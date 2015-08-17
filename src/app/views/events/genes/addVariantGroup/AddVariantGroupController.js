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
  function AddVariantGroupController($scope, $stateParams, VariantGroups, Datatables) {
    console.log('AddVariantGroupController called.');

    var vm = $scope.vm = {};

    vm.variantGroup = {
      gene_id: $stateParams.geneId,
      name: '',
      description: '',
      variants: []
    };

    vm.variantGroupFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: false,
          value: vm.variantGroup.name
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
          minLength: 32
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

    vm.add = function(newVariantGroup, options) {
      VariantGroups.add(newVariantGroup)
        .then(function(response) {
          console.log('new variant group created!');
        })
        .catch(function(error) {
          console.error('revision submit error!');
          // vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    }

  }

})();
