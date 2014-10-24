(function() {
  'use strict';
  angular.module('civic.services')
    .constant('ConfigService', {
      serverUrl: 'http://localhost:3000/',
      mainMenuItems: [
        {
          label: 'Collaborate',
          state: 'collaborate'
        },
        {
          label: 'Help',
          state: 'help'
        },
        {
          label: 'Contact',
          state: 'contact'
        }
      ]
    }
  );
})();

