0.0.8 / 2017-01-19
==================
* added Evidence, Drugs, Diseases, and Sources statistics pages
* redesigned variant menu to accomodate larger collections of variants/groups

0.0.7 / 2017-01-12
==================
* improved documentation with new 'Getting Started' section, figure updates, more extensive documentation
* added Statistics page showing various Evidence metrics
* Source summary pages now provide a comments thread
* ConfigService now contains all attribute help strings for add/edit forms
* signout now returns users to home page, mooting various sign-out UI state issues

0.0.6 / 2016-09-29
==================
* variants now show aliases and HGVS expressions
* variant edit form provides multi-inputs for HGVS expressions and aliases
* gene advanced search now provides Suggested Revisions attribute
* Evidence Type fields on add/edit evidence item forms now provide a Predisposing type
* gene grid variant count column now filterable and sortable
* meetings page updates for NKI
* added custom header to client requests so server can better differentiate between client and direct API access
* variant name on add evidence for now a required field.
* gene variant sidebar now shows all variants instead just the first 25 returned from query

0.0.5 / 2016-08-26
==================
* sources now have their own summary view
* advanced search now provides an option to search sources
* browse view now provides option to browse sources
* data releases now shown in a table instead of long list
* evidence summary now shows citation (linked to source summary view) and pubmed ID (linked to pubmed detail page)


0.0.4 / 2016-08-18
==================
* added publication year to evidence search query builder


0.0.3 / 2016-08-11
==================
* browse view tabs no longer wrap when displayed in sm and md window widths
* user profile links now work even if user has no events returned from Search service
* users viewing their profile are now provided a button linking to the account profile edit page
* comment help text now details @admins and @editors mention notifications


0.0.2 / 2016-07-28
==================
* users may no longer approving/accept their own items/updates - approve/accept buttons will show as disabled
* HOTFIX: some components that compare entity owner to current user threw an error when rendering if user logged out
* evidence item advanced search now includes a Variant Origin option
* added note regarding CIViC partner relationships to About page
* evidence item / disease search option now provides typeahead assistance
* advanced search query builder now indicates if no records returned
* added biography attribute to profile display and edit views
* evidence grid row now indicates if pending changes exist using indicator/tooltip in ID cell


0.0.1 / 2016-07-21
==================
* gene advanced search added
* added variant count column to browse variant group grid
* added note on profile instructing users how to change their avatar on gravatar.com
* fixed variant grid variant list cell
* all entity grids can now open record in new tab if meta key (alt/command) held while clicking
* contributors no longer able to accept their own evidence items and revisions
* facebook and linkedin profile attributes now accept nicknames/handles instead of full URLs
