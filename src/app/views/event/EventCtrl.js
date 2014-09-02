(function() {
  'use strict';
  angular.module('civic.event')
    .controller('EventCtrl', EventCtrl);

  // @ngInject
  function EventCtrl($log) {
    $log.info('EventCtrl called.');
  }
})();
