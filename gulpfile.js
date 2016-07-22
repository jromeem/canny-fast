var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var $ = require('gulp-load-plugins')();
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('build', ['styles', 'scripts', 'images']);

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('dist/images/'))
        .pipe($.size());
});

gulp.task('clean', function(cb) {
    del.sync(['dist']);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

gulp.task('watch', ['build'], function() {
    browserSync({
        proxy: "http://simply.api.dev/",
        notify: false,
        logPrefix: 'BS',
    });
    gulp.watch(['app/simply/**/*',
                'app/admin/**/*',
                'app/shared/**/*',
                'app/property-owner/**/*',
                'app/assets/styles/**/*',
                'app/views/**/*'], ['slim-dep-fast', reload]);
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('styles', ['sass', 'css']);
gulp.task('css', function(){
    gulp.src(['src/styles/**/*.css'])
    .pipe(gulp.dest('dist/styles'));
});
gulp.task('sass', function() {
    return $.rubySass('src/styles', {
            style: 'expanded',
            precision: 10
        })
        .pipe(gulp.dest('dist/styles'))
        .pipe($.size());
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/images/**/*", ['images']);
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});