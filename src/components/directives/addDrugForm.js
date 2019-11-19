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
                                 DrugService,
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
      name: ''
    };

    vm.newDrugFields = [
      {
        key: 'name',
        type: 'input',
        templateOptions: {
          label: 'Drug Name',
          required: true
        }
      }
    ];

    vm.submit = function() {
      console.log('new drug submitted.');
      DrugsService.add(this.newDrug.name)
        .then(function(response) {
          console.log('drug added successfully');
        });
      vm.replaceItem(this.parentField.value(), this.index, this.newDrug.name);
    };

    vm.replaceItem = function(newDrug) {
      vm.replaceItem(this.parentField.value(), this.index, this.newDrug.name);
    };
  }
})();
