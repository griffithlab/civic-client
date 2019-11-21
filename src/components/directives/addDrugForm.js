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
            vm.createdDrug = response;
            vm.showForm = false;
            vm.showSuccess = true;
          },
          function(response) {
            console.log('Error adding new drug.');
            var status = vm.errorStatus = response.status;
            vm.showForm = false;
            vm.showConflict = true;
            switch(status) {
            case 409: // conflict, drug exists.
              vm.conflictDrug = response.data;
              break;
            case 500: // server error
              break;
            default: // general error
            }
          });
    };

    vm.addDrug= function() {
      console.log('Replacing model drug name.');
      vm.replaceItem(this.parentField.value(), this.index, this.newDrug.drug_name);
    };
  }
})();
