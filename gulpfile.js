var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var stylus = require('gulp-stylus');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require('gulp-minify-css');

var paths = {
  scripts: ['client/assets/js/**/*.js'],
  images: 'client/assets/img/**/*'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['build']);
});

gulp.task('scripts', ['clean'], function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

// Copy all static images
gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  // gulp.watch(paths.scripts, ['scripts']);
  // gulp.watch(paths.images, ['images']);
  gulp.watch('./client/assets/site/style/*.styl', ['css']);
  gulp.watch('./client/assets/game/style/*.styl', ['css']);
  gulp.watch('./client/assets/common/style/*.styl', ['css']);
  gulp.watch('./client/assets/mapCreator/style/*.styl', ['css']);
});

gulp.task('css', function () {
  gulp.src(['./client/assets/site/style/*.styl', './client/assets/common/style/*.styl'])
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./client/assets/css/build/site'));
  gulp.src(['./client/assets/game/style/*.styl', './client/assets/common/style/*.styl'])
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./client/assets/css/build/game'));
  gulp.src(['./client/assets/mapCreator/style/*.styl'])
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./client/assets/css/build/mapCreator'));
});

// The default task (called when you run `gulp` from cli)
// gulp.task('default', ['watch', 'scripts', 'images']);
gulp.task('default', ['watch', 'css']);