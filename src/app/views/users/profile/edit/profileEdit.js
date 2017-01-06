(function() {
  'use strict';
  angular.module('civic.users.profile')
    .controller('ProfileEditController', ProfileEditController);

  // @ngInject
  function ProfileEditController ($scope,
                                  $state,
                                  $interval,
                                  Security,
                                  Users,
                                  user){
    var vm = $scope.vm = {};

    vm.user = user;
    vm.userEdit = angular.copy(user);
    vm.currentUser = Security.currentUser;
    vm.secondsReturn = 5;

    // TODO: implement better error handling and success message
    vm.submitSuccess = false;
    vm.submitFail = false;

    vm.userEditFields = [
      {
        key: 'name',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Name',
          minLength: 8,
          value: 'vm.userEdit.name',
          helpText: 'Name'
        }
      },
      {
        key: 'username',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'User Name',
          minLength: 8,
          value: 'vm.userEdit.user',
          helpText: 'Username'
        }
      },
      {
        key: 'email',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Email Address',
          minLength: 5,
          value: 'vm.userEdit.email',
          helpText: 'Email address will not be visible to others or shared. Email addresses will only be used for sending CIViC notifications, news, and updates.'
        }
      },
      {
        key: 'area_of_expertise',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Areas of Expertise',
          options: [
            { value: null, label: 'Please select an Area of Expertise' },
            { value: 'Patient Advocate', label: 'Patient Advocate'},
            { value: 'Clinical Scientist', label: 'Clinical Scientist' },
            { value: 'Research Scientist', label: 'Research Scientist' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          value: 'vm.userEdit.area_of_expertise',
          helpText: 'Area of Expertise'
        }
      }
    ];

    vm.saveProfile = function(userEdit) {

      Users.update(userEdit)
        .then(function(response) {
          console.log('updated user successfully');
          vm.user = Security.currentUser = response;
          vm.submitSuccess = true;
          vm.count = vm.secondsReturn;
          var int = $interval(function() {
            if (vm.count <= 1) {
              $state.go('users.profile', { userId: user.id });
              $interval.cancel(int);
            } else {
              vm.count--;
            }
          }, 1000);

        })
        .catch(function() {
          console.error('update user error!');
          vm.submitFail = false;
        });

    };
  }
})();
