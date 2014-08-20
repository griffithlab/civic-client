angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000/',
    mainMenuItems: [
      {
        label: 'Home',
        state: 'home'
      },
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

