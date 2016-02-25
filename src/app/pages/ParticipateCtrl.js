(function() {
  'use strict';
  angular
    .module('civic.pages')
    .controller('ParticipateCtrl', ParticipateCtrl);

// @ngInject
  function ParticipateCtrl ($scope, $modal) {
    var vm = $scope.vm = {};

    vm.imgPopup = function imgPopup() {
      $modal.open({
        animation: false,
        backdrop: true,
        template: '<div><img src="assets/images/GP-113_CIViC_schema-collaboration_PROCESS_v1a.png" ' +
        'class="img-fluid" width="100%" height="100%" ' +
        'alt="CIViC Participate Diagram" ' +
        'ng-click="$close()"' +
        '/></div>',
        size: 'lg'
      });
    };
  }
})();
