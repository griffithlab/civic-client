(function() {
  'use strict';
  angular.module('civic.users.profile')
    .controller('ProfileEditController', ProfileEditController);

  // @ngInject
  function ProfileEditController ($scope, Security, Users, user){
    var vm = $scope.vm = {};

    vm.user = user;
    vm.userEdit = angular.copy(user);
    vm.currentUser = Security.currentUser;

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
          helpText: 'Email address will be used for sending CIViC notifications, news, and updates.'
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
        })
      .catch(function(error) {
          console.error('update user error!');
          vm.submitFail = false;
        })

    }
  }
})();
