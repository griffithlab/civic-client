(function() {
  'use strict';
  angular.module('civic.events.variants')
    .controller('MyVariantInfoController', MyVariantInfoController)
    .directive('myVariantInfo', function () {
      return {
        restrict: 'E',
        scope: {
          variantInfo: '='
        },
        controller: 'MyVariantInfoController',
        templateUrl: 'app/views/events/variants/summary/myVariantInfo.tpl.html'
      };
    });

  // @ngInject
  function MyVariantInfoController($scope, ngDialog, _) {
    var ctrl = $scope.ctrl = {};
    ctrl.variantInfo = $scope.variantInfo;

    // MyVariant.info returns some fields as strings OR arrays, this
    // converts strings to a single-element array
    var multiTypeFields = [
      'cadd.consdetail',
      'cadd.consequence',
      'clinvar.hgvs.coding',
      'clinvar.hgvs.genomic',
      'clinvar.hgvs.non-coding',
      'emv.hgvs',
      'clinvar.rcv',
      'exac.ac.ac_adj',
      'exac.an.an_adj',
      'snpeff.ann'
    ];
    _.each(multiTypeFields, function(field) {
      var val = _.get(ctrl.variantInfo,field);
      if (!(_.isUndefined(val) || _.isArray(val))) { _.set(ctrl.variantInfo, field, [val]); }
    });

    // calculate adjusted allele frequency
    if(!_.isUndefined(ctrl.variantInfo.exac)) {
      if(!_.isUndefined(ctrl.variantInfo.exac.an) && !_.isUndefined(ctrl.variantInfo.exac.ac)) {
        ctrl.variantInfo.exac.adj_allele_freq = _.round(ctrl.variantInfo.exac.ac.ac_adj[0] / ctrl.variantInfo.exac.an.an_adj[0], 5);
      }
    }

    var gnomad_exome_af_rounded;
    var gnomad_genome_af_rounded;
    // calculate gnomAD allele frequency
    if(!_.isUndefined(ctrl.variantInfo.gnomad_exome) && _.isUndefined(ctrl.variantInfo.gnomad_genome)) {
      gnomad_exome_af_rounded = _.round(ctrl.variantInfo.gnomad_exome.af.af, 5);
      ctrl.variantInfo.gnomad_adj_allele_freq = gnomad_exome_af_rounded;
      ctrl.variantInfo.gnomad_adj_af_tooltip = 'Exome Allele Freq: ' + gnomad_exome_af_rounded + '</br> Genome Allele Freq: --';
    } else if(!_.isUndefined(ctrl.variantInfo.gnomad_genome) && _.isUndefined(ctrl.variantInfo.gnomad_exome)) {
      gnomad_genome_af_rounded = _.round(ctrl.variantInfo.gnomad_genome.af.af, 5);
      ctrl.variantInfo.gnomad_adj_allele_freq = gnomad_genome_af_rounded;
      ctrl.variantInfo.gnomad_adj_af_tooltip = 'Exome Allele Freq: --</br>Genome Allele Freq: ' + gnomad_genome_af_rounded;
    } else if(!_.isUndefined(ctrl.variantInfo.gnomad_exome) && !_.isUndefined(ctrl.variantInfo.gnomad_genome)) {
      gnomad_exome_af_rounded = _.round(ctrl.variantInfo.gnomad_exome.af.af, 5);
      gnomad_genome_af_rounded = _.round(ctrl.variantInfo.gnomad_genome.af.af, 5);
      ctrl.variantInfo.gnomad_adj_allele_freq = _.round((ctrl.variantInfo.gnomad_exome.ac.ac + ctrl.variantInfo.gnomad_genome.ac.ac) / (ctrl.variantInfo.gnomad_exome.an.an + ctrl.variantInfo.gnomad_genome.an.an), 5);
      ctrl.variantInfo.gnomad_adj_af_tooltip = 'Exome Allele Freq: ' + gnomad_exome_af_rounded + '</br>Genome Allele Freq: ' + gnomad_genome_af_rounded;
    }

    // replace ampersands with commas in SnpEff Effect strings
    if(!_.isUndefined(ctrl.variantInfo.snpeff) && !_.isUndefined(ctrl.variantInfo.snpeff.ann[0])) {
      if(!_.isUndefined(ctrl.variantInfo.snpeff.ann[0])) {
        ctrl.variantInfo.snpeff.ann[0].effect = ctrl.variantInfo.snpeff.ann[0].effect.replace(/_/g, ' ');
        ctrl.variantInfo.snpeff.ann[0].effect = ctrl.variantInfo.snpeff.ann[0].effect.replace(/&/g, ', ');
      }
    }

    ctrl.popupOptions = {
      template: 'app/views/events/variants/summary/myVariantInfoDialog.tpl.html',
      scope: $scope
    };

    ctrl.openDialog = function() {
      if(_.has(ctrl.dialog, 'id')) {
        ctrl.closeDialog().then(function() {
          ctrl.dialog = ngDialog.open(ctrl.popupOptions);
        });
      } else {
        ctrl.dialog = ngDialog.open(ctrl.popupOptions);
      }
      return ctrl.dialog;
    };

    ctrl.closeDialog = function() {
      ctrl.dialog.close();
      return ctrl.dialog.closePromise.then(function() { _.omit(ctrl, 'dialog'); } );
    };
  }

})();
