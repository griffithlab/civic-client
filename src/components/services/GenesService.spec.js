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

  it('Genes.get(238) should send a GET request to /api/genes/238', function() {
    $httpBackend.expect('GET', '/api/genes/238').respond('200', servedGene238);
    Genes.get(238);
    $httpBackend.flush();
  });

  it('Genes.query() should send a GET request to /api/genes', function() {
    $httpBackend.expect('GET', '/api/genes').respond('200', servedGenes);
    Genes.query();
    $httpBackend.flush();
  });

  it('Genes.update({ geneId: 238, description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/genes', function() {
    $httpBackend.expect('PUT', '/api/genes').respond('200', {});
    Genes.update({ geneId: 238, description: 'UPDATED DESCRIPTION'});
    $httpBackend.flush();
  });

  it('Genes.addComment({geneId: 238, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/genes/238/comments', function() {
    $httpBackend.expect('POST', '/api/genes/238/comments').respond('200', {});
    Genes.addComment({geneId: 238}, {title: 'comment title', text: 'comment text'});
    $httpBackend.flush();
  });

  it('Genes.getComments(238) should send a GET request to /api/genes/238/comments', function() {
    $httpBackend.expect('GET', '/api/genes/238/comments').respond('200', []);
    Genes.getComments(238);
    $httpBackend.flush();
  });

  it('Genes.getComment({geneId: 238, commentId: 1 }) should send a GET request to /api/genes/238/comments/1', function() {
    $httpBackend.expect('GET', '/api/genes/238/comments/1').respond('200', {});
    Genes.getComment({geneId: 238, commentId: 1});
    $httpBackend.flush();
  });

  it('Genes.getRevisions(238) should send a GET request to /api/genes/238/revisions', function() {
    $httpBackend.expect('GET', '/api/genes/238/revisions').respond('200', []);
    Genes.getRevisions(238);
    $httpBackend.flush();
  });

  it('Genes.getRevision({geneId: 238, revisionId: 1}) should send a GET request to /api/genes/238/revisions/1', function() {
    $httpBackend.expect('GET', '/api/genes/238/revisions/1').respond('200', []);
    Genes.getRevision({geneId: 238, revisionId: 1});
    $httpBackend.flush();
  });

  it('Genes.getSuggestedChanges(238) should send a GET request to /api/genes/238/suggested_changes', function() {
    $httpBackend.expect('GET', '/api/genes/238/suggested_changes').respond('200', []);
    Genes.getSuggestedChanges(238);
    $httpBackend.flush();
  });

  it('Genes.getSuggestedChange({geneId: 238, changeId: 1}) should send a GET request to /api/genes/238/suggested_changes/1', function() {
    $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1').respond('200', []);
    Genes.getSuggestedChange({geneId: 238, changeId: 1});
    $httpBackend.flush();
  });

});
