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
    sourcemaps = require('gulp-sourcemaps'),
    destFolder = './public/scripts',
    destFileName = 'app.js';

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
    console.log('building with sourcemaps');
    return browserify(sourceFile)
            .bundle()
            .pipe(source(destFileName))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('public/scripts'));
});

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
gulp.task('bundle', ['styles', 'scripts'], function(){
    return gulp.src('./client/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('public'));
});

gulp.task('buildBundle', ['styles', 'buildScripts'], function(){
    return gulp.src('./client/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('public'));
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

gulp.task('nodemon', function(cb){
   return nodemon({
       script: 'app.js',
       ext: 'js',
       ignore: ['client/**/*', 'public/**/*', 'node_modules/**/*'],
       nodeArgs: ['--debug']
   })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('* node server restarted!')
    });
});

// Watch
gulp.task('watch', ['html', 'bundle'], function () {

    gulp.watch('client/scripts/**/*.js', ['scripts']);

    // Watch .html files
    gulp.watch('client/*.html', ['html']);

    gulp.watch(['client/styles/**/*.scss', 'client/styles/**/*.css'], ['styles']);

    // Watch image files
    gulp.watch('client/images/**/*');
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
