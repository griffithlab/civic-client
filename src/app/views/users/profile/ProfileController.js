(function() {
  angular.module('civic.users.profile')
  .controller('ProfileController', ProfileController);

  // @ngInject
  function ProfileController() {
    console.log('ProfileController called.');
  }
})();
