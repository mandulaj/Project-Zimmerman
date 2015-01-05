var http       = require('http'),
    connect    = require('connect'),
    path       = require('path'),
    spawn      = require('child_process').spawn,
    gulp       = require('gulp'),
    plumber    = require('gulp-plumber'),
    less       = require('gulp-less'),
    prefix     = require('gulp-autoprefixer'),
    notify     = require('gulp-notify');

gulp.task('styles', function() {
    var styles = gulp.src('less/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(prefix())
        .pipe(gulp.dest('css/'));

    return styles;
});

gulp.task('jekyll', function() {
    jekyll = spawn('jekyll', ['build', '--drafts', '--future']);

    jekyll.stdout.on('data', function (data) {
        console.log('jekyll:\t' + data); // works fine
    });
});

gulp.task('watch', function() {

    gulp.watch('less/**', ['styles']);
    gulp.watch(['css/**', '_layouts/**', '_includes/**', '_posts/**'], ['jekyll']);
});

gulp.task('serve', function() {
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static(path.resolve('_site')));

    http.createServer(app).listen(4000);
});

gulp.task('build', ['styles', 'jekyll']);
gulp.task('default', ['watch', 'serve', 'styles']);
