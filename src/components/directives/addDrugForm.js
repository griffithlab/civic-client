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
      scope: {},
      controller: addDrugFormController
    };

    return directive;
  }

  function addDrugFormController($scope,
                                 ConfigService) {
    var vm = $scope.vm = {};

    var newDrug = {
      name: ''
    };

    var newDrugFields = [
      {
        key: 'name',
        type: 'horizontalTypeahead',
        wrapper: null,
        templateOptions: {
          label: 'Drug Name',
          required: true
        }
      }
    ];

    vm.submit = function(newDrug, options) {
      console.log('New Drug Submitted');
    };
  }
})();
