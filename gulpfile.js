var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));

var pug = require('gulp-pug');
var webserver = require('gulp-webserver');
var minify = require("gulp-minify");

gulp.task('views', function buildHTML() {
  return gulp.src('src/views/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {
  return gulp.src('src/SCSS/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/CSS'));
});

gulp.task('js', function () {
  return gulp.src("src/JS/*.js")
    .pipe(minify())
    .pipe(gulp.dest("dist/JS"));
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      open: false
    }));
});

gulp.task('watch', function () {
  gulp.watch('src/SCSS/*.scss', gulp.series('sass'));
  gulp.watch('src/views/*.pug', gulp.series('views'));
  gulp.watch('src/JS/main.js', gulp.series('js'));
});

gulp.task('default', gulp.series('views', 'sass', 'js', gulp.parallel('watch', 'webserver')));
