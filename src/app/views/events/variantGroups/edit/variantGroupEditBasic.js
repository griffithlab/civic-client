(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantGroupEditBasic', variantGroupEditBasicDirective)
    .controller('VariantGroupEditBasicController', VariantGroupEditBasicController);

  // @ngInject
  function variantGroupEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantGroupEditBasicController',
      templateUrl: 'app/views/events/variantGroups/edit/variantGroupEditBasic.tpl.html'
    }
  }

  // @ngInject
  function VariantGroupEditBasicController($scope,
                                           $stateParams,
                                           Security,
                                           Datatables,
                                           VariantGroupRevisions,
                                           VariantGroups,
                                           VariantGroupHistory,
                                           VariantGroupsViewOptions,
                                           formConfig) {
    var variantGroupModel, vm;

    vm = $scope.vm = {};
    variantGroupModel = vm.variantGroupModel = VariantGroups;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.variantGroup = VariantGroups.data.item;
    vm.variantGroupRevisions = VariantGroupRevisions;
    vm.variantGroupHistory = VariantGroupHistory;
    vm.variantGroupEdit = angular.copy(vm.variantGroup);
    vm.variantGroupEdit.comment = { title: 'VARIANT GROUP ' + vm.variantGroup.name + ' Revision Description', text:'' };
    vm.variantGroupEdit.variants = _.map(vm.variantGroupEdit.variants, function(variant) {
      return { name: variant.entrez_name + " - " + variant.name, id: variant.id };
    });

    vm.styles = VariantGroupsViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;
    vm.newRevisionId = Number();
    vm.stateParams = $stateParams;
    vm.showForm = true;
    vm.showSuccessMessage = false;
    vm.showInstructions = true;

    vm.variantGroupFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          disabled: true,
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
          inputOptions: {
            type: 'typeahead',
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
                      return { name: event.entrez_gene + " - " + event.variant, id: event.variant_id }
                    });
                  });
              }
            }
          },
          helpText: 'Click the X button to delete a variant, click the Add Item button to add a variant. Note that variants must be known to CIViC to be available for including here. New variants must be added as part of an evidence item using the the <a href="/#/add/evidence/basic">Add Evidence form</a>.'
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.variantGroupEdit.comment,
        key: 'text',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          rows: 5,
          label: 'Revision Description',
          value: 'text',
          helpText: 'Please provide a brief description and support, if necessary, for your suggested revision. It will appear as the first comment in this revision\'s comment thread.'
        }
      }
    ];

    vm.submit = function(variantGroupEdit, options) {
      variantGroupEdit.variantGroupId = variantGroupEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      // prep variant edit obj for submission to server
      variantGroupEdit.variants = _.pluck(variantGroupEdit.variants, 'id');

      VariantGroupRevisions.submitRevision(variantGroupEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.newRevisionId = response.id;
          vm.formMessages['submitSuccess'] = true;
          vm.showForm = false;
          vm.showSuccessMessage = true;
          vm.showInstructions = false;
        })
        .catch(function(error) {
          console.error('revision submit error!');
          vm.formErrors[error.status] = true;
        })
        .finally(function(){
          console.log('revision submit done!');
        });
    };

    vm.apply = function(variantGroupEdit, options) {
      variantGroupEdit.variantGroupId = variantGroupEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      VariantGroups.apply(variantGroupEdit)
        .then(function(response) {
          console.log('revision apply success!');
          vm.formMessages['applySuccess'] = true;
          // options.resetModel();
        })
        .catch(function(response) {
          console.error('revision application error!');
          vm.formErrors[response.status] = true;
        })
        .finally(function(){
          console.log('revision apply done!');
        });
    };
  }
})();
