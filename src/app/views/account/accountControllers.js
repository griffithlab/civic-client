(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountViewController', AccountViewController)
    .controller('AccountMentionsController', AccountMentionsController)
    .controller('AccountSubscribedController', AccountSubscribedController)
    .controller('AccountMessagesController', AccountMessagesController);

  // @ngInject
  function AccountViewController($scope) {
    var vm = $scope.vm = {};
    vm.tabs = {
      notifiations: [
        {
          heading: 'Mentions',
          state: 'account.mentions'
        },
        {
          heading: 'Subscribed',
          state: 'account.subscribed'
        }
        ,
        {
          heading: 'Messages',
          state: 'account.messages'
        }
      ]
    };
  }

  // @ngInject
  function AccountMentionsController() {
    console.log('AccountMentionsController called.');
  }

  // @ngInject
  function AccountEventsController() {
    console.log('AccountEventsController called.');
  }

  // @ngInject
  function AccountSubscribedController() {
    console.log('AccountSubscribedController called.');
  }

  // @ngInject
  function AccountMessagesController() {
    console.log('AccountMessagesController called.');
  }
})();
