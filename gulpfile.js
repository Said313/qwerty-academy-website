const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefix = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');


sass.compiler = require('node-sass');

gulp.task('styles', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefix())
    .pipe(cssnano())
    .pipe(gulp.dest('./build'));
});

gulp.task('staticFiles', function () {
  return gulp.src([
    './src/**/*',
    './src/*',
    '!./src/**/*.html',
    '!./src/**/*.scss',
    '!./src/**/*.css',
    '!./src/**/*.js',
    '!./src/assets/images/*',
    '!./src/components'
    ])
    .pipe(gulp.dest('./build'));
});

gulp.task('compressImg', function () {
  return gulp.src([
    './src/assets/images/*'
    ])
    .pipe(imagemin([
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('./build/assets/images'));
});

gulp.task('html', function () {
    return gulp.src([
      './src/**/*.html',
      '!./src/components/*.html', // ignore
      ])
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(htmlmin({ 
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
      }))
      .pipe(gulp.dest('./build'));
  }
)

gulp.task('watch', function(){
    gulp.watch('./src/**/*.scss', gulp.series('styles'));
    gulp.watch('./src/**/*.html', gulp.series('html'));
    gulp.watch('./src/assets/**/*', gulp.series('staticFiles'));
    gulp.watch('./src/assets/images/*', gulp.series('compressImg'));
});

gulp.task('default', gulp.series('styles', 'html', 'staticFiles', 'watch'));
