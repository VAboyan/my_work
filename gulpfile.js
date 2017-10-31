"use strict";

const gulp = require('gulp')
const prefix = require('gulp-autoprefixer')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const fonts = require('gulp-fontmin')
const del = require('del')
const runSequence = require('run-sequence')
const notify = require('gulp-notify')

const makeBuildIn = path => {
  const pathArr = path.split('/')

  pathArr.shift()
  pathArr.pop()

  return pathArr.join('/') + '/'
}

gulp.task('connect', function () {
  connect.server({
    root: 'build',
    livereload: true
  })
});

gulp.task('scss', function() {
  const scssArr = [ // Сюда вписывай пути к своим scss файлам, как в примере, через запятую (пример можно удалить потом)
    'src/style.scss',
    'src/career/backend/style.scss',
    'src/career/frontend/style.scss',
    'src/notFound/style.scss',
  ]

  scssArr.forEach(function (path) {
    gulp.src(path)
      .pipe(sass())
      .on('error', notify.onError(function(error) {
        return {
          title: 'scss',
          message:  error.message
        };
      }))
      .pipe(prefix({
        browsers: ['last 2 versions'],
      }))
      .pipe(gulp.dest('build/' + makeBuildIn(path)))
      .pipe(connect.reload())
  })
});

gulp.task('pug', function () {
  const pugArr = [ // Сюда вписывай пути к своим pug файлам, как в примере, через запятую (пример можно удалить потом)
    'src/index.pug',
    'src/career/backend/index.pug',
    'src/career/frontend/index.pug',
    'src/notFound/404.pug',
  ]

  pugArr.forEach(function (path) {
    gulp.src(path)
      .pipe(pug({ pretty: true }))
      .on('error', notify.onError(function(error) {
        return {
          title: 'pug',
          message:  error.message
        };
      }))
      .pipe(gulp.dest('build/' + makeBuildIn(path)))
      .pipe(connect.reload())
  })
});

gulp.task('images', function() { // Это просто перетаскиввает картинки из static в build/static
  gulp.src('static/images/*.+(png|jpg|gif|jpeg)')
    .pipe(gulp.dest('build/static/images'))
});

gulp.task('fonts', function () { // Это просто перетаскиввает шрифты из static в build/static
  gulp.src('static/fonts/*')
    .pipe(fonts())
    .pipe(gulp.dest('build/static/fonts/'));
});

gulp.task('static', function () { // Это просто перетаскиввает все остальное из static в build/static
  gulp.src('static/**')
    .pipe(gulp.dest('build/static/'));
});

gulp.task('clean', function(cb) { // просто чистит папку билд перед запуском, чтобы не перезаписывать файлы и создавтаь новые
  return del('./build', cb);
});

gulp.task('watch', function () { // тут я говорю галпу, чтобы он смотрел за такими-то файлами (1 аргумент в ф-ции watch), и выполнял такой-то таск (второй аргумент)
  gulp.watch('src/**/*.scss', ['scss']);
  gulp.watch('src/**/*.pug', ['pug']);
  gulp.watch('static/images/*', ['images']);
  gulp.watch('static/**', ['static']);
  gulp.watch('static/fonts/*', ['fonts']);
});

gulp.task('default', function (cb) {
  runSequence('clean', ['scss', 'pug', 'images', 'static', 'fonts'], ['connect', 'watch'], cb)
});