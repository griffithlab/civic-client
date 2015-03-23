'use strict';

describe('civicClient', function(){
  var scope;
  beforeEach(module('civicClient'));
  beforeEach(inject(function($rootScope) {
    console.log('beforeEach block');
  }));

  it('creates a view object on $rootScope to hold global view attributes', inject(function($rootScope) {
      console.log('it block');
      expect($rootScope.view).to.be.an('object');
    })
  );
});
