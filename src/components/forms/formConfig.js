(function() {
  'use strict';
  angular.module('civic.config')
    .constant('formConfig', {
      options: {
        labelColWidth: 2,
        inputColWidth: 5,
        helpColWidth: 5
      },
      validationMessages: {
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '403': 'Forbidden',
        '404': 'Not Found',
        '405': 'Method Not Allowed',
        '406': 'Not Acceptable',
        '409': 'Conflict',
        '500': 'Server Error',
        '501': 'Not Implemented'
      },
      errorPrompts: {
        '400': 'The CIViC Client made a request the server didn\'t like, check the console output for more information.',
        '401': 'You must be logged in to perform that action.',
        '403': 'You do not have sufficient permissions to perform that action.',
        '404': 'The CIViC client made a request to a route that could not be found, check the console output for more information',
        '405': 'The CIViC client made a request that is not supported, check the console output for more information',
        '406': 'TOTALLY UNACCEPTABLE, I CAN\'T EVEN',
        '409': 'The attempted update conflicts with an existing record.',
        '500': 'The CIViC server experienced an unrecoverable error, please check the console output for more information.',
        '501': 'The CIViC client attempted to utilize an unimplemented route.'
      }
    })
    .config(formlyTemplatesConfig)
    .run(formlyTemplatesRun);

  // @ngInject
  function formlyTemplatesRun(formlyValidationMessages) {
    // default messages
    formlyValidationMessages.addTemplateOptionValueMessage('minlength', 'minlength', '', 'is the minimum length', 'Too short.');
    formlyValidationMessages.addTemplateOptionValueMessage('maxlength', 'maxlength', '', 'is the maximum length', 'Too long.');
    formlyValidationMessages.addStringMessage('required', 'This field is required.');
  }

  // @ngInject
  function formlyTemplatesConfig(formlyConfigProvider, formConfig) {


  }
})();
