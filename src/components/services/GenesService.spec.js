'use strict';
describe('GenesService', function() {
  var $httpBackend,
    gene238,
    Genes;

  beforeEach(module('civic.services'));
  beforeEach(module('served/gene238.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Genes = $injector.get('Genes');
    gene238 = $injector.get('servedGene238');
  }));

  it('getGene should send a request', function() {
    var gene;
    $httpBackend.when('GET', '/api/genes/238').respond('200', gene238);
    $httpBackend.expect('GET', '/api/genes/238').respond('200', gene238);
    Genes.get(238).then(function(response){
      gene = response;
    });
    expect(gene.entrez_id).to.eventually.equal(238);
  })
});
