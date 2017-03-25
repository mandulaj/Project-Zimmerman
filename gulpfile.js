const gulp = require('gulp'),
  less = require('gulp-less'),
  minify = require("gulp-clean-css"),
  autoprfixer = require('gulp-autoprefixer'),
  jshint = require('gulp-jshint'),
  jsuglify = require('gulp-uglify'),
  plumber = require('gulp-plumber'),
  connect = require('gulp-connect'),
  rename = require('gulp-rename'),
  jade = require('gulp-jade'),
  imagemin = require('gulp-imagemin'),
  changed = require('gulp-changed'),
  gulpIf = require('gulp-if'),
  del = require('del'),
  exec = require('child_process').exec;


var paths = {
  input: {
    js: "src/js/**/*js",
    less: "src/less/**/*.less",
    jade: "src/jade/**/*.jade",
    img: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif', 'src/img/**/*.jpeg', 'src/img/**/*.*'],
    articles: "src/data/**"
  },
  output: {
    js: "build/js",
    css: "build/css",
    img: "build/img",
    articles: "build/data",
    root: "build"
  }
};

function isDeploy() {
  return (process.argv.indexOf('deploy') !== -1);
}

gulp.task('deploy', ['jade', 'less', 'js', 'image', 'articles'], function(cb) {
  //TODO: make sure to merge any articles from the github repository into here

  // Check for uncommited files
  exec('git status', function(err, stdout, stderr){
    if(err) return cb(err);

    if((/nothing to commit, working tree clean/).test(stdout)){
      exec('git add -f build; git commit -m "git deployment ' + new Date() + '"; git push origin `git subtree split --prefix build`:gh-pages --force; git reset HEAD^;git reset build', function(err, stdout, stderr) {
        if (err) return cb(err); // return error
        console.log(stdout);
        console.log(stderr);
        cb(); // finished task
      });
    } else {
      console.log("Error, uncommited changes in the working tree.")
      console.log("Please commit your changes and then run gulp deploy again.")
      return cb();
    }
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
    .pipe(gulpIf(isDeploy(),minify()))
    .pipe(rename({
      extname: ".css"
    }))
    .pipe(gulp.dest(paths.output.css))
    .pipe(connect.reload());

});

gulp.task("jade", function() {
  gulp.src("CNAME").pipe(gulp.dest(paths.output.root));
  gulp.src(".gitignore").pipe(gulp.dest(paths.output.root));
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
    .pipe(gulpIf(isDeploy(),jsuglify()))
    .pipe(rename({
      extname: ".js"
    }))
    .pipe(gulp.dest(paths.output.js))
    .pipe(connect.reload());
});

gulp.task("image", function() {
  return gulp.src(paths.input.img)
    .pipe(plumber())
    .pipe(changed(paths.output.img))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest(paths.output.img));
});

gulp.task("articles", function(){
  return gulp.src(paths.input.articles)
    .pipe(gulp.dest(paths.output.articles));
});

gulp.task("watch", function() {
  gulp.watch(paths.input.less, ['less']);
  gulp.watch(paths.input.js, ['js']);
  gulp.watch(paths.input.jade, ['jade']);
  gulp.watch(paths.input.img, ['image']);
  gulp.watch(paths.input.articles, ['articles']);
});

gulp.task("clean", function() {
  return del([paths.output.root]);
});

gulp.task('default', ["connect", "less", "jade", "js", "image","articles", "watch"]);
