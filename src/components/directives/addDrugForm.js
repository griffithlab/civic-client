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

  // @ngInject
  function addDrugFormController($rootScope,
                                 $scope,
                                 Drugs,
                                 DrugSuggestions,
                                 ConfigService,
                                 _) {
    var vm = $scope.vm = { };
    vm.parentField = _.find($scope.fields, { key: $scope.options.key }); // ref to parent's form field object
    vm.index = $scope.$index; // $index value assigned by angular-formly
    vm.replaceItem = $scope.replaceItem; // ref to replaceItem function on multiInput controller
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
        type: 'typeahead',
        wrapper: null,
        templateOptions: {
          label: 'New Drug Name',
          typeahead: 'item.name for item in options.data.typeaheadSearch($viewValue)',
          templateUrl: 'components/forms/fieldTypes/drugTypeahead.tpl.html',
          editable: true
        },
        data: {
          typeaheadSearch: function(val) {
            return DrugSuggestions.query(val)
              .then(function(response) {
                var labelLimit = 100;
                return _.map(response, function(drug) {
                  if (drug.aliases.length > 0) {
                    drug.alias_list = drug.aliases.join(', ');
                    if(drug.alias_list.length > labelLimit) { drug.alias_list = _.truncate(drug.alias_list, labelLimit); }
                  } else {
                    drug.alias_list = '--';
                  }
                  return drug;
                });
              });
          }
        }
      }
    ];

    vm.close = function() {
      $scope.$parent.addFormIsOpen = false;
    };

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
      var drug = vm.createdDrug ? vm.createdDrug.name : vm.conflictDrug.name;
      vm.replaceItem(this.parentField.value(), this.index, drug);
    };
  }
})();
