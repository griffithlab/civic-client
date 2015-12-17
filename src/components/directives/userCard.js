(function() {
  'use strict';

  angular.module('civic.common')
    .directive('userCard', userCardDirective)
    .controller('UserCardController', UserCardController);

  // @ngInject
  function userCardDirective() {
    return /* @ngInject */ {
      restrict: 'E',
      scope: {
        user: '='
      },
      controller: 'UserCardController as vm',
      bindToController: true,
      templateUrl: 'components/directives/userCard.tpl.html'
    };
  }

  // @inject
  function UserCardController($state) {
    console.log('userCard controller called.');
    var vm = this;

    if (!_.isUndefined(vm.user.last_event)) {
      var params = vm.user.last_event.state_params;
      vm.entityNames = [];

      if (_.has(params, 'gene')) {
        vm.entityNames.push(params.gene.name);
      }
      if (_.has(params, 'variant')) {
        vm.entityNames.push(params.variant.name);
      }
      if (_.has(params, 'evidence_item')) {
        vm.entityNames.push(params.evidence_item.name);
      }

      vm.entityName = _.compact(vm.entityNames).join(' / ');
    }
    
    vm.userClick = function(id) {
      $state.go('users.profile', { userId: id});
    };

  }
})();
