(function() {
  'use strict';
  angular.module('civic.config')
    .config(evidenceSelectorFieldConfig);

  // @ngInject
  function evidenceSelectorFieldConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'evidenceSelectorField',
      templateUrl: 'components/forms/fieldTypes/evidenceSelectorField.tpl.html',
      defaultOptions: {
        templateOptions: {
          inputOptions: {
            // wrapper: null
          }
        }
      },
      controller: /* @ngInject */ function($scope, _) {
        $scope.removeItem = function(item) {
          $scope.model.evidence_items = _.reject($scope.model.evidence_items, {id: item.id});
        };
      }
    });
  }

})();
