(function() {
  'use strict';
  angular.module('civic.config')
    .constant('formConfig', {
      errorMessages: {
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '409': 'Conflict',
        '500': 'Server Error',
        '501': 'Not Implemented'
      }
    });
})();
