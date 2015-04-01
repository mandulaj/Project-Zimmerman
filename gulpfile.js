var gulp = require('gulp'),
  less = require('gulp-less'),
  minify = require("gulp-mini-css"),
  autoprfixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  jsuglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  imageop = require('gulp-image-optimization'),
  exec = require('child_process').exec;


var paths = {
  input: {
    js: "src/js/**/*js",
    less: "src/less/**/*.less",
    jade: "src/jade/**/*.jade",
    img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif', 'src/img/**/*.jpeg']
  },
  output: {
    js: "build/js",
    css: "build/css",
    img: "build/img",
    root: "build"
  }
};

gulp.task('deploy', ['jade', 'less', 'js', 'image'], function(cb) {
  exec('git add -f build; git commit -m "git deployment"; git push origin `git subtree split --prefix build master`:gh-pages --force;git reset HEAD^;git reset build', function(err, stdout, stderr) {
    if (err) return cb(err); // return error
    console.log(stdout);
    console.log(stderr);
    cb(); // finished task
  });
});

gulp.task('connect', function() {
  connect.server({
    root: paths.output.root,
    livereload: true
  });
});


gulp.task("less", function() {
  return gulp.src(paths.input.less)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprfixer())
    .pipe(gulp.dest(paths.output.css))
    .pipe(minify({
      ext: '.min.css'
    }))
    .pipe(gulp.dest(paths.output.css))
    .pipe(connect.reload());

});

gulp.task("jade", function() {
  gulp.src("CNAME").pipe(gulp.dest(paths.output.root));
  return gulp.src(paths.input.jade)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(paths.output.root))
    .pipe(connect.reload());
});

gulp.task("js", function() {
  return gulp.src(paths.input.js)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(rename({
      extname: ".js"
    }))
    .pipe(gulp.dest(paths.output.js))
    .pipe(jsuglify())
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest(paths.output.js))
    .pipe(connect.reload());
});

gulp.task("image", function() {
  return gulp.src(paths.input.img)
    .pipe(plumber())
    .pipe(imageop({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.output.img));
});

gulp.task("watch", function() {
  gulp.watch(paths.input.less, ['less']);
  gulp.watch(paths.input.js, ['js']);
  gulp.watch(paths.input.jade, ['jade']);
});

gulp.task('default', ["connect", "less", "jade", "js", "image", "watch"]);
