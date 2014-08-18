angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000/',
    mainMenuItems: [
      {
        label: 'Home',
        state: 'home'
      },
      {
        label: 'Auth Test',
        state: 'authTest'
      }
    ]
  }
);

