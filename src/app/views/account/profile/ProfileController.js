(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountProfileController', AccountProfileController);


  // @ngInject
  function AccountProfileController($scope,
                                    Security,
                                    Users,
                                    user){
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
          helpText: 'Email address will not be visible to others or shared and will only be used for sending CIViC notifications, news, and updates.'
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
      },
      {
        key: 'orcid',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'ORCID',
          minLength: 5,
          value: 'vm.userEdit.orcid',
          helpText: 'Your Open Research and Contributor ID. Please only include the ID.'
        }
      },
      {
        key: 'url',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Personal Website',
          minLength: 5,
          value: 'vm.userEdit.url',
          helpText: 'Your personal website/blog. Please only include the domain and path, omitting the \'https://\' protocol part.'
        }
      },
      {
        key: 'bio',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          label: 'Biography',
          rows: 4,
          value: 'vm.userEdit.bio',
          helpText: 'A short bio describing your interests, accomplishments, associations, and/or anything else about yourself you would like to share with the CIViC community.'
        }
      },
      {
        template:'<h3 class="form-subheader">Social Media</h3>'
      },
      {
        key: 'twitter_handle',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Twitter Handle',
          minLength: 5,
          value: 'vm.userEdit.twitter_handle',
          helpText: 'Your Twitter handle, displayed on your profile page and user cards.'
        }
      },
      {
        key: 'facebook_profile',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'Facebook Profile',
          minLength: 5,
          value: 'vm.userEdit.facebook_profile',
          helpText: 'Your Facebook handle, displayed on your profile page and user cards.'
        }
      },
      {
        key: 'linkedin_profile',
        type: 'horizontalInputHelp',
        templateOptions: {
          label: 'LinkedIn Profile',
          minLength: 5,
          value: 'vm.userEdit.linkedin_profile',
          helpText: 'Your LinkedIn username, displayed on your profile page and user cards.'
        }
      }
    ];

    vm.saveProfile = function(userEdit) {

      Users.update(userEdit)
        .then(function() {
          console.log('updated user successfully');
          vm.submitSuccess = true;
          vm.user = Security.reloadCurrentUser();
        })
        .catch(function() {
          console.error('update user error!');
          vm.submitFail = true;
        });

    };
  }
})();
