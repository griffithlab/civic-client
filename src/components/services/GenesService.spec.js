'use strict';
describe('GenesService', function() {
  var $httpBackend,
    servedGene238,
    servedGenes,
    Genes;

  beforeEach(module('civic.services'));
  beforeEach(module('served/gene238.json'));
  beforeEach(module('served/genes.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Genes = $injector.get('Genes');
    servedGene238 = $injector.get('servedGene238');
    servedGenes = $injector.get('servedGenes');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Genes.get(238) should send a request', function() {
    $httpBackend.expect('GET', '/api/genes/238').respond('200', servedGene238);
    Genes.get(238);
    $httpBackend.flush();
  });

  it('Genes.query() should send a request', function() {
    $httpBackend.expect('GET', '/api/genes').respond('200', servedGenes);
    Genes.query();
    $httpBackend.flush();
  });

});
