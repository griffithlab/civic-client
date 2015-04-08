'use strict';
/*jshint expr:true */
describe('entityView', function () {
  var $rootScope,
    $state,
    $controller,
    $httpBackend,

    scope;

  beforeEach(function () {
    module('civic.events.common');

    // inject services
    inject(function(_$rootScope_,
                    _$controller_,
                    _$httpBackend_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $httpBackend = _$httpBackend_;

    });
  });

  describe('controller instantiation', function(){
    it('is successfully instantiated using resolved state dependencies', function() {
      // expect(GenesViewController).to.exist;
    });
  });

});
