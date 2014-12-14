var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    hbsfy = require('browserify-handlebars');

var watcher = gulp.watch('websrc/**/*.js', ['browserify']);
watcher.on('change', function(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks');
});

gulp.task('default', function(){

});

gulp.task('browserify', function(){
    gulp.src('websrc/rankyui.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: true,
            transform: [hbsfy]
        }))
        .on('error', handleError)
        .pipe(gulp.dest('public/js'))
});

gulp.task('less', function(){

});

var handleError = function(err){
    console.log(err.stack);
}
