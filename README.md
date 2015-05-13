civic-client
============

## Screenshots
**Homepage:**
![Homepage](notes/screenshots/home-view.png)

**Browse Events:**
![Homepage](notes/screenshots/gene-browse-view.png)

**View Event:**
![Homepage](notes/screenshots/gene-variant-evidence-view.png)

**Edit Gene:**
![Homepage](notes/screenshots/gene-edit-view.png)

**Also looks pretty good on tablet and mobile displays:**
![Homepage](notes/screenshots/tablet-gene-view.png)

## To Install

civic-client uses npm for development, build, and resource server tasks, so ensure that you have npm (and node) installed and running. Checkout this repository and cd to it, then:

```bash
npm install
```

Then head to Starbucks, get a coffee, read that new Pikettey book everyone's been talking about, return to your workstation and install the bower package management system:

```bash
npm install -g bower
```

and finally, use bower to install civic-client's runtime libraries:

```bash
bower install
```

If bower becomes confused about which Angular version to use, pick the first one that offers version 1.2.28 (however, if you intend to use the events-refactor branch as described below, choose 1.3.15).

NOTE: Currently the civic-client master branch is out of sync with civic-server master branch's API. The events-refactor branch is in sync, but is missing the 'Add Evidence' feature. To use the events-refactor branch:

```bash
git checkout events-refactor
```

Be sure to watch the master branch for an upcoming merge from events-refactor so you can switch back to master and track it for future updates.

## Development

To start developing in the project, fire up the civic-server on port 3000 and run:

```bash
gulp serve
```

Then head to `http://localhost:3001` in your browser. 

The `serve` tasks starts a static file server, and a proxy that routes calls to /api to the civic-server listening on port 3000. It serves the AngularJS application, and a starts a watch task which watches all files for changes and lints, builds and injects them into the index.html accordingly.

## Production ready build - a.k.a. dist

To make the app ready for deploy to production run:

```bash
gulp serve:dist
```

Now there's a `./dist` folder with all scripts and stylesheets concatenated, minified, and versioned, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.

## Pulling Updates
As the civic-client is under heavy development, we'll be pushing releases to the master branch at a fairly rapid rate. Often, we'll update various packages and modules that are part of the workflow and/or production codebase. So after you do a `git pull` to update your local repository, be sure to:

```bash
npm install
bower install
```

This will install any new packages or modules that the new updates require.

## Related resources
[Personalized Cancer Therapy Knowledge Base for Precision Oncology (MD Anderson Cancer Center)](https://pct.mdanderson.org/)
[My Cancer Genome - Genetically Informed Cancer Medicine (Vanderbilt-Ingram Cancer Center)](http://www.mycancergenome.org/)
[Targeted Cancer Care (Massachusetts General Hospital)](https://targetedcancercare.massgeneral.org/My-Trial-Guide/Mutations.aspx)


