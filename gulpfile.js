'use strict';

var gulp = require('gulp');
var del = require('del');


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),
    sourceFile = './client/scripts/app.js',
    jshint = require('gulp-jshint'),
    nodemon = require('gulp-nodemon'),
    destFolder = './public/scripts',
    destFileName = 'app.js';

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Styles
gulp.task('styles', function () {
    return gulp.src(['client/styles/main.scss', 'client/styles/**/*.css'])
        .pipe($.rubySass({
            style: 'expanded',
            precision: 10,
            loadPath: ['client/bower_components']}))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('public/styles'))
        .pipe($.size());
});

// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source(destFileName))
            .pipe(gulp.dest(destFolder));
    }

    return rebundle();

});

gulp.task('buildScripts', function() {
    return browserify(sourceFile)
            .bundle()
            .pipe(source(destFileName))
            .pipe(gulp.dest('public/scripts'));
});




gulp.task('jade', function () {
    return gulp.src('client/template/*.jade')
        .pipe($.jade({ pretty: true }))
        .pipe(gulp.dest('public'));
})



// HTML
gulp.task('html', function () {
    return gulp.src('client/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('public'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('client/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public/images'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function (cb) {
    cb(del.sync(['public/styles', 'public/scripts', 'public/images']));
});


// Bundle
gulp.task('bundle', ['styles', 'scripts', 'bower'], function(){
    return gulp.src('./client/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('public'));
});

gulp.task('buildBundle', ['styles', 'buildScripts', 'bower'], function(){
    return gulp.src('./client/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('public'));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('client/bower_components/**/*.js', {base: 'client/bower_components'})
        .pipe(gulp.dest('public/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('client/scripts/json/**/*.json', {base: 'client/scripts'})
        .pipe(gulp.dest('public/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
    return gulp.src(['client/*.txt', 'client/*.ico'])
        .pipe(gulp.dest('public/'))
        .pipe($.size());
});

gulp.task('lint', function(){
    gulp.src('./**/*.js')
        .pipe(jshint());
});

gulp.task('node', function(){
   nodemon({ 
       script: 'app.js', 
       ext: 'js', 
       ignore: ['client/**/*', 'public/**/*', 'node_modules/**/*'],
       nodeArgs: ['--debug'] 
   })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('* node server restarted!')
    });
});

// Watch
gulp.task('watch', ['html', 'bundle'], function () {
/*
    browserSync({
        notify: false,
        logPrefix: 'BS',
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['public', 'client']
    });
    */

    gulp.watch('client/scripts/**/*.js', ['scripts', reload]);

    // Watch .json files
    gulp.watch('client/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('client/*.html', ['html']);

    gulp.watch(['client/styles/**/*.scss', 'client/styles/**/*.css'], ['styles', reload]);


    // Watch .jade files
    gulp.watch('client/template/**/*.jade', ['jade', 'html', reload]);


    // Watch image files
    gulp.watch('client/images/**/*', reload);
});

// Build
gulp.task('build', ['html', 'buildBundle', 'images', 'extras'], function() {
    gulp.src('public/scripts/app.js')
        .pipe($.uglify())
        .pipe($.stripDebug())
        .pipe(gulp.dest('public/scripts'));
});

// Default task
gulp.task('default', ['clean', 'build' ]);
