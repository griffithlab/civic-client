(function() {
  'use strict';
  angular.module('civic.activity')
    .config(ActivityView);

  // @ngInject
  function ActivityView($stateProvider) {
    $stateProvider
      .state('activity', {
        url: '/activity',
        controller: 'ActivityController',
        templateUrl: 'app/views/activity/activity.tpl.html',
        data: {
          titleExp: '"Activity"',
          navMode: 'sub'
        }
      });
  }

})();
