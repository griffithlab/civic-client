(function() {
  'use strict';
  angular.module('civic.config')
    .config(multiInputConfig);

  // @ngInject
  function multiInputConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'multiInput',
      templateUrl: 'components/forms/fieldTypes/multiInput.tpl.html',
      defaultOptions: {
        noFormControl: true,
        wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError'],
        templateOptions: {
          inputOptions: {
            // wrapper: null
          }
        }
      },
      controller: /* @ngInject */ function(_, $scope) {
        $scope.copyItemOptions = copyItemOptions;
        $scope.replaceItem = replaceItem;
        $scope.deleteItem = deleteItem;
        $scope.addItem = addItem;

        $scope.hasDups = function() {
          var model = _.without($scope.model[$scope.options.key], '');
          return _.uniq(model).length !== model.length;
        };

        function deleteItem(model, index) {
          model.splice(index,1);
        }

        function addItem(model, index) {
          model.splice(index+1, 0, '');
        }

        function replaceItem(model, index, value) {
          model[index] = value;
        }

        function copyItemOptions() {
          return angular.copy($scope.to.inputOptions);
        }
      }
    });
  }

})();
