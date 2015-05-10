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
                                   Security,
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
    vm.variantGroupEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
    vm.variants = variantGroupModel.data.variants;

    vm.styles = VariantGroupsViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.variantGroupFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: vm.variantGroup.name
        }
      },
      {
        key: 'description',
        type: 'textarea',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.variantGroup.description',
          focus: true,
          minLength: 32
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.variantGroupEdit.comment,
        key: 'title',
        type: 'input',
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        model: vm.variantGroupEdit.comment,
        key: 'text',
        type: 'textarea',
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];

    vm.submit = function(variantGroupEdit, options) {
      variantGroupEdit.variantGroupId = variantGroupEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      VariantGroupRevisions.submitRevision(variantGroupEdit)
        .then(function(response) {
          console.log('revision submit success!');
          vm.formMessages['submitSuccess'] = true;
          // options.resetModel();
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
      variantGroups.apply(variantGroupEdit)
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
