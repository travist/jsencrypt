var gulp = require('gulp');
var tslint = require('gulp-tslint');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var gulpCopy = require('gulp-copy');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var ts = require('gulp-typescript');
var through = require('through2');
var rollup = require('rollup');

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
];

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

/**
 * Build ts to js for rollup
 */
gulp.task('tsc', function() {
    var tsProject = ts.createProject('./tsconfig.json');

    var typescript_error_count = 0;

    var tsResult = tsProject.src()
        .pipe(tsProject({
            reporter: ts.reporter.longReporter(),
            error: function () {
                typescript_error_count++;
                this.reporter.error.apply(this.reporter, arguments);
            },
            finish: function () {
                this.reporter.finish.apply(this.reporter, arguments);
            }
        }));

    return tsResult.js.pipe(gulp.dest('./'))
        .pipe(through.obj(function (chunk, enc, cb) {
            if (typescript_error_count) {
                this.emit("error", "TypeScript compile errors (count:" + typescript_error_count + ")");
            }
            cb(null, chunk)
        }));
});

/**
 * build library with rollup
 */
gulp.task('assemble', ['tsc'], function () {
    var config = require('./rollup.config');

    return rollup.rollup(config).then(function (bundle) {
        return bundle.write(config.output);

    });
});

/**
 * copy mocha files from node modules to test directory (for gh-pages serving)
 */
gulp.task('prepare_test', function() {
    return gulp
        .src(libs_for_test)
        .pipe(gulpCopy("test/libs/", { prefix: 2}));

});

gulp.task('compress', function (cb) {
  return gulp.src('bin/jsencrypt.js')
    .pipe(uglify())
    .pipe(rename('jsencrypt.min.js'))
    .pipe(gulp.dest('bin'));
});

gulp.task('build', ['prepare_test', 'lint', 'assemble', 'license', 'compress']);
gulp.task('default', ['build']);
