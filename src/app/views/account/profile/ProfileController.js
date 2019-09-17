(function() {
  'use strict';
  angular.module('civic.account')
    .controller('AccountProfileController', AccountProfileController);


  // @ngInject
  function AccountProfileController($scope,
                                    Security,
                                    Users,
                                    CurrentUser,
                                    user,
                                    statements){
    var vm = $scope.vm = {};

    vm.user = user;
    vm.statements = statements;
    vm.userEdit = angular.copy(user);
    vm.userEdit.country_id = vm.userEdit.country === null ? null : vm.userEdit.country.id;
    vm.currentUser = Security.currentUser;

    vm.coiEdit = {
      coi_present: false,
      coi_statement: ''
    };

    // TODO: implement better error handling and success message
    vm.submitSuccess = false;
    vm.submitFail = false;

    vm.submitCoiSuccess = false;
    vm.submitCoiFail = false;

    $scope.$watchCollection(function() {
      return CurrentUser.data.statements;
    }, function(statements) {
      vm.statements = statements;
    });

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
        key: 'country_id',
        type: 'horizontalSelectHelp',
        templateOptions: {
          label: 'Country',
          options: [
            { value: null, label: 'Choose Your Country' },
            { value: 1, label: 'Afghanistan' },
            { value: 2, label: 'Albania' },
            { value: 3, label: 'Algeria' },
            { value: 4, label: 'American Samoa' },
            { value: 5, label: 'Andorra' },
            { value: 6, label: 'Angola' },
            { value: 7, label: 'Anguilla' },
            { value: 8, label: 'Antigua and Barbuda' },
            { value: 9, label: 'Argentina' },
            { value: 10, label: 'Armenia' },
            { value: 11, label: 'Aruba' },
            { value: 12, label: 'Australia' },
            { value: 13, label: 'Austria' },
            { value: 14, label: 'Azerbaijan' },
            { value: 15, label: 'Bahamas' },
            { value: 16, label: 'Bahrain' },
            { value: 17, label: 'Bangladesh' },
            { value: 18, label: 'Barbados' },
            { value: 19, label: 'Belarus' },
            { value: 20, label: 'Belgium' },
            { value: 21, label: 'Belize' },
            { value: 22, label: 'Benin' },
            { value: 23, label: 'Bermuda' },
            { value: 24, label: 'Bhutan' },
            { value: 25, label: 'Bolivia' },
            { value: 26, label: 'Bosnia and Herzegovina' },
            { value: 27, label: 'Botswana' },
            { value: 28, label: 'Brazil' },
            { value: 29, label: 'Brunei Darussalam' },
            { value: 30, label: 'Bulgaria' },
            { value: 31, label: 'Burkina Faso' },
            { value: 32, label: 'Burundi' },
            { value: 33, label: 'Cambodia' },
            { value: 34, label: 'Cameroon' },
            { value: 35, label: 'Canada' },
            { value: 36, label: 'Cape Verde' },
            { value: 37, label: 'Cayman Islands' },
            { value: 38, label: 'Central African Republic' },
            { value: 39, label: 'Chad' },
            { value: 40, label: 'Chile' },
            { value: 41, label: 'China' },
            { value: 42, label: 'Colombia' },
            { value: 43, label: 'Comoros' },
            { value: 44, label: 'Congo' },
            { value: 45, label: 'Congo, the Democratic Republic of the' },
            { value: 46, label: 'Cook Islands' },
            { value: 47, label: 'Costa Rica' },
            { value: 48, label: 'Cote D\'Ivoire' },
            { value: 49, label: 'Croatia' },
            { value: 50, label: 'Cuba' },
            { value: 51, label: 'Cyprus' },
            { value: 52, label: 'Czech Republic' },
            { value: 53, label: 'Denmark' },
            { value: 54, label: 'Djibouti' },
            { value: 55, label: 'Dominica' },
            { value: 56, label: 'Dominican Republic' },
            { value: 57, label: 'Ecuador' },
            { value: 58, label: 'Egypt' },
            { value: 59, label: 'El Salvador' },
            { value: 60, label: 'Equatorial Guinea' },
            { value: 61, label: 'Eritrea' },
            { value: 62, label: 'Estonia' },
            { value: 63, label: 'Ethiopia' },
            { value: 64, label: 'Falkland Islands (Malvinas)' },
            { value: 65, label: 'Faroe Islands' },
            { value: 66, label: 'Fiji' },
            { value: 67, label: 'Finland' },
            { value: 68, label: 'France' },
            { value: 69, label: 'French Guiana' },
            { value: 70, label: 'French Polynesia' },
            { value: 71, label: 'Gabon' },
            { value: 72, label: 'Gambia' },
            { value: 73, label: 'Georgia' },
            { value: 74, label: 'Germany' },
            { value: 75, label: 'Ghana' },
            { value: 76, label: 'Gibraltar' },
            { value: 77, label: 'Greece' },
            { value: 78, label: 'Greenland' },
            { value: 79, label: 'Grenada' },
            { value: 80, label: 'Guadeloupe' },
            { value: 81, label: 'Guam' },
            { value: 82, label: 'Guatemala' },
            { value: 83, label: 'Guinea' },
            { value: 84, label: 'Guinea-Bissau' },
            { value: 85, label: 'Guyana' },
            { value: 86, label: 'Haiti' },
            { value: 87, label: 'Holy See (Vatican City State)' },
            { value: 88, label: 'Honduras' },
            { value: 89, label: 'Hong Kong' },
            { value: 90, label: 'Hungary' },
            { value: 91, label: 'Iceland' },
            { value: 92, label: 'India' },
            { value: 93, label: 'Indonesia' },
            { value: 94, label: 'Iran, Islamic Republic of' },
            { value: 95, label: 'Iraq' },
            { value: 96, label: 'Ireland' },
            { value: 97, label: 'Israel' },
            { value: 98, label: 'Italy' },
            { value: 99, label: 'Jamaica' },
            { value: 100, label: 'Japan' },
            { value: 101, label: 'Jordan' },
            { value: 102, label: 'Kazakhstan' },
            { value: 103, label: 'Kenya' },
            { value: 104, label: 'Kiribati' },
            { value: 105, label: 'Korea, Democratic People\'s Republic of' },
            { value: 106, label: 'Korea, Republic of' },
            { value: 107, label: 'Kuwait' },
            { value: 108, label: 'Kyrgyzstan' },
            { value: 109, label: 'Lao People\'s Democratic Republic' },
            { value: 110, label: 'Latvia' },
            { value: 111, label: 'Lebanon' },
            { value: 112, label: 'Lesotho' },
            { value: 113, label: 'Liberia' },
            { value: 114, label: 'Libyan Arab Jamahiriya' },
            { value: 115, label: 'Liechtenstein' },
            { value: 116, label: 'Lithuania' },
            { value: 117, label: 'Luxembourg' },
            { value: 118, label: 'Macao' },
            { value: 119, label: 'Macedonia, the Former Yugoslav Republic of' },
            { value: 120, label: 'Madagascar' },
            { value: 121, label: 'Malawi' },
            { value: 122, label: 'Malaysia' },
            { value: 123, label: 'Maldives' },
            { value: 124, label: 'Mali' },
            { value: 125, label: 'Malta' },
            { value: 126, label: 'Marshall Islands' },
            { value: 127, label: 'Martinique' },
            { value: 128, label: 'Mauritania' },
            { value: 129, label: 'Mauritius' },
            { value: 130, label: 'Mexico' },
            { value: 131, label: 'Micronesia, Federated States of' },
            { value: 132, label: 'Moldova, Republic of' },
            { value: 133, label: 'Monaco' },
            { value: 134, label: 'Mongolia' },
            { value: 135, label: 'Montserrat' },
            { value: 136, label: 'Morocco' },
            { value: 137, label: 'Mozambique' },
            { value: 138, label: 'Myanmar' },
            { value: 139, label: 'Namibia' },
            { value: 140, label: 'Nauru' },
            { value: 141, label: 'Nepal' },
            { value: 142, label: 'Netherlands' },
            { value: 143, label: 'Netherlands Antilles' },
            { value: 144, label: 'New Caledonia' },
            { value: 145, label: 'New Zealand' },
            { value: 146, label: 'Nicaragua' },
            { value: 147, label: 'Niger' },
            { value: 148, label: 'Nigeria' },
            { value: 149, label: 'Niue' },
            { value: 150, label: 'Norfolk Island' },
            { value: 151, label: 'Northern Mariana Islands' },
            { value: 152, label: 'Norway' },
            { value: 153, label: 'Oman' },
            { value: 154, label: 'Pakistan' },
            { value: 155, label: 'Palau' },
            { value: 156, label: 'Panama' },
            { value: 157, label: 'Papua New Guinea' },
            { value: 158, label: 'Paraguay' },
            { value: 159, label: 'Peru' },
            { value: 160, label: 'Philippines' },
            { value: 161, label: 'Pitcairn' },
            { value: 162, label: 'Poland' },
            { value: 163, label: 'Portugal' },
            { value: 164, label: 'Puerto Rico' },
            { value: 165, label: 'Qatar' },
            { value: 166, label: 'Reunion' },
            { value: 167, label: 'Romania' },
            { value: 168, label: 'Russian Federation' },
            { value: 169, label: 'Rwanda' },
            { value: 170, label: 'Saint Helena' },
            { value: 171, label: 'Saint Kitts and Nevis' },
            { value: 172, label: 'Saint Lucia' },
            { value: 173, label: 'Saint Pierre and Miquelon' },
            { value: 174, label: 'Saint Vincent and the Grenadines' },
            { value: 175, label: 'Samoa' },
            { value: 176, label: 'San Marino' },
            { value: 177, label: 'Sao Tome and Principe' },
            { value: 178, label: 'Saudi Arabia' },
            { value: 179, label: 'Senegal' },
            { value: 180, label: 'Seychelles' },
            { value: 181, label: 'Sierra Leone' },
            { value: 182, label: 'Singapore' },
            { value: 183, label: 'Slovakia' },
            { value: 184, label: 'Slovenia' },
            { value: 185, label: 'Solomon Islands' },
            { value: 186, label: 'Somalia' },
            { value: 187, label: 'South Africa' },
            { value: 188, label: 'Spain' },
            { value: 189, label: 'Sri Lanka' },
            { value: 190, label: 'Sudan' },
            { value: 191, label: 'Suriname' },
            { value: 192, label: 'Svalbard and Jan Mayen' },
            { value: 193, label: 'Swaziland' },
            { value: 194, label: 'Sweden' },
            { value: 195, label: 'Switzerland' },
            { value: 196, label: 'Syrian Arab Republic' },
            { value: 197, label: 'Taiwan, Province of China' },
            { value: 198, label: 'Tajikistan' },
            { value: 199, label: 'Tanzania, United Republic of' },
            { value: 200, label: 'Thailand' },
            { value: 201, label: 'Togo' },
            { value: 202, label: 'Tokelau' },
            { value: 203, label: 'Tonga' },
            { value: 204, label: 'Trinidad and Tobago' },
            { value: 205, label: 'Tunisia' },
            { value: 206, label: 'Turkey' },
            { value: 207, label: 'Turkmenistan' },
            { value: 208, label: 'Turks and Caicos Islands' },
            { value: 209, label: 'Tuvalu' },
            { value: 210, label: 'Uganda' },
            { value: 211, label: 'Ukraine' },
            { value: 212, label: 'United Arab Emirates' },
            { value: 213, label: 'United Kingdom' },
            { value: 214, label: 'United States' },
            { value: 215, label: 'Uruguay' },
            { value: 216, label: 'Uzbekistan' },
            { value: 217, label: 'Vanuatu' },
            { value: 218, label: 'Venezuela' },
            { value: 219, label: 'Viet Nam' },
            { value: 220, label: 'Virgin Islands, British' },
            { value: 221, label: 'Virgin Islands, U.s.' },
            { value: 222, label: 'Wallis and Futuna' },
            { value: 223, label: 'Western Sahara' },
            { value: 224, label: 'Yemen' },
            { value: 225, label: 'Zambia' },
            { value: 226, label: 'Zimbabwe' }
          ],
          valueProp: 'value',
          labelProp: 'label',
          value: 'vm.userEdit.country',
          helpText: 'Please choose your country of residence/study.'
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
      },
    ];

    vm.coiFields = [
      {
        key: 'coi_present',
        type: 'horizontalRadioHelp',
        defaultValue: 'false',
        templateOptions: {
          label: null,
          options: [
            {value: false, name: 'I do not have any potential conflicts of interest'},
            {value: true, name: 'I do have a potential conflict of interest'},
          ],
          helpText: 'Please indicate if you have a conflict of interest in curating CIViC.'
        }
      },
      {
        key: 'coi_statement',
        type: 'horizontalTextareaHelp',
        templateOptions: {
          label: 'COI Statement',
          rows: 4,
          helpText: 'Provide a concise description of any potential or actual conflicts of interest that you may have in curating CIViC.'
        },
        hideExpression: '!model.coi_present',
        expressionProperties: {
          'templateOptions.required': 'model.coi_present === true'
        }
      },
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

    vm.saveCoiStatement = function(coiEdit, coiOptions) {
      CurrentUser.addCoiStatement(coiEdit)
        .then(function() {
          console.log('added COI statement successfully.');
          vm.submitCoiSuccess = true;
          coiOptions.resetModel();
        })
        .catch(function() {
          console.error('failed to add COI statement!');
          vm.submitCoiFail = true;
        });
    };
  }
})();
