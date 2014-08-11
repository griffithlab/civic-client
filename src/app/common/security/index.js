// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('civic.security', [
  'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
  ,'civic.security.authorization'
]);
