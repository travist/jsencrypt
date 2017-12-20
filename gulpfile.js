var gulp = require('gulp');
var tslint = require('gulp-tslint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var gulpCopy = require('gulp-copy');
var wrap = require('gulp-wrap');

var files = [
  'lib/jsbn/jsbn.js',
  'lib/jsbn/jsbn2.js',
  'lib/jsbn/prng4.js',
  'lib/jsbn/rng.js',
  'lib/jsbn/rsa.js',
  'lib/jsbn/rsa2.js',
  'lib/jsbn/rsa-async.js',
  'lib/jsbn/base64.js',
  'lib/jsrsasign/asn1-1.0.js',
  'lib/asn1js/hex.js',
  'lib/asn1js/base64.js',
  'lib/asn1js/asn1.js',
  'src/jsencrypt.js'
];

var lintFiles = [
    'src/*.ts',
    'lib/*/**.ts'
];

var licenses = [
  'src/LICENSE.txt',
  'lib/jsrsasign/LICENSE.txt',
  'lib/jsbn/LICENSE.txt',
  'lib/asn1js/LICENSE.txt'
];

var libs_for_test = [
    "node_modules/mocha/mocha.css",
    "node_modules/expect.js/index.js",
    "node_modules/mocha/mocha.js"

]

gulp.task('lint', function () {
  return gulp.src(lintFiles)
      .pipe(tslint({}))
      .pipe(tslint.report({ summarizeFailureOutput: true }));
});

gulp.task('license', function() {
  return gulp.src(licenses)
    .pipe(insert.transform(function(contents, file) {
      return 'File: ' + file.path.replace(__dirname, '') + "\n" + contents;
    }))
    .pipe(concat('LICENSE.txt'))
    .pipe(gulp.dest(''));
});

var packageJson = require('./package.json');
gulp.task('scripts', function() {
  return gulp.src(files)
    .pipe(concat('jsencrypt.js'))
    .pipe(wrap({src: 'src/template.txt'}, {version: packageJson.version}, {variable: 'data'}))
    .pipe(gulp.dest('bin/'))
    .pipe(rename('jsencrypt.min.js'))
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(gulp.dest('bin'));
});


gulp.task('assemble', function () {

});

gulp.task('prepare_test', function() {
    return gulp
        .src(libs_for_test)
        .pipe(gulpCopy("test/libs/", { prefix: 2}));

});


gulp.task('build', ['lint', 'scripts', 'license']);
gulp.task('default', ['build']);
