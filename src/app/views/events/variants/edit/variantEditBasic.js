(function() {
  'use strict';
  angular.module('civic.events.variants')
    .directive('variantEditBasic', variantEditBasicDirective)
    .controller('VariantEditBasicController', VariantEditBasicController);

  // @ngInject
  function variantEditBasicDirective() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'VariantEditBasicController',
      templateUrl: 'app/views/events/variants/edit/variantEditBasic.tpl.html'
    }
  }

  // @ngInject
  function VariantEditBasicController($scope,
                                   Security,
                                   VariantRevisions,
                                   Variants,
                                   VariantHistory,
                                   VariantsViewOptions,
                                   formConfig) {
    var variantModel, vm;

    vm = $scope.vm = {};
    variantModel = vm.variantModel = Variants;

    vm.isAdmin = Security.isAdmin();
    vm.isAuthenticated = Security.isAuthenticated();

    vm.variant = Variants.data.item;
    vm.variantRevisions = VariantRevisions;
    vm.variantHistory = VariantHistory;
    vm.variantEdit = angular.copy(vm.variant);
    vm.variantEdit.comment = { title: 'New Suggested Revision', text:'Comment text.' };
    vm.myVariantInfo = variantModel.data.myVariantInfo;
    vm.variants = variantModel.data.variants;
    vm.variantGroups = variantModel.data.variantGroups;

    vm.styles = VariantsViewOptions.styles;

    vm.user = {};

    vm.formErrors = {};
    vm.formMessages = {};
    vm.errorMessages = formConfig.errorMessages;
    vm.errorPrompts = formConfig.errorPrompts;

    vm.variantFields = [
      {
        key: 'name',
        type: 'horizontalInput',
        templateOptions: {
          label: 'Name',
          disabled: true,
          value: vm.variant.name
        }
      },
      {
        key: 'description',
        type: 'horizontalTextarea',
        templateOptions: {
          rows: 8,
          label: 'Description',
          value: 'vm.variant.description',
          minLength: 32
        }
      },
      {
        template: '<hr/>'
      },
      {
        model: vm.variantEdit.comment,
        key: 'title',
        type: 'horizontalInput',
        templateOptions: {
          label: 'Comment Title',
          value: 'title'
        }
      },
      {
        model: vm.variantEdit.comment,
        key: 'text',
        type: 'horizontalTextarea',
        templateOptions: {
          rows: 5,
          label: 'Comment',
          value: 'text'
        }
      }
    ];

    vm.submit = function(variantEdit, options) {
      variantEdit.variantId = variantEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      VariantRevisions.submitRevision(variantEdit)
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

    vm.apply = function(variantEdit, options) {
      variantEdit.variantId = variantEdit.id;
      vm.formErrors = {};
      vm.formMessages = {};
      Variants.apply(variantEdit)
        .then(function(response) {
          console.log('revision appy success!');
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
