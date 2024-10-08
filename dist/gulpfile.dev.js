"use strict";

var _require = require('gulp'),
    task = _require.task,
    series = _require.series,
    parallel = _require.parallel,
    src = _require.src,
    dest = _require.dest,
    watch = _require.watch;

var sass = require('gulp-sass');

var browserSync = require('browser-sync');

var notify = require('gulp-notify');

var postcss = require('gulp-postcss');

var csscomb = require('gulp-csscomb');

var autoprefixer = require('autoprefixer');

var mqpacker = require('css-mqpacker');

var sortCSSmq = require('sort-css-media-queries');

var path = {
  scssFolder: './assets/scss/',
  scssFiles: './assets/scss/**/*.scss',
  scssFile: './assets/scss/style.scss',
  cssFolder: './assets/css/',
  cssFile: './assets/css/style.css',
  htmlFiles: './*.html',
  jsFiles: './assets/js/**/*.js'
};
var plugins = [autoprefixer({
  overrideBrowserslist: ['last 5 versions', '> 1%'],
  cascade: true
}), mqpacker({
  sort: sortCSSmq
})];

function scss() {
  return src(path.scssFile).pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError)).pipe(postcss(plugins)).pipe(dest(path.cssFolder)).pipe(notify({
    message: 'Compiled!',
    sound: false
  })).pipe(browserSync.reload({
    stream: true
  }));
}

function scssDev() {
  return src(path.scssFile, {
    sourcemaps: true
  }).pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError)).pipe(postcss(plugins)).pipe(dest(path.cssFolder, {
    sourcemaps: true
  })).pipe(notify({
    message: 'Compiled!',
    sound: false
  })).pipe(browserSync.reload({
    stream: true
  }));
}

function comb() {
  return src(path.scssFiles).pipe(csscomb()).on('error', notify.onError(function (error) {
    return "File: ".concat(error.message);
  })).pipe(dest(path.scssFolder));
}

function syncInit() {
  browserSync({
    server: {
      baseDir: './'
    },
    notify: false
  });
}

function sync() {
  return regeneratorRuntime.async(function sync$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          browserSync.reload();

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}

function watchFiles() {
  syncInit();
  watch(path.scssFiles, series(scss));
  watch(path.htmlFiles, sync);
  watch(path.jsFiles, sync);
}

task('comb', series(comb));
task('scss', series(scss));
task('dev', series(scssDev));
task('watch', watchFiles);