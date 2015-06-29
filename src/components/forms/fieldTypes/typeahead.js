(function() {
  'use strict';
  angular.module('civic.config')
    .config(typeaheadConfig);

  // @ngInject
  function typeaheadConfig(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'typeahead',
      templateUrl: 'components/forms/fieldTypes/typeahead.tpl.html'
    });

    formlyConfigProvider.setType({
      name: 'horizontalTypeaheadHelp',
      extends: 'typeahead',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });
  }

})();
