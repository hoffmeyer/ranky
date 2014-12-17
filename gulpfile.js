var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    less = require('gulp-less'),
    hbsfy = require('browserify-handlebars'),
    path = require('path');


var jsWatcher = gulp.watch('client/**/*.js', ['browserify']);
jsWatcher.on('change', function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks');
});

var lessWatcher = gulp.watch('client/**/*.less', ['less']);
lessWatcher.on('change', function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks');
});

gulp.task('default', function(){

});

gulp.task('browserify', function(){
    gulp.src('client/rankyui.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production,
            transform: [hbsfy]
        }))
        .on('error', handleError)
        .pipe(gulp.dest('public/'))
});

gulp.task('less', function(){
    gulp.src('./client/less/ranky.less')
    .pipe(less())
    .on('error', handleError)
    .pipe(gulp.dest('public/'));
});

var handleError = function(err){
    console.log('Error!');
    console.log(err);
}
