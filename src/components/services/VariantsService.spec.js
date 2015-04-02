'use strict';
describe('VariantsService', function() {
  var $httpBackend,
    servedVariant7,
    servedVariants,
    Variants;

  beforeEach(module('civic.services'));
  beforeEach(module('served/variant7.json'));
  beforeEach(module('served/variants.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Variants = $injector.get('Variants');
    servedVariant7 = $injector.get('servedVariant7');
    servedVariants = $injector.get('servedVariants');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Variants.get(7) should send a GET request to /api/variants/7', function() {
    $httpBackend.expect('GET', '/api/variants/7').respond('200', servedVariant7);
    Variants.get(7);
    $httpBackend.flush();
  });

  it('Variants.query() should send a GET request to /api/variants', function() {
    $httpBackend.expect('GET', '/api/variants').respond('200', servedVariants);
    Variants.query();
    $httpBackend.flush();
  });

  it('Variants.update({ variantId: 7, description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/variants', function() {
    $httpBackend.expect('PUT', '/api/variants').respond('200', {});
    Variants.update({ variantId: 7, description: 'UPDATED DESCRIPTION'});
    $httpBackend.flush();
  });

  it('Variants.addComment({variantId: 7, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/variants/7/comments', function() {
    $httpBackend.expect('POST', '/api/variants/7/comments').respond('200', {});
    Variants.addComment({variantId: 7}, {title: 'comment title', text: 'comment text'});
    $httpBackend.flush();
  });

  it('Variants.getComments(7) should send a GET request to /api/variants/7/comments', function() {
    $httpBackend.expect('GET', '/api/variants/7/comments').respond('200', []);
    Variants.getComments(7);
    $httpBackend.flush();
  });

  it('Variants.getComment({variantId: 7, commentId: 1 }) should send a GET request to /api/variants/7/comments/1', function() {
    $httpBackend.expect('GET', '/api/variants/7/comments/1').respond('200', {});
    Variants.getComment({variantId: 7, commentId: 1});
    $httpBackend.flush();
  });

  it('Variants.getRevisions(7) should send a GET request to /api/variants/7/revisions', function() {
    $httpBackend.expect('GET', '/api/variants/7/revisions').respond('200', []);
    Variants.getRevisions(7);
    $httpBackend.flush();
  });

  it('Variants.getRevision({variantId: 7, revisionId: 1}) should send a GET request to /api/variants/7/revisions/1', function() {
    $httpBackend.expect('GET', '/api/variants/7/revisions/1').respond('200', []);
    Variants.getRevision({variantId: 7, revisionId: 1});
    $httpBackend.flush();
  });

  it('Variants.getSuggestedChanges(7) should send a GET request to /api/variants/7/suggested_changes', function() {
    $httpBackend.expect('GET', '/api/variants/7/suggested_changes').respond('200', []);
    Variants.getSuggestedChanges(7);
    $httpBackend.flush();
  });

  it('Variants.getSuggestedChange({variantId: 7, changeId: 1}) should send a GET request to /api/variants/7/suggested_changes/1', function() {
    $httpBackend.expect('GET', '/api/variants/7/suggested_changes/1').respond('200', []);
    Variants.getSuggestedChange({variantId: 7, changeId: 1});
    $httpBackend.flush();
  });

});
