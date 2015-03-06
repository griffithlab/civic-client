(function() {
  'use strict';
  angular.module('civic.services')
    .constant('ConfigService', {
      serverUrl: 'http://127.0.0.1:3000/',
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
          label: 'FAQ',
          state: 'faq'
        }
      ],
      footerMenuItems: [
        {
          label: 'Glossary of Terms',
          state: 'glossary'
        },
        {
          label: 'API Documentation',
          state: 'api'
        },
        {
          label: 'Contact',
          state: 'contact'
        }
      ]
    }
  );
})();

