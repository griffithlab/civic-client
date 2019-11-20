(function() {
  'use strict';
  angular.module('civic.common')
    .directive('addDrugForm', addDrugForm);

  // @ngInject
  function addDrugForm() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/directives/addDrugForm.tpl.html',
      replace: true,
      controller: addDrugFormController
    };

    return directive;
  }

  function addDrugFormController($rootScope,
                                 $scope,
                                 Drugs,
                                 ConfigService,
                                 _) {
    var vm = $scope.vm = { };
    vm.parentField = _.find($scope.fields, { key: $scope.options.key }); // field object ref
    vm.index = $scope.$index; // $index value assigned by angular-formly
    vm.replaceItem = $scope.replaceItem; // replaceItem on multiInput controller
    vm.suggestions = [];

    vm.showForm = true;
    vm.showSuccess = false;
    vm.showConflict = false;

    vm.newDrug = {
      drug_name: ''
    };

    vm.newDrugFields = [
      {
        key: 'drug_name',
        type: 'input',
        templateOptions: {
          label: 'Drug Name',
          required: true
        }
      }
    ];

    vm.submit = function() {
      console.log('new drug submitted.');
      Drugs.add(this.newDrug)
        .then(
          function(response) { // success
            console.log('Drug successfully added.');
            vm.showForm = false;
            vm.showSuccess = true;
          },
          function(response) {
            console.log('Error adding new drug.');
            vm.showForm = false;
            vm.showError = true;
          });
    };

    vm.replaceItem = function() {
      console.log('Replacing model drug name.');
      vm.replaceItem(this.parentField.value(), this.index, this.newDrug.name);
    };
  }
})();
