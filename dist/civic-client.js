angular.module('civic.security.login', ['civic.security.login.form', 'civic.security.login.toolbar']);
angular.module('civic.security.login.form', [])
  .controller('LoginFormController', LoginFormController);

/**
 * @name LoginFormController
 * @desc provides the behaviour behind a reusable form to allow users to authenticate. This controller and
 * its template (login/form.tpl.html) are used in a modal dialog box by the security service.
 * @param $scope
 * @param security
 * @constructor
 * @ngInject
 */
function LoginFormController($scope, $state, Security) {
  'use strict';

  // The model for this form
  $scope.user = {};

  // Any error message from failing to login
  $scope.authError = null;

  // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
  // We could do something different for each reason here but to keep it simple...
  $scope.authReason = null;
  if ( Security.getLoginReason() ) {
    $scope.authReason = ( Security.isAuthenticated() ) ?
      'NOT AUTHORIZED' :
      'NOT AUTHENTICATED';
  }

  // Attempt to authenticate the user specified in the form's model
  $scope.login = function() {
    // Clear any previous Security errors
    $scope.authError = null;

    // Try to login
    Security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
      if ( !loggedIn ) {
        // If we get here then the login failed due to bad credentials
        $scope.authError = 'INVALID CREDENTIALS';
      }
    }, function() {
      // If we get here then there was a problem with the login request to the server
      $scope.authError = 'SERVER ERROR';
    });
  };

  $scope.clearForm = function() {
    $scope.user = {};
  };

  $scope.cancelLogin = function() {
    Security.cancelLogin();
  };
}
angular.module('geneDataMock', ['ngTable', 'ngMockE2E'])
  .run(function($httpBackend, $filter, $log, ngTableParams) {
    'use strict';
    $log.info('DemoMock loaded.');
    // emulation of api server
    $httpBackend.whenGET(/mockGeneData.*/).respond(function(method, url) {
      var query = url.split('?')[1],
        requestParams = {};

      $log.log('Ajax request: ', url);

      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        requestParams[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
      }

      var params;
      // parse url params
      for (var key in requestParams) {
        if (key.indexOf('[') >= 0) {
          var lastKey = '';
          var  value = requestParams[key];

          params = key.split(/\[(.*)\]/);
          angular.forEach(params.reverse(), function(name) {
            if (name !== '') {
              var v = value;
              value = {};
              value[lastKey = name] = _.isNumber(v) ? parseFloat(v) : v;
            }
          });
          requestParams[lastKey] = angular.extend(requestParams[lastKey] || {}, value[lastKey]);
        } else {
          requestParams[key] = _.isNumber(requestParams[key]) ? parseFloat(requestParams[key]) : requestParams[key];
        }
      }

      /* jshint ignore:start */
      var data = [
          {
            "entrez_gene":"ALK",
            "entrez_id":"19737948",
            "variant":"F1174L",
            "gene_category":"Receptor tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"",
            "pathway":"Cell proliferation and survival",
            "pathway_citation":"",
            "protein_motifs":"Signal peptide, MAM domain, LDL domain, MAM domain, transmembrane domain, juxtamembrane domain, kinase domain.",
            "motifs_citation":"21945349",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ALK",
            "entrez_id":"19737948",
            "variant":"R1275Q",
            "gene_category":"Receptor tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"",
            "pathway":"Cell proliferation and survival",
            "pathway_citation":"",
            "protein_motifs":"Signal peptide, MAM domain, LDL domain, MAM domain, transmembrane domain, juxtamembrane domain, kinase domain.",
            "motifs_citation":"21945349",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"EGFR",
            "entrez_id":"",
            "variant":"T790M",
            "gene_category":"Receptor tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"15142631",
            "pathway":"Angiogenesis, cell growth, cell migration and metastasis",
            "pathway_citation":"10690506",
            "protein_motifs":"Domain I, domain II, domain III, domain IV, transmembrane domain, kinase domain, regulatory region",
            "motifs_citation":"18573086",
            "mutation_biology":"Threonine to bulky methionine",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"EGFR",
            "entrez_id":"",
            "variant":"L858R",
            "gene_category":"Receptor tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"15142631",
            "pathway":"Angiogenesis, cell growth, cell migration and metastasis",
            "pathway_citation":"10690506",
            "protein_motifs":"Domain I, domain II, domain III, domain IV, transmembrane domain, kinase domain, regulatory region",
            "motifs_citation":"18573086",
            "mutation_biology":"Leucine to arginine",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"L536Q",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Small, Hydrophobic Leucine to Much Larger, Basic Glutamine.",
            "disease_ontology_id":"1612, 0060075, 1380",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Everolimus, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"Y537S",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Large Tyrosine to Smaller Serine. Biochemically very similar.",
            "disease_ontology_id":"1612, 0060075, 1380",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Toremifene, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"Y537C",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Tyrosine to Cysteine.",
            "disease_ontology_id":"breast, endometrial, ovarian",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Toremifene, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"Y537N",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Tyrosine to Asparagine",
            "disease_ontology_id":"1612, 0060075, 1380",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Toremifene, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"N538G",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Large Asparagine to Much Smaller Glycine.",
            "disease_ontology_id":"1612, 0060075, 1380",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Toremifene, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ESR1",
            "entrez_id":"2099",
            "variant":"Amplification",
            "gene_category":"Nuclear Hormone Receptor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand Activated Transcription  Factor",
            "function_citation":"21779010",
            "pathway":"Hormone (Estrogen) Response",
            "pathway_citation":"16769596",
            "protein_motifs":"DNA binding domain, Dimer binding site, Ligand binding domain.",
            "motifs_citation":"24185510",
            "mutation_biology":"Large Asparagine to Much Smaller Glycine.",
            "disease_ontology_id":"1612, 0060075, 1380",
            "type_citation":"24185510",
            "treatments":"Tamoxifen, Toremifene, Anastrozole, Letrozole",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ESR1 encodes for the Estrogen Receptor alpha subunit, a Nuclear Hormone Receptor. It's cellular function is to bind its ligand, estrogen, and modulate transcription of genes responsible for hormone response. It is integral to sexual and reproductive development. The protein contains a DNA-binding domain which dimerizes to another alpha or beta subunit to form a functional transcription factor. It also contains a Ligand Binding Domain (LBD) which has been found to be a hotspot for mutations in Breast and Endometrial Cancer. Computational predictions have shown that ligand binding domain mutations are capable of being activating mutations, and in vitro experiments have confirmed the constitutive acitivity of LBD mutations. A number of drugs are already FDA approved to treat ESR1 abnormalities in Breast Cancer, these include: Tamoxifen, Everolimus, and the aromatase inhibitors Anastrozole and Letrozole. A full list of drugs that interact with ESR1 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"V777L",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Valine to Isoleucine, both very similar, hydrophobic amino acids within the kinase domain",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"ERBB2 (commonly known as HER2) encodes for a receptor tyrosine kinase that is involved in the mitogen-activated cell growth and proliferation pathway. While it does not bind a ligand, its function is to form an active heterodimer with EGFR upon it's ligand binding, which results in the cross-phosphorylation of its tyrosine kinase domain. This domain, when activated, acts as a docking site for downstream enzymes responsible for propagating the kinase cascade, including SHC, Grb and SOS. It contains a few notable functional domains, including an extracellular region, dimerization region, tyrosine phosphorylation sites, and an anchoring site for the transducers of the kinase cascade. This mutation specifically convert Valine to Isoleucine, which are similar in structure. However, in vitro kinase activity assays have shown that this mutation is an activating one, and produces a very significant increase in activity of both the monomer and dimer forms of the protein. This mutation has also been shown to exhibit sensitivity to the kinase inhibitor neratinib, an FDA approved drug for ERBB2 amplification in Breast Cancer. A full list of drugs that interact with ERBB2 can be found at www.dgidb.org",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"DEL 755-759",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Deletion of four amino acids in kinase domain, possibly a loss of function mutation",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"L755S",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Leucine mutated to Serine in the kinase domain of the protein. A hydrophobic amino acid is being converted to a hydrophillic residue of similar size.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"D769H",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Aspartic Acid converted to Histamine. An acidic residue is converted to the very basic histamine within the kinase domain.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"V842I",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Valine to Isoleucine, both very similar, hydrophobic amino acids within the kinase domain",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"G309A",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Glycine to Alanine, both small, hydrophobic amino acids. Mutation is within the dimerization domain.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"R678Q",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Arginine to Glutamine, both relatively basic amino acids. Mutation is immediately ater the trans-membrane domain, within the cytoplasmic side of the protein.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"L755W",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Leucine to Tryptophan. A small, hydrophobic amino acid, to a much larger one. Mutation is within the kinase domain.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ERBB2",
            "entrez_id":"2064",
            "variant":"Amplification",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"EGFR related signal transducer",
            "function_citation":"Entrez Gene",
            "pathway":"Mitogen Activated cell growth and proliferation",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Dimerization site, Tyrosine phosphorylation sites, kinase cascade anchor site.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Leucine to Tryptophan. A small, hydrophobic amino acid, to a much larger one. Mutation is within the kinase domain.",
            "disease_ontology_id":"1612, 0060079, 2394, 1793, 1380, 3908, 11812, 3717",
            "type_citation":"17471238, 20185938",
            "treatments":"Trastuzumab, Pertuzumab, Lapatinib, Neratinib",
            "treatments_citation":"http://www.accessdata.fda.gov/scripts/cder/drugsatfda/index.cfm",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"PIK3CA",
            "entrez_id":"5290",
            "variant":"E542K",
            "gene_category":"Lipid Signalling",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Lipid signalling cascadetransducer",
            "function_citation":"Entrez Gene",
            "pathway":"Lipid Signalling, Calcium Signalling.",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Catalytic kinase domain, Multiple protein binding sites.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Glutamic Acid to basic Lysine",
            "disease_ontology_id":"Colon, Breast, Urinary, Endometrial",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"PIK3CA",
            "entrez_id":"5290",
            "variant":"E545K",
            "gene_category":"Lipid Signalling",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Lipid signalling cascadetransducer",
            "function_citation":"Entrez Gene",
            "pathway":"Lipid Signalling, Calcium Signalling.",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Catalytic domain, Multiple protein binding sites.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Glutamic Acid to basic Lysine",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"PIK3CA",
            "entrez_id":"5290",
            "variant":"H1047R",
            "gene_category":"Lipid Signalling",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Lipid signalling cascadetransducer",
            "function_citation":"Entrez Gene",
            "pathway":"Lipid Signalling, Calcium Signalling.",
            "pathway_citation":"Entrez Gene",
            "protein_motifs":"Catalytic domain, Multiple protein binding sites.",
            "motifs_citation":"Entrez Gene",
            "mutation_biology":"Histidine to Arginine",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"GATA3",
            "entrez_id":"",
            "variant":"",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"BRAF",
            "entrez_id":"673",
            "variant":"V600E",
            "gene_category":"serine/threonine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Raf activated MEK kinase",
            "function_citation":"7855890",
            "pathway":"Cell survival signal",
            "pathway_citation":"7855890",
            "protein_motifs":"Ras binding domain, Thr Ser rich region, kinase region",
            "motifs_citation":"20674547",
            "mutation_biology":"",
            "disease_ontology_id":"Thyroid, colorectal, melanoma, ovarian",
            "type_citation":"12670889",
            "treatments":"",
            "treatments_citation":"",
            "summary":"The BRAF gene provides instructions for making a protein that helps transmit chemical signals from outside the cell to the cell's nucleus. This protein is part of a signaling pathway known as the RAS/MAPK pathway, which helps control several important cell functions. Specifically, the RAS/MAPK pathway regulates the growth and division (proliferation) of cells, the process by which cells mature to carry out specific functions (differentiation), cell movement (migration), and the self-destruction of cells (apoptosis). Chemical signaling through this pathway is essential for normal development before birth.",
            "event_summary":"BRAF V600E has been shown to be recurrent in many cancer types. It is one of the most widely studied variants in cancer. This variant is correlated with poorprognosis in certain cancer types, including CRC and papillary thyroid cancer. The targeted therapeutic debrafenib has been shown to be effective in clinical trials with an array of BRAF mutations. Debrafenib has also shown to be effective when combined with the MEK inhibitor trametinib in CRC and melanoma. However, in patients with TP53, KRAS, and CDK2NA mutations, debrafenib resistance has been reported. Ipilimumab, regorafenib, vemurafenib, and a number of combination therapies have been successful in treating V6000E mutations. While the drugs cetuximab and panitumumab have largely shown to been largely ineffective without supplementary treatment.",
            "clinical_trial":""
          },
          {
            "entrez_gene":"FLT3",
            "entrez_id":"2322",
            "variant":"D835",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"21359601",
            "pathway":"Cell proliferation signal",
            "pathway_citation":"8590775",
            "protein_motifs":"extracellular immunoglobulin-like domains, transmembrane domain, juxtamembrane domain and tyrosine-kinase domains",
            "motifs_citation":"8590775",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MPL",
            "entrez_id":"",
            "variant":"W515",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"KIT",
            "entrez_id":"3815",
            "variant":"D816V (exon 17)",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"15526160",
            "pathway":"Cell survival and differentiation signal",
            "pathway_citation":"15526160",
            "protein_motifs":"extracellular domain, transmembrane segment, juxtamembrane domain, protein kinase domain",
            "motifs_citation":"16226710",
            "mutation_biology":"",
            "disease_ontology_id":"Small cell lung cancer, breast cancer, colorectal cancer, GIST",
            "type_citation":"15526160",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"KIT",
            "entrez_id":"3815",
            "variant":"L576P (exon 11)",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"15526160",
            "pathway":"Cell survival and differentiation signal",
            "pathway_citation":"15526160",
            "protein_motifs":"extracellular domain, transmembrane segment, juxtamembrane domain, protein kinase domain",
            "motifs_citation":"16226710",
            "mutation_biology":"",
            "disease_ontology_id":"Melanoma, lung",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"JAK2",
            "entrez_id":"3717",
            "variant":"V617F",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"24069563",
            "pathway":"Cell survival, anti-apoptotic and cell cycle control signal",
            "pathway_citation":"24058805",
            "protein_motifs":"Receptor region, binding region, pseudokinase region, kinase region",
            "motifs_citation":"12039028",
            "mutation_biology":"",
            "disease_ontology_id":"8997, 2224, 4971, 8552, 9119",
            "type_citation":"Genetics Home Reference",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"IDH1",
            "entrez_id":"3417",
            "variant":"R132H",
            "gene_category":"Reductase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"oxidize isocitrate to alpha-ketoglutarate (_-KG)",
            "function_citation":"23512379",
            "pathway":"cell metabolism",
            "pathway_citation":"23999441",
            "protein_motifs":"nucleotide binding, substrate binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"IDH1",
            "entrez_id":"3417",
            "variant":"R132C/S",
            "gene_category":"Reductase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"oxidize isocitrate to alpha-ketoglutarate (_-KG)",
            "function_citation":"23512379",
            "pathway":"cell metabolism",
            "pathway_citation":"23999441",
            "protein_motifs":"nucleotide binding, substrate binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"IDH2",
            "entrez_id":"",
            "variant":"R140Q/L",
            "gene_category":"Reductase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"oxidize isocitrate to alpha-ketoglutarate (_-KG)",
            "function_citation":"23512379",
            "pathway":"cell metabolism",
            "pathway_citation":"23999441",
            "protein_motifs":"nucleotide binding, substrate binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"IDH2",
            "entrez_id":"",
            "variant":"R172K",
            "gene_category":"Reductase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"oxidize isocitrate to alpha-ketoglutarate (_-KG)",
            "function_citation":"23512379",
            "pathway":"cell metabolism",
            "pathway_citation":"23999441",
            "protein_motifs":"nucleotide binding, substrate binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"p.G13D",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"p.Q61H",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"Q61K",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"G12D",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"Q61R",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NRAS",
            "entrez_id":"4893",
            "variant":"G12C",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"KRAS",
            "entrez_id":"4893",
            "variant":"Q61H",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"20921338",
            "pathway":"Cell survival, cell growth, cell migration, cell division",
            "pathway_citation":"22983396",
            "protein_motifs":"GTP binding, hypervariable region, effector binding",
            "motifs_citation":"Uniprot",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"KRAS",
            "entrez_id":"",
            "variant":"G12V/D",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"10989276",
            "pathway":"cell proliferation, differentiation, survival",
            "pathway_citation":"9009833",
            "protein_motifs":"GTP binding, effector binding, hypervariable region",
            "motifs_citation":"23626007",
            "mutation_biology":"",
            "disease_ontology_id":"Lung cancer, colorectal cancer, leukemia",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"KRAS",
            "entrez_id":"",
            "variant":"G13D",
            "gene_category":"GTP binding tyrosine kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"small GTPase transductor protein",
            "function_citation":"10989276",
            "pathway":"cell proliferation, differentiation, survival",
            "pathway_citation":"9009833",
            "protein_motifs":"GTP binding, effector binding, hypervariable region",
            "motifs_citation":"23626007",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"U2AF",
            "entrez_id":"7307",
            "variant":"S34Y/F",
            "gene_category":"RNA binding protein",
            "gene_category_citation":"Uniprot",
            "protein_function":"protein-RNA binding mediator",
            "function_citation":"12127445",
            "pathway":"Protein translation",
            "pathway_citation":"22158538",
            "protein_motifs":"Zinc finger, RNA recognition domain",
            "motifs_citation":"23775717",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"U2AF",
            "entrez_id":"7307",
            "variant":"Q157P/R",
            "gene_category":"RNA binding protein",
            "gene_category_citation":"Uniprot",
            "protein_function":"protein-RNA binding mediator",
            "function_citation":"12127445",
            "pathway":"Protein translation",
            "pathway_citation":"22158538",
            "protein_motifs":"Zinc finger, RNA recognition domain",
            "motifs_citation":"23775717",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"DNMT3A",
            "entrez_id":"",
            "variant":"R882C/S",
            "gene_category":"Methyltransferase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA methyltransferase",
            "function_citation":"10545955",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"Variable region, PWWP region, cystein rich region, catalytic region",
            "motifs_citation":"15456878",
            "mutation_biology":"",
            "disease_ontology_id":"9119",
            "type_citation":"Genetics Home Reference",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"DNMT3A",
            "entrez_id":"",
            "variant":"R882H",
            "gene_category":"Methyltransferase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA methyltransferase",
            "function_citation":"10545955",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"Variable region, PWWP region, cystein rich region, catalytic region",
            "motifs_citation":"15456878",
            "mutation_biology":"",
            "disease_ontology_id":"9119",
            "type_citation":"Genetics Home Reference",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"FLT3",
            "entrez_id":"",
            "variant":"D835E",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"8618433",
            "pathway":"cell proliferation",
            "pathway_citation":"8590775",
            "protein_motifs":"Ig-like domain, transmembrane domain, juxtamembrane domain, tyrosine kinase domain",
            "motifs_citation":"14759363",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"FLT3",
            "entrez_id":"",
            "variant":"D835Y",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"8618433",
            "pathway":"cell proliferation",
            "pathway_citation":"8590775",
            "protein_motifs":"Ig-like domain, transmembrane domain, juxtamembrane domain, tyrosine kinase domain",
            "motifs_citation":"14759363",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"FLT3",
            "entrez_id":"",
            "variant":"D839G",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"8618433",
            "pathway":"cell proliferation",
            "pathway_citation":"8590775",
            "protein_motifs":"Ig-like domain, transmembrane domain, juxtamembrane domain, tyrosine kinase domain",
            "motifs_citation":"14759363",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"FGFR2",
            "entrez_id":"",
            "variant":"",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SF3B1",
            "entrez_id":"",
            "variant":"K700E",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SF3B1",
            "entrez_id":"",
            "variant":"K666N",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"CSF3R",
            "entrez_id":"",
            "variant":"T618I",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"GATA2",
            "entrez_id":"",
            "variant":"T354M",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"GATA2",
            "entrez_id":"",
            "variant":"R398W",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"Y220C",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"1612, 11054, 9256",
            "type_citation":"Genetics Home Reference",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"R249T",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"R249W",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"R248Q",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"R273H",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"R273C",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"TP53",
            "entrez_id":"",
            "variant":"V173G/A",
            "gene_category":"Tumor suppressor",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"DNA binding transactivation factor",
            "function_citation":"12446780",
            "pathway":"Cell cycle arrest, senescence and apoptosis",
            "pathway_citation":"15865944",
            "protein_motifs":"Activation domain, prolin rich domain, DNA binding domain, nuclear localization signal, tetramerization domain, basic domain",
            "motifs_citation":"16543939",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"RUNX1",
            "entrez_id":"",
            "variant":"R201*",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"RUNX1",
            "entrez_id":"",
            "variant":"R162K",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"RUNX1",
            "entrez_id":"",
            "variant":"R162S",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"RUNX1",
            "entrez_id":"",
            "variant":"R162G",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"WT1",
            "entrez_id":"",
            "variant":"A381fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"WT1",
            "entrez_id":"",
            "variant":"A381fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"WT1",
            "entrez_id":"",
            "variant":"A381fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MIR142",
            "entrez_id":"",
            "variant":"-",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MIR142",
            "entrez_id":"",
            "variant":"-",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MIR142",
            "entrez_id":"",
            "variant":"-",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NPM1",
            "entrez_id":"",
            "variant":"W288fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NPM1",
            "entrez_id":"",
            "variant":"W288fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NPM1",
            "entrez_id":"",
            "variant":"W288fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NPM1",
            "entrez_id":"",
            "variant":"W288fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"NPM1",
            "entrez_id":"",
            "variant":"W288fs",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SRSF2",
            "entrez_id":"",
            "variant":"P95H",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SRSF2",
            "entrez_id":"",
            "variant":"P95L",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SRSF2",
            "entrez_id":"",
            "variant":"P95R",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SRSF2",
            "entrez_id":"",
            "variant":"P95A",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"SRSF2",
            "entrez_id":"",
            "variant":"P95T",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"CBL",
            "entrez_id":"",
            "variant":"Y371",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"JAK1",
            "entrez_id":"",
            "variant":"V658F",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ABL",
            "entrez_id":"",
            "variant":"",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"ARAF",
            "entrez_id":"369",
            "variant":"S214C",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"nuclear signal transducer",
            "function_citation":"",
            "pathway":"Cell cycle control, cell proliferation",
            "pathway_citation":"9779991",
            "protein_motifs":"RAS binding domain, cysteine-rich domain, catalytic domain",
            "motifs_citation":"10848612",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"PDGFRA",
            "entrez_id":"5156",
            "variant":"D842V",
            "gene_category":"Receptor Tyrosine Kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"15207812",
            "pathway":"Cell survival and differentiation signal",
            "pathway_citation":"18483217",
            "protein_motifs":"Ig-like domain, transmembrane domain, Split-tyrosine kinase domain",
            "motifs_citation":"8586421",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MAP2K1",
            "entrez_id":"5604",
            "variant":"Q56P",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"MAP2K1",
            "entrez_id":"5604",
            "variant":"P124S",
            "gene_category":"",
            "gene_category_citation":"",
            "protein_function":"",
            "function_citation":"",
            "pathway":"",
            "pathway_citation":"",
            "protein_motifs":"",
            "motifs_citation":"",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          },
          {
            "entrez_gene":"RET",
            "entrez_id":"5979",
            "variant":"M918T",
            "gene_category":"Receptor tyrosine-protein kinase",
            "gene_category_citation":"Entrez Gene",
            "protein_function":"Ligand activated kinase",
            "function_citation":"uniprot",
            "pathway":"Cell survival, cell proliferation, cell migration",
            "pathway_citation":"11544105",
            "protein_motifs":"Cystein rich, transmembrane, tyrosine kinase 1, tyrosine kinase 2",
            "motifs_citation":"11114739",
            "mutation_biology":"",
            "disease_ontology_id":"",
            "type_citation":"",
            "treatments":"",
            "treatments_citation":"",
            "summary":"",
            "event_summary":"",
            "clinical_trial":""
          }
        ];
      /* jshint ignore:end */

      params = new ngTableParams(requestParams);
      data = params.filter() ? $filter('filter')(data, params.filter()) : data;
      data = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

      var total = data.length;
      data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());

      return [200, {
        result: data,
        total: total
      }];
    });
    $httpBackend.whenGET(/.*/).passThrough();
  });
angular.module('civicClient', [
  'ui.router'
  ,'ui.bootstrap'
  ,'ngTable'
  ,'geneDataMock'
  ,'dialogs.main'
  ,'civic.services'
  ,'civic.security'
  ,'civic.login'
  ,'civic.common'

  ,'civic.pages'
  ,'civic.account'
  ,'civic.browse'
  ,'civic-client-templates'
])
  .config(appConfig)
  .run(appRun);

/**
 * @name appConfig
 * @desc Config function for main app
 * @param $log
 * @param $stateProvider
 * @param $urlRouterProvider
 * @ngInject
 *
 */
function appConfig($stateProvider, $urlRouterProvider) {
  'use strict';
  // route to home state if no state supplied
  $urlRouterProvider.otherwise('home');
}

function appRun(Security) {
  'use strict';
  Security.requestCurrentUser();
}

// define app modules
angular.module('civic.security', [
  'civic.security.authorization'
  ,'civic.security.service'
  ,'civic.security.interceptor'
  ,'civic.security.login'
]);
angular.module('civic.services', []);
angular.module('civic.pages', ['civic.security.authorization']);
angular.module('civic.account', ['civic.security.authorization']);
angular.module('civic.common', []);
angular.module('civic.login', []);
angular.module('civic.browse', []);
angular.module('civic.search', []);
angular.module('civic.gene', []);
angular.module('civic.event', []);
angular.module('civic.evidence', []);

angular.module('civic.browse')
  .controller('BrowseCtrl', BrowseCtrl)
  .config(browseConfig);

// @ngInject
function BrowseCtrl($log) {
  'use strict';
  $log.info('BrowseCtrl loaded');
}

// @ngInject
function browseConfig($stateProvider, $log) {
  'use strict';
  $log.info('browseConfig called');

  $stateProvider
    .state('browse', {
      url: '/browse',
      controller: 'BrowseCtrl',
      templateUrl: '/civic-client/views/browse/browse.tpl.html'
    });
}
angular.module('civic.account')
  .controller('AccountCtrl', AccountCtrl)
  .config(accountConfig);

// @ngInject
function AccountCtrl($scope, $rootScope, $log) {
  'use strict';
  $log.info('AccountCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Account';
  $scope.loadedMsg = 'Loaded Account!';
}

// @ngInject
function accountConfig($stateProvider, AuthorizationProvider) {
  'use strict';
  $stateProvider
    .state('account', {
      url: '/account',
      controller: 'AccountCtrl',
      templateUrl: '/civic-client/views/account/account.tpl.html',
      resolve: {
        authorized: AuthorizationProvider.requireAuthenticatedUser
      }
    });
}
angular.module('civic.services')
  .constant('ConfigService', {
    serverUrl: 'http://localhost:3000/',
    mainMenuItems: [
      {
        label: 'Collaborate',
        state: 'collaborate'
      },
      {
        label: 'Help',
        state: 'help'
      },
      {
        label: 'Contact',
        state: 'contact'
      }
    ]
  }
);


// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('civic.security.service', [
  'civic.security.retryQueue'
  ,'civic.security.login'
  ,'dialogs.main'
])
  .factory('Security', Security);

// @ngInject
function Security($http, $q, $location, RetryQueue, dialogs, $log) {
  'use strict';
  // Redirect to the given url (defaults to '/')
  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  // Login form dialog stuff
  var loginDialog = null;
  function openLoginDialog() {
    if ( loginDialog ) {
      throw new Error('Trying to open a dialog that is already open!');
    }
    loginDialog= dialogs.create('common/security/login/LoginForm.tpl.html','LoginFormController',{},'lg');
    loginDialog.result.then(onLoginDialogClose);
  }
  function closeLoginDialog(success) {
    $log.info('Security.closeLoginDialog() called.');
    if (loginDialog) {
      loginDialog.close(success);
    }
  }
  function onLoginDialogClose(success) {
    loginDialog = null;
    if ( success ) {
      RetryQueue.retryAll();
    } else {
      RetryQueue.cancelAll();
      redirect();
    }
  }

  // Register a handler for when an item is added to the retry queue
  RetryQueue.onItemAddedCallbacks.push(function() {
    if ( RetryQueue.hasMore() ) {
      service.showLogin();
    }
  });

  // The public API of the service
  var service = {

    // Get the first reason for needing a login
    getLoginReason: function() {
      return RetryQueue.retryReason();
    },

    // Show the modal login dialog
    showLogin: function() {
      openLoginDialog();
    },

    // Attempt to authenticate a user by the given email and password
    login: function() {
      var request = $http.get('/api/current_user.json');
      return request.then(function(response) {
        service.currentUser = response.data.user;
        if ( service.isAuthenticated() ) {
          closeLoginDialog(true);
        }
        return service.isAuthenticated();
      });
    },

    // Give up trying to login and clear the retry queue
    cancelLogin: function() {
      closeLoginDialog(false);
      redirect();
    },

    // Logout the current user and redirect
    logout: function(redirectTo) {
      $http.get('/api/sign_out').then(function() {
        service.currentUser = null;
        redirect(redirectTo);
      });
    },

    // Ask the backend to see if a user is already authenticated - this may be from a previous session.
    requestCurrentUser: function() {
      if ( service.isAuthenticated() ) {
        return $q.when(service.currentUser);
      } else {
        return $http.get('/api/current_user.json').then(function(response) {
          service.currentUser = response.data;
          return service.currentUser;
        });
      }
    },

    // Information about the current user
    currentUser: null,

    // Is the current user authenticated?
    isAuthenticated: function(){
      return !!service.currentUser;
    },

    // Is the current user an adminstrator?
    isAdmin: function() {
      return !!(service.currentUser && service.currentUser.admin);
    }
  };

  return service;
}

angular.module('civic.security.retryQueue', [])
  .factory('RetryQueue', RetryQueue);

/**
 * @name RetryQueue
 * @desc This is a generic retry queue for security failures.  Each item is expected to expose two functions: retry and cancel.
 * @param $q
 * @param $log
 * @returns {{onItemAddedCallbacks: Array, hasMore: hasMore, push: push, pushRetryFn: pushRetryFn, retryReason: retryReason, cancelAll: cancelAll, retryAll: retryAll}}
 * @ngInject
 */
function RetryQueue($q, $log) {
  'use strict';
  var retryQueue = [];
  var service = {
    // The security service puts its own handler in here!
    onItemAddedCallbacks: [],

    hasMore: function() {
      return retryQueue.length > 0;
    },
    push: function(retryItem) {
      $log.info('retryQueue.push() called with item: ' + retryItem);
      retryQueue.push(retryItem);
      // Call all the onItemAdded callbacks
      angular.forEach(service.onItemAddedCallbacks, function(cb) {
        try {
          cb(retryItem);
        } catch(e) {
          $log.error('securityRetryQueue.push(retryItem): callback threw an error' + e);
        }
      });
    },
    pushRetryFn: function(reason, retryFn) {
      // The reason parameter is optional
      if ( arguments.length === 1) {
        retryFn = reason;
        reason = undefined;
      }

      // The deferred object that will be resolved or rejected by calling retry or cancel
      var deferred = $q.defer();
      var retryItem = {
        reason: reason,
        retry: function() {
          // Wrap the result of the retryFn into a promise if it is not already
          $q.when(retryFn()).then(function(value) {
            // If it was successful then resolve our deferred
            deferred.resolve(value);
          }, function(value) {
            // Othewise reject it
            deferred.reject(value);
          });
        },
        cancel: function() {
          // Give up on retrying and reject our deferred
          deferred.reject();
        }
      };
      service.push(retryItem);
      return deferred.promise;
    },
    retryReason: function() {
      return service.hasMore() && retryQueue[0].reason;
    },
    cancelAll: function() {
      while(service.hasMore()) {
        retryQueue.shift().cancel();
      }
    },
    retryAll: function() {
      $log.info('RetryQueue.retryall() called.');
      while(service.hasMore()) {
        retryQueue.shift().retry();
      }
    }
  };
  return service;
}

angular.module('civic.security.interceptor', ['civic.security.retryQueue'])
  .factory('Interceptor', Interceptor)
  .config(interceptorServiceConfig);

/**
 * @name Interceptor
 * @desc listens for authentication failures
 * @param $injector
 * @param RetryQueue
 * @returns {Function}
 * @ngInject
 */
function Interceptor($injector, RetryQueue) {
  'use strict';
  return function(promise) {
    // Intercept failed requests
    return promise.then(null, function(originalResponse) {
      if(originalResponse.status === 401) {
        // The request bounced because it was not authorized - add a new request to the retry RetryQueue
        promise = RetryQueue.pushRetryFn('unauthorized-server', function retryRequest() {
          // We must use $injector to get the $http service to prevent circular dependency
          return $injector.get('$http')(originalResponse.config);
        });
      }
      return promise;
    });
  };
}

/**
 * @name interceptorServiceConfig
 * @desc We have to add the interceptor to the RetryQueue as a string because the interceptor depends upon service instances that are not available in the config block.
 * @param $httpProvider
 */
function interceptorServiceConfig($httpProvider) {
  'use strict';
  $httpProvider.responseInterceptors.push('Interceptor');
}

angular.module('civic.security.authorization', ['civic.security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
  .provider('Authorization', {
    requireAdminUser: function(Authorization) {
      'use strict';
      return Authorization.requireAdminUser();
    },

    requireAuthenticatedUser: function(Authorization) {
      'use strict';
      return Authorization.requireAuthenticatedUser();
    },

    $get: function(Security, RetryQueue) {
      'use strict';
      var service = {

        // Require that there is an authenticated user
        // (use this in a route resolve to prevent non-authenticated users from entering that route)
        requireAuthenticatedUser: function() {
          var promise = Security.requestCurrentUser().then(function() {
            if ( !Security.isAuthenticated() ) {
              return RetryQueue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
            }
          });
          return promise;
        },

        // Require that there is an administrator logged in
        // (use this in a route resolve to prevent non-administrators from entering that route)
        requireAdminUser: function() {
          var promise = Security.requestCurrentUser().then(function() {
            if ( !Security.isAdmin() ) {
              return RetryQueue.pushRetryFn('unauthorized-client', service.requireAdminUser);
            }
          });
          return promise;
        }

      };

      return service;
    }
  });
angular.module('civic.common')
  .directive('subheader', subheader)
  .controller('typeAheadCtrl', typeAheadCtrl);

/**
 * @name subheaderCtrl
 * @param $scope
 * @param $log
 * @ngInject
 */
function subheader($rootScope, $log) {
  'use strict';

  // @ngInject
  function subheaderCtrl($scope, $element, $attrs) {
    $log.info('subheaderCtrl loaded');
    // $scope.viewTitle = $rootScope.viewTitle;
    $scope.$watch(function() { return $rootScope.viewTitle; },
      function() {
        $scope.viewTitle = $rootScope.viewTitle;
      })
  }

  var directive = {
    restrict: 'E',
    scope: true,
    templateUrl: 'common/directives/subheader.tpl.html',
    controller: subheaderCtrl
  };

  return directive;
}

function typeAheadCtrl($scope, $log, $location) {
  'use strict';
  $log.info('typeAheadCtrl loaded.');
//    var gd = GeneData;
//    $scope.geneList = [];
//    gd.getGenesAndVariants().then(function(data) {
//      $scope.geneList = data;
//    });
//
//    $scope.onSelect = function($item) {
//      // $log.info('onSelect called, location: ' + ['/gene/', $item.gene, '/variant/', $item.variant].join(' '));
//      var loc = ['/gene/', $item.gene, '/variant/', $item.variant].join("");
//      $log.info('location.path(' + loc + ')');
//      $location.path(loc);
//    };
}
angular.module('civic.common')
  .directive('sessionInfo', sessionInfo);

/**
 * @ngInject
 */
function sessionInfo(ConfigService, $log) {
  'use strict';
  return {
    restrict: 'EA',
    template: '<h2>CIViC Server URL: {{ conf.serverUrl }}</h2>',
    link: function(scope) {
      $log.info('sessionInfo directive loaded.');
      scope.conf = ConfigService;
    }
  };
}
angular.module('civic.common')
  .directive('mainMenu', mainMenu);
/**
 * @name mainMenu
 * @desc generates the app main menu
 * @returns {{restrict: string, templateUrl: string, replace: boolean, scope: boolean}}
 * @ngInject
 */
function mainMenu() {
  'use strict';

  function mainMenuController($scope, ConfigService) {
    $scope.menuItems = ConfigService.mainMenuItems;
  }

  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/mainMenu.tpl.html',
    replace: true,
    scope: true,
    controller: mainMenuController
  };

  return directive;
}
angular.module('civic.security.login.toolbar', [])
  .directive('loginToolbar', loginToolbar);

/**
 * @name loginToolbar
 * @desc The loginToolbar directive is a reusable widget that can show login or logout
 * buttons and information the current authenticated user
 * @param Security
 * @returns {{templateUrl: string, restrict: string, replace: boolean, scope: boolean, link: link}}
 * @ngInject
 */
function loginToolbar(Security, $log) {
  'use strict';
  var directive = {
    templateUrl: 'common/directives/loginToolbar.tpl.html',
    restrict: 'E',
    replace: true,
    scope: true,
    link: function($scope) {
      $scope.isAuthenticated = Security.isAuthenticated;
      $scope.login = Security.showLogin;
      $scope.logout = Security.logout;
      $scope.$watch(function() {
        return Security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });

      $scope.items = [
        'The first choice!',
        'And another choice for you.',
        'but wait! A third!'
      ];

      $scope.status = {
        isopen: false
      };

      $scope.toggled = function(open) {
        $log.info('Dropdown is now: ', open);
      };

      $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
      };
    }
  };
  return directive;
}
angular.module('civic.common')
  .directive('headerSearch', headerSearch);

function headerSearch() {
  'use strict';

  function headerSearchCtrl() {

  }

  return {
    restrict: 'E',
    templateUrl: 'common/directives/headerSearch.tpl.html',
    controller: headerSearch
  }

}
angular.module('civic.common')
  .directive('civicLogo', civicLogo);

/**
 * @ngInject
 */
function civicLogo($log) {
  'use strict';
  var directive = {
    restrict: 'E',
    templateUrl: 'common/directives/civicLogo.tpl.html',
    controller: civicLogoController
  };

  // @ngInject
  function civicLogoController($scope, $rootScope) {
    var pageState = {
      navMode: $rootScope.navMode,
      pageTitle: $rootScope.pageTitle
    };
    $log.info('civicLogoController loaded');
    $scope.navMode = $rootScope.navMode;
    $scope.pageTitle = $rootScope.pageTitle;
  }

  return directive;
}
angular.module('civic.pages')
  .config(pageRoutes);

// @ngInject
function pageRoutes($stateProvider) {
  'use strict';
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/civic-client/pages/home.tpl.html'
    })
    .state('collaborate', {
      url: '/collaborate',
      controller: 'CollaborateCtrl',
      templateUrl: '/civic-client/pages/collaborate.tpl.html'
    })
    .state('help', {
      url: '/help',
      controller: 'HelpCtrl',
      templateUrl: '/civic-client/pages/help.tpl.html'
    })
    .state('contact', {
      url: '/contact',
      controller: 'ContactCtrl',
      templateUrl: '/civic-client/pages/contact.tpl.html'
    });
}

angular
  .module('civic.pages')
  .controller('AuthTestCtrl', AuthTestCtrl);

function AuthTestCtrl ($scope, $rootScope, $log) {
  'use strict';
  $log.info('AuthTestCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'AuthTest';
  $scope.loadedMsg = 'Loaded AuthTest!';
}

angular.module('civic.pages')
  .controller('HomeCtrl', HomeCtrl);

/**
 * @ngInject
 */
function HomeCtrl($rootScope, $scope, $log) {
  'use strict';
  $log.info('HomeCtrl instantiated');
  $rootScope.navMode = 'home';
  $rootScope.viewTitle = 'Home';
  $scope.loadedMsg = 'Loaded Home!';
}


angular.module('civic.pages')
  .controller('HelpCtrl', HelpCtrl);

function HelpCtrl($scope, $rootScope, $log) {
  'use strict';
  $log.info('HelpCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Help';
  $scope.loadedMsg = 'Loaded Help!';
}
angular.module('civic.pages')
  .controller('ContactCtrl', ContactCtrl);

function ContactCtrl($scope, $rootScope, $log) {
  'use strict';
  $log.info('ContactCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Contact';
  $scope.loadedMsg = 'Loaded Contact!';
}
angular
  .module('civic.pages')
  .controller('CollaborateCtrl', CollaborateCtrl);

// @ngInject
function CollaborateCtrl ($scope, $rootScope, $log) {
  'use strict';
  $log.info('CollaborateCtrl loaded.');
  $rootScope.navMode = 'sub';
  $rootScope.viewTitle = 'Collaborate';
  $scope.loadedMsg = 'Loaded Collaborate!';
}

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/authTest.tpl.html',
    '<h1>Requires Auth</h1><p>{{ loadedMsg }}</p>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/collaborate.tpl.html',
    '<h1>Collaborate</h1>{{ loadedMsg }}');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/contact.tpl.html',
    '<h1>Contact</h1>{{ loadedMsg }}');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/help.tpl.html',
    '<h1>Help</h1>{{ loadedMsg }}');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/pages/home.tpl.html',
    '<h1>Home</h1>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/civicLogo.tpl.html',
    '<div class="civicLogo"><a ui-sref="home"><div ng-switch on="navMode"><span ng-switch-when="home"><img src="assets/images/CIViC_logo@2x.png" alt="CIViC: Clinical Interpretations of Variations in Cancer" width="375" height="240" class="img-responsive"></span> <span ng-switch-when="sub"><img src="assets/images/CIViC_logo_sm@2x.png" alt="CIViC: Clinical Interpretations of Variations in Cancer" width="155" height="76"></span></div></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/headerSearch.tpl.html',
    '<div class="headerSearch" ng-show="$root.navMode == \'home\'"><div class="col-xs-8 col-md-12"><form role="form"><div class="input-group" ng-controller="typeAheadCtrl"><input class="form-control" placeholder="e.g. SR1 or Y360I" ng-model="selected" typeahead="gene as gene.both for gene in geneList | filter:$viewValue" typeahead-on-select="onSelect($item, $model, $label)"> <span class="input-group-btn"><button class="btn btn-default" type="button">Search</button></span></div></form></div><div class="col-xs-4 col-md-12"><a class="btn btn-browse-margin btn-justified btn-block hidden-sm hidden-xs" ui-sref="browse">Browse CIViC Database</a> <a class="btn btn-browse btn-justified btn-block hidden-md hidden-lg" ui-sref="browse">Browse</a></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/loginToolbar.tpl.html',
    '<div class="loginToolbar"><div class="login-toolbar-lg hidden-xs hidden-sm"><div ng-show="isAuthenticated()" class="user-controls"><div class="btn-group" dropdown><button type="button" class="btn btn-xs btn-info">{{ currentUser.name }}</button> <button type="button" class="btn btn-xs btn-info dropdown-toggle"><span class="caret"></span> <span class="sr-only">Split button!</span></button><ul class="dropdown-menu" role="menu"><li><a ui-sref="messages">Messages</a></li><li><a ui-sref="notifications">Notifications</a></li><li class="divider"></li><li><a ui-sref="settings">Settings</a></li><li class="divider"></li><li><a ng-click="logout(\'home\')">Logout</a></li></ul></div></div><div ng-hide="isAuthenticated()" class="viewer-controls"><button class="btn btn-xs btn-login" ng-click="login()">Log in</button> <button class="btn btn-xs btn-create-account" ng-click="createAccount()">Create Account</button></div></div><div class="login-toolbar-sm hidden-md hidden-lg"><div ng-show="isAuthenticated()" class="user-controls"><div class="btn-group" dropdown><button type="button" class="btn btn-xs btn-info">{{ currentUser.name }}</button> <button type="button" class="btn btn-xs btn-info dropdown-toggle"><span class="caret"></span> <span class="sr-only">Split button!</span></button><ul class="dropdown-menu" role="menu"><li><a ui-sref="messages">Messages</a></li><li><a ui-sref="notifications">Notifications</a></li><li class="divider"></li><li><a ui-sref="settings">Settings</a></li><li class="divider"></li><li><a ng-click="logout(\'home\')">Logout</a></li></ul></div></div><div ng-hide="isAuthenticated()" class="viewer-controls"><button class="btn btn-xs btn-login" ng-click="login()">Log in</button> <button class="btn btn-xs btn-create-account" ng-click="createAccount()">Create Account</button></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/mainMenu.tpl.html',
    '<div class="mainMenu"><div class="main-menu-lg hidden-xs hidden-sm"><ul><li ng-repeat="item in menuItems" ui-sref-active="active"><a ui-sref="{{ item.state}}">{{ item.label }}</a></li><li><login-toolbar></login-toolbar></li></ul></div><div class="main-menu-sm hidden-md hidden-lg"><ul class="main-menu-sm hidden-md hidden-lg"><li ng-repeat="item in menuItems" ui-sref-active="active"><a ui-sref="{{ item.state}}">{{ item.label }}</a></li><li style="position: relative"><login-toolbar></login-toolbar></li></ul></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/directives/subheader.tpl.html',
    '<div class="subheader" ng-hide="$root.navMode == \'home\'"><div class="container-fluid"><form role="form"><div class="subheader-bg"><div class="row"><div class="col-xs-6"><h1>{{ viewTitle }}</h1></div><div class="col-xs-4 col-med-4 col-lg-5 search-sub-input"><div class="input-group input-group-sm" ng-controller="typeAheadCtrl"><input class="form-control"> <span class="input-group-btn"><a class="btn btn-default" type="button">Search</a></span></div></div><div class="col-xs-2 col-med-2 col-lg-1 search-sub-browse"><a type="button" class="btn btn-sm btn-browse-sub btn-block">Browse</a></div></div></div></form></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/views/account/account.tpl.html',
    '<h1>Account Management</h1>{{ loadedMsg }}');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/views/browse/browse.tpl.html',
    '<div class="browseView"><h1>Browse</h1>{{ loadedMsg }}</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('civic-client-templates');
} catch (e) {
  module = angular.module('civic-client-templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/civic-client/common/security/login/LoginForm.tpl.html',
    '<form name="form" novalidate class="login-form"><div class="modal-header"><h4>Sign in</h4></div><div class="modal-body"><div class="alert alert-warning" ng-show="authReason">{{authReason}}</div><div class="alert alert-error" ng-show="authError">{{authError}}</div><div class="alert alert-info">Login by choosing one of the methods below:</div><ul><li><a href="api/auth/github">Login with Github</a></li></ul></div><div class="modal-footer"><button class="btn btn-warning cancel" ng-click="cancelLogin()">Cancel</button></div></form>');
}]);
})();
