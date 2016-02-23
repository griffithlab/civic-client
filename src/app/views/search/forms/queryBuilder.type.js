(function() {
  'use strict';
  angular.module('civic.search')
    .config(queryBuilderConfig);

  // @ngInject
  function queryBuilderConfig(formlyConfigProvider) {
    var unique = 1;

    formlyConfigProvider.setType({
      name: 'queryBuilderSelect',
      extends: 'select',
      controller: function($scope, $parse) {
        // angular-formly's options.defaultValue appears to ignore current model values,
        // so we must implement our own default value feature here
        var getter = $parse($scope.options.key);
        var setter = getter.assign;
        if(getter($scope.model) === undefined) {
          // no model value found, so set field value to default value
          setter($scope.model, $scope.options.data.defaultValue);
        }
      }
    });

    formlyConfigProvider.setType({
      name: 'queryRow',
      templateUrl: 'app/views/search/forms/queryBuilder.type.tpl.html',
      controller: /* @ngInject */ function($scope) {
        $scope.formOptions = {formState: $scope.formState};
        $scope.addNew = addNew;

        $scope.copyFields = copyFields;

        function copyFields(fields) {
          fields = angular.copy(fields);
          addRandomIds(fields);
          return fields;
        }

        function addNew() {
          $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
          var repeatsection = $scope.model[$scope.options.key];
          //var lastSection = repeatsection[repeatsection.length - 1];
          var newsection = { field: '', condition: { name: undefined, parameters: [] } };
          //if (lastSection) {
          //  newsection = angular.copy(lastSection);
          //}
          repeatsection.push(newsection);
        }

        function addRandomIds(fields) {
          unique++;
          angular.forEach(fields, function(field, index) {
            if (field.fieldGroup) {
              addRandomIds(field.fieldGroup);
              return; // fieldGroups don't need an ID
            }

            if (field.templateOptions && field.templateOptions.fields) {
              addRandomIds(field.templateOptions.fields);
            }

            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
          });
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
    });
  }

})();
