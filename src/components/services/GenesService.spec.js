'use strict';
describe('GenesService', function() {
  var $httpBackend,
    servedGene238,
    servedGenes,
    servedGene238Variants,
    Genes;

  beforeEach(module('civic.services'));
  beforeEach(module('served/gene238.json'));
  beforeEach(module('served/genes.json'));
  beforeEach(module('served/gene238Variants.json'));

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Genes = $injector.get('Genes');
    servedGene238 = $injector.get('servedGene238');
    servedGenes = $injector.get('servedGenes');
    servedGene238Variants = $injector.get('servedGene238Variants');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('/api/genes path', function() {
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
  });

  describe('/api/genes/:geneId/variants path', function() {
    it('Genes.getVariants(238) should send a GET request to /api/genes/238/variants', function() {
      $httpBackend.expect('GET', '/api/genes/238/variants').respond('200', servedGene238Variants);
      Genes.getVariants(238);
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/comments path', function() {
    it('Genes.addComment({geneId: 238, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/genes/238/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/genes/238/comments',
        {
          geneId: 238,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Genes.addComment({geneId: 238, title: 'comment title', text: 'comment text'});
      $httpBackend.flush();
    });

    it('Genes.updateComment({geneId: 238, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/genes/238/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/genes/238/comments/1',
        {
          geneId: 238,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Genes.updateComment({
        geneId: 238,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Genes.deleteComment({geneId: 238, commentId: 1}) should send a DELETE request to /api/genes/238/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/genes/238/comments/1').respond('200', {});
      Genes.deleteComment({ geneId: 238, commentId: 1 });
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
  });

  describe('/api/genes/:geneId/revisions path', function() {
    it('Genes.getRevisions(238) should send a GET request to /api/genes/238/revisions', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions').respond('200', []);
      Genes.getRevisions(238);
      $httpBackend.flush();
    });

    it('Genes.getRevision({geneId: 238, revisionId: 1}) should send a GET request to /api/genes/238/revisions/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions/1').respond('200', {});
      Genes.getRevision({geneId: 238, revisionId: 1});
      $httpBackend.flush();
    });

    it('Genes.getLastRevision({geneId: 238}) should send a GET request to /api/genes/238/revisions/last', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions/last').respond('200', {});
      Genes.getLastRevision({geneId: 238});
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/suggested_changes path', function() {
    it('Genes.getSuggestedChanges(238) should send a GET request to /api/genes/238/suggested_changes', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes').respond('200', []);
      Genes.getChanges(238);
      $httpBackend.flush();
    });

    it('Genes.getSuggestedChange({geneId: 238, changeId: 1}) should send a GET request to /api/genes/238/suggested_changes/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1').respond('200', {});
      Genes.getChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.acceptChange({geneId: 238, changeId: 1}) should send a POST request to /api/genes/238/suggested_changes/1/accept', function() {
      $httpBackend.expect('POST', '/api/genes/238/suggested_changes/1/accept').respond('200', {});
      Genes.acceptChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.rejectChange({geneId: 238, changeId: 1}) should send a POST request to /api/genes/238/suggested_changes/1/reject', function() {
      $httpBackend.expect('POST', '/api/genes/238/suggested_changes/1/reject').respond('200', {});
      Genes.rejectChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/suggested_changes/:changeId/comments path', function() {
    it('Genes.addChangeComment({geneId: 238, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/genes/238/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/genes/238/suggested_changes/1/comments',
        {
          geneId: 238,
          changeId: 1,
          title: 'comment title',
          text: 'comment text'
        }).respond('200', {});
      Genes.addChangeComment({
        geneId: 238,
        changeId: 1,
        title: 'comment title',
        text: 'comment text'
      });
      $httpBackend.flush();
    });

    it('Genes.updateChangeComment({geneId: 238, changeId: 1, commentId: 1, title: \'updated title\', text: \'updated comment text\'}) should send a PATCH request to /api/genes/238/suggested_changes/1/comments/1', function() {
      $httpBackend.expect(
        'PATCH',
        '/api/genes/238/suggested_changes/1/comments/1',
        {
          geneId: 238,
          changeId: 1,
          commentId: 1,
          title: 'updated comment title',
          text: 'updated comment text'
        }).respond('200', {});
      Genes.updateChangeComment({
        geneId: 238,
        changeId: 1,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Genes.deleteChangeComment({geneId: 238, changeId: 1, commentId: 1}) should send a DELETE request to /api/genes/238/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/genes/238/suggested_changes/1/comments/1').respond('200', {});
      Genes.deleteChangeComment({ geneId: 238, changeId:1, commentId: 1 });
      $httpBackend.flush();
    });

    it('Genes.getChangeComments({geneId: 238, changeId: 1}) should send a GET request to /api/genes/238/suggested_changes/1/comments', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1/comments').respond('200', []);
      Genes.getChangeComments({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.getChangeComment({geneId: 238, changeId: 1, commentId: 1 }) should send a GET request to /api/genes/238/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1/comments/1').respond('200', {});
      Genes.getChangeComment({geneId: 238, changeId: 1, commentId: 1});
      $httpBackend.flush();
    });
  });
});
