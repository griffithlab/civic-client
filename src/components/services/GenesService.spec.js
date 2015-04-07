'use strict';
describe('GenesService', function() {
  var $httpBackend,
    Genes;

  beforeEach(function() {
    module('civic.services');
    module('served/genes.json');
    module('served/gene238.json');
    module('served/gene238Variants.json');
    module('served/gene238VariantGroups.json');
    module('served/myGeneInfo238.json');
    module('served/gene238Comments.json');
  });

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Genes = $injector.get('Genes');

    inject(function($httpBackend,
                    servedGenes,
                    servedGene238,
                    servedMyGeneInfo238,
                    servedGene238Variants,
                    servedGene238VariantGroups,
                    servedGene238Comments) {

      $httpBackend.when('GET', '/api/genes').respond(200, servedGenes);
      $httpBackend.when('GET', '/api/genes/238').respond(200, servedGene238);
      $httpBackend.when('GET', '/api/genes/mygene_info_proxy/238').respond(200, servedMyGeneInfo238);
      $httpBackend.when('GET', '/api/genes/238/comments').respond(200, servedGene238Comments);
      $httpBackend.when('GET', '/api/genes/238/variants').respond(200, servedGene238Variants);
      $httpBackend.when('GET', '/api/genes/238/variant_groups').respond(200, servedGene238VariantGroups);
      $httpBackend.when('GET', '/api/genes/238/comments').respond(200, servedGene238Comments);
    });
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('/api/genes path', function() {
    it('Genes.add({entrez_name: \'GENE\', description: \'GENE description\'}) should send a POST request to /api/genes', function() {
      $httpBackend.expect('POST', '/api/genes', {entrez_name: 'GENE', description: 'GENE description'}).respond(200, {});
      Genes.add({entrez_name: 'GENE', description: 'GENE description'});
      $httpBackend.flush();
    });

    it('Genes.delete(238) should send a DELETE request to /api/genes/238', function() {
      $httpBackend.expect('DELETE', '/api/genes/238').respond(200, {});
      Genes.delete(238);
      $httpBackend.flush();
    });

    it('Genes.get(238) should send a GET request to /api/genes/238', function() {
      $httpBackend.expect('GET', '/api/genes/238');
      Genes.get(238);
      $httpBackend.flush();
    });

    it('Genes.refresh(238) should send a GET request to /api/genes/238 (and not hit the genes cache)', function() {
      Genes.get(238);
      $httpBackend.expect('GET', '/api/genes/238');
      $httpBackend.flush();
      $httpBackend.expect('GET', '/api/genes/238');
      Genes.refresh(238);
      $httpBackend.flush();
    });

    it('Genes.query() should send a GET request to /api/genes', function() {
      $httpBackend.expect('GET', '/api/genes');
      Genes.query();
      $httpBackend.flush();
    });

    it('Genes.update({ geneId: 238, description: \'UPDATED DESCRIPTION\'}) should send a PUT request to /api/genes', function() {
      $httpBackend.expect('PATCH', '/api/genes/238').respond(200, {});
      Genes.update({ geneId: 238, description: 'UPDATED DESCRIPTION'});
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/variants path', function() {
    it('Genes.getVariants(238) should send a GET request to /api/genes/238/variants', function() {
      $httpBackend.expect('GET', '/api/genes/238/variants');
      Genes.getVariants(238);
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/variant_groups path', function() {
    it('Genes.getVariantGroups(238) should send a GET request to /api/genes/238/variant_groups', function() {
      $httpBackend.expect('GET', '/api/genes/238/variant_groups');
      Genes.getVariantGroups(238);
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/comments path', function() {
    it('Genes.submitComment({geneId: 238, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/genes/238/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/genes/238/comments',
        {
          geneId: 238,
          title: 'comment title',
          text: 'comment text'
        }).respond(200, {});
      Genes.submitComment({geneId: 238, title: 'comment title', text: 'comment text'});
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
        }).respond(200, {});
      Genes.updateComment({
        geneId: 238,
        commentId: 1,
        title: 'updated comment title',
        text: 'updated comment text'
      });
      $httpBackend.flush();
    });

    it('Genes.deleteComment({geneId: 238, commentId: 1}) should send a DELETE request to /api/genes/238/comments/1', function() {
      $httpBackend.expect('DELETE', '/api/genes/238/comments/1').respond(200, {});
      Genes.deleteComment({ geneId: 238, commentId: 1 });
      $httpBackend.flush();
    });

    it('Genes.getComments(238) should send a GET request to /api/genes/238/comments', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments');
      Genes.getComments(238);
      $httpBackend.flush();
    });

    it('Genes.getComment(238, 1) should send a GET request to /api/genes/238/comments/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/comments/1').respond(200, {});
      Genes.getComment(238, 1);
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/revisions path', function() {
    it('Genes.getRevisions(238) should send a GET request to /api/genes/238/revisions', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions').respond(200, []);
      Genes.getRevisions(238);
      $httpBackend.flush();
    });

    it('Genes.getRevision({geneId: 238, revisionId: 1}) should send a GET request to /api/genes/238/revisions/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions/1').respond(200, {});
      Genes.getRevision({geneId: 238, revisionId: 1});
      $httpBackend.flush();
    });

    it('Genes.getLastRevision({geneId: 238}) should send a GET request to /api/genes/238/revisions/last', function() {
      $httpBackend.expect('GET', '/api/genes/238/revisions/last').respond(200, {});
      Genes.getLastRevision({geneId: 238});
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/suggested_changes path', function() {
    it('Genes.getSuggestedChanges(238) should send a GET request to /api/genes/238/suggested_changes', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes').respond(200, []);
      Genes.getChanges(238);
      $httpBackend.flush();
    });

    it('Genes.getSuggestedChange({geneId: 238, changeId: 1}) should send a GET request to /api/genes/238/suggested_changes/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1').respond(200, {});
      Genes.getChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.acceptChange({geneId: 238, changeId: 1}) should send a POST request to /api/genes/238/suggested_changes/1/accept', function() {
      $httpBackend.expect('POST', '/api/genes/238/suggested_changes/1/accept').respond(200, {});
      Genes.acceptChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.rejectChange({geneId: 238, changeId: 1}) should send a POST request to /api/genes/238/suggested_changes/1/reject', function() {
      $httpBackend.expect('POST', '/api/genes/238/suggested_changes/1/reject').respond(200, {});
      Genes.rejectChange({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });
  });

  describe('/api/genes/:geneId/suggested_changes/:changeId/comments path', function() {
    it('Genes.submitChangeComment({geneId: 238, changeId: 1, title: \'comment title\', text: \'comment text\'}) should send a POST request to /api/genes/238/comments', function() {
      $httpBackend.expect(
        'POST',
        '/api/genes/238/suggested_changes/1/comments',
        {
          geneId: 238,
          changeId: 1,
          title: 'comment title',
          text: 'comment text'
        }).respond(200, {});
      Genes.submitChangeComment({
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
        }).respond(200, {});
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
      $httpBackend.expect('DELETE', '/api/genes/238/suggested_changes/1/comments/1').respond(200, {});
      Genes.deleteChangeComment({ geneId: 238, changeId:1, commentId: 1 });
      $httpBackend.flush();
    });

    it('Genes.getChangeComments({geneId: 238, changeId: 1}) should send a GET request to /api/genes/238/suggested_changes/1/comments', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1/comments').respond(200, []);
      Genes.getChangeComments({geneId: 238, changeId: 1});
      $httpBackend.flush();
    });

    it('Genes.getChangeComment({geneId: 238, changeId: 1, commentId: 1 }) should send a GET request to /api/genes/238/suggested_changes/1/comments/1', function() {
      $httpBackend.expect('GET', '/api/genes/238/suggested_changes/1/comments/1').respond(200, {});
      Genes.getChangeComment({geneId: 238, changeId: 1, commentId: 1});
      $httpBackend.flush();
    });
  });
});
