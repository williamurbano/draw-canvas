var gulp = require('gulp');
var pug = require('gulp-pug');
var less = require('gulp-less');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var copy = require('gulp-copy');

var runSequence = require('run-sequence');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

var srcDir = __dirname + '/src';
var devDir = __dirname + '/.tmp';
var distDir = __dirname + '/dist';

var pug_files = srcDir + '/**/*.pug';
var less_files = srcDir + '/less/*.less';
var coffee_files = srcDir + '/coffee/*.coffee';

// clean development package
gulp.task('clean-dev', function () {
    return gulp.src(devDir)
        .pipe(plumber())
        .pipe(clean());
});

// clean distributable package
gulp.task('clean-dist', function () {
    return gulp.src(distDir)
        .pipe(plumber())
        .pipe(clean());
});

// compile pug templates
gulp.task('pug-dev', function() {
    return gulp.src(pug_files)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(devDir))
        .pipe(connect.reload());
});

// compile pug templates
gulp.task('pug-dist', function() {
    return gulp.src(pug_files)
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest(distDir));
});

// compile less files
gulp.task('less-dev', function () {
    return gulp.src(less_files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write(devDir + '/css'))
        .pipe(gulp.dest(devDir + '/css'))
        .pipe(connect.reload());
});

// compile less files
gulp.task('less-dist', function () {
    return gulp.src(less_files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefix]
        }))
        .pipe(sourcemaps.write(distDir + '/css'))
        .pipe(gulp.dest(distDir + '/css'));
});

// compile coffeescript files
gulp.task('coffee-dev', function () {
    return gulp.src(coffee_files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(coffee({
            bare: true
        }))
        .pipe(sourcemaps.write(devDir + '/js'))
        .pipe(gulp.dest(devDir + '/js'))
        .pipe(connect.reload());
});

// compile coffeescript files
gulp.task('coffee-dist', function () {
    return gulp.src(coffee_files)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(coffee({
            bare: true
        }))
        .pipe(sourcemaps.write(distDir + '/js'))
        .pipe(gulp.dest(distDir + '/js'));
});

// create local server
gulp.task('connect', function() {
    connect.server({
        root: devDir,
        livereload: true,
        port: 8081
    });
});

// watch file changes
gulp.task('watch', function () {
    gulp.watch(pug_files, ['pug-dev']);
    gulp.watch(less_files, ['less-dev']);
    gulp.watch(coffee_files, ['coffee-dev']);
});

// copy jquery files
gulp.task('copy-jquery-dev', function() {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(plumber())
        .pipe(gulp.dest(devDir + '/vendor/jquery'));
});

// copy jquery files
gulp.task('copy-jquery-dist', function() {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(plumber())
        .pipe(gulp.dest(distDir + '/vendor/jquery'));
});

// copy bootstrap files
gulp.task('copy-bs-dist', function() {
    return gulp.src('node_modules/bootstrap/dist/**')
        .pipe(plumber())
        .pipe(gulp.dest(distDir + '/vendor/bootstrap'));
});

// run vendor tasks
gulp.task('vendor-dev', function () {
    runSequence('copy-jquery-dev', 'copy-bs-dev');
});

// run vendor tasks
gulp.task('vendor-dist', function () {
    runSequence('copy-jquery-dist', 'copy-bs-dist');
});

// serve builded development files
gulp.task('serve', function () {
    runSequence('clean-dev', 'vendor-dev', 'pug-dev', 'less-dev', 'coffee-dev', 'connect', 'watch');
});

// build the development mode
gulp.task('build-dev', ['clean-dev'], function () {
    runSequence('vendor-dev', 'pug-dev', 'less-dev', 'coffee-dev');
});

// build the distributable mode
gulp.task('build-dist', ['clean-dist'], function () {
    runSequence('vendor-dist', 'pug-dist', 'less-dist', 'coffee-dist');
});