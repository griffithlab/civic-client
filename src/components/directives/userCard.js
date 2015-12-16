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

    // MOCK EVENT
    vm.user.last_event = {'id':911,'timestamp':'2015-12-14T17:13:41.728Z','subject_id':409,'subject_type':'evidenceitems','event_type':'rejected','description':'Joshua McMichael rejected a submitted evidence item','state_params':{'gene':{'id':5,'name':'ABL1'},'variant':{'id':1,'name':'BCR-ABL8'},'evidence_item':{'id':409,'name':'EID409'}},'user':{'id':2,'email':'jmcmichael@gmail.com','name':'Joshua McMichael','last_seen_at':'2015-12-14T17:58:07.214Z','username':null,'role':'admin','avatar_url':'https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon&r=pg&s=32','avatars':{'x128':'https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon&r=pg&s=128','x64':'https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon&r=pg&s=64','x32':'https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon&r=pg&s=32','x14':'https://secure.gravatar.com/avatar/094be4476cc475b8636ad534ffc6ac6b.png?d=identicon&r=pg&s=14'},'area_of_expertise':null,'orcid':null,'display_name':'Joshua McMichael'},'$$hashKey':'object:78'};

    // MOCK ACTIVITY LEVEL
    vm.user.activity_level = 888;

    var params = vm.user.last_event.state_params;
    vm.entityNames = [];

    if(_.has(params, 'gene')) {vm.entityNames.push(params.gene.name);}
    if(_.has(params, 'variant')) {vm.entityNames.push(params.variant.name);}
    if(_.has(params, 'evidence_item')) {vm.entityNames.push(params.evidence_item.name);}

    vm.entityName = _.compact(vm.entityNames).join(' / ');

    vm.userClick = function(id) {
      $state.go('users.profile', { userId: id});
    };

  }
})();
