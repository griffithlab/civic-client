'use strict';

var gulp = require('gulp');
var es = require("event-stream")
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});
// TODO require gulp plugins normally instead of using gulp-load-plugins - makes the code easier to understand

var connect = require('gulp-connect');

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

gulp.task('styles', ['wiredep'],  function () {
  return gulp.src([
      'src/{app,components}/**/*.less',
      '!src/{app,components}/**/_*.less'
    ])
    .pipe($.less({
      paths: [
        'src/bower_components',
        'src/app',
        'src/components'
      ]
    }))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('scripts', function () {
  var angularticsFilter = $.filter('!**/angulartics-ga.js');
  return gulp.src('src/{app,components}/**/*.js')
    .pipe(angularticsFilter)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('partials', function () {
  return gulp.src('src/{app,components}/**/*.html')
    .pipe($.htmlmin({
      collapseWhitespace: true
    }))
    .pipe($.ngHtml2js({
      moduleName: 'civicClient'
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe($.size());
});

gulp.task('html', ['styles', 'scripts', 'partials', 'cdnize'], function () {
  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var fieldTypeFilter = function(){
    return $.filter(function(file){
      return !file.path.endsWith('src/components/forms/fieldTypes/comment.js');
    });
  };
  var indexFilter = function(){
    return $.filter(function(file){
      return !file.path.endsWith('src/app/index.js');
    });
  };
  var loginFilter = function(){
    return $.filter(function(file){
      return !file.path.endsWith('src/components/directives/looginToolbar.js')
    });
  };
  var specFilter = function(){
    return $.filter(function(file){
      return !file.path.endsWith(".spec.js");
    });
  };

  return gulp.src('.tmp/*.html')
    // .pipe($.inject(
    //   gulp.src("src/components/forms/**/*.js")
    //   .pipe(fieldTypeFilter())
    //   .pipe(specFilter()),
    //   {
    //     starttag: '<!-- inject:forms -->',
    //     addRootSlash: false,
    //   }
    // ))
    // .pipe($.inject(
    //   gulp.src('src/app/**/*.js')
    //   .pipe(indexFilter())
    //   .pipe(specFilter()),
    //   {
    //     starttag: '<!-- inject:appjs -->',
    //     addRootSlash: false,
    //   }
    // ))
    // .pipe($.inject(
    //   gulp.src('src/components/**/*.js')
    //   .pipe(fieldTypeFilter())
    //   .pipe(loginFilter())
    //   .pipe(specFilter()),
    //   {
    //     starttag: '<!-- inject:components -->',
    //     addRootSlash: false
    //   }
    // ))
    .pipe($.inject(
      gulp.src("src/{app,components}/**/*.js")
        .pipe(specFilter())
        .pipe(function(coreModule, exceptions) {
          var through = require('through2');
          var BufferStreams = require("bufferstreams");
          var exceptionList = exceptions || {};
          var core = coreModule;
          var moduleGroups = {};
          var files = [];
          var skipped = [];
          var add_to_group = function(name, toGroup){
            if (!moduleGroups[toGroup]){
              moduleGroups[toGroup] = [];
            }
            moduleGroups[toGroup].push(name);
          };

          var resolve = function(name, chain) {
            var callChain = chain;
            if (callChain === undefined) {
              callChain = [];
            }
            if (callChain.find(function(elem) { return elem == name;})) {
              console.log("---------Dependency loop detected--------");
              console.log(callChain);
              return [];
            }
            if (moduleGroups[name]) {
              var output = moduleGroups[name];
              if (moduleGroups[name+"_deps"]) {
                moduleGroups[name+"_deps"].forEach(function(dep_name) {
                  output = output.concat(resolve(dep_name, callChain.concat([name])));
                });
              }
              if (moduleGroups[name+"_child"]) {
                output = output.concat(moduleGroups[name+"_child"]);
              }
              if (moduleGroups[name+"_exceptions"]) {
                output = output.concat(moduleGroups[name+"_exceptions"]);
              }
              return output;
            }
            return [];
          };

          console.log("Starting up angular app injection");
          var scanner = function(path, contents) {
            var regex = /(?:angular|ng)(?:.|[\r\n])*?\.module\(((?:.|[\r\n])+?)\)/gmi;
            var raw_modules = contents.toString().match(regex);
            if (!raw_modules){
              // console.log("====================>");
              // console.log(path+" does not contain a matched angular expression");
              skipped.push(path);
              return;
            }
            raw_modules.forEach(function(elem){
              //console.log("============>\n\n");
              //console.log(elem);
              var name_regex = /(?:angular|ng)(?:.|[\r\n])*?\.module\((?:.|[\r\n])*?[\'\"]([.\-\/\w]+)[\'\"].*?[,\)]/mi;
              var name = name_regex.exec(elem)[1];
              //console.log(name);
              var deps_regex = RegExp(name+"[\'\"]([^\)]*)", 'gm');
              //name -> ) is a module call.
              //name -> ,[ interest ]) is a module def
              //load order:
              //modle def: angular.module(a, [b,c,d]) name
              //module dependents: angular.module(b,[]) name_deps
              //module children: angular.module(a) name_child
              var deps = deps_regex.exec(elem);
              // if (path.endsWith("formConfig.js")) {
              //   console.log('-----FORM CONFIG------');
              //   console.log(deps);
              //   console.log(deps[0]);
              //   console.log(deps[1]);
              //   console.log('----------------------');
              // }
              Object.keys(exceptionList).forEach(function(excPath) {
                if(path.includes(excPath)) {
                  console.log(path," matches exception to ",exceptionList[excPath]);
                  add_to_group(path, exceptionList[excPath]+"_exceptions");
                }
              });
              if (!deps[1]){
                //this is a module call
                add_to_group(path, name+"_child");
              } else {
                //console.log("Dependents:");
                // console.log('-------MODULE DEF----------');
                // console.log(name);
                // console.log(deps);
                // console.log(path);
                // console.log('---------------------------');
                add_to_group(path, name);
                var mods_regex = /[\'\"]([.\-\w\/]+)[\'\"]/gi;
                var dependents = deps[1].match(mods_regex);
                if (dependents) {
                  dependents.forEach(function(dep_mod) {
                    //console.log(dep_mod.slice(1,-1));
                    add_to_group(dep_mod.slice(1,-1), name+"_deps");
                  });
                }
              }
            });
          };

          return through.obj(
            function(file, encoding, callback) {
              //console.log("Scanning: ", file.path)
              files.push(file);
              if(file.isBuffer()) {
                scanner(file.path, file.contents);
              } else {
                console.log("Streaming: "+file.path);
                file.contents.pipe(new BufferStreams(function(err, buffer, cb) {
                  if(err) return cb(err);
                  try {
                    scanner(file.path, buffer);
                  } catch(e) {
                    return cb(e);
                  }
                }))
              }
              callback();
            },
            function(callback){
              var streamCaller = this;
              console.log("Skipped files:");
              console.log(skipped);
              console.log("Resolving dependency tree from module: "+core);
              resolve(core).forEach(function(filepath) {
                var index = files.findIndex(function(obj) {
                  return obj && obj.path == filepath;
                });
                if (index == -1) {
                  return;
                }
                streamCaller.push(files[index]);
                files[index] = null;
                return;
              });
              console.log("Completed app injection");
              callback();
            }
          );
        }('civicClient', {
          // 'src/components/filters.js':'civic.states',
          // 'src/components/security/':'civic.config',
        })),
        {
          starttag: '<!-- inject:appjs -->',
          addRootSlash: false,
          //ignorePath: 'src/'
        }
    ))
    .pipe($.inject(
      // stream JS files in app/component directories
      gulp.src('.tmp/{app,components}/**/*.js'),
      {
        starttag: '<!-- inject:partials -->',
        addRootSlash: false,
        addPrefix: '../'
      }))


    // parse index.html for links to asset (scripts, html, css), group, concatenate, add to stream
    //This call to useref will parse all app assets and concatenate
    //It also filters out any remote assets which have been cdnized,
    //leaving only those which couldn't behind to be parsed into vendor files
    // .pipe($.useref({
    //   //this function scans build:filter_cdn blocks for assets which have been cdnized
    //   filter_cdn: function(content, target, mode, altPath){
    //     var scripts = content.split(/\r?\n/gm);
    //     var output = "";
    //     //prepare the build tag for the next run of useref
    //     var parse = "<!-- build:"+mode+(altPath?"("+altPath+") ":' ')+target+" -->\n";
    //     scripts.forEach(function(line){
    //       if(line.search(/(cloudflare\.com|googleapis\.com|jsdelivr\.net)/g)!=-1)
    //       {
    //         output+=line+"\n";
    //       }
    //       else {
    //         parse+=line+"\n";
    //       }
    //     });
    //     parse+="<!-- endbuild -->";
    //     return output+"\n"+parse;
    //   }
    // }))
    //
    // .pipe($.useref()) //Second call to useref picks up the vendor files which weren't cdnized
    //and concatenates into vendor.{js,css}

    // init asset revisioning with gulp-rev on each block
    .pipe($.if("!*.html",$.rev()))

    // pluck javascript block, store everything else
    .pipe(jsFilter)
    //.pipe($.sourcemaps.init()) // initialize sourcemap generation
    .pipe($.ngAnnotate()) // add angular dependency injection to protect from minification
    // .pipe($.uglify({ // minify js
    //     preserveComments: $.uglifySaveLicense,
    //     mangle: true,
    //     compress: {
    //       drop_console: true,
    //       unused: true
    //     }
    //   }
    // ))
    //.pipe($.sourcemaps.write('.')) // write sourcemaps
    .pipe(jsFilter.restore)
    // restore non-js blocks to stream

    // pluck CSS, store non-css files
    .pipe(cssFilter)
    .pipe($.replace('/bower_components/bootstrap/fonts','/assets/fonts')) // rewrite bootstrap font urls
    .pipe($.replace(/url\('ui-grid\.(.*?)'\)/g,'url(\'/assets/fonts/ui-grid.$1\')')) // rewrite ui-grid font urls
    .pipe($.replace(/url\('\.\.\/fonts\/fontawesome-webfont\.(.*?)'\)/g,'url(\'/assets/fonts/fontawesome-webfont.$1\')')) // rewrite font-awesome fonts
    .pipe($.csso(true)) // minify CSS
    .pipe(cssFilter.restore)
    // restore non-css blocks to stream


    // apply revisions to concatenated assets
    .pipe($.revReplace())

    // pluck HTML, store everything else
    // .pipe(htmlFilter)
    // .pipe($.htmlmin({
    //   collapseWhitespace: true
    // }))
    // .pipe(htmlFilter.restore)
    // restore non-HTML files to stream

    // save files
    .pipe(gulp.dest('dist'))

    // generate size report
    .pipe($.size());
});

gulp.task('images', function () {
  return gulp.src('src/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return es.concat(
    gulp.src($.mainBowerFiles()),
    gulp.src('src/assets/fonts/**/*')
    )
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe($.size());
});

gulp.task('misc', function () {
  return gulp.src(['sitemap.xml', 'src/**/*.ico'])
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

gulp.task('clear-cache', function() {
  $.cache.clearAll();
});

gulp.task('clean', function (done) {
  $.del(['.tmp', 'dist'], done);
});

gulp.task('e2e:build', ['html', 'images', 'fonts', 'misc']);

gulp.task('build', ['e2e:build'], function(){

  return gulp.src('dist/scripts/app*.js')
    .pipe($.replace(/window\.apiCheck\.disabled=![01]/g, 'window.apiCheck.disabled=!0'))
    .pipe($.replace(/\.debugInfoEnabled\(![01]\)/g, '.debugInfoEnabled(!1)'))
    .pipe(gulp.dest('dist/scripts'))
});
