// This file only handles building the client side code and css.
// The server side code i all handels by node, nothing is doen by gulp
//
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    less = require('gulp-less'),
    path = require('path');



var bundler = watchify(browserify('./client/rankyui.js', watchify.args));
// add any other browserify options or transforms here
bundler.transform('hbsfy');

gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
    var now = new Date(),
        time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    console.log( time + ' Building bundle...');
    return bundler.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./public'));
}

gulp.task('less', function(){
    gulp.src('./client/less/ranky.less')
    .pipe(less())
    .on('error', lessError)
    .pipe(gulp.dest('public/'));
});

var lessError = function(err){
    console.log('Error!');
    console.log(err);
}

gulp.task('watch', function(){
    gulp.watch('./client/less/*.less', ['less']);
});

gulp.task('lint', function(){
    gulp.src('./**/*.js')
        .pipe(jshint());
});

gulp.task('node', function(){
   nodemon({ 
       script: 'app.js', 
       ext: 'jade js html', 
       ignore: ['client/**/*'],
       nodeArgs: ['--debug'] 
   })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    });
});


gulp.task('default', ['watch', 'js', 'node']);
