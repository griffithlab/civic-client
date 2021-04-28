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
      variants: [{id: 0, name:''}],
      organization: null
    };

    vm.currentUser = null; // will be updated with requestCurrentUser

    Security.reloadCurrentUser().then(function(u) {
      vm.currentUser = u;
      vm.isEditor = Security.isEditor();
      vm.isAdmin = Security.isAdmin();
      vm.isAuthenticated = Security.isAuthenticated();

      vm.variantGroup.organization = vm.currentUser.most_recent_organization;
    });


    vm.variantGroupFields = [
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
          showAddButton: false,
          inputOptions: {
            type: 'typeahead',
            wrapper: null,
            templateOptions: {
              formatter: 'model[options.key].name',
              typeahead: 'item as item.name for item in options.data.typeaheadSearch($viewValue)',
              popupTemplateUrl: 'components/forms/fieldTypes/variantTypeaheadPopup.tpl.html',
              onSelect: 'options.data.pushNew(model, index)'
            },
            data: {
              pushNew: function(model, index) {
                model.splice(index+1, 0, '');
              },
              typeaheadSearch: function(val) {
                var request = {
                  mode: 'variants',
                  count: 5,
                  page: 0,
                  'filter[variant]': val,
                  'sorting[variant]': 'asc'
                };
                return Datatables.query(request)
                  .then(function(response) {
                    return _.map(response.result, function(event) {
                      return { name: event.entrez_gene + ' - ' + event.variant, id: event.variant_id };
                    });
                  });
              }
            }
          },
          helpText: 'Click the X button to delete a variant, click the + button to add a variant. Note that variants must be known to CIViC to be available for including here. New variants may be added as part of an evidence item using the <a href="/add/evidence/basic" target="_self">Add Evidence form</a>.',
        }
      }
    ];

    vm.switchOrg = function(id) {
      vm.variantGroup.organization = _.find(vm.currentUser.organizations, { id: id });
    };

    vm.add = function(newVariantGroup) {
      newVariantGroup.variants = _.without(newVariantGroup.variants, ''); // delete blank input values
      VariantGroups.add(newVariantGroup)
        .then(function(response) {
          console.log('new variant group created!');
          vm.formMessages.submitSuccess = true;
          vm.showInstructions = false;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.newGroupId= response.id;
          vm.newGeneId = response.variants[0].gene_id; // grab gene id from first variant in group

          // reload current user if org changed
          if (newVariantGroup.organization.id != vm.currentUser.most_recent_organization.id) {
            Security.reloadCurrentUser();
          }
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
