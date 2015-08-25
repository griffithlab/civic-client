(function() {
  'use strict';
  angular.module('civic.add.evidence', []);
  angular.module('civic.add')
    .config(AddViewConfig)
    .controller('AddViewController', AddViewController);

  // @ngInject
  function AddViewConfig($stateProvider) {
    $stateProvider
      .state('add', {
        abstract: true,
        url: '/add',
        template: '<ui-view autoscroll="true" id="add-view"></ui-view>',
        controller: 'AddViewController',
        onExit: /* @ngInject */ function($deepStateRedirect) {
          $deepStateRedirect.reset();
        }
      });

  }

  // @ngInject
  function AddViewController() {
    // console.log('AddViewController instantiated.');
  }

})();
