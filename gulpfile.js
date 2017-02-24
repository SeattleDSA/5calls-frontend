'use strict';

var gulp = require('gulp')
  , sass = require('gulp-sass')
  , autoprefixer = require('gulp-autoprefixer')
  , imagemin = require('gulp-imagemin')
  , browserify = require('browserify')
  , es2040 = require('es2040')
  , buffer = require('vinyl-buffer')
  , source = require('vinyl-source-stream')
  ;

// Input directories
var SRC = {
  html:    './static/html',
  scss:    './static/scss',
  img:     './static/img',
  js:      './static/js',
  extra:   './static/rootExtra'
};

// Output directories; Servable content ends up here
var DEST = {
  html:'./app/static',
  css: './app/static/css',
  img: './app/static/img',
  js:  './app/static/js'
};

// Take all html files and directly transfer to destination directory with no transformations.
gulp.task('html', function() {
  gulp.src(SRC.html + '/*.html')
    .pipe(gulp.dest(DEST.html));
});

// Watch html files in the src directory for changes, and run 'html' task every time the files change.
gulp.task('html:watch', function() {
  gulp.watch(`${SRC.html}/*.html`, ['html']);
});

// Compile Sass into CSS
gulp.task('sass', function() {
  gulp.src(`${SRC.scss}/*.scss`)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest(DEST.css));
});

// Watch .scss files for changes, and run 'sass' task every time the files change.
gulp.task('sass:watch', function() {
  gulp.watch(`${SRC.scss}/**/*.scss`, ['sass']);
});

// Copy/minify image assets. Take any of the listed formats from image directory,
// losslessly compress, and copy to destination image folder.
gulp.task('copy-images', function() {
  gulp.src(SRC.img + '/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest(DEST.img));
});

// Watch any image files (of listed format types), and run 'copy-images' task every time they change. 
gulp.task('copy-images:watch', function() {
  gulp.watch(SRC.img + '/**/*.+(png|jpg|jpeg|gif|svg)');
});

// Bundle and transpile javascript
gulp.task('scripts', function() {
  // Browserify is a node-style module library for client side JavaScript. https://github.com/substack/node-browserify#usage
  var b = browserify({
    entries: `${SRC.js}/main.js`,
    debug: true, // TODO: non-debug deploy task
    transform: [es2040] // gives us cross-browser es6 functionality
  });

  // Turn all of our js files used in the app into one big js file, then output to destination js directory.
  // This is used to limit http requests and limit download size.
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest(DEST.js));
});

// Watch all js script files, and run 'scripts' task every time they change.
gulp.task('scripts:watch', function() {
  gulp.watch(`${SRC.js}/**/*.js`, ['scripts']);
});

// Copy any files of the listed types to the destination html folder.
gulp.task('extra', function() {
  gulp.src(SRC.extra + '/*.+(ico|xml|json)')
    .pipe(gulp.dest(DEST.html));
});

// The default task (called when you run `gulp` from cli)
// Builds the entire project, and turns on all of the file watchers defined in this file.
gulp.task('default', ['html', 'html:watch', 'sass', 'sass:watch', 'copy-images', 'copy-images:watch', 'scripts', 'scripts:watch', 'extra']);

// A deploy task which runs the subset of our tasks required for deployment of project.
// Run this when you just need a working build of the project, and won't be doing continuous development.
gulp.task('deploy', ['html', 'sass', 'scripts', 'extra', 'copy-images']);
