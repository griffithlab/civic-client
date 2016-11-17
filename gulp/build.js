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
  return gulp.src('src/{app,components}/**/*.js')
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

  return gulp.src('.tmp/*.html')
    .pipe($.inject(
      // stream JS files in app/component directories
      gulp.src('.tmp/{app,components}/**/*.js'),
      {
        starttag: '<!-- inject:partials -->',
        addRootSlash: false,
        addPrefix: '../'
      }))



    // parse index.html for links to asset (scripts, html, css), group, concatenate, add to stream
    .pipe($.useref()) //Run useref on any vendor files which couldn't be cdnized

    //This call to useref will parse all app assets and concatenate
    //It also filters out any remote assets which have been cdnized,
    //leaving only those which couldn't behind to be parsed into vendor files
    .pipe($.useref({
      //this function scans build:filter_cdn blocks for assets which have been cdnized
      filter_cdn: function(content, target, mode, altPath){
        var scripts = content.split(/\r?\n/gm);
        var output = "";
        //prepare the build tag for the next run of useref
        var parse = "<!-- build:"+mode+"("+altPath+") "+target+" -->\n";
        scripts.forEach(function(line){
          if(line.search(/(cloudflare.com|googleapis.com|jsdelivr.net)/g)!=-1)
          {
            output+=line+"\n";
          }
          else {
            parse+=line+"\n";
          }
        });
        parse+="<!-- endbuild -->";
        return output+"\n"+parse;
      }
    }))

    // init asset revisioning with gulp-rev on each block
    .pipe($.if("!*.html",$.rev()))

    // pluck javascript block, store everything else
    .pipe(jsFilter)
    //.pipe($.sourcemaps.init()) // initialize sourcemap generation
    .pipe($.ngAnnotate()) // add angular dependency injection to protect from minification
    .pipe($.uglify({ // minify js
        preserveComments: $.uglifySaveLicense,
        mangle: false,
        beautify: true,
        compress: {
          drop_console: true,
          unused: true
        }
      }
    ))
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
    .pipe(htmlFilter)
    .pipe($.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(htmlFilter.restore)
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
